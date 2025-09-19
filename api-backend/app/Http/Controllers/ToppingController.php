<?php

namespace App\Http\Controllers;

use App\Services\ToppingService;
use App\Traits\AuthIdentity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ToppingController extends Controller
{
    use AuthIdentity;
    public function __construct(private ToppingService $toppingService) {}

    public function index(): JsonResponse
    {
        try {
            $toppings = $this->toppingService->getAllToppings();

            return response()->json([
                'success' => true,
                'data' => $toppings,
                'message' => 'Toppings retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve toppings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:toppings,name',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'created_by' => 'required|uuid|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            // ✅ Check admin role
            $adminId = $this->adminId($data['created_by']);
            if (!$adminId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Only admins can create toppings.'
                ], 403);
            }

            $topping = $this->toppingService->createTopping($data);

            return response()->json([
                'success' => true,
                'data' => $topping,
                'message' => 'Topping created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create topping',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function show(string $id): JsonResponse
    {
        try {
            $topping = $this->toppingService->getToppingById($id);

            return response()->json([
                'success' => true,
                'data' => $topping,
                'message' => 'Topping retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Topping not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:toppings,name,' . $id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'created_by' => 'required|uuid|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            // ✅ Verify Admin
            $adminId = $this->adminId($data['created_by']);
            if (!$adminId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Only admins can update toppings.'
                ], 403);
            }

            $topping = $this->toppingService->updateTopping($id, array_merge($data, [
                'created_by' => $adminId
            ]));

            return response()->json([
                'success' => true,
                'data' => $topping,
                'message' => 'Topping updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update topping',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(string $id): JsonResponse
    {
        try {
            $this->toppingService->deleteTopping($id);

            return response()->json([
                'success' => true,
                'message' => 'Topping deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete topping',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function assignToProduct(Request $request, string $toppingId, string $productId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'is_default' => 'boolean',
            'created_by' => 'required|uuid|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();

            // ✅ Check if user is an admin
            $adminId = $this->adminId($data['created_by']);
            if (!$adminId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized: Only admins can assign toppings to products.'
                ], 403);
            }

            $isDefault = $data['is_default'] ?? false;

            $this->toppingService->assignToProduct(
                $toppingId,
                $productId,
                $isDefault,
                $adminId // 👈 we pass verified admin userId
            );

            return response()->json([
                'success' => true,
                'message' => 'Topping assigned to product successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign topping to product',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function removeFromProduct(string $toppingId, string $productId): JsonResponse
    {
        try {
            $this->toppingService->removeFromProduct($toppingId, $productId);

            return response()->json([
                'success' => true,
                'message' => 'Topping removed from product successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove topping from product',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
