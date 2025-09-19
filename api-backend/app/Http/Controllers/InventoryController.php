<?php

namespace App\Http\Controllers;

use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Traits\AuthIdentity;

class InventoryController extends Controller
{
    use AuthIdentity;

    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Adjust inventory (add/remove) for a branch.
     */
    public function adjustInventory(Request $request)
    {
        $adjustments = $request->input('adjustments', []); // get a copy

        // Convert employee user_ids to actual employee_ids
        foreach ($adjustments as $key => $adj) {
            $userId = $adj['employee_id'] ?? null;
            $employeeId = $this->managerId($userId); // Only managers allowed here

            if (!$employeeId) {
                return response()->json([
                    'error' => true,
                    'message' => "Unauthorized: Adjustment #$key user is not a manager."
                ], 403);
            }

            // Replace user_id with real employee_id in local copy
            $adjustments[$key]['employee_id'] = $employeeId;
        }

        // Merge back into request if you really need it
        $request->merge(['adjustments' => $adjustments]);

        $validator = Validator::make($request->all(), [
            'branch_id' => 'required|exists:branches,id',
            'adjustments' => 'required|array|min:1',
            'adjustments.*.product_id' => 'required|exists:products,id',
            'adjustments.*.action' => 'required|in:add,remove',
            'adjustments.*.quantity' => 'required|integer|min:1',
            'adjustments.*.reorder_level' => 'nullable|integer|min:0',
            'adjustments.*.reason' => 'nullable|string|max:500',
            'adjustments.*.employee_id' => 'required|exists:employees,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $adjusted = $this->inventoryService->adjustInventory(
                $adjustments, // pass the modified local copy
                $request->branch_id
            );

            return response()->json([
                'message' => 'Inventory adjusted successfully',
                'data' => $adjusted
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Inventory adjustment failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Bulk update inventory (absolute values) for a branch.
     */
    public function bulkUpdate(Request $request)
    {
        // Convert employee user_ids to actual employee_ids
        if (!empty($request->updates)) {

            $updates = $request->input('updates', []);

            foreach ($updates as $key => $upd) {
                $userId = $upd['employee_id'] ?? null;
                $employeeId = $this->managerId($userId);

                if (!$employeeId) {
                    return response()->json([
                        'error' => true,
                        'message' => "Unauthorized: Update #$key user is not a manager."
                    ], 403);
                }

                $updates[$key]['employee_id'] = $employeeId;
            }

            $request->merge(['updates' => $updates]);
        }

        $validator = Validator::make($request->all(), [
            'branch_id' => 'required|exists:branches,id',
            'updates' => 'required|array|min:1',
            'updates.*.product_id' => 'required|exists:products,id',
            'updates.*.quantity' => 'required|integer|min:0',
            'updates.*.reorder_level' => 'nullable|integer|min:0',
            'updates.*.reason' => 'nullable|string|max:500',
            'updates.*.employee_id' => 'required|exists:employees,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updated = $this->inventoryService->bulkUpdate(
                $request->updates,
                $request->branch_id
            );

            return response()->json([
                'message' => 'Inventory updated successfully',
                'data' => $updated
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Inventory update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
