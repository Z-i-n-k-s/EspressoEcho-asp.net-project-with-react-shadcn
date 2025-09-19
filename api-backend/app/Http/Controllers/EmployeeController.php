<?php

namespace App\Http\Controllers;

use App\Services\EmployeeService;
use App\Traits\AuthIdentity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Exception;

class EmployeeController extends Controller
{
    use AuthIdentity;
    protected EmployeeService $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    /**
     * Validate UUID format
     */
    private function validateUuid(string $uuid): void
    {
        if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i', $uuid)) {
            abort(422, 'Invalid UUID format');
        }
    }

    /**
     * List all employees
     */
    public function index(): JsonResponse
    {
        $employees = $this->employeeService->getAll();
        return response()->json($employees);
    }

    /**
     * Get employees by branch ID
     */
    public function getByBranch(string $branchId): JsonResponse
    {
        $this->validateUuid($branchId);

        $employees = $this->employeeService->getByBranch($branchId);
        return response()->json($employees);
    }

    /**
     * Show single employee details
     */
    public function show(string $id): JsonResponse
    {
        $this->validateUuid($id);

        $employee = $this->employeeService->find($id);

        if (!$employee) {
            return response()->json(['message' => 'Employee not found'], 404);
        }

        return response()->json($employee);
    }

    /**
     * Create new employee
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            // User creation fields
            'email'      => ['required', 'email', 'unique:users,email'],
            'password'   => ['required', 'string', 'min:6'],
            'full_name'  => ['required', 'string', 'max:255'],

            // Employee fields
            'branch_id'  => ['nullable', 'uuid', 'exists:branches,id'],
            'role'       => ['required', Rule::in(['manager', 'cashier', 'staff'])],
            'hire_date'  => ['required', 'date'],
            'created_by' => ['required', 'uuid', 'exists:users,id'], // user ID passed
        ]);

        // Validate created_by is an admin
        $adminId = $this->adminId($validated['created_by']);
        if (!$adminId) {
            return response()->json([
                'error' => true,
                'message' => 'Unauthorized: Only an admin can create employees.'
            ], 403);
        }
        $validated['created_by'] = $adminId;

        try {
            $employee = $this->employeeService->create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Employee created successfully',
                'data' => $employee
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'message' => 'Employee creation failed',
                'details' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Update employee
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $this->validateUuid($id);

        $validated = $request->validate([
            'branch_id' => ['nullable', 'uuid', 'exists:branches,id'],
            'role'      => ['sometimes', Rule::in(['manager', 'cashier', 'staff'])],
            'hire_date' => ['sometimes', 'date'],
        ]);

        try {
            $employee = $this->employeeService->update($id, $validated);
            return response()->json($employee);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Employee update failed',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Delete employee using stored procedure
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->validateUuid($id);

        $validator = Validator::make($request->all(), [
            'admin_user_id' => 'required|uuid|exists:users,id',
            'reason'        => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            // ✅ Verify Admin
            $adminId = $this->adminId($data['admin_user_id']);
            if (!$adminId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Only admins can delete employees.'
                ], 403);
            }

            $message = $this->employeeService->delete(
                $id,
                $adminId,
                $data['reason'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => $message
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Deletion failed',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
