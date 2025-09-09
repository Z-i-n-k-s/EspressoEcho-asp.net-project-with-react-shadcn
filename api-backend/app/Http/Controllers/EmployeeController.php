<?php

namespace App\Http\Controllers;

use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Exception;

class EmployeeController extends Controller
{
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
            'created_by' => ['required', 'uuid', 'exists:users,id'],
        ]);

        try {
            $employee = $this->employeeService->create($validated);
            return response()->json($employee, 201);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Employee creation failed',
                'message' => $e->getMessage()
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

        $validated = $request->validate([
            'admin_user_id' => 'required|uuid|exists:users,id',
            'reason'        => 'nullable|string'
        ]);

        try {
            $message = $this->employeeService->deleteWithProcedure(
                $id,
                $validated['admin_user_id'],
                $validated['reason'] ?? null
            );

            return response()->json(['message' => $message], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Deletion failed',
                'message' => $e->getMessage()
            ], 400);
        }
    }
}