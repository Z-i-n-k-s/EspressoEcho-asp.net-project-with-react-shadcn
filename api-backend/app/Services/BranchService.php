<?php

namespace App\Services;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BranchService
{
    public function getAllBranches(array $filters = [])
    {
        $query = Branch::with('manager');
        
        // Apply filters
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('address', 'like', '%' . $filters['search'] . '%');
        }
        
        // Pagination
        $perPage = $filters['per_page'] ?? 15;
        return $query->paginate($perPage);
    }

    public function getBranch(string $id): Branch
    {
        return Branch::with(['manager', 'employees', 'categories'])->findOrFail($id);
    }

    public function createBranch(array $data): Branch
    {
        return DB::transaction(function () use ($data) {
            $managerId = $data['manager_id'] ?? null;

            // If a manager is provided, validate
            if ($managerId) {
                $this->validateManager($managerId);
            }

            // Create branch
            $branch = Branch::create([
                'name' => $data['name'],
                'address' => $data['address'],
                'contact_phone' => $data['contact_phone'],
                'status' => $data['status'],
                'manager_id' => $managerId,
            ]);

            // If manager was provided, update their branch assignment
            if ($managerId) {
                $this->assignManagerToBranch($managerId, $branch->id);
            }

            return $branch->load('manager');
        });
    }

    public function updateBranch(string $id, array $data): Branch
    {
        return DB::transaction(function () use ($id, $data) {
            $branch = Branch::findOrFail($id);
            $managerId = $data['manager_id'] ?? null;
            $currentManagerId = $branch->manager_id;

            // If a new manager is provided, validate
            if ($managerId && $managerId !== $currentManagerId) {
                $this->validateManager($managerId, $branch->id);
                
                // Remove current manager from branch if exists
                if ($currentManagerId) {
                    $this->removeManagerFromBranch($currentManagerId);
                }
                
                // Assign new manager to branch
                $this->assignManagerToBranch($managerId, $branch->id);
            } elseif (is_null($managerId) && $currentManagerId) {
                // Remove current manager if manager_id is set to null
                $this->removeManagerFromBranch($currentManagerId);
            }

            // Update branch attributes
            $branch->update($data);

            return $branch->load('manager');
        });
    }

    public function deleteBranch(string $id): bool
    {
        $branch = Branch::findOrFail($id);
        return $branch->delete();
    }

    public function restoreBranch(string $id): Branch
    {
        $branch = Branch::withTrashed()->findOrFail($id);
        $branch->restore();
        return $branch;
    }

    protected function validateManager(string $managerId, string $branchId = null): void
    {
        $manager = Employee::where('user_id', $managerId)->first();

        if (!$manager) {
            throw ValidationException::withMessages([
                'manager_id' => 'Manager does not exist in employees.'
            ]);
        }

        if ($manager->role !== 'manager') {
            throw ValidationException::withMessages([
                'manager_id' => 'Employee is not a manager.'
            ]);
        }

        // Check if manager is already assigned to another branch
        if ($manager->branch_id && $manager->branch_id !== $branchId) {
            throw ValidationException::withMessages([
                'manager_id' => 'Manager is already assigned to another branch.'
            ]);
        }
    }

    protected function assignManagerToBranch(string $managerId, string $branchId): void
    {
        $manager = Employee::where('user_id', $managerId)->first();
        if ($manager) {
            $manager->branch_id = $branchId;
            $manager->save();
        }
    }

    protected function removeManagerFromBranch(string $managerId): void
    {
        $manager = Employee::where('user_id', $managerId)->first();
        if ($manager) {
            $manager->branch_id = null;
            $manager->save();
        }
    }
}