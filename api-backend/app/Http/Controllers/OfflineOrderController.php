<?php

namespace App\Http\Controllers;

use App\Services\OfflineOrderService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class OfflineOrderController extends Controller
{
    protected $offlineOrderService;

    public function __construct(OfflineOrderService $offlineOrderService)
    {
        $this->offlineOrderService = $offlineOrderService;
    }

    /**
     * Get all offline orders with items
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Validate request parameters
        $validator = Validator::make($request->all(), [
            'branch_id' => 'sometimes|uuid|exists:branches,id',
            'cashier_id' => 'sometimes|uuid|exists:employees,id',
            'payment_method' => 'sometimes|in:cash,card',
            'date' => 'sometimes|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid parameters',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->offlineOrderService->getAllOrders($request->all());
        
        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'message' => $result['message']
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
                'error' => $result['error'] ?? null
            ], 500);
        }
    }

    /**
     * Create a new offline order
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'branch_id' => 'required|uuid|exists:branches,id',
            'cashier_id' => 'required|uuid|exists:employees,id',
            'payment_method' => 'required|in:cash,card',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|uuid|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid order data',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->offlineOrderService->createOrder(
            $request->only(['branch_id', 'cashier_id', 'payment_method']),
            $request->input('items')
        );

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'message' => $result['message']
            ], 201);
        } else {
            // Return 422 for validation errors (like cashier not in branch)
            // and 500 for server errors
            $statusCode = strpos($result['message'], 'does not belong') !== false ? 422 : 500;
            
            return response()->json([
                'success' => false,
                'message' => $result['message'],
                'error' => $result['error'] ?? null
            ], $statusCode);
        }
    }

    /**
     * Get orders by cashier ID
     *
     * @param Request $request
     * @param string $cashierId
     * @return JsonResponse
     */
    public function getByCashierId(Request $request, string $cashierId): JsonResponse
    {
        // Validate cashier ID
        $validator = Validator::make(['cashier_id' => $cashierId], [
            'cashier_id' => 'required|uuid|exists:employees,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid cashier ID',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->offlineOrderService->getOrdersByCashierId($cashierId);
        
        if ($result['success']) {
            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'message' => $result['message']
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
                'error' => $result['error'] ?? null
            ], 500);
        }
    }
}