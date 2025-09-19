<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Branch;
use App\Models\User;
use App\Models\BranchAnnouncement;
use App\Models\InventoryTransfer;
use App\Models\Order;
use App\Models\OfflineOrder;
use App\Models\Payment;
use App\Models\DeliveryAssignment;
use App\Models\InventoryAdjustment;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Validation\ValidationException;

class EmployeeService
{
    /**
     * Get all employees with their relations
     */
    public function getAll(): Collection
    {
        return Employee::with(['user', 'branch', 'creator'])->get();
    }

    /**
     * Get employees by branch
     */
    public function getByBranch(string $branchId): Collection
    {
        return Employee::with(['user', 'branch', 'creator'])
            ->where('branch_id', $branchId)
            ->get();
    }

    /**
     * Find specific employee
     */
    public function find(string $id): ?Employee
    {
        return Employee::with(['user', 'branch', 'creator'])->find($id);
    }

    /**
     * Create user and employee together
     */
    public function create(array $data): Employee
    {
        return DB::transaction(function () use ($data) {
            // Validate branch exists if provided
            if (!empty($data['branch_id']) && !Branch::where('id', $data['branch_id'])->exists()) {
                throw ValidationException::withMessages([
                    'branch_id' => 'Branch not found.'
                ]);
            }

            // Validate creator exists
            if (!User::where('id', $data['created_by'])->exists()) {
                throw ValidationException::withMessages([
                    'created_by' => 'Creator user not found.'
                ]);
            }

            // 1. Create user first
            $user = User::create([
                'id'            => (string) Str::uuid(),
                'email'         => $data['email'],
                'password_hash' => bcrypt($data['password']),
                'full_name'     => $data['full_name'],
                'status'        => 'active',
            ]);

            // 2. Assign customer role to the user
            $customerRoleId = DB::table('roles')->where('name', 'customer')->value('id');
            if ($customerRoleId) {
                DB::table('user_roles')->insert([
                    'user_id' => $user->id,
                    'role_id' => $customerRoleId
                ]);
            }

            // 3. Create employee linked to that user
            $employee = Employee::create([
                'id'         => (string) Str::uuid(),
                'user_id'    => $user->id,
                'branch_id'  => $data['branch_id'] ?? null,
                'role'       => $data['role'],
                'hire_date'  => $data['hire_date'],
                'created_by' => $data['created_by'],
            ]);

            // 4. Assign employee role to the user
            $employeeRoleId = DB::table('roles')->where('name', $data['role'])->value('id');
            if ($employeeRoleId) {
                DB::table('user_roles')->insert([
                    'user_id' => $user->id,
                    'role_id' => $employeeRoleId
                ]);
            }

            // 5. If the role is 'manager', update the branch's manager_id
            if ($data['role'] === 'manager' && !empty($data['branch_id'])) {
                Branch::where('id', $data['branch_id'])
                    ->update(['manager_id' => $user->id]);
            }

            return $employee->load(['user', 'branch', 'creator']);
        });
    }

    /**
     * Update employee info
     */
    public function update(string $id, array $data): Employee
    {
        return DB::transaction(function () use ($id, $data) {
            $employee = Employee::findOrFail($id);
            $oldRole = $employee->role;
            $oldBranchId = $employee->branch_id;

            // Validate branch exists if provided
            if (!empty($data['branch_id']) && !Branch::where('id', $data['branch_id'])->exists()) {
                throw ValidationException::withMessages([
                    'branch_id' => 'Branch not found.'
                ]);
            }

            // Update employee
            $employee->update($data);

            // Update user role if employee role changed
            if (isset($data['role']) && $data['role'] !== $oldRole) {
                // Remove existing employee roles
                $employeeRoleIds = DB::table('roles')
                    ->whereIn('name', ['manager', 'cashier', 'staff'])
                    ->pluck('id');

                if ($employeeRoleIds->isNotEmpty()) {
                    DB::table('user_roles')
                        ->where('user_id', $employee->user_id)
                        ->whereIn('role_id', $employeeRoleIds)
                        ->delete();
                }

                // Add new role
                $newRoleId = DB::table('roles')->where('name', $data['role'])->value('id');
                if ($newRoleId) {
                    DB::table('user_roles')->insert([
                        'user_id' => $employee->user_id,
                        'role_id' => $newRoleId
                    ]);
                }

                // If changing from manager role, update branch manager_id
                if ($oldRole === 'manager' && $oldBranchId) {
                    Branch::where('id', $oldBranchId)
                        ->where('manager_id', $employee->user_id)
                        ->update(['manager_id' => null]);
                }

                // If changing to manager role, update branch manager_id
                if ($data['role'] === 'manager' && !empty($data['branch_id'])) {
                    Branch::where('id', $data['branch_id'])
                        ->update(['manager_id' => $employee->user_id]);
                }
            }

            return $employee->load(['user', 'branch', 'creator']);
        });
    }

    /**
     * Delete employee with all related records
     */
    public function delete(string $id): bool
    {
        return DB::transaction(function () use ($id) {
            $employee = Employee::findOrFail($id);
            $userId = $employee->user_id;

            // 1. If employee is a manager, remove from branch
            if ($employee->role === 'manager' && $employee->branch_id) {
                Branch::where('id', $employee->branch_id)
                    ->where('manager_id', $userId)
                    ->update(['manager_id' => null]);
            }

            // 2. Remove employee-specific roles
            $employeeRoleIds = DB::table('roles')
                ->whereIn('name', ['manager', 'cashier', 'staff'])
                ->pluck('id');

            if ($employeeRoleIds->isNotEmpty()) {
                DB::table('user_roles')
                    ->where('user_id', $userId)
                    ->whereIn('role_id', $employeeRoleIds)
                    ->delete();
            }

            // 3. Handle records where employee is referenced
            // Inventory transfers
            InventoryTransfer::where('requested_by', $id)->update(['requested_by' => null]);
            InventoryTransfer::where('approved_by', $id)->update(['approved_by' => null]);
            InventoryTransfer::where('received_by', $id)->update(['received_by' => null]);

            // Orders
            Order::where('handled_by', $id)->update(['handled_by' => null]);

            // Offline orders
            OfflineOrder::where('cashier_id', $id)->update(['cashier_id' => null]);

            // Payments
            Payment::where('collected_by', $id)->update(['collected_by' => null]);

            // Delivery assignments
            DeliveryAssignment::where('staff_id', $id)->update(['staff_id' => null]);
            DeliveryAssignment::where('assigned_by', $id)->update(['assigned_by' => null]);

            // Inventory adjustments
            InventoryAdjustment::where('last_updated_by', $id)->update(['last_updated_by' => null]);

            // Branch announcements
            BranchAnnouncement::where('created_by', $userId)->update(['created_by' => null]);

            // Branch inventory
            DB::table('branch_inventory')
                ->where('last_updated_by', $id)
                ->update(['last_updated_by' => null]);

            // 4. Delete the employee
            $deleted = $employee->delete();

            // 5. Delete the related user as well
            if ($deleted) {
                DB::table('users')->where('id', $userId)->delete();
            }

            return $deleted;
        });
    }
}
