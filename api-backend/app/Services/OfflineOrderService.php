<?php

namespace App\Services;

use App\Models\OfflineOrder;
use App\Models\OfflineOrderItem;
use App\Models\BranchInventory;
use App\Models\InventoryAdjustment;
use App\Models\Payment;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OfflineOrderService
{
    /**
     * Get all offline orders with their items
     *
     * @param array $filters
     * @return array
     */
    public function getAllOrders(array $filters = []): array
    {
        try {
            $query = OfflineOrder::with(['offlineOrderItems.product', 'branch', 'cashier.user', 'payment']);

            if (!empty($filters['branch_id'])) {
                $query->where('branch_id', $filters['branch_id']);
            }

            if (!empty($filters['cashier_id'])) {
                $query->where('cashier_id', $filters['cashier_id']);
            }

            if (!empty($filters['payment_method'])) {
                $query->where('payment_method', $filters['payment_method']);
            }

            if (!empty($filters['date'])) {
                $query->whereDate('created_at', $filters['date']);
            }

            $orders = $query->orderBy('created_at', 'desc')->get();
            
            return [
                'success' => true,
                'data' => $orders,
                'message' => 'Offline orders retrieved successfully'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to retrieve orders',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Create a new offline order
     *
     * @param array $orderData
     * @param array $itemsData
     * @return array
     */
    public function createOrder(array $orderData, array $itemsData): array
    {
        DB::beginTransaction();
        
        try {
            // Validate that cashier belongs to the selected branch
            $cashierValidation = $this->validateCashierBranch(
                $orderData['cashier_id'], 
                $orderData['branch_id']
            );
            
            if (!$cashierValidation['success']) {
                DB::rollBack();
                return $cashierValidation;
            }

            // Create the order
            $order = OfflineOrder::create([
                'id' => (string) Str::uuid(),
                'branch_id' => $orderData['branch_id'],
                'cashier_id' => $orderData['cashier_id'],
                'total_amount' => 0, // Will be calculated from items
                'payment_method' => $orderData['payment_method'],
            ]);

            $totalAmount = 0;

            // Process order items
            foreach ($itemsData as $item) {
                $itemTotal = $item['quantity'] * $item['unit_price'];
                $totalAmount += $itemTotal;

                // Create order item
                $orderItem = OfflineOrderItem::create([
                    'id' => (string) Str::uuid(),
                    'offline_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $itemTotal,
                ]);

                // Always deduct from inventory for offline orders
                $inventoryResult = $this->deductInventory(
                    $orderData['branch_id'],
                    $item['product_id'],
                    $item['quantity'],
                    $order->id,
                    $orderData['cashier_id']
                );
                
                if (!$inventoryResult['success']) {
                    DB::rollBack();
                    return [
                        'success' => false,
                        'message' => $inventoryResult['message']
                    ];
                }
                
                // Mark inventory as deducted
                $orderItem->update(['inventory_deducted' => true]);
            }

            // Update order total
            $order->update(['total_amount' => $totalAmount]);

            // Create payment record
            $paymentResult = $this->createPaymentRecord($order, $orderData['cashier_id']);
            
            if (!$paymentResult['success']) {
                DB::rollBack();
                return [
                    'success' => false,
                    'message' => $paymentResult['message']
                ];
            }

            DB::commit();
            
            return [
                'success' => true,
                'data' => $order->load('offlineOrderItems.product', 'payment'),
                'message' => 'Order created successfully'
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            
            return [
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Validate that cashier belongs to the selected branch
     *
     * @param string $cashierId
     * @param string $branchId
     * @return array
     */
    protected function validateCashierBranch(string $cashierId, string $branchId): array
    {
        try {
            $employee = Employee::where('id', $cashierId)
                ->where('branch_id', $branchId)
                ->first();

            if (!$employee) {
                return [
                    'success' => false,
                    'message' => 'Cashier does not belong to the selected branch'
                ];
            }

            return [
                'success' => true,
                'message' => 'Cashier validation successful'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to validate cashier branch association',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get orders by cashier ID
     *
     * @param string $cashierId
     * @return array
     */
    public function getOrdersByCashierId(string $cashierId): array
    {
        try {
            $orders = OfflineOrder::with(['offlineOrderItems.product', 'branch', 'payment'])
                ->where('cashier_id', $cashierId)
                ->orderBy('created_at', 'desc')
                ->get();
                
            return [
                'success' => true,
                'data' => $orders,
                'message' => 'Orders retrieved successfully'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to retrieve orders',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Deduct inventory from branch and log adjustment
     *
     * @param string $branchId
     * @param string $productId
     * @param int $quantity
     * @param string $orderId
     * @param string $cashierId
     * @return array
     */
    protected function deductInventory(string $branchId, string $productId, int $quantity, string $orderId, string $cashierId): array
    {
        try {
            $inventory = BranchInventory::where('branch_id', $branchId)
                ->where('product_id', $productId)
                ->first();

            if (!$inventory) {
                return [
                    'success' => false,
                    'message' => "Product not found in branch inventory"
                ];
            }

            if ($inventory->quantity_on_hand < $quantity) {
                return [
                    'success' => false,
                    'message' => "Insufficient inventory for product: {$productId}"
                ];
            }

            // Use query builder to decrement inventory (avoiding Eloquent decrement method)
            $affectedRows = BranchInventory::where('branch_id', $branchId)
                ->where('product_id', $productId)
                ->update([
                    'quantity_on_hand' => DB::raw("quantity_on_hand - {$quantity}"),
                    'last_updated_by' => $cashierId,
                    'updated_at' => now()
                ]);
            
            if ($affectedRows === 0) {
                return [
                    'success' => false,
                    'message' => 'Failed to update inventory'
                ];
            }
            
            // Verify the cashier exists as an employee
            $employee = Employee::find($cashierId);
            if (!$employee) {
                return [
                    'success' => false,
                    'message' => 'Cashier not found in employees'
                ];
            }
            
            // Log inventory adjustment with reference_order_type set to 'offline'
            InventoryAdjustment::create([
                'id' => (string) Str::uuid(),
                'branch_id' => $branchId,
                'product_id' => $productId,
                'adjustment_type' => 'manual_decrease',
                'quantity' => $quantity,
                'reason' => 'Offline order sale',
                'reference_order_type' => 'offline', // Set reference_order_type to 'offline'
                'reference_order_id' => $orderId,    // Set reference_order_id to the offline order ID
                'last_updated_by' => $cashierId,
            ]);
            
            return [
                'success' => true,
                'message' => 'Inventory deducted successfully'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to deduct inventory: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Generate a unique transaction ID
     *
     * @return string
     */
    protected function generateTransactionId(): string
    {
        // Generate a unique transaction ID with prefix and timestamp
        $prefix = 'TXN';
        $timestamp = now()->format('YmdHis');
        $random = Str::upper(Str::random(6));
        
        return "{$prefix}{$timestamp}{$random}";
    }

    /**
     * Create payment record for offline order
     *
     * @param OfflineOrder $order
     * @param string $cashierId
     * @return array
     */
    protected function createPaymentRecord(OfflineOrder $order, string $cashierId): array
    {
        try {
            // Verify the cashier exists as an employee
            $employee = Employee::find($cashierId);
            if (!$employee) {
                return [
                    'success' => false,
                    'message' => 'Cashier not found in employees'
                ];
            }
            
            // Generate a unique transaction ID
            $transactionId = $this->generateTransactionId();
            
            Payment::create([
                'id' => (string) Str::uuid(),
                'order_id' => $order->id,
                'order_type' => 'offline',
                'payment_method' => $order->payment_method,
                'amount' => $order->total_amount,
                'status' => 'completed',
                'transaction_id' => $transactionId,
                'collected_by' => $cashierId,
                'payment_date' => now(),
            ]);
            
            return [
                'success' => true,
                'message' => 'Payment record created successfully'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to create payment record: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ];
        }
    }
}