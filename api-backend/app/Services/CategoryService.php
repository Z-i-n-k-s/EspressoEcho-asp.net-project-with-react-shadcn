<?php
// app/Services/CategoryService.php

namespace App\Services;

use App\Models\Category;
use App\Models\BranchCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoryService
{
    /**
     * Get all categories with optional pagination
     */
    public function getAllCategories(bool $paginate = false, int $perPage = 15): Collection|LengthAwarePaginator
    {
        try {
            $query = Category::with(['products' => function ($query) {
                $query->whereNull('deleted_at');
            }, 'branches'])->whereNull('deleted_at');

            return $paginate
                ? $query->paginate($perPage)
                : $query->get();
        } catch (\Exception $e) {
            Log::error('Failed to fetch categories: ' . $e->getMessage());
            throw new \Exception('Could not retrieve categories');
        }
    }

    /**
     * Get a specific category by ID
     */
    public function getCategoryById(string $id): Category
    {
        try {
            $category = Category::with(['products' => function ($query) {
                $query->whereNull('deleted_at');
            }, 'branches'])
                ->whereNull('deleted_at')
                ->findOrFail($id);

            return $category;
        } catch (\Exception $e) {
            Log::error("Failed to fetch category with ID {$id}: " . $e->getMessage());
            throw new \Exception('Category not found');
        }
    }

    /**
     * Create a new category
     */
    public function createCategory(array $data): Category
    {
        DB::beginTransaction();

        try {
            $category = Category::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
            ]);

            DB::commit();
            return $category->load(['products' => function ($query) {
                $query->whereNull('deleted_at');
            }, 'branches']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create category: ' . $e->getMessage());
            throw new \Exception('Could not create category');
        }
    }

    /**
     * Update an existing category
     */
    public function updateCategory(string $id, array $data): Category
    {
        DB::beginTransaction();

        try {
            $category = Category::whereNull('deleted_at')->findOrFail($id);

            $category->update([
                'name' => $data['name'] ?? $category->name,
                'description' => $data['description'] ?? $category->description,
            ]);

            DB::commit();
            return $category->load(['products' => function ($query) {
                $query->whereNull('deleted_at');
            }, 'branches']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to update category with ID {$id}: " . $e->getMessage());
            throw new \Exception('Could not update category');
        }
    }

    /**
     * Delete a category (soft delete)
     * Note: Database triggers will handle constraints
     */
    public function deleteCategory(string $id): bool
    {
        DB::beginTransaction();

        try {
            $category = Category::findOrFail($id);

            // First, delete any branch associations
            BranchCategory::where('category_id', $id)->delete();

            // Then delete the category
            $category->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to delete category with ID {$id}: " . $e->getMessage());
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * Get categories assigned to a specific branch
     */
    public function getCategoriesByBranch(string $branchId): Collection
    {
        try {
            return Category::whereHas('branches', function ($query) use ($branchId) {
                $query->where('branches.id', $branchId);
            })
                ->whereNull('deleted_at')
                ->with(['products' => function ($query) {
                    $query->whereNull('deleted_at');
                }, 'branches'])
                ->get();
        } catch (\Exception $e) {
            Log::error("Failed to fetch categories for branch ID {$branchId}: " . $e->getMessage());
            throw new \Exception('Could not retrieve categories for this branch');
        }
    }

    /**
     * Assign or remove category from branches
     */
    public function manageBranchAssignment(string $categoryId, array $branchIds, string $assignedBy, bool $assign = true): bool
    {
        DB::beginTransaction();

        try {
            $category = Category::findOrFail($categoryId);

            if ($assign) {
                // Assign category to branches with assigned_by user
                $dataToInsert = [];
                foreach ($branchIds as $branchId) {
                    $dataToInsert[] = [
                        'id' => \Illuminate\Support\Str::uuid(), // Generate UUID
                        'branch_id' => $branchId,
                        'category_id' => $categoryId,
                        'assigned_by' => $assignedBy,
                        'created_at' => now(),
                    ];
                }

                // Use insertOrIgnore to avoid duplicate key errors
                BranchCategory::insertOrIgnore($dataToInsert);
            } else {
                // Remove category from branches
                BranchCategory::where('category_id', $categoryId)
                    ->whereIn('branch_id', $branchIds)
                    ->delete();
            }

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to manage branch assignment for category ID {$categoryId}: " . $e->getMessage());
            throw new \Exception('Could not manage branch assignment');
        }
    }
}
