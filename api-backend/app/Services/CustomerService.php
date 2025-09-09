<?php

namespace App\Services;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CustomerService
{
    public function registerCustomer(array $data)
    {
        return DB::transaction(function () use ($data) {

            // 1️⃣ Create user with UUID
            $user = User::create([
                'id' => (string) Str::uuid(),          // generate UUID
                'email' => $data['email'],
                'password_hash' => Hash::make($data['password']),
                'full_name' => $data['full_name'],
                'status' => 'active',
            ]);

            // 2️⃣ Create customer linked to user
            $customer = Customer::create([
                'id' => (string) Str::uuid(),          // generate UUID
                'user_id' => $user->id,
                'phone' => $data['phone'],
                'default_delivery_address' => $data['default_delivery_address'] ?? null,
            ]);

            // Optional: return customer with user info
            return $customer->load('user');
        });
    }
}
