<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'order_id',
        'product_id',
        'topping_id',
        'quantity',
        'unit_price',
        'total_price',
        'inventory_deducted',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'inventory_deducted' => 'boolean',
    ];

    // Relationships
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function topping(): BelongsTo
    {
        return $this->belongsTo(Topping::class);
    }

    // Mutators
    public function setTotalPriceAttribute($value)
    {
        $this->attributes['total_price'] = $this->quantity * $this->unit_price;
    }

    // Accessors
    public function getFormattedTotalPriceAttribute()
    {
        return number_format($this->total_price, 2);
    }
}