<?php
// app/Http/Controllers/CategoryController.php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use App\Traits\AuthIdentity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    protected $categoryService;
    use AuthIdentity;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the categories.
     */
    public function index(): JsonResponse
    {
        try {
            $categories = $this->categoryService->getAllCategories();
            
            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories'
            ], 500);
        }
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        try {
            $category = $this->categoryService->createCategory($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'data' => $category
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category'
            ], 500);
        }
    }

    /**
     * Display the specified category.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $category = $this->categoryService->getCategoryById($id);
            
            return response()->json([
                'success' => true,
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        try {
            $category = $this->categoryService->updateCategory($id, $request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $category
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category'
            ], 500);
        }
    }

    /**
     * Remove the specified category.
     */
     public function destroy(string $id): JsonResponse
    {
        try {
            $this->categoryService->deleteCategory($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully'
            ]);
        } catch (\Exception $e) {
            $statusCode = str_contains($e->getMessage(), 'not found') ? 404 : 500;
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }

    /**
     * Get categories by branch.
     */
    public function getByBranch(string $branchId): JsonResponse
    {
        try {
            $categories = $this->categoryService->getCategoriesByBranch($branchId);
            
            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories for this branch'
            ], 500);
        }
    }

    /**
     * Assign or remove category from branches
     */
 
    public function manageBranchAssignment(Request $request, string $categoryId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'branch_ids' => 'required|array',
            'branch_ids.*' => 'exists:branches,id',
            'assigned_by' => 'required|exists:users,id', // user ID passed
            'action' => 'required|in:assign,remove'
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Verify assigned_by is an admin
        $adminId = $this->adminId($validated['assigned_by']);
        if (!$adminId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: User is not an admin.'
            ], 403);
        }

        $assign = ($validated['action'] === 'assign');
        $branchIds = $validated['branch_ids'];

        try {
            $this->categoryService->manageBranchAssignment($categoryId, $branchIds, $adminId, $assign);

            return response()->json([
                'success' => true,
                'message' => 'Category ' . ($assign ? 'assigned to' : 'removed from') . ' branches successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to manage branch assignment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}