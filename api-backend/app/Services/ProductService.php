<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductTopping;
use App\Models\BranchInventory;
use App\Models\OrderItem;
use App\Models\OfflineOrderItem;
use App\Models\InventoryAdjustment;
use App\Models\InventoryTransferItem;
use App\Models\ProductReview;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductService
{
    /**
     * Get all products with optional pagination
     */
    public function getAllProducts(bool $paginate = false, int $perPage = 15): Collection|LengthAwarePaginator
    {
        try {
            $query = Product::with(['category', 'creator', 'toppings']); // Added 'toppings'

            return $paginate
                ? $query->paginate($perPage)
                : $query->get();
        } catch (\Exception $e) {
            Log::error('Failed to fetch products: ' . $e->getMessage());
            throw new \Exception('Could not retrieve products: ' . $e->getMessage());
        }
    }

    /**
     * Get a specific product by ID
     */
    public function getProductById(string $id): Product
    {
        try {
            return Product::with(['category', 'creator','toppings'])->findOrFail($id);
        } catch (\Exception $e) {
            Log::error("Failed to fetch product with ID {$id}: " . $e->getMessage());
            throw new \Exception('Product not found: ' . $e->getMessage());
        }
    }

    /**
     * Create a new product
     */
    public function createProduct(array $data): Product
    {
        DB::beginTransaction();

        try {
            $product = Product::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'base_price' => $data['base_price'],
                'image_url' => $data['image_url'] ?? null,
                'category_id' => $data['category_id'],
                'is_active' => $data['is_active'] ?? true,
                'created_by' => $data['created_by'],
            ]);

            DB::commit();
            return $product->load(['category', 'creator']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create product: ' . $e->getMessage());
            throw new \Exception('Could not create product: ' . $e->getMessage());
        }
    }

    /**
     * Update an existing product
     */
    public function updateProduct(string $id, array $data): Product
    {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);

            $product->update([
                'name' => $data['name'] ?? $product->name,
                'description' => $data['description'] ?? $product->description,
                'base_price' => $data['base_price'] ?? $product->base_price,
                'image_url' => $data['image_url'] ?? $product->image_url,
                'category_id' => $data['category_id'] ?? $product->category_id,
                'is_active' => $data['is_active'] ?? $product->is_active,
            ]);

            DB::commit();
            return $product->load(['category', 'creator']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to update product with ID {$id}: " . $e->getMessage());
            throw new \Exception('Could not update product: ' . $e->getMessage());
        }
    }

    /**
     * Delete a product and all its related data (hard delete)
     */
    public function deleteProduct(string $id): bool
    {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);
            
            // Delete all related data first to maintain referential integrity
            ProductTopping::where('product_id', $id)->delete();
            BranchInventory::where('product_id', $id)->delete();
            OrderItem::where('product_id', $id)->delete();
            OfflineOrderItem::where('product_id', $id)->delete();
            InventoryAdjustment::where('product_id', $id)->delete();
            InventoryTransferItem::where('product_id', $id)->delete();
            ProductReview::where('product_id', $id)->delete();
            
            // Finally delete the product
            $product->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to delete product with ID {$id}: " . $e->getMessage());
            throw new \Exception('Could not delete product: ' . $e->getMessage());
        }
    }

    /**
     * Get products by category
     */
    public function getProductsByCategory(string $categoryId, bool $paginate = false, int $perPage = 15): Collection|LengthAwarePaginator
    {
        try {
            $query = Product::with(['category', 'creator', 'toppings'])
                ->where('category_id', $categoryId)
                ->where('is_active', true)
                ->orderBy('name');

            return $paginate
                ? $query->paginate($perPage)
                : $query->get();
        } catch (\Exception $e) {
            Log::error("Failed to fetch products for category ID {$categoryId}: " . $e->getMessage());
            throw new \Exception('Could not retrieve products: ' . $e->getMessage());
        }
    }

    /**
     * Get active products only
     */
    public function getActiveProducts(bool $paginate = false, int $perPage = 15): Collection|LengthAwarePaginator
    {
        try {
            $query = Product::with(['category', 'creator', 'toppings'])
                ->where('is_active', true)
                ->orderBy('name');

            return $paginate
                ? $query->paginate($perPage)
                : $query->get();
        } catch (\Exception $e) {
            Log::error('Failed to fetch active products: ' . $e->getMessage());
            throw new \Exception('Could not retrieve products: ' . $e->getMessage());
        }
    }

    /**
     * Toggle product active status
     */
    public function toggleProductStatus(string $id): Product
    {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);
            $product->update([
                'is_active' => !$product->is_active
            ]);

            DB::commit();
            return $product->load(['category', 'creator']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to toggle status for product with ID {$id}: " . $e->getMessage());
            throw new \Exception('Could not toggle product status: ' . $e->getMessage());
        }
    }
}