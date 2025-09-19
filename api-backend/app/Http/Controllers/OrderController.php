<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use App\Traits\AuthIdentity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    protected $orderService;
    use AuthIdentity;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'nullable|uuid|exists:customers,id',
            'branch_id' => 'nullable|uuid|exists:branches,id',
            'status' => 'nullable|in:pending,confirmed,preparing,ready_for_delivery,on_the_way,delivered,cancelled',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1,max:100'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $orders = $this->orderService->getOrders($validator->validated());
            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
      public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,preparing,ready_for_delivery,on_the_way,delivered,cancelled',
            'handled_by' => 'required|uuid', // user ID
            'delivery_staff_id' => 'required_if:status,ready_for_delivery|uuid' // user ID
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // Validate cashier role for handled_by
        $cashierId = $this->cashierId($validated['handled_by']);
        if (!$cashierId) {
            return response()->json([
                'message' => 'Unauthorized: Only a cashier can handle orders.'
            ], 403);
        }
        $validated['handled_by'] = $cashierId;

        // Validate staff role for delivery_staff_id if provided
        if (isset($validated['delivery_staff_id'])) {
            $staffId = $this->staffId($validated['delivery_staff_id']);
            if (!$staffId) {
                return response()->json([
                    'message' => 'Unauthorized: Only a staff member can deliver orders.'
                ], 403);
            }
            $validated['delivery_staff_id'] = $staffId;
        }

        try {
            $order = $this->orderService->updateOrderStatus($id, $validated);
            return response()->json([
                'message' => 'Order status updated successfully',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function checkCancellationEligibility(string $id): JsonResponse
    {
        try {
            $order = Order::findOrFail($id);
            return response()->json([
                'eligibility' => $order->cancellation_eligibility
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }



    public function assignDelivery(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'delivery_staff_id' => 'required|uuid|exists:employees,id',
            'assigned_by' => 'required|uuid|exists:employees,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $order = $this->orderService->assignDeliveryStaff($id, $validator->validated());
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function show(string $id): JsonResponse
    {
        try {
            $order = $this->orderService->getOrderDetails($id);
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|uuid|exists:customers,id',
            'branch_id' => 'required|uuid|exists:branches,id',
            'order_type' => 'required|in:online',
            'order_items' => 'required|array|min:1',
            'order_items.*.product_id' => 'required|uuid|exists:products,id',
            'order_items.*.quantity' => 'required|integer|min:1',
            'delivery_address' => 'required_if:default_address,false|string|max:500',
            'default_address' => 'boolean',
            'special_instructions' => 'nullable|string|max:1000',
            'promo_code_used' => 'nullable|string|exists:promotions,code'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $order = $this->orderService->createOrder($validator->validated());
            return response()->json($order, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function customerOrderHistory(Request $request, string $customerId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'nullable|in:pending,confirmed,preparing,ready_for_delivery,on_the_way,delivered,cancelled',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1,max:100',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $filters = array_merge(['customer_id' => $customerId], $validator->validated());
            $orders = $this->orderService->getCustomerOrderHistory($filters);
            return response()->json($orders);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function cancelOrder(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'cancellation_reason' => 'nullable|string|max:500',
            'cancelled_by' => 'required|string|in:customer,cashier',
            'user_id' => 'required|uuid', // Customer ID or Employee ID based on cancelled_by
            'employee_id' => 'required_if:cancelled_by,cashier|uuid|exists:employees,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = $validator->validated();
            $order = $this->orderService->cancelOrder($id, $data);
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function customerCancelOrder(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'cancellation_reason' => 'nullable|string|max:500',
            'customer_id' => 'required|uuid|exists:customers,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = $validator->validated();
            $data['cancelled_by'] = 'customer';
            $data['user_id'] = $data['customer_id'];

            $order = $this->orderService->cancelOrder($id, $data);
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function cashierCancelOrder(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'cancellation_reason' => 'nullable|string|max:500',
            'employee_id' => 'required|uuid|exists:employees,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = $validator->validated();
            $data['cancelled_by'] = 'cashier';
            $data['user_id'] = $data['employee_id'];

            $order = $this->orderService->cancelOrder($id, $data);
            return response()->json($order);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
