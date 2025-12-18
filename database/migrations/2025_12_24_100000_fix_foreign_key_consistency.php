<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fix the foreign key column consistency issue
     * This migration ensures capsule_artifacts uses 'capsule_id' consistently
     */

    public function up(): void
    {
        Schema::table('capsule_artifacts', function (Blueprint $table) {
            // Fix foreign key column naming
            if (Schema::hasColumn('capsule_artifacts', 'time_capsule_id')) {
                // Drop existing foreign key constraint
                $table->dropForeign(['time_capsule_id']);
                
                // Rename column from time_capsule_id to capsule_id
                $table->renameColumn('time_capsule_id', 'capsule_id');
                
                // Add foreign key constraint with new name
                $table->foreign('capsule_id')->references('id')->on('time_capsules')->onDelete('cascade');
            }
            
            // Ensure all required columns exist with proper constraints
            if (!Schema::hasColumn('capsule_artifacts', 'title')) {
                $table->string('title')->nullable()->after('id');
            }
            
            if (!Schema::hasColumn('capsule_artifacts', 'content')) {
                $table->json('content')->nullable()->after('title');
            }
            
            if (!Schema::hasColumn('capsule_artifacts', 'artifact_type')) {
                $table->string('artifact_type')->nullable()->after('content');
            }
            
            if (!Schema::hasColumn('capsule_artifacts', 'year')) {
                $table->integer('year')->nullable()->after('artifact_type');
            }
            
            if (!Schema::hasColumn('capsule_artifacts', 'media_path')) {
                $table->string('media_path')->nullable()->after('year');
            }
            
            // Ensure timestamps exist
            if (!Schema::hasColumn('capsule_artifacts', 'created_at')) {
                $table->timestamps();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('capsule_artifacts', function (Blueprint $table) {
            // Revert changes if needed
            if (Schema::hasColumn('capsule_artifacts', 'capsule_id')) {
                $table->dropForeign(['capsule_id']);
                $table->renameColumn('capsule_id', 'time_capsule_id');
                $table->foreign('time_capsule_id')->references('id')->on('time_capsules')->onDelete('cascade');
            }
        });
    }
};