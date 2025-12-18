<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Final migration to ensure capsule_artifacts table schema is correct
     * This migration will:
     * 1. Ensure the foreign key column is named 'capsule_id' (not 'time_capsule_id')
     * 2. Ensure all required columns exist
     * 3. Fix any schema inconsistencies
     */

    public function up(): void
    {
        Schema::table('capsule_artifacts', function (Blueprint $table) {
            // First, handle the foreign key column naming inconsistency
            if (Schema::hasColumn('capsule_artifacts', 'time_capsule_id')) {
                // Drop existing foreign key if it exists
                $table->dropForeign(['time_capsule_id']);
                
                // Rename the column
                $table->renameColumn('time_capsule_id', 'capsule_id');
                
                // Add the foreign key constraint
                $table->foreign('capsule_id')->references('id')->on('time_capsules')->onDelete('cascade');
            } elseif (!Schema::hasColumn('capsule_artifacts', 'capsule_id')) {
                // If neither column exists, create capsule_id
                $table->foreignId('capsule_id')->constrained('time_capsules')->onDelete('cascade');
            }
            
            // Ensure all required columns exist
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
            // This is dangerous, so we'll be very careful
            // Only revert if we created the capsule_id column
            if (Schema::hasColumn('capsule_artifacts', 'capsule_id') &&
                !Schema::hasColumn('capsule_artifacts', 'time_capsule_id')) {
                
                $table->dropForeign(['capsule_id']);
                $table->renameColumn('capsule_id', 'time_capsule_id');
                $table->foreign('time_capsule_id')->references('id')->on('time_capsules')->onDelete('cascade');
            }
        });
    }
};