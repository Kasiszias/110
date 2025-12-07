<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CapsuleArtifact extends Model
{
    use HasFactory;

    protected $fillable = [
        'capsule_id',
        'type',
        'title',
        'content',
        'year',
        'metadata',
        'layer_z_index',
    ];

    protected $casts = [
        'metadata' => 'array',
        'year'     => 'integer',
    ];

    public function capsule()
    {
        return $this->belongsTo(TimeCapsule::class, 'capsule_id');
    }
}
