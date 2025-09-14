<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfflineOrderItem extends Model
{
    use HasFactory, HasUuids;
    public $timestamps = false;


    protected $fillable = [
        'offline_order_id',
        'product_id',
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
    public function offlineOrder(): BelongsTo
    {
        return $this->belongsTo(OfflineOrder::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
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