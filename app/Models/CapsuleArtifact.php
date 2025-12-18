<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CapsuleArtifact extends Model
{
    use HasFactory;



    protected $fillable = [
        'capsule_id',
        'title',
        'content',
        'artifact_type',
        'type',
        'year',
        'media_path',
    ];

    protected $casts = [
        'content' => 'array',
    ];


    /**
     * Get the time capsule that owns this artifact.
     */
    public function capsule()
    {
        return $this->belongsTo(TimeCapsule::class, 'capsule_id');
    }


    /**
     * Get the user who owns the time capsule containing this artifact.
     */
    public function user()
    {
        return $this->hasOneThrough(
            User::class,
            TimeCapsule::class,
            'id', // Local key on time_capsules table
            'id', // Local key on users table
            'capsule_id', // Foreign key on capsule_artifacts table
            'user_id' // Foreign key on time_capsules table
        );
    }
}