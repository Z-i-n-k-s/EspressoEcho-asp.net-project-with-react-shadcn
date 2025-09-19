<?php

namespace App\Traits;

use Illuminate\Support\Facades\DB;

trait AuthIdentity
{
    /**
     * Get role-based ID for admin (just the user ID)
     */
    public function adminId(string $userId): ?string
    {
        $record = DB::table('users')
            ->leftJoin('user_roles', 'users.id', '=', 'user_roles.user_id')
            ->leftJoin('roles', 'user_roles.role_id', '=', 'roles.id')
            ->where('users.id', $userId)
            ->where('roles.name', 'admin')
            ->select('users.id as admin_user_id')
            ->first();

        return $record->admin_user_id ?? null;
    }

    /**
     * Get role-based ID for manager
     */
    public function managerId(string $userId): ?string
    {
        return $this->getEmployeeIdByRoles($userId, ['manager']);
    }

    /**
     * Get role-based ID for staff
     */
    public function staffId(string $userId): ?string
    {
        return $this->getEmployeeIdByRoles($userId, ['staff']);
    }

    /**
     * Get role-based ID for cashier
     */
    public function cashierId(string $userId): ?string
    {
        return $this->getEmployeeIdByRoles($userId, ['cashier']);
    }

    /**
     * Get customer ID
     */
    public function customerId(string $userId): ?string
    {
        $record = DB::table('users')
            ->leftJoin('user_roles', 'users.id', '=', 'user_roles.user_id')
            ->leftJoin('roles', 'user_roles.role_id', '=', 'roles.id')
            ->leftJoin('customers', 'users.id', '=', 'customers.user_id')
            ->where('users.id', $userId)
            ->where('roles.name', 'customer')
            ->select('customers.id as customer_id')
            ->first();

        return $record->customer_id ?? null;
    }

    /**
     * Internal helper to get employee ID by allowed roles
     */
    private function getEmployeeIdByRoles(string $userId, array $allowedRoles): ?string
    {
        $record = DB::table('users')
            ->leftJoin('user_roles', 'users.id', '=', 'user_roles.user_id')
            ->leftJoin('roles', 'user_roles.role_id', '=', 'roles.id')
            ->leftJoin('employees', 'users.id', '=', 'employees.user_id')
            ->where('users.id', $userId)
            ->whereIn('roles.name', $allowedRoles)
            ->select('employees.id as employee_id', 'roles.name as role_name')
            ->first();

        return $record->employee_id ?? null;
    }
}
