<?php

namespace App\Services;

use App\Models\Branch;
use App\Models\BranchAnnouncement;
use App\Models\BranchCategory;
use App\Models\BranchInventory;
use App\Models\Employee;
use App\Models\InventoryTransfer;
use App\Models\Order;
use App\Models\OfflineOrder;
use App\Models\Feedback;
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
        return DB::transaction(function () use ($id) {
            $branch = Branch::findOrFail($id);

            // Delete related records in proper order to maintain referential integrity
            
            // 1. Delete branch announcements
            BranchAnnouncement::where('branch_id', $id)->delete();
            
            // 2. Delete branch categories
            BranchCategory::where('branch_id', $id)->delete();
            
            // 3. Delete branch inventory
            BranchInventory::where('branch_id', $id)->delete();
            
            // 4. Handle inventory transfers (set branch IDs to null)
            InventoryTransfer::where('from_branch_id', $id)
                ->update(['from_branch_id' => null]);
            InventoryTransfer::where('to_branch_id', $id)
                ->update(['to_branch_id' => null]);
            
            // 5. Delete orders and related records
            $orderIds = Order::where('branch_id', $id)->pluck('id');
            
            // Delete order items
            DB::table('order_items')->whereIn('order_id', $orderIds)->delete();
            
            // Delete delivery assignments
            DB::table('delivery_assignments')->whereIn('order_id', $orderIds)->delete();
            
            // Delete orders
            Order::where('branch_id', $id)->delete();
            
            // 6. Delete offline orders and related records
            $offlineOrderIds = OfflineOrder::where('branch_id', $id)->pluck('id');
            
            // Delete offline order items
            DB::table('offline_order_items')->whereIn('offline_order_id', $offlineOrderIds)->delete();
            
            // Delete offline orders
            OfflineOrder::where('branch_id', $id)->delete();
            
            // 7. Delete feedbacks
            Feedback::where('branch_id', $id)->delete();
            
            // 8. Remove employees from this branch (but don't delete employees)
            Employee::where('branch_id', $id)->update(['branch_id' => null]);
            
            // 9. Finally delete the branch
            return $branch->delete();
        });
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