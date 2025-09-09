<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeedbackReply extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'feedback_id',
        'responder_id',
        'responder_role',
        'message',
        'replied_at',
    ];

    protected $casts = [
        'replied_at' => 'datetime',
    ];

    // Relationships
    public function feedback(): BelongsTo
    {
        return $this->belongsTo(Feedback::class);
    }

    public function responder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responder_id');
    }

    // Scopes
    public function scopeByRole($query, $role)
    {
        return $query->where('responder_role', $role);
    }

    public function scopeByResponder($query, $responderId)
    {
        return $query->where('responder_id', $responderId);
    }

    // Accessors
    public function getIsAdminReplyAttribute()
    {
        return $this->responder_role === 'admin';
    }

    public function getIsManagerReplyAttribute()
    {
        return $this->responder_role === 'manager';
    }
}