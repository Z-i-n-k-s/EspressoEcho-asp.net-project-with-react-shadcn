<?php

namespace App\Services;

use App\Models\InventoryAdjustment;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * Adjust inventory with add/remove actions.
     */
    public function adjustInventory(array $adjustments, string $branchId): array
    {
        $results = [];

        DB::beginTransaction();

        try {
            foreach ($adjustments as $adjustment) {
                // Extract data from adjustment array
                $productId = $adjustment['product_id'];
                $quantity = (int) $adjustment['quantity'];
                $action = $adjustment['action'];
                $employeeId = $adjustment['employee_id'];
                $reorderLevel = isset($adjustment['reorder_level']) ? (int) $adjustment['reorder_level'] : null;
                $reason = $adjustment['reason'] ?? null;

                // Check if inventory exists
                $inventoryExists = DB::table('branch_inventory')
                    ->where('branch_id', $branchId)
                    ->where('product_id', $productId)
                    ->exists();

                $oldQuantity = 0;
                $oldReorderLevel = 0;
                if ($inventoryExists) {
                    $inventoryRecord = DB::table('branch_inventory')
                        ->where('branch_id', $branchId)
                        ->where('product_id', $productId)
                        ->first();
                    $oldQuantity = $inventoryRecord->quantity_on_hand;
                    $oldReorderLevel = $inventoryRecord->reorder_level;
                }

                if ($action === 'add') {
                    if ($inventoryExists) {
                        // Update existing inventory
                        $updateData = [
                            'quantity_on_hand' => DB::raw('quantity_on_hand + ' . $quantity),
                            'last_updated_by' => $employeeId,
                            'updated_at' => now(),
                        ];
                        
                        if ($reorderLevel !== null) {
                            $updateData['reorder_level'] = $reorderLevel;
                        }
                        
                        DB::table('branch_inventory')
                            ->where('branch_id', $branchId)
                            ->where('product_id', $productId)
                            ->update($updateData);
                    } else {
                        // Create new inventory record
                        DB::table('branch_inventory')->insert([
                            'branch_id' => $branchId,
                            'product_id' => $productId,
                            'quantity_on_hand' => $quantity,
                            'reorder_level' => $reorderLevel ?? 0,
                            'last_updated_by' => $employeeId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                } elseif ($action === 'remove') {
                    if (!$inventoryExists) {
                        throw new \Exception("Product $productId not found in inventory");
                    }
                    
                    if ($oldQuantity < $quantity) {
                        throw new \Exception("Insufficient quantity for product $productId");
                    }

                    // Update inventory
                    $updateData = [
                        'quantity_on_hand' => DB::raw('quantity_on_hand - ' . $quantity),
                        'last_updated_by' => $employeeId,
                        'updated_at' => now(),
                    ];
                    
                    if ($reorderLevel !== null) {
                        $updateData['reorder_level'] = $reorderLevel;
                    }
                    
                    DB::table('branch_inventory')
                        ->where('branch_id', $branchId)
                        ->where('product_id', $productId)
                        ->update($updateData);
                }

                // Log the adjustment - only if there was a quantity change
                $adjustmentType = $action === 'add' ? 'manual_increase' : 'manual_decrease';
                $this->logInventoryAdjustment(
                    $branchId,
                    $productId,
                    $adjustmentType,
                    $quantity,
                    $employeeId,
                    $reason
                );

                // Get the new quantity and reorder level
                $updatedInventory = DB::table('branch_inventory')
                    ->where('branch_id', $branchId)
                    ->where('product_id', $productId)
                    ->first();

                $results[] = [
                    'product_id' => $productId,
                    'action' => $action,
                    'quantity' => $quantity,
                    'old_quantity' => $oldQuantity,
                    'new_quantity' => $updatedInventory->quantity_on_hand,
                    'old_reorder_level' => $oldReorderLevel,
                    'new_reorder_level' => $updatedInventory->reorder_level
                ];
            }

            DB::commit();

            return $results;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Bulk update inventory with absolute quantities.
     */
    public function bulkUpdate(array $updates, string $branchId): array
    {
        $results = [];

        DB::beginTransaction();

        try {
            foreach ($updates as $update) {
                // Extract data from update array
                $productId = $update['product_id'];
                $quantity = (int) $update['quantity'];
                $employeeId = $update['employee_id'];
                $reorderLevel = isset($update['reorder_level']) ? (int) $update['reorder_level'] : null;
                $reason = $update['reason'] ?? null;

                // Check if inventory exists
                $inventoryExists = DB::table('branch_inventory')
                    ->where('branch_id', $branchId)
                    ->where('product_id', $productId)
                    ->exists();

                $oldQuantity = 0;
                $oldReorderLevel = 0;
                if ($inventoryExists) {
                    $inventoryRecord = DB::table('branch_inventory')
                        ->where('branch_id', $branchId)
                        ->where('product_id', $productId)
                        ->first();
                    $oldQuantity = $inventoryRecord->quantity_on_hand;
                    $oldReorderLevel = $inventoryRecord->reorder_level;
                }

                if ($inventoryExists) {
                    // Update existing inventory
                    $updateData = [
                        'quantity_on_hand' => $quantity,
                        'last_updated_by' => $employeeId,
                        'updated_at' => now(),
                    ];
                    
                    if ($reorderLevel !== null) {
                        $updateData['reorder_level'] = $reorderLevel;
                    }
                    
                    DB::table('branch_inventory')
                        ->where('branch_id', $branchId)
                        ->where('product_id', $productId)
                        ->update($updateData);
                } else {
                    // Create new inventory record
                    DB::table('branch_inventory')->insert([
                        'branch_id' => $branchId,
                        'product_id' => $productId,
                        'quantity_on_hand' => $quantity,
                        'reorder_level' => $reorderLevel ?? 0,
                        'last_updated_by' => $employeeId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                // Log the adjustment if there was a change in quantity
                $quantityChange = $quantity - $oldQuantity;
                if ($quantityChange !== 0) {
                    $adjustmentType = $quantityChange > 0 ? 'manual_increase' : 'manual_decrease';
                    
                    $this->logInventoryAdjustment(
                        $branchId,
                        $productId,
                        $adjustmentType,
                        abs($quantityChange),
                        $employeeId,
                        $reason
                    );
                }

                // Log reorder level change if there was a change and no quantity change
                if ($quantityChange === 0 && $reorderLevel !== null && $reorderLevel != $oldReorderLevel) {
                    $this->logInventoryAdjustment(
                        $branchId,
                        $productId,
                        'reorder_level_update',
                        0,
                        $employeeId,
                        $reason ?? 'Reorder level updated'
                    );
                }

                $updatedInventory = DB::table('branch_inventory')
                    ->where('branch_id', $branchId)
                    ->where('product_id', $productId)
                    ->first();

                $results[] = [
                    'product_id' => $productId,
                    'old_quantity' => $oldQuantity,
                    'new_quantity' => $updatedInventory->quantity_on_hand,
                    'old_reorder_level' => $oldReorderLevel,
                    'new_reorder_level' => $updatedInventory->reorder_level
                ];
            }

            DB::commit();

            return $results;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Log inventory adjustment.
     */
    private function logInventoryAdjustment(
        string $branchId,
        string $productId,
        string $adjustmentType,
        int $quantity,
        string $employeeId,
        string $reason = null
    ): void {
        DB::table('inventory_adjustments')->insert([
            'id' => \Illuminate\Support\Str::uuid(),
            'branch_id' => $branchId,
            'product_id' => $productId,
            'adjustment_type' => $adjustmentType,
            'quantity' => $quantity,
            'reason' => $reason,
            'last_updated_by' => $employeeId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
    /**
 * Get current inventory for a branch.
 */
public function getBranchInventory(string $branchId): array
{
    return DB::table('branch_inventory as bi')
        ->join('products as p', 'bi.product_id', '=', 'p.id')
        ->where('bi.branch_id', $branchId)
        ->select(
            'bi.product_id',
            'p.name as product_name',
            'bi.quantity_on_hand',
            'bi.reorder_level',
            'bi.last_updated_by',
            'bi.updated_at'
        )
        ->get()
        ->toArray();
}
}