<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;


class InventoryAdjustment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'branch_id',
        'product_id',
        'adjustment_type',
        'quantity',
        'reason',
        'reference_order_type',
        'reference_order_id',
        'last_updated_by',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
    // Relationships
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function lastUpdatedBy(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'last_updated_by');
    }

    // Scopes
    public function scopeByReferenceOrderType($query, $type)
    {
        return $query->where('reference_order_type', $type);
    }
}
