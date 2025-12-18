<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeCapsule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'contents',
        'message',
        'reveal_date',
        'is_public',
        'email_recipients',
    ];

    protected $casts = [
        'contents' => 'array',
        'email_recipients' => 'array',
        'reveal_date' => 'datetime',
        'is_public' => 'boolean',
    ];

    protected $attributes = [
        'contents' => '[]', // Default empty JSON array
        'is_public' => false,
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function artifacts()
    {
        return $this->hasMany(CapsuleArtifact::class, 'capsule_id');
    }

    public function isRevealed()
    {
        return now()->gte($this->reveal_date);
    }

    public function isLocked()
    {
        return now()->lt($this->reveal_date);
    }
}