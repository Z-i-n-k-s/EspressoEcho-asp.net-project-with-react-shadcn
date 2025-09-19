<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use App\Traits\AuthIdentity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    protected $productService;
     use AuthIdentity;


    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Get all products
     */
    public function index(): JsonResponse
    {
        try {
            $products = $this->productService->getAllProducts();
            
            return response()->json([
                'success' => true,
                'data' => $products,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new product
     */
  public function store(Request $request): JsonResponse
{
    // Step 1: Validate input (basic validation only)
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'base_price' => 'required|numeric|min:0',
        'image_url' => 'nullable|url|max:500',
        'category_id' => 'required|exists:categories,id',
        'is_active' => 'boolean',
        'created_by' => 'required|uuid|exists:users,id', // user_id
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    // Step 2: Resolve admin employee_id
    $adminId = $this->adminId($request->created_by);

    if (!$adminId) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized: Only admins can create products.',
        ], 403);
    }

    try {
        // Merge the resolved admin employee_id back into data
        $validated = $validator->validated();
        $validated['created_by'] = $adminId;

        $product = $this->productService->createProduct($validated);
        
        return response()->json([
            'success' => true,
            'data' => $product,
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}

    /**
     * Get a single product by ID
     */
    public function show(string $id): JsonResponse
    {
        try {
            $product = $this->productService->getProductById($id);
            
            return response()->json([
                'success' => true,
                'data' => $product,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update a product
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'base_price' => 'sometimes|numeric|min:0',
            'image_url' => 'nullable|url|max:500',
            'category_id' => 'sometimes|exists:categories,id',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = $this->productService->updateProduct($id, $validator->validated());
            
            return response()->json([
                'success' => true,
                'data' => $product,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a product (hard delete)
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->productService->deleteProduct($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}