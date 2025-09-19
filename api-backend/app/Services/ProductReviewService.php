<?php

namespace App\Services;

use App\Models\ProductReview;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductReviewService
{
    /**
     * Get all reviews for a specific product
     */
    public function getReviewsByProductId(string $productId)
    {
        return DB::transaction(function () use ($productId) {
            try {
                return ProductReview::with(['customer', 'product', 'order'])
                    ->where('product_id', $productId)
                    ->where('is_visible', true)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::error('Failed to retrieve reviews by product ID', [
                    'error' => $e->getMessage(),
                    'product_id' => $productId
                ]);
                
                throw new \Exception('Failed to retrieve reviews: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Get all reviews by a specific customer
     */
    public function getReviewsByCustomerId(string $customerId)
    {
        return DB::transaction(function () use ($customerId) {
            try {
                return ProductReview::with(['customer', 'product', 'order'])
                    ->where('customer_id', $customerId)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::error('Failed to retrieve reviews by customer ID', [
                    'error' => $e->getMessage(),
                    'customer_id' => $customerId
                ]);
                
                throw new \Exception('Failed to retrieve reviews: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Create a new review
     */
    public function createReview(array $data): ProductReview
    {
        return DB::transaction(function () use ($data) {
            try {
                $review = ProductReview::create([
                    'customer_id' => $data['customer_id'],
                    'product_id' => $data['product_id'],
                    'order_id' => $data['order_id'] ?? null,
                    'rating' => $data['rating'],
                    'comment' => $data['comment'] ?? null,
                    'is_visible' => $data['is_visible'] ?? true
                ]);

                Log::info('Product review created successfully', [
                    'review_id' => $review->id,
                    'customer_id' => $data['customer_id'],
                    'product_id' => $data['product_id']
                ]);

                return $review->load(['customer', 'product', 'order']);
            } catch (\Exception $e) {
                Log::error('Failed to create product review', [
                    'error' => $e->getMessage(),
                    'data' => $data
                ]);
                
                throw new \Exception('Failed to create review: ' . $e->getMessage());
            }
        });
    }

    /**
     * Get a specific review by ID
     */
    public function getReviewById(string $id): ProductReview
    {
        return DB::transaction(function () use ($id) {
            try {
                return ProductReview::with(['customer', 'product', 'order'])
                    ->findOrFail($id);
            } catch (\Exception $e) {
                Log::error('Failed to retrieve product review', [
                    'error' => $e->getMessage(),
                    'review_id' => $id
                ]);
                
                throw new \Exception('Failed to retrieve review: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Update a review
     */
    public function updateReview(string $id, array $data): ProductReview
    {
        return DB::transaction(function () use ($id, $data) {
            try {
                $review = ProductReview::findOrFail($id);
                
                // Only allow updating specific fields
                $updatableFields = ['rating', 'comment', 'is_visible'];
                $updateData = array_intersect_key($data, array_flip($updatableFields));
                
                $review->update($updateData);

                Log::info('Product review updated successfully', [
                    'review_id' => $id,
                    'updated_data' => $updateData
                ]);

                return $review->fresh()->load(['customer', 'product', 'order']);
            } catch (\Exception $e) {
                Log::error('Failed to update product review', [
                    'error' => $e->getMessage(),
                    'review_id' => $id,
                    'data' => $data
                ]);
                
                throw new \Exception('Failed to update review: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Hard delete a review
     */
    public function deleteReview(string $id): void
    {
        DB::transaction(function () use ($id) {
            try {
                $review = ProductReview::findOrFail($id);
                $review->delete();

                Log::info('Product review deleted successfully', [
                    'review_id' => $id
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to delete product review', [
                    'error' => $e->getMessage(),
                    'review_id' => $id
                ]);
                
                throw new \Exception('Failed to delete review: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Hide a review (set is_visible to false)
     */
    public function hideReview(string $id): ProductReview
    {
        return DB::transaction(function () use ($id) {
            try {
                $review = ProductReview::findOrFail($id);
                $review->update([
                    'is_visible' => false
                ]);

                Log::info('Product review hidden successfully', [
                    'review_id' => $id
                ]);

                return $review->fresh()->load(['customer', 'product', 'order']);
            } catch (\Exception $e) {
                Log::error('Failed to hide product review', [
                    'error' => $e->getMessage(),
                    'review_id' => $id
                ]);
                
                throw new \Exception('Failed to hide review: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Show a review (set is_visible to true)
     */
    public function showReview(string $id): ProductReview
    {
        return DB::transaction(function () use ($id) {
            try {
                $review = ProductReview::findOrFail($id);
                $review->update([
                    'is_visible' => true
                ]);

                Log::info('Product review shown successfully', [
                    'review_id' => $id
                ]);

                return $review->fresh()->load(['customer', 'product', 'order']);
            } catch (\Exception $e) {
                Log::error('Failed to show product review', [
                    'error' => $e->getMessage(),
                    'review_id' => $id
                ]);
                
                throw new \Exception('Failed to show review: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Get reviews by rating
     */
    public function getReviewsByRating(int $rating)
    {
        return DB::transaction(function () use ($rating) {
            try {
                return ProductReview::with(['customer', 'product', 'order'])
                    ->where('rating', $rating)
                    ->where('is_visible', true)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::error('Failed to retrieve reviews by rating', [
                    'error' => $e->getMessage(),
                    'rating' => $rating
                ]);
                
                throw new \Exception('Failed to retrieve reviews: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Get high-rated reviews (4+ stars)
     */
    public function getHighRatedReviews()
    {
        return DB::transaction(function () {
            try {
                return ProductReview::with(['customer', 'product', 'order'])
                    ->where('rating', '>=', 4)
                    ->where('is_visible', true)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::error('Failed to retrieve high-rated reviews', [
                    'error' => $e->getMessage()
                ]);
                
                throw new \Exception('Failed to retrieve reviews: ' . $e->getMessage());
            }
        }, 3);
    }

    /**
     * Get low-rated reviews (2 stars or less)
     */
    public function getLowRatedReviews()
    {
        return DB::transaction(function () {
            try {
                return ProductReview::with(['customer', 'product', 'order'])
                    ->where('rating', '<=', 2)
                    ->where('is_visible', true)
                    ->orderBy('created_at', 'desc')
                    ->get();
            } catch (\Exception $e) {
                Log::error('Failed to retrieve low-rated reviews', [
                    'error' => $e->getMessage()
                ]);
                
                throw new \Exception('Failed to retrieve reviews: ' . $e->getMessage());
            }
        }, 3);
    }
}