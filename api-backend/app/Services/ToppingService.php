<?php

namespace App\Services;

use App\Models\Topping;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ToppingService
{
    public function getAllToppings()
    {
        return Topping::with('creator')->orderBy('name')->get();
    }

    public function getToppingById(string $id): Topping
    {
        return Topping::with('creator')->findOrFail($id);
    }

    public function createTopping(array $data): Topping
    {
        return DB::transaction(function () use ($data) {
            // Generate a UUID for the id field
            $data['id'] = (string) Str::uuid();
            
            $topping = Topping::create($data);
            return $topping->load('creator');
        });
    }

    public function updateTopping(string $id, array $data): Topping
    {
        return DB::transaction(function () use ($id, $data) {
            $topping = Topping::findOrFail($id);
            $topping->update($data);
            return $topping->load('creator');
        });
    }

    public function deleteTopping(string $id): void
    {
        DB::transaction(function () use ($id) {
            $topping = Topping::findOrFail($id);
            
            // Perform a hard delete (bypassing soft delete)
            $topping->forceDelete();
        });
    }

    public function assignToProduct(string $toppingId, string $productId, bool $isDefault = false, string $createdBy): void
    {
        DB::transaction(function () use ($toppingId, $productId, $isDefault, $createdBy) {
            $topping = Topping::findOrFail($toppingId);
            
            // Check if already assigned
            if ($topping->products()->where('product_id', $productId)->exists()) {
                throw new \Exception('Topping is already assigned to this product');
            }
            
            $topping->products()->attach($productId, [
                'id' => (string) Str::uuid(),
                'is_default' => $isDefault,
                'created_by' => $createdBy
            ]);
        });
    }

    public function removeFromProduct(string $toppingId, string $productId): void
    {
        DB::transaction(function () use ($toppingId, $productId) {
            $topping = Topping::findOrFail($toppingId);
            
            // Check if assigned
            if (!$topping->products()->where('product_id', $productId)->exists()) {
                throw new \Exception('Topping is not assigned to this product');
            }
            
            $topping->products()->detach($productId);
        });
    }

    public function getToppingsByProduct(string $productId)
    {
        return Topping::whereHas('products', function ($query) use ($productId) {
            $query->where('product_id', $productId);
        })->active()->get();
    }
}