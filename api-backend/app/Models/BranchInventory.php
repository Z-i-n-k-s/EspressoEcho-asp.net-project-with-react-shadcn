<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BranchInventory extends Model
{
    

    protected $table = 'branch_inventory';
    protected $primaryKey = ['branch_id', 'product_id'];
    public $incrementing = false;
    public $timestamps = true;

    protected $fillable = [
        'branch_id',
        'product_id',
        'quantity_on_hand',
        'reorder_level',
        'last_updated_by',
    ];

    protected $casts = [
        'quantity_on_hand' => 'integer',
        'reorder_level' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function updater()
    {
        return $this->belongsTo(Employee::class, 'last_updated_by');
    }
}