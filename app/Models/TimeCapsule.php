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
        'bury_date',
        'reveal_date',
        'recipients',
        'public',
        'access_code',
        'revealed',
        'visible',
    ];

    protected $casts = [
        'contents'    => 'array',
        'recipients'  => 'array',
        'public'      => 'boolean',
        'revealed'    => 'boolean',
        'visible'     => 'boolean',
        'bury_date'   => 'datetime',
        'reveal_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function artifacts()
    {
        return $this->hasMany(CapsuleArtifact::class, 'capsule_id');
    }
}
