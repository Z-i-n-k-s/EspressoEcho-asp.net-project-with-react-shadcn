<?php

namespace App\Services;

use App\Models\Promotion;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class PromotionService
{
    /**
     * Get all promotions.
     */
    public function getAllPromotions(array $filters = []): Collection
    {
        try {
            $query = Promotion::with('creator');

            // Apply filters
            if (!empty($filters['search'])) {
                $query->where('code', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            }

            if (isset($filters['is_active'])) {
                $query->where('is_active', $filters['is_active']);
            }

            if (!empty($filters['discount_type'])) {
                $query->where('discount_type', $filters['discount_type']);
            }

            return $query->orderBy('created_at', 'desc')->get();
        } catch (\Exception $e) {
            throw new \Exception('Failed to retrieve promotions: ' . $e->getMessage());
        }
    }

    /**
     * Get a specific promotion by ID.
     */
    public function getPromotionById(string $id): Promotion
    {
        try {
            $promotion = Promotion::with('creator', 'customerPromotions.customer')->findOrFail($id);
            return $promotion;
        } catch (\Exception $e) {
            throw new \Exception('Promotion not found: ' . $e->getMessage());
        }
    }

    /**
     * Create a new promotion.
     */
    public function createPromotion(array $data): Promotion
    {
        DB::beginTransaction();

        try {
            if (Promotion::where('code', $data['code'])->exists()) {
                throw new \Exception('Promotion code already exists.');
            }

            $promotion = Promotion::create([
                'code' => $data['code'],
                'description' => $data['description'] ?? null,
                'discount_type' => $data['discount_type'],
                'discount_value' => $data['discount_value'],
                'valid_from' => $data['valid_from'],
                'valid_to' => $data['valid_to'],
                'max_uses' => $data['max_uses'] ?? null,
                'rule_type' => $data['rule_type'] ?? null,
                'rule_criteria' => $data['rule_criteria'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'created_by' => $data['created_by'] // already set in controller
            ]);

            DB::commit();
            return $promotion;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to create promotion: ' . $e->getMessage());
        }
    }

    /**
     * Update an existing promotion.
     */

    public function updatePromotion(string $id, array $data): Promotion
    {
        DB::beginTransaction();

        try {
            $promotion = Promotion::find($id);

            if (!$promotion) {
                throw new \Exception("Promotion with ID {$id} not found");
            }

            // Ensure code is unique if being changed
            if (isset($data['code']) && $data['code'] !== $promotion->code) {
                if (Promotion::where('code', $data['code'])->where('id', '!=', $id)->exists()) {
                    throw new \Exception('Promotion code already exists.');
                }
            }

            $promotion->update($data);

            DB::commit();
            return $promotion->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to update promotion: ' . $e->getMessage());
        }
    }

    /**
     * Delete a promotion (soft delete).
     */
    public function deletePromotion(string $id): bool
    {
        DB::beginTransaction();

        try {
            $promotion = Promotion::findOrFail($id);
            $result = $promotion->delete();

            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to delete promotion: ' . $e->getMessage());
        }
    }

    /**
     * Restore a soft-deleted promotion.
     */
    public function restorePromotion(string $id): bool
    {
        DB::beginTransaction();

        try {
            $promotion = Promotion::withTrashed()->findOrFail($id);
            $result = $promotion->restore();

            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to restore promotion: ' . $e->getMessage());
        }
    }

    /**
     * Permanently delete a promotion.
     */
    public function forceDeletePromotion(string $id): bool
    {
        DB::beginTransaction();

        try {
            $promotion = Promotion::withTrashed()->findOrFail($id);
            $result = $promotion->forceDelete();

            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to permanently delete promotion: ' . $e->getMessage());
        }
    }
}
