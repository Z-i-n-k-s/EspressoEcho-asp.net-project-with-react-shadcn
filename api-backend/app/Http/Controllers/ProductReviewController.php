<?php

namespace App\Http\Controllers;

use App\Services\ProductReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ProductReviewController extends Controller
{
    protected $productReviewService;

    public function __construct(ProductReviewService $productReviewService)
    {
        $this->productReviewService = $productReviewService;
    }

    /**
     * Get all reviews for a specific product
     */
    public function indexByProduct(string $productId): JsonResponse
    {
        $validator = Validator::make(['product_id' => $productId], [
            'product_id' => 'required|uuid|exists:products,id'
        ], [
            'product_id.uuid' => 'Product ID must be a valid UUID',
            'product_id.exists' => 'Product does not exist'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $reviews = $this->productReviewService->getReviewsByProductId($productId);
            
            return response()->json([
                'message' => 'Reviews retrieved successfully',
                'data' => $reviews
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all reviews by a specific customer
     */
    public function indexByCustomer(string $customerId): JsonResponse
    {
        $validator = Validator::make(['customer_id' => $customerId], [
            'customer_id' => 'required|uuid|exists:customers,id'
        ], [
            'customer_id.uuid' => 'Customer ID must be a valid UUID',
            'customer_id.exists' => 'Customer does not exist'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $reviews = $this->productReviewService->getReviewsByCustomerId($customerId);
            
            return response()->json([
                'message' => 'Reviews retrieved successfully',
                'data' => $reviews
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new review
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|uuid|exists:customers,id',
            'product_id' => 'required|uuid|exists:products,id',
            'order_id' => 'nullable|uuid|exists:orders,id',
            'rating' => 'required|integer|between:1,5',
            'comment' => 'sometimes|string|nullable',
            'is_visible' => 'sometimes|boolean'
        ], [
            'customer_id.uuid' => 'Customer ID must be a valid UUID',
            'customer_id.exists' => 'Customer does not exist',
            'product_id.uuid' => 'Product ID must be a valid UUID',
            'product_id.exists' => 'Product does not exist',
            'order_id.uuid' => 'Order ID must be a valid UUID',
            'order_id.exists' => 'Order does not exist',
            'rating.between' => 'Rating must be between 1 and 5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $review = $this->productReviewService->createReview($validator->validated());
            
            return response()->json([
                'message' => 'Review created successfully',
                'data' => $review
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific review
     */
    public function show(string $id): JsonResponse
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|uuid|exists:product_reviews,id'
        ], [
            'id.uuid' => 'Review ID must be a valid UUID',
            'id.exists' => 'Review does not exist'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $review = $this->productReviewService->getReviewById($id);
            
            return response()->json([
                'message' => 'Review retrieved successfully',
                'data' => $review
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a review (only by the original customer)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make(array_merge($request->all(), ['id' => $id]), [
            'id' => 'required|uuid|exists:product_reviews,id',
            'rating' => 'sometimes|integer|between:1,5',
            'comment' => 'sometimes|string|nullable',
            'is_visible' => 'sometimes|boolean'
        ], [
            'id.uuid' => 'Review ID must be a valid UUID',
            'id.exists' => 'Review does not exist',
            'rating.between' => 'Rating must be between 1 and 5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $review = $this->productReviewService->updateReview($id, $validator->validated());
            
            return response()->json([
                'message' => 'Review updated successfully',
                'data' => $review
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a review (soft delete by setting is_visible to false)
     */
    public function destroy(string $id, Request $request): JsonResponse
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|uuid|exists:product_reviews,id'
        ], [
            'id.uuid' => 'Review ID must be a valid UUID',
            'id.exists' => 'Review does not exist'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->productReviewService->softDeleteReview($id);
            
            return response()->json([
                'message' => 'Review deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get reviews by rating
     */
    public function getByRating(int $rating): JsonResponse
    {
        $validator = Validator::make(['rating' => $rating], [
            'rating' => 'required|integer|between:1,5'
        ], [
            'rating.between' => 'Rating must be between 1 and 5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $reviews = $this->productReviewService->getReviewsByRating($rating);
            
            return response()->json([
                'message' => 'Reviews retrieved successfully',
                'data' => $reviews
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get high-rated reviews (4+ stars)
     */
    public function getHighRated(): JsonResponse
    {
        try {
            $reviews = $this->productReviewService->getHighRatedReviews();
            
            return response()->json([
                'message' => 'High-rated reviews retrieved successfully',
                'data' => $reviews
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve high-rated reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get low-rated reviews (2 stars or less)
     */
    public function getLowRated(): JsonResponse
    {
        try {
            $reviews = $this->productReviewService->getLowRatedReviews();
            
            return response()->json([
                'message' => 'Low-rated reviews retrieved successfully',
                'data' => $reviews
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve low-rated reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}