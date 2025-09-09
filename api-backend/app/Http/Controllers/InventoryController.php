<?php

namespace App\Http\Controllers;

use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
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
                $request->adjustments,
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
    /**
 * Get current inventory for a branch.
 */
public function getInventory(Request $request, $branchId)
{
    $validator = Validator::make(['branch_id' => $branchId], [
        'branch_id' => 'required|exists:branches,id'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        $inventory = $this->inventoryService->getBranchInventory($branchId);

        return response()->json([
            'message' => 'Inventory retrieved successfully',
            'data' => $inventory
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to retrieve inventory',
            'error' => $e->getMessage()
        ], 500);
    }
}
}