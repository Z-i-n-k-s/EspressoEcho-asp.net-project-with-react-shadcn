<?php

namespace App\Http\Controllers;

use App\Services\ToppingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ToppingController extends Controller
{
    public function __construct(private ToppingService $toppingService)
    {
    }

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
            'created_by' => 'required|exists:users,id'
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
            'created_by' => 'sometimes|required|exists:users,id'
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
            $topping = $this->toppingService->updateTopping($id, $data);
            
            return response()->json([
                'success' => true,
                'data' => $topping,
                'message' => 'Topping updated successfully'
            ]);
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
            'created_by' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $isDefault = $request->get('is_default', false);
            $createdBy = $request->get('created_by');
            
            $this->toppingService->assignToProduct($toppingId, $productId, $isDefault, $createdBy);
            
            return response()->json([
                'success' => true,
                'message' => 'Topping assigned to product successfully'
            ]);
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