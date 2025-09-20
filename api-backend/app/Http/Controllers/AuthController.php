<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function refreshToken(Request $request)
    {
        $refreshToken = $request->header('X-Refresh-Token');
        error_log($refreshToken);

        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token not provided'], 401);
        }

        try {
            // Authenticate the user using the refresh token
            $user = JWTAuth::setToken($refreshToken)->authenticate();

            if (!$user) {
                return response()->json(['message' => 'Invalid refresh token'], 401);
            }

            // Generate a new access token with any custom claims as needed
            $newAccessToken = JWTAuth::customClaims(['type' => 'access'])->fromUser($user);

            return response()->json(['access_token' => $newAccessToken], 200);
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Refresh token expired'], 401);
        } catch (TokenInvalidException | JWTException $e) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'default_delivery_address' => 'nullable|string',
        ]);

        $user = $this->authService->registerCustomer($validated);

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => true,
                'message' => 'Registration failed'
            ], 500);
        }

        $accessToken = JWTAuth::customClaims(['type' => 'access'])->fromUser($user);

        // Generate Refresh Token (5 hours)
        $refreshToken = JWTAuth::customClaims([
            'type' => 'refresh',
            'exp'  => now()->addHours(5)->timestamp,
        ])->fromUser($user);

        // Format user info based on role
        $userInfo = $this->formatUserInfo($user);

        return response()->json([
            'success'       => true,
            'error'         => false,
            'message'       => 'Registration successful',
            'user_info'     => $userInfo,
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|min:6',
        ]);

        $user = $this->authService->login($validated);

        if (!$user) {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'Invalid email or password',
            ], 401);
        }

        // Generate tokens using a valid JWTSubject (User model instance)
        $accessToken = JWTAuth::customClaims(['type' => 'access'])->fromUser($user);
        $refreshToken = JWTAuth::customClaims([
            'type' => 'refresh',
            'exp'  => now()->addHours(5)->timestamp,
        ])->fromUser($user);

        // Format user info based on role
        $userInfo = $this->formatUserInfo($user);

        return response()->json([
            'success'       => true,
            'error'         => false,
            'message'       => 'Login successful',
            'user_info'     => $userInfo,
            'access_token'  => $accessToken,
            'refresh_token' => $refreshToken,
        ], 200);
    }

    public function logout(Request $request)
    {
        $userId = $request->attributes->get('userId');
        error_log($userId);

        $res = $this->authService->logout($userId);

        if ($res) {
            return response()->json([
                'success' => true,
                'error'   => false,
                'message' => 'Logged out successfully',
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'error'   => true,
                'message' => 'Failed to log out',
            ], 500);
        }
    }
    public function currentUser(Request $request)
    {
        $userId = $request->get('userId'); // From middleware

        // Validate the user_id
        $validator = Validator::make(
            ['user_id' => $userId],
            ['user_id' => 'required|uuid|exists:users,id']
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => true,
                'message' => $validator->errors()->first(),
            ], 400);
        }

        // Fetch user via AuthService
        $user = $this->authService->getCurrentUser($userId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => true,
                'message' => 'User not found'
            ], 404);
        }

        $userInfo = $this->formatUserInfo($user);

        return response()->json([
            'success' => true,
            'error' => false,
            'message' => 'Current user retrieved successfully',
            'user_info' => $userInfo
        ], 200);
    }


    /**
     * Format user information based on role
     */
    private function formatUserInfo($user)
    {
        // Load relationships based on user roles
        $user->load(['roles', 'customer', 'employee.branch']);

        // Base user info
        $userInfo = [
            'id' => $user->id,
            'email' => $user->email,
            'full_name' => $user->full_name,
            'status' => $user->status,
            'roles' => $user->roles->pluck('name'),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];

        // Add customer info if user is a customer
        if ($user->customer) {
            $userInfo['customer'] = [
                'id' => $user->customer->id, // Customer UUID
                'phone' => $user->customer->phone,
                'default_delivery_address' => $user->customer->default_delivery_address,
            ];
        }

        // Add employee info if user is an employee
        if ($user->employee) {
            $userInfo['employee'] = [
                'id' => $user->employee->id, // Employee UUID
                'branch_id' => $user->employee->branch_id,
                'role' => $user->employee->role,
                'hire_date' => $user->employee->hire_date,
                'branch' => $user->employee->branch ? [
                    'id' => $user->employee->branch->id, // Branch UUID if needed
                    'name' => $user->employee->branch->name,
                    'address' => $user->employee->branch->address,
                    'contact_phone' => $user->employee->branch->contact_phone,
                    'status' => $user->employee->branch->status,
                ] : null,
            ];
        }

        return $userInfo;
    }
}
