<?php

namespace App\Services;

use App\Models\InventoryTransfer;
use App\Models\InventoryTransferItem;
use App\Models\BranchInventory;
use App\Models\InventoryAdjustment;
use App\Models\BranchCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InventoryTransferService
{
    protected $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Request an inventory transfer between branches.
     */
    public function requestTransfer(
        string $fromBranchId,
        string $toBranchId,
        array $items,
        string $requestedBy,
        string $reason = null
    ) {
        // Validate that both branches have the same categories for the products
        $this->validateBranchCategories($fromBranchId, $toBranchId, $items);

        // Validate that all items are available in the source branch
        foreach ($items as $item) {
            $available = DB::table('branch_inventory')
                ->where('branch_id', $fromBranchId)
                ->where('product_id', $item['product_id'])
                ->where('quantity_on_hand', '>=', $item['quantity'])
                ->exists();

            if (!$available) {
                throw new \Exception("Insufficient quantity for product {$item['product_id']} in source branch");
            }
        }

        DB::beginTransaction();

        try {
            // Create the transfer record
            $transferId = (string) Str::uuid();
            DB::table('inventory_transfers')->insert([
                'id' => $transferId,
                'from_branch_id' => $fromBranchId,
                'to_branch_id' => $toBranchId,
                'requested_by' => $requestedBy,
                'reason' => $reason,
                'status' => 'pending',
                'requested_at' => now(),
            ]);

            // Add transfer items
            foreach ($items as $item) {
                DB::table('inventory_transfer_items')->insert([
                    'id' => (string) Str::uuid(),
                    'transfer_id' => $transferId,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            DB::commit();

            return $this->getTransfer($transferId);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Validate that both branches have the same categories for the products being transferred.
     */
    private function validateBranchCategories(string $fromBranchId, string $toBranchId, array $items)
    {
        // Get all product IDs from the transfer request
        $productIds = array_column($items, 'product_id');

        // Get the categories of these products
        $productCategories = DB::table('products')
            ->whereIn('id', $productIds)
            ->pluck('category_id', 'id')
            ->toArray();

        // Get categories assigned to the source branch
        $fromBranchCategories = DB::table('branch_categories')
            ->where('branch_id', $fromBranchId)
            ->pluck('category_id')
            ->toArray();

        // Get categories assigned to the destination branch
        $toBranchCategories = DB::table('branch_categories')
            ->where('branch_id', $toBranchId)
            ->pluck('category_id')
            ->toArray();

        // Check if all product categories exist in both branches
        foreach ($productCategories as $productId => $categoryId) {
            if (!in_array($categoryId, $fromBranchCategories)) {
                throw new \Exception("Product {$productId}'s category is not assigned to the source branch");
            }

            if (!in_array($categoryId, $toBranchCategories)) {
                throw new \Exception("Product {$productId}'s category is not assigned to the destination branch");
            }
        }
    }

    /**
     * Approve an inventory transfer.
     */
    public function approveTransfer(string $transferId, string $approvedBy)
    {
        DB::beginTransaction();

        try {
            // Get the transfer
            $transfer = DB::table('inventory_transfers')
                ->where('id', $transferId)
                ->first();

            if (!$transfer) {
                throw new \Exception("Transfer not found");
            }

            if ($transfer->status !== 'pending') {
                throw new \Exception("Transfer cannot be approved in its current status");
            }

            // Validate that the approver is a manager of the source branch
            $approver = DB::table('employees')
                ->where('id', $approvedBy)
                ->where('branch_id', $transfer->from_branch_id)
                ->where('role', 'manager')
                ->first();

            if (!$approver) {
                throw new \Exception("Only managers of the source branch can approve transfers");
            }

            // Rest of the approveTransfer method remains the same...
            // Get transfer items
            $items = DB::table('inventory_transfer_items')
                ->where('transfer_id', $transferId)
                ->get();

            // Deduct inventory from the source branch
            foreach ($items as $item) {
                // Check if the product still has sufficient quantity
                $available = DB::table('branch_inventory')
                    ->where('branch_id', $transfer->from_branch_id)
                    ->where('product_id', $item->product_id)
                    ->where('quantity_on_hand', '>=', $item->quantity)
                    ->exists();

                if (!$available) {
                    throw new \Exception("Insufficient quantity for product {$item->product_id} in source branch");
                }

                // Deduct the inventory and update last_updated_by
                DB::table('branch_inventory')
                    ->where('branch_id', $transfer->from_branch_id)
                    ->where('product_id', $item->product_id)
                    ->update([
                        'quantity_on_hand' => DB::raw("quantity_on_hand - {$item->quantity}"),
                        'last_updated_by' => $approvedBy,
                        'updated_at' => now(),
                    ]);

                // Log the adjustment in the source branch
                DB::table('inventory_adjustments')->insert([
                    'id' => (string) Str::uuid(),
                    'branch_id' => $transfer->from_branch_id,
                    'product_id' => $item->product_id,
                    'adjustment_type' => 'transfer_out',
                    'quantity' => $item->quantity,
                    'reason' => "Inventory transfer #{$transferId} to branch {$transfer->to_branch_id}",
                    'last_updated_by' => $approvedBy,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Update the transfer status
            DB::table('inventory_transfers')
                ->where('id', $transferId)
                ->update([
                    'status' => 'approved',
                    'approved_by' => $approvedBy,
                    'approved_at' => now(),
                ]);

            DB::commit();

            return $this->getTransfer($transferId);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Complete an inventory transfer.
     */
    public function completeTransfer(string $transferId, string $receivedBy)
    {
        DB::beginTransaction();

        try {
            // Get the transfer
            $transfer = DB::table('inventory_transfers')
                ->where('id', $transferId)
                ->first();

            if (!$transfer) {
                throw new \Exception("Transfer not found");
            }

            if ($transfer->status !== 'approved') {
                throw new \Exception("Transfer cannot be completed in its current status");
            }

            // Validate that the receiver is a manager of the destination branch
            $receiver = DB::table('employees')
                ->where('id', $receivedBy)
                ->where('branch_id', $transfer->to_branch_id)
                ->where('role', 'manager')
                ->first();

            if (!$receiver) {
                throw new \Exception("Only managers of the destination branch can complete transfers");
            }

            // Rest of the completeTransfer method remains the same...
            // Get transfer items
            $items = DB::table('inventory_transfer_items')
                ->where('transfer_id', $transferId)
                ->get();

            // Add inventory to the destination branch
            foreach ($items as $item) {
                // Check if inventory exists in destination branch
                $inventoryExists = DB::table('branch_inventory')
                    ->where('branch_id', $transfer->to_branch_id)
                    ->where('product_id', $item->product_id)
                    ->exists();

                if ($inventoryExists) {
                    // Update existing inventory
                    DB::table('branch_inventory')
                        ->where('branch_id', $transfer->to_branch_id)
                        ->where('product_id', $item->product_id)
                        ->update([
                            'quantity_on_hand' => DB::raw("quantity_on_hand + {$item->quantity}"),
                            'last_updated_by' => $receivedBy,
                            'updated_at' => now(),
                        ]);
                } else {
                    // Create new inventory record
                    DB::table('branch_inventory')->insert([
                        'branch_id' => $transfer->to_branch_id,
                        'product_id' => $item->product_id,
                        'quantity_on_hand' => $item->quantity,
                        'reorder_level' => 0,
                        'last_updated_by' => $receivedBy,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                // Log the adjustment in the destination branch
                DB::table('inventory_adjustments')->insert([
                    'id' => (string) Str::uuid(),
                    'branch_id' => $transfer->to_branch_id,
                    'product_id' => $item->product_id,
                    'adjustment_type' => 'transfer_in',
                    'quantity' => $item->quantity,
                    'reason' => "Inventory transfer #{$transferId} from branch {$transfer->from_branch_id}",
                    'last_updated_by' => $receivedBy,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Update the transfer status
            DB::table('inventory_transfers')
                ->where('id', $transferId)
                ->update([
                    'status' => 'completed',
                    'received_by' => $receivedBy,
                    'completed_at' => now(),
                ]);

            DB::commit();

            return $this->getTransfer($transferId);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    /**
     * Reject an inventory transfer.
     */
    public function rejectTransfer(string $transferId, string $rejectedBy, string $rejectionReason)
    {
        DB::beginTransaction();

        try {
            // Get the transfer
            $transfer = DB::table('inventory_transfers')
                ->where('id', $transferId)
                ->first();

            if (!$transfer) {
                throw new \Exception("Transfer not found");
            }

            if ($transfer->status !== 'pending') {
                throw new \Exception("Transfer cannot be rejected in its current status");
            }

            // Update the transfer status
            DB::table('inventory_transfers')
                ->where('id', $transferId)
                ->update([
                    'status' => 'rejected',
                    'approved_by' => $rejectedBy,
                    'rejection_reason' => $rejectionReason,
                    'approved_at' => now(),
                ]);

            DB::commit();

            return $this->getTransfer($transferId);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }


    /**
     * Get transfer details with items.
     */
    public function getTransfer(string $transferId)
    {
        $transfer = DB::table('inventory_transfers')
            ->select(
                'inventory_transfers.*',
                'from_branch.name as from_branch_name',
                'to_branch.name as to_branch_name',
                'requester_user.full_name as requester_name',
                'approver_user.full_name as approver_name',
                'receiver_user.full_name as receiver_name'
            )
            ->leftJoin('branches as from_branch', 'inventory_transfers.from_branch_id', '=', 'from_branch.id')
            ->leftJoin('branches as to_branch', 'inventory_transfers.to_branch_id', '=', 'to_branch.id')
            ->leftJoin('employees as requester_employee', 'inventory_transfers.requested_by', '=', 'requester_employee.id')
            ->leftJoin('users as requester_user', 'requester_employee.user_id', '=', 'requester_user.id')
            ->leftJoin('employees as approver_employee', 'inventory_transfers.approved_by', '=', 'approver_employee.id')
            ->leftJoin('users as approver_user', 'approver_employee.user_id', '=', 'approver_user.id')
            ->leftJoin('employees as receiver_employee', 'inventory_transfers.received_by', '=', 'receiver_employee.id')
            ->leftJoin('users as receiver_user', 'receiver_employee.user_id', '=', 'receiver_user.id')
            ->where('inventory_transfers.id', $transferId)
            ->first();

        if (!$transfer) {
            throw new \Exception("Transfer not found");
        }

        $items = DB::table('inventory_transfer_items')
            ->select(
                'inventory_transfer_items.*',
                'products.name as product_name',
                // 'products.sku as product_sku'
            )
            ->join('products', 'inventory_transfer_items.product_id', '=', 'products.id')
            ->where('transfer_id', $transferId)
            ->get();

        $transfer->items = $items;

        return $transfer;
    }

    /**
     * List transfers with optional filtering.
     */
    public function listTransfers(
        string $branchId = null,
        string $status = null,
        int $page = 1,
        int $perPage = 15
    ) {
        $query = DB::table('inventory_transfers')
            ->select(
                'inventory_transfers.*',
                'from_branch.name as from_branch_name',
                'to_branch.name as to_branch_name',
                'requester_user.full_name as requester_name'
            )
            ->leftJoin('branches as from_branch', 'inventory_transfers.from_branch_id', '=', 'from_branch.id')
            ->leftJoin('branches as to_branch', 'inventory_transfers.to_branch_id', '=', 'to_branch.id')
            ->leftJoin('employees as requester_employee', 'inventory_transfers.requested_by', '=', 'requester_employee.id')
            ->leftJoin('users as requester_user', 'requester_employee.user_id', '=', 'requester_user.id')
            ->orderBy('inventory_transfers.requested_at', 'desc');

        if ($branchId) {
            $query->where(function ($q) use ($branchId) {
                $q->where('from_branch_id', $branchId)
                    ->orWhere('to_branch_id', $branchId);
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $transfers = $query->paginate($perPage, ['*'], 'page', $page);

        return $transfers;
    }
}
