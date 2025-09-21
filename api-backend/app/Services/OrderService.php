<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Promotion;
use App\Models\CustomerPromotion;
use App\Models\BranchInventory;
use App\Models\Category;
use App\Models\DeliveryAssignment;
use App\Models\Employee;
use App\Models\InventoryAdjustment;
use App\Models\Payment;
use App\Models\ProductTopping;
use App\Models\Topping;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Str;

class OrderService
{
    public function getOrders(array $filters): array
    {
        $query = Order::with(['customer', 'orderItems.product', 'orderItems.topping', 'handledBy', 'promotion']);

        if (isset($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (isset($filters['status'])) {
            $query->where('order_status', $filters['status']);
        }

        $perPage = $filters['per_page'] ?? 15;
        $orders = $query->orderBy('placed_at', 'desc')->paginate($perPage);

        return [
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'last_page' => $orders->lastPage()
            ]
        ];
    }

    public function getOrderDetails(string $id): Order
    {
        return Order::with([
            'customer.user',
            'orderItems.product',
            'orderItems.topping',
            'handledBy.user',
            'promotion',
            'deliveryAssignment.staff.user',
            'payment'
        ])->findOrFail($id);
    }

    public function createOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            // Validate product availability, toppings, and calculate totals
            $orderDetails = $this->validateAndCalculateOrder($data);

            // Check and apply promo code if provided
            $promoDetails = [];
            if (!empty($data['promo_code_used'])) {
                $promoDetails = $this->validateAndApplyPromoCode(
                    $data['customer_id'],
                    $data['promo_code_used'],
                    $orderDetails['subtotal']
                );
            }

            // Create order
            $order = Order::create([
                'customer_id' => $data['customer_id'],
                'order_type' => $data['order_type'],
                'order_status' => 'pending',
                'subtotal' => $orderDetails['subtotal'],
                'discount_amount' => $promoDetails['discount_amount'] ?? 0,
                'total_amount' => $promoDetails['total_amount'] ?? $orderDetails['subtotal'],
                'default_address' => $data['default_address'] ?? false,
                'delivery_address' => $data['delivery_address'] ?? null,
                'special_instructions' => $data['special_instructions'] ?? null,
                'promo_code_used' => $data['promo_code_used'] ?? null,
                'placed_at' => now()
            ]);

            // Create order items with toppings
            foreach ($data['order_items'] as $item) {
                $orderItemData = [
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $orderDetails['product_prices'][$item['product_id']],
                    'total_price' => $item['quantity'] * $orderDetails['product_prices'][$item['product_id']]
                ];

                // Add topping if provided (only one topping per item in this schema)
                if (!empty($item['toppings']) && count($item['toppings']) > 0) {
                    $toppingId = $item['toppings'][0]; // Get first topping only
                    $this->validateToppingForProduct($item['product_id'], $toppingId);
                    $orderItemData['topping_id'] = $toppingId;
                }

                OrderItem::create($orderItemData);
            }

            // Mark promo as used if applicable
            if (!empty($promoDetails['customer_promotion'])) {
                $promoDetails['customer_promotion']->update([
                    'status' => 'used',
                    'used_at' => now(),
                    'order_id' => $order->id
                ]);

                // Increment promo usage count
                Promotion::where('code', $data['promo_code_used'])->increment('current_uses');
            }

            // Create payment record
            $this->createPayment($order, $data);

            return $order->load(['orderItems.product', 'orderItems.topping', 'payment']);
        });
    }

    private function validateToppingForProduct(string $productId, string $toppingId): void
    {
        $isValid = ProductTopping::where('product_id', $productId)
            ->where('topping_id', $toppingId)
            ->exists();

        if (!$isValid) {
            throw new \Exception("Topping {$toppingId} is not available for product {$productId}");
        }
    }

    public function updateOrderStatus(string $orderId, array $data): Order
    {
        return DB::transaction(function () use ($orderId, $data) {
            $order = Order::with('orderItems.product')->findOrFail($orderId);
            $currentStatus = $order->order_status;

            // Validate employee role if handled_by is provided
            if (isset($data['handled_by'])) {
                $this->validateEmployeeRole($data['delivery_staff_id'], $data['status']);
            }

            // Update order status
            $order->order_status = $data['status'];

            // Update handled_by if provided
            if (isset($data['handled_by'])) {
                $order->handled_by = $data['handled_by'];
            }

            // Update timestamps based on new status
            switch ($data['status']) {
                case 'confirmed':
                    $order->confirmed_at = now();
                    break;
                case 'preparing':
                    $order->prepared_at = now();
                    break;
                case 'delivered':
                    $order->completed_at = now();
                    break;
                case 'cancelled':
                    $order->cancelled_at = now();
                    break;
            }

            $order->save();

            // Handle delivered status - DEDUCT INVENTORY HERE
            if ($data['status'] === 'delivered') {
                $this->handleDeliveredStatus($order);

                // Get employee's branch
                $employee = Employee::findOrFail($data['handled_by']);
                if (!$employee->branch_id) {
                    throw new \Exception("Employee is not assigned to any branch.");
                }

                $this->validateBranchCategoryAccess($data['handled_by'], $order->orderItems);
                $this->deductInventory(
                    $employee->branch_id,
                    $order->orderItems,
                    $order->id,
                    $data['handled_by']
                );
            }

            return $order->fresh(['orderItems.product']);
        });
    }

    private function deductInventory(string $branchId, $orderItems, string $orderId, ?string $handledBy): void
    {
        foreach ($orderItems as $item) {
            $product = $item->product;

            // Check stock for this branch - FIXED TABLE NAME
            $stock = DB::table('branch_inventory')
                ->where('branch_id', $branchId)
                ->where('product_id', $product->id)
                ->first();

            if (!$stock) {
                throw new \Exception("Product {$product->name} is not available in this branch.");
            }

            if ($stock->quantity_on_hand < $item->quantity) {
                throw new \Exception("Insufficient stock for product: {$product->name}");
            }

            // Deduct inventory
            DB::table('branch_inventory')
                ->where('branch_id', $branchId)
                ->where('product_id', $product->id)
                ->update([
                    'quantity_on_hand' => $stock->quantity_on_hand - $item->quantity,
                    'updated_at' => now(),
                ]);

            // Mark item as deducted
            $item->inventory_deducted = true;
            $item->save();

            // Log inventory adjustment - ADDED PROPER LOGGING
            InventoryAdjustment::create([
                'id' => (string) Str::uuid(),
                'branch_id' => $branchId,
                'product_id' => $product->id,
                'adjustment_type' => 'manual_decrease',
                'quantity' => $item->quantity,
                'reason' => 'Order delivery',
                'last_updated_by' => $handledBy,
                'reference_order_type' => 'online',
                'reference_order_id' => $orderId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
    private function validateAndCalculateOrder(array $data): array
    {
        $subtotal = 0;
        $productPrices = [];

        foreach ($data['order_items'] as $item) {
            // Get product price with toppings
            $productPrice = $this->getProductPrice($item['product_id'], $item['toppings'] ?? []);
            $productPrices[$item['product_id']] = $productPrice;

            // Calculate item total
            $itemTotal = $productPrice * $item['quantity'];
            $subtotal += $itemTotal;
        }

        return [
            'subtotal' => $subtotal,
            'product_prices' => $productPrices
        ];
    }

    private function getProductPrice(string $productId, array $toppingIds = []): float
    {
        $product = \App\Models\Product::findOrFail($productId);
        $basePrice = $product->base_price;

        // Add topping prices (only one topping in this schema)
        $toppingsPrice = 0;
        if (!empty($toppingIds) && count($toppingIds) > 0) {
            $topping = Topping::find($toppingIds[0]);
            if ($topping) {
                $toppingsPrice = $topping->price;
            }
        }

        return $basePrice + $toppingsPrice;
    }

    private function createPayment(Order $order, array $data): void
    {
        $paymentStatus = 'pending';

        // If payment method is not cash_on_delivery, mark as completed
        if ($data['payment_method'] !== 'cash_on_delivery') {
            $paymentStatus = 'completed';
        }

        Payment::create([
            'id' => (string) Str::uuid(),
            'order_id' => $order->id,
            'order_type' => 'online',
            'payment_method' => $data['payment_method'],
            'amount' => $order->total_amount,
            'status' => $paymentStatus,
            'transaction_id' => $data['transaction_id'] ?? null,
            'collected_by' => null, // Will be set when delivered for cash_on_delivery
            'payment_date' => now(),
        ]);
    }




    /**
     * Validate that cashier’s branch has access to all categories
     */
    private function validateBranchCategoryAccess(string $employeeId, $orderItems): void
    {
        $employee = Employee::findOrFail($employeeId);

        if (!$employee->branch_id) {
            throw new \Exception("Cashier is not assigned to any branch.");
        }

        $branchId = $employee->branch_id;

        // Extract all category IDs from order items
        $categoryIds = $orderItems->map(function ($item) {
            return $item->product->category_id;
        })->unique();

        // Fetch assigned categories for the branch
        $assignedCategories = DB::table('branch_categories')
            ->where('branch_id', $branchId)
            ->pluck('category_id')
            ->toArray();

        foreach ($categoryIds as $catId) {
            if (!in_array($catId, $assignedCategories)) {
                $categoryName = Category::find($catId)->name ?? 'Unknown';
                throw new \Exception("Branch is not assigned to product category: {$categoryName}");
            }
        }
    }

    /**
     * Deduct inventory stock for order items
     */


    private function validateEmployeeRole(string $employeeId, string $status): void
    {
        $employee = Employee::with('user.roles')->findOrFail($employeeId);

        $allowedRoles = [
            'pending' => ['cashier'],
            'confirmed' => ['cashier'],
            'preparing' => ['cashier'],
            'ready_for_delivery' => ['cashier'],
            'on_the_way' => ['staff'], // Delivery staff
            'delivered' => ['staff'], // Delivery staff
            'cancelled' => ['cashier']
        ];

        $employeeRoles = $employee->user->roles->pluck('name')->toArray();
        $requiredRoles = $allowedRoles[$status] ?? [];

        if (empty(array_intersect($employeeRoles, $requiredRoles))) {
            throw new \Exception("Employee does not have required role to update status to {$status}");
        }
    }

    private function createDeliveryAssignment(string $orderId, string $staffId, string $assignedById): void
    {
        // Check if staff is eligible for delivery (has staff role)
        $staff = Employee::with('user.roles')->findOrFail($staffId);
        $staffRoles = $staff->user->roles->pluck('name')->toArray();

        if (!in_array('staff', $staffRoles)) {
            throw new \Exception("Selected employee is not eligible for delivery assignments");
        }

        DeliveryAssignment::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'order_id' => $orderId,
            'staff_id' => $staffId,
            'assigned_by' => $assignedById,
            'status' => 'assigned',
            'assigned_at' => now()
        ]);
    }


    // In OrderService.php, update the restoreInventory method
    private function restoreInventory(string $branchId, $orderItems, string $orderId, string $adjustmentType, ?string $updatedBy): void
    {
        foreach ($orderItems as $item) {
            if ($item->inventory_deducted) {
                // Restore branch inventory
                DB::table('branch_inventory')
                    ->where('branch_id', $branchId)
                    ->where('product_id', $item->product_id)
                    ->increment('quantity_on_hand', $item->quantity);

                // Mark order item as inventory restored
                $item->update(['inventory_deducted' => false]);

                // Record inventory adjustment
                InventoryAdjustment::create([
                    'id' => (string) \Illuminate\Support\Str::uuid(),
                    'branch_id' => $branchId,
                    'product_id' => $item->product_id,
                    'adjustment_type' => $adjustmentType,
                    'quantity' => $item->quantity,
                    'reason' => 'Order cancellation',
                    'reference_order_id' => $orderId,
                    'last_updated_by' => $updatedBy
                ]);
            }
        }
    }


    public function getCustomerOrderHistory(array $filters): array
    {
        $query = Order::with(['branch', 'orderItems.product'])
            ->where('customer_id', $filters['customer_id'])
            ->orderBy('placed_at', 'desc');

        if (isset($filters['status'])) {
            $query->where('order_status', $filters['status']);
        }

        if (isset($filters['start_date'])) {
            $query->whereDate('placed_at', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->whereDate('placed_at', '<=', $filters['end_date']);
        }

        $perPage = $filters['per_page'] ?? 15;
        $orders = $query->paginate($perPage);

        return [
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'last_page' => $orders->lastPage()
            ]
        ];
    }



    private function validateAndApplyPromoCode(string $customerId, string $promoCode, float $subtotal): array
    {
        $promotion = Promotion::where('code', $promoCode)
            ->where('is_active', true)
            ->whereDate('valid_from', '<=', now())
            ->whereDate('valid_to', '>=', now())
            ->first();

        if (!$promotion) {
            throw new \Exception('Invalid or expired promo code');
        }

        // Check if promo has usage limits
        if ($promotion->max_uses && $promotion->current_uses >= $promotion->max_uses) {
            throw new \Exception('Promo code has reached its usage limit');
        }

        // Check if customer is eligible for this promo
        $customerPromotion = CustomerPromotion::where('customer_id', $customerId)
            ->where('promo_id', $promotion->id)
            ->where('status', 'assigned')
            ->first();

        if (!$customerPromotion && $promotion->rule_type === 'customer_duration') {
            throw new \Exception('Customer is not eligible for this promotion');
        }

        // Calculate discount
        $discountAmount = 0;

        if ($promotion->discount_type === 'percentage') {
            $discountAmount = ($subtotal * $promotion->discount_value) / 100;
        } else {
            $discountAmount = min($promotion->discount_value, $subtotal);
        }

        $totalAmount = $subtotal - $discountAmount;

        return [
            'discount_amount' => $discountAmount,
            'total_amount' => $totalAmount,
            'customer_promotion' => $customerPromotion
        ];
    }


    private function handleDeliveredStatus(Order $order): void
    {
        // Update payment if cash_on_delivery
        $payment = Payment::where('order_id', $order->id)->first();
        if ($payment && $payment->payment_method === 'cash_on_delivery') {
            $payment->update([
                'status' => 'completed',
                'collected_by' => $order->handled_by, // Delivery staff ID
                'payment_date' => now()
            ]);
        }

        // Update delivery assignment status
        DeliveryAssignment::where('order_id', $order->id)
            ->update(['status' => 'delivered', 'completed_at' => now()]);
    }

    private function validateStatusTransition(string $currentStatus, string $newStatus): void
    {
        $validTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['preparing', 'cancelled'],
            'preparing' => ['ready_for_delivery', 'cancelled'],
            'ready_for_delivery' => ['on_the_way', 'cancelled'],
            'on_the_way' => ['delivered'],
            'delivered' => [],
            'cancelled' => []
        ];

        if (!in_array($newStatus, $validTransitions[$currentStatus])) {
            throw new \Exception("Invalid status transition from {$currentStatus} to {$newStatus}");
        }
    }
    // Add this method to OrderService
    public function assignDeliveryStaff(string $id, array $data): Order
    {
        return DB::transaction(function () use ($id, $data) {
            $order = Order::findOrFail($id);

            // Check if order is in ready_for_delivery status
            if ($order->order_status !== 'ready_for_delivery') {
                throw new \Exception('Order must be in ready_for_delivery status before assigning delivery staff');
            }

            // Validate assigned_by employee has appropriate role
            $this->validateEmployeeRole($data['assigned_by'], 'ready_for_delivery');

            // Validate delivery staff has appropriate role
            $this->validateEmployeeRole($data['delivery_staff_id'], 'on_the_way');

            // Create delivery assignment
            $this->createDeliveryAssignment($order->id, $data['delivery_staff_id'], $data['assigned_by']);

            // Update order status to on_the_way
            $order->update([
                'order_status' => 'on_the_way',
                'handled_by' => $data['delivery_staff_id']
            ]);

            return $order->fresh();
        });
    }



    private function reversePromoCodeUsage(string $customerId, string $promoCode, string $orderId): void
    {
        $promotion = Promotion::where('code', $promoCode)->first();

        if ($promotion) {
            // Decrement promo usage count
            Promotion::where('code', $promoCode)->decrement('current_uses');

            // Update customer promotion status back to assigned
            CustomerPromotion::where('customer_id', $customerId)
                ->where('promo_id', $promotion->id)
                ->where('order_id', $orderId)
                ->update([
                    'status' => 'assigned',
                    'used_at' => null,
                    'order_id' => null
                ]);
        }
    }
    public function cancelOrder(string $id, array $data): Order
    {
        return DB::transaction(function () use ($id, $data) {
            $order = Order::findOrFail($id);

            // Validate cancellation permissions
            $this->validateCancellationPermissions($order, $data);

            if ($order->order_status === 'cancelled') {
                throw new \Exception('Order is already cancelled');
            }

            // Check if order can be cancelled based on status
            if (in_array($order->order_status, ['on_the_way', 'delivered'])) {
                throw new \Exception('Cannot cancel order that is already on the way or delivered');
            }

            $updateData = [
                'order_status' => 'cancelled',
                'cancelled_at' => now(),
                'special_instructions' => isset($data['cancellation_reason']) ?
                    ($order->special_instructions ? $order->special_instructions . ' | Cancellation Reason: ' . $data['cancellation_reason']
                        : 'Cancellation Reason: ' . $data['cancellation_reason']) : $order->special_instructions
            ];

            // Set handled_by for cashier cancellations
            if ($data['cancelled_by'] === 'cashier') {
                $updateData['handled_by'] = $data['user_id'];
            }

            $order->update($updateData);

            // Restore inventory if it was deducted
            if (in_array($order->order_status, ['confirmed', 'preparing', 'ready_for_delivery'])) {
                $this->restoreInventory($order->branch_id, $order->orderItems, $order->id, 'cancelled_order_loss', $data['user_id']);
            }

            // Reverse promo code usage if applicable
            if ($order->promo_code_used) {
                $this->reversePromoCodeUsage($order->customer_id, $order->promo_code_used, $order->id);
            }

            // Record cancellation in activity log
            $this->recordCancellationActivity($order, $data);

            return $order->fresh();
        });
    }

    private function validateCancellationPermissions(Order $order, array $data): void
    {
        if ($data['cancelled_by'] === 'customer') {
            // Validate customer owns the order
            if ($order->customer_id !== $data['user_id']) {
                throw new \Exception('You can only cancel your own orders');
            }

            // Check if customer can cancel this order (time-based or status-based restrictions)
            $this->validateCustomerCancellation($order);
        } else if ($data['cancelled_by'] === 'cashier') {
            // Validate employee has cashier role
            $employee = Employee::with('user.roles')->find($data['user_id']);
            if (!$employee) {
                throw new \Exception('Employee not found');
            }

            $employeeRoles = $employee->user->roles->pluck('name')->toArray();
            if (!in_array('cashier', $employeeRoles) && !in_array('manager', $employeeRoles)) {
                throw new \Exception('Only cashiers and managers can cancel orders');
            }
        } else {
            throw new \Exception('Invalid cancellation request');
        }
    }

    private function validateCustomerCancellation(Order $order): void
    {
        // Customers can only cancel orders within a certain time frame (e.g., 30 minutes)
        $placedAt = Carbon::parse($order->placed_at);
        $now = Carbon::now();

        if ($now->diffInMinutes($placedAt) > 30) {
            throw new \Exception('Orders can only be cancelled within 30 minutes of placement');
        }

        // Customers cannot cancel orders that are already being prepared
        if (in_array($order->order_status, ['preparing', 'ready_for_delivery', 'on_the_way', 'delivered'])) {
            throw new \Exception('Order is already being processed and cannot be cancelled');
        }
    }

    private function recordCancellationActivity(Order $order, array $data): void
    {
        $activityType = $data['cancelled_by'] === 'customer' ? 'customer_cancellation' : 'cashier_cancellation';

        // You would typically use an activity log model here
        // For now, we'll just update a cancellation note in the order
        $note = "Cancelled by " . $data['cancelled_by'];
        if (isset($data['cancellation_reason'])) {
            $note .= ": " . $data['cancellation_reason'];
        }

        // If you have an activity log table, you would record it here
        // ActivityLog::create([...]);

        // For simplicity, we'll append to special instructions
        $order->update([
            'special_instructions' => $order->special_instructions .
                ($order->special_instructions ? ' | ' : '') . $note
        ]);
    }
}
