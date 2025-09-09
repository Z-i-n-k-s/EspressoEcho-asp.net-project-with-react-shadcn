<?php
// app/Models/Category.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, HasUuids; // Removed SoftDeletes trait

    protected $fillable = [
        'name',
        'description',
    ];

    // Relationships
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'branch_categories');
    }
}