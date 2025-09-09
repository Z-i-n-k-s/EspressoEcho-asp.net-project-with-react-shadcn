<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'customer_id',
        'branch_id',
        'order_type',
        'order_status',
        'subtotal',
        'discount_amount',
        'total_amount',
        'default_address',
        'delivery_address',
        'special_instructions',
        'promo_code_used',
        'placed_at',
        'confirmed_at',
        'prepared_at',
        'completed_at',
        'cancelled_at',
        'handled_by',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'default_address' => 'boolean',
        'placed_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'prepared_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    protected $dates = ['deleted_at'];

    // Relationships
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function handledBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'handled_by');
    }

    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class, 'promo_code_used', 'code');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function deliveryAssignment(): HasOne
    {
        return $this->hasOne(DeliveryAssignment::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class)->where('order_type', 'online');
    }

    public function productReviews(): HasMany
    {
        return $this->hasMany(ProductReview::class);
    }

    public function customerPromotions(): HasMany
    {
        return $this->hasMany(CustomerPromotion::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereNotIn('order_status', ['cancelled']);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('order_status', $status);
    }

    public function scopeByBranch($query, $branchId)
    {
        return $query->where('branch_id', $branchId);
    }
}