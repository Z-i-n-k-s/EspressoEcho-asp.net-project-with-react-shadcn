<?php

namespace App\Services;

use App\Models\User;
use App\Models\Customer;
use App\Models\Employee;
use App\Models\Role;
use App\Models\UserRole;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AuthService
{
    public function registerCustomer(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Create user
            $user = User::create([
                'id' => (string) Str::uuid(),
                'email' => $data['email'],
                'password_hash' => Hash::make($data['password']),
                'full_name' => $data['full_name'],
                'status' => 'active',
            ]);

            // Find customer role
            $customerRole = Role::where('name', 'customer')->first();

            if (!$customerRole) {
                throw new \Exception('Customer role not found');
            }

            // Assign customer role to user
            UserRole::create([
                'user_id' => $user->id,
                'role_id' => $customerRole->id,
            ]);

            // Create customer record
            Customer::create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
                'phone' => $data['phone'],
                'default_delivery_address' => $data['default_delivery_address'] ?? null,
            ]);

            return $user->load(['roles', 'customer']);
        });
    }

    public function login(array $credentials)
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password_hash)) {
            return null;
        }

        if ($user->status !== 'active') {
            return null;
        }

        // Load relationships based on user roles
        $user->load(['roles', 'customer', 'employee.branch']);

        return $user;
    }
    
    /**
     * Get the current user by ID
     */
    public function getCurrentUser(string $userId)
    {
        $user = User::with(['roles', 'customer', 'employee.branch'])->find($userId);

        if (!$user) {
            return null;
        }

        return $user;
    }

    public function logout($userId)
    {
        return $userId ? true : false;
    }
}
