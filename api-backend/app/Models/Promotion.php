<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Promotion extends Model
{
    use HasFactory, SoftDeletes;

    
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'valid_from',
        'valid_to',
        'max_uses',
        'current_uses',
        'is_active',
        'rule_type',
        'rule_criteria',
        'created_by'
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'valid_from' => 'date',
        'valid_to' => 'date',
        'max_uses' => 'integer',
        'current_uses' => 'integer',
        'is_active' => 'boolean',
        'rule_criteria' => 'array'
    ];

    /**
     * Get the user that created the promotion.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the customer promotions for this promotion.
     */
    public function customerPromotions(): HasMany
    {
        return $this->hasMany(CustomerPromotion::class, 'promo_id');
    }

    /**
     * Scope a query to only include active promotions.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                    ->where('valid_from', '<=', now())
                    ->where('valid_to', '>=', now())
                    ->where(function($q) {
                        $q->whereNull('max_uses')
                          ->orWhereRaw('current_uses < max_uses');
                    });
    }

    /**
     * Check if the promotion is currently valid.
     */
    public function isValid(): bool
    {
        return $this->is_active &&
               now()->between($this->valid_from, $this->valid_to) &&
               (!$this->max_uses || $this->current_uses < $this->max_uses);
    }
}