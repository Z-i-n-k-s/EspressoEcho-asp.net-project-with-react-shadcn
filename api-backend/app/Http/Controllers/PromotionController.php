<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Services\PromotionService;
use App\Traits\AuthIdentity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PromotionController extends Controller
{
    protected $promotionService;
     use AuthIdentity;

    public function __construct(PromotionService $promotionService)
    {
        $this->promotionService = $promotionService;
    }

    // Add this method to your PromotionController
    public function checkExists(string $id): JsonResponse
    {
        try {
            $exists = Promotion::where('id', $id)->exists();

            return response()->json([
                'success' => true,
                'exists' => $exists,
                'message' => $exists ? 'Promotion exists' : 'Promotion not found'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of promotions.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['search', 'is_active', 'discount_type']);

            $promotions = $this->promotionService->getAllPromotions($filters);

            return response()->json([
                'success' => true,
                'data' => $promotions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created promotion.
     */
  public function store(Request $request): JsonResponse
{
    $validator = Validator::make($request->all(), [
        'code' => 'required|alpha_dash|max:50|unique:promotions,code',
        'description' => 'nullable|string|max:500',
        'discount_type' => 'required|in:percentage,fixed_amount',
        'discount_value' => 'required|numeric|min:0',
        'valid_from' => 'required|date',
        'valid_to' => 'required|date|after:valid_from',
        'max_uses' => 'nullable|integer|min:1',
        'rule_type' => 'nullable|in:order_count,customer_duration,order_amount',
        'rule_criteria' => 'nullable|json',
        'is_active' => 'boolean',
        'created_by' => ['required', 'uuid', 'exists:users,id'], // user_id
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    // ✅ Check if the user is actually an admin
    $adminId = $this->adminId($request->created_by);

    if (!$adminId) {
        return response()->json([
            'success' => false,
            'message' => 'Unauthorized: Only admins can create promotions.'
        ], 403);
    }

    try {
        $validated = $validator->validated();
        $validated['created_by'] = $adminId; // now stores employee_id

        $promotion = $this->promotionService->createPromotion($validated);

        return response()->json([
            'success' => true,
            'message' => 'Promotion created successfully',
            'data' => $promotion
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Display the specified promotion.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $promotion = $this->promotionService->getPromotionById($id);

            return response()->json([
                'success' => true,
                'data' => $promotion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified promotion.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|alpha_dash|max:50|unique:promotions,code,' . $id,
            'description' => 'nullable|string|max:500',
            'discount_type' => 'sometimes|in:percentage,fixed_amount',
            'discount_value' => 'sometimes|numeric|min:0',
            'valid_from' => 'sometimes|date',
            'valid_to' => 'sometimes|date|after:valid_from',
            'max_uses' => 'nullable|integer|min:1',
            'rule_type' => 'nullable|in:order_count,customer_duration,order_amount',
            'rule_criteria' => 'nullable|json',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $promotion = $this->promotionService->updatePromotion($id, $validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Promotion updated successfully',
                'data' => $promotion
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    /**
 * Get all active promotions
 */
public function activePromotions(): JsonResponse
{
    try {
        $promotions = $this->promotionService->getActivePromotions();

        return response()->json([
            'success' => true,
            'data' => $promotions
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Remove the specified promotion (soft delete).
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->promotionService->deletePromotion($id);

            return response()->json([
                'success' => true,
                'message' => 'Promotion deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore a soft-deleted promotion.
     */
    public function restore(string $id): JsonResponse
    {
        try {
            $this->promotionService->restorePromotion($id);

            return response()->json([
                'success' => true,
                'message' => 'Promotion restored successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Permanently delete a promotion.
     */
    public function forceDelete(string $id): JsonResponse
    {
        try {
            $this->promotionService->forceDeletePromotion($id);

            return response()->json([
                'success' => true,
                'message' => 'Promotion permanently deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
