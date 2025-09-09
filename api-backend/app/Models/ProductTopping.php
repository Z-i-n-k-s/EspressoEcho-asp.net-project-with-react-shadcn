<?php

// app/Models/ProductTopping.php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductTopping extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'product_id',
        'topping_id',
        'is_default',
        'created_by',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    // Relationships
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function topping()
    {
        return $this->belongsTo(Topping::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}