<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

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
            // 1. Create user first
            $user = User::create([
                'id'            => (string) Str::uuid(),
                'email'         => $data['email'],
                'password_hash' => bcrypt($data['password']),
                'full_name'     => $data['full_name'],
                'status'        => 'active',
            ]);

            // 2. Assign customer role to the user
            DB::table('user_roles')->insert([
                'user_id' => $user->id,
                'role_id' => DB::table('roles')->where('name', 'customer')->value('id')
            ]);

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
            DB::table('user_roles')->insert([
                'user_id' => $user->id,
                'role_id' => DB::table('roles')->where('name', $data['role'])->value('id')
            ]);

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

            // Update employee
            $employee->update($data);

            // Update user role if employee role changed
            if (isset($data['role'])) {
                // Remove existing employee roles
                DB::table('user_roles')
                    ->where('user_id', $employee->user_id)
                    ->whereIn('role_id', function ($query) {
                        $query->select('id')
                            ->from('roles')
                            ->whereIn('name', ['manager', 'cashier', 'staff']);
                    })
                    ->delete();

                // Add new role
                DB::table('user_roles')->insert([
                    'user_id' => $employee->user_id,
                    'role_id' => DB::table('roles')->where('name', $data['role'])->value('id')
                ]);
            }

            return $employee->load(['user', 'branch', 'creator']);
        });
    }

    /**
     * Delete employee using stored procedure
     */
    public function deleteWithProcedure(string $employeeId, string $adminUserId, ?string $reason = null): string
    {
        try {
            // Check if employee exists
            $employee = Employee::find($employeeId);
            if (!$employee) {
                throw new Exception('Employee not found');
            }

            // Use the database trigger instead of a stored procedure
            $employee->delete();

            return 'Employee deleted successfully';
        } catch (Exception $e) {
            throw new Exception('Failed to delete employee: ' . $e->getMessage());
        }
    }
}
