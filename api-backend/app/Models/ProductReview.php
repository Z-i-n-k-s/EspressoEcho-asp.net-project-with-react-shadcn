<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductReview extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'customer_id',
        'product_id',
        'order_id',
        'rating',
        'comment',
        'is_visible',
        'removed_by',
        'removed_at',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_visible' => 'boolean',
        'removed_at' => 'datetime',
    ];

    // Relationships
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function removedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'removed_by');
    }

    // Scopes
    public function scopeVisible($query)
    {
        return $query->where('is_visible', true)->whereNull('removed_at');
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    public function scopeHighRated($query)
    {
        return $query->where('rating', '>=', 4);
    }

    public function scopeLowRated($query)
    {
        return $query->where('rating', '<=', 2);
    }

    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    // Accessors
    public function getRatingStarsAttribute()
    {
        return str_repeat('★', $this->rating) . str_repeat('☆', 5 - $this->rating);
    }

    public function getIsRemovedAttribute()
    {
        return !is_null($this->removed_at);
    }

    public function getHasCommentAttribute()
    {
        return !empty($this->comment);
    }
}