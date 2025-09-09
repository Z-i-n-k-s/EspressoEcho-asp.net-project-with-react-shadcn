<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Services\CustomerService;

class CustomerController extends Controller
{
    protected $customerService;

    public function __construct(CustomerService $customerService)
    {
        $this->customerService = $customerService;
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'default_delivery_address' => 'nullable|string',
        ]);

        $customer = $this->customerService->registerCustomer($validated);

        return response()->json($customer, 201);
    }
}
