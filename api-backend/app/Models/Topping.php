<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Topping extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'id',
        'name',
        'description',
        'price',
        'is_active',
        'created_by'
    ];

    protected $casts = [
        'id' => 'string',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'created_by' => 'string'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_toppings')
            ->withPivot('is_default')
            ->withTimestamps();
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}