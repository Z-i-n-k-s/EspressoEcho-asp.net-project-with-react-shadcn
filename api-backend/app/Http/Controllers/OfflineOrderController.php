<?php

namespace App\Http\Controllers;

use App\Services\OfflineOrderService;
use App\Traits\AuthIdentity;
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
    use AuthIdentity;

    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'branch_id' => 'sometimes|uuid|exists:branches,id',
            'cashier_id' => 'sometimes|uuid', // user ID
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

        $params = $validator->validated();

        // Resolve cashier_id from user ID to employee ID
        if (!empty($params['cashier_id'])) {
            $cashierEmployeeId = $this->cashierId($params['cashier_id']);
            if (!$cashierEmployeeId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Only a cashier can be assigned.',
                ], 403);
            }
            $params['cashier_id'] = $cashierEmployeeId;
        }

        $result = $this->offlineOrderService->getAllOrders($params);

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'] ?? null,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], $result['success'] ? 200 : 500);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'branch_id' => 'required|uuid|exists:branches,id',
            'cashier_id' => 'required|uuid', // user ID
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

        $validated = $validator->validated();

        // Resolve cashier ID
        $cashierEmployeeId = $this->cashierId($validated['cashier_id']);
        if (!$cashierEmployeeId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Only a cashier can create orders.',
            ], 403);
        }
        $validated['cashier_id'] = $cashierEmployeeId;

        $result = $this->offlineOrderService->createOrder(
            $validated,
            $validated['items']
        );

        $statusCode = $result['success'] ? 201 : (strpos($result['message'], 'does not belong') !== false ? 422 : 500);

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'] ?? null,
            'message' => $result['message'],
            'error' => $result['error'] ?? null
        ], $statusCode);
    }

    /**
     * Get orders by cashier ID
     *
     * @param Request $request
     * @param string $cashierId
     * @return JsonResponse
     */
    public function getByCashierId(Request $request, string $cashierUserId): JsonResponse
    {
        // Resolve cashier user_id to employee_id
        $cashierEmployeeId = $this->cashierId($cashierUserId);

        if (!$cashierEmployeeId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: Only a cashier can be queried.',
            ], 403);
        }

        $result = $this->offlineOrderService->getOrdersByCashierId($cashierEmployeeId);

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
