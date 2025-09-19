<?php

namespace App\Http\Controllers;

use App\Models\InventoryTransfer;
use App\Services\InventoryTransferService;
use App\Traits\AuthIdentity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InventoryTransferController extends Controller
{
    use AuthIdentity;
    protected $transferService;

    public function __construct(InventoryTransferService $transferService)
    {
        $this->transferService = $transferService;
    }

  

    public function requestTransfer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'from_branch_id' => 'required|exists:branches,id',
            'to_branch_id' => 'required|exists:branches,id|different:from_branch_id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string|max:500',
            'requested_by' => 'required|uuid', // user ID, not employee ID
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Get manager employee ID from user ID
        $managerId = $this->managerId($validated['requested_by']);
        if (!$managerId) {
            return response()->json([
                'message' => 'Unauthorized: Only a manager can request transfers.'
            ], 403);
        }

        try {
            $transfer = $this->transferService->requestTransfer(
                $validated['from_branch_id'],
                $validated['to_branch_id'],
                $validated['items'],
                $managerId,
                $validated['reason'] ?? null
            );

            return response()->json([
                'message' => 'Transfer requested successfully',
                'data' => $transfer
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Transfer request failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function approveTransfer(Request $request, $transferId)
    {
        $validator = Validator::make($request->all(), [
            'approved_by' => 'required|uuid', // user ID
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $managerId = $this->managerId($request->approved_by);
        if (!$managerId) {
            return response()->json([
                'message' => 'Unauthorized: Only a manager can approve transfers.'
            ], 403);
        }

        try {
            $transfer = $this->transferService->approveTransfer($transferId, $managerId);

            return response()->json([
                'message' => 'Transfer approved successfully',
                'data' => $transfer
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Transfer approval failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function rejectTransfer(Request $request, $transferId)
    {
        $validator = Validator::make($request->all(), [
            'rejected_by' => 'required|uuid',
            'rejection_reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $managerId = $this->managerId($request->rejected_by);
        if (!$managerId) {
            return response()->json([
                'message' => 'Unauthorized: Only a manager can reject transfers.'
            ], 403);
        }

        try {
            $transfer = $this->transferService->rejectTransfer(
                $transferId,
                $managerId,
                $request->rejection_reason
            );

            return response()->json([
                'message' => 'Transfer rejected successfully',
                'data' => $transfer
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Transfer rejection failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function completeTransfer(Request $request, $transferId)
    {
        $validator = Validator::make($request->all(), [
            'received_by' => 'required|uuid', // user ID
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $managerId = $this->managerId($request->received_by);
        if (!$managerId) {
            return response()->json([
                'message' => 'Unauthorized: Only a manager can complete transfers.'
            ], 403);
        }

        try {
            $transfer = $this->transferService->completeTransfer($transferId, $managerId);

            return response()->json([
                'message' => 'Transfer completed successfully',
                'data' => $transfer
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Transfer completion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get transfer details.
     */
    public function getTransfer($transferId)
    {
        try {
            $transfer = $this->transferService->getTransfer($transferId);

            return response()->json([
                'message' => 'Transfer retrieved successfully',
                'data' => $transfer
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Transfer retrieval failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * List transfers with optional filtering.
     */
    public function listTransfers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'branch_id' => 'nullable|exists:branches,id',
            'status' => 'nullable|in:pending,approved,completed,rejected',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $transfers = $this->transferService->listTransfers(
                $request->branch_id,
                $request->status,
                $request->page ?? 1,
                $request->per_page ?? 15
            );

            return response()->json([
                'message' => 'Transfers retrieved successfully',
                'data' => $transfers
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Transfers retrieval failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}