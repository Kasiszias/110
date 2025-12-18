<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations to fix capsule_artifacts table schema issues.
     * This migration will:
     * 1. Ensure all required columns exist with correct names
     * 2. Fix the foreign key reference to use 'capsule_id' instead of 'time_capsule_id'
     * 3. Add missing columns if needed
     */

    public function up(): void
    {
        Schema::table('capsule_artifacts', function (Blueprint $table) {
            // Fix foreign key column name
            if (Schema::hasColumn('capsule_artifacts', 'time_capsule_id')) {
                $table->dropForeign(['time_capsule_id']);
                $table->renameColumn('time_capsule_id', 'capsule_id');
                $table->foreign('capsule_id')->references('id')->on('time_capsules')->onDelete('cascade');
            }
            
            // Ensure title column exists and is not null
            if (!Schema::hasColumn('capsule_artifacts', 'title')) {
                $table->string('title')->nullable()->after('id');
            }
            
            // Ensure content column exists and is JSON
            if (!Schema::hasColumn('capsule_artifacts', 'content')) {
                $table->json('content')->nullable()->after('title');
            }
            
            // Ensure artifact_type column exists
            if (!Schema::hasColumn('capsule_artifacts', 'artifact_type')) {
                $table->string('artifact_type')->nullable()->after('content');
            }
            
            // Ensure year column exists
            if (!Schema::hasColumn('capsule_artifacts', 'year')) {
                $table->integer('year')->nullable()->after('artifact_type');
            }
            
            // Ensure media_path column exists
            if (!Schema::hasColumn('capsule_artifacts', 'media_path')) {
                $table->string('media_path')->nullable()->after('year');
            }
            
            // Make sure timestamps exist
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
            // Revert column changes
            if (Schema::hasColumn('capsule_artifacts', 'capsule_id')) {
                $table->dropForeign(['capsule_id']);
                $table->renameColumn('capsule_id', 'time_capsule_id');
                $table->foreign('time_capsule_id')->references('id')->on('time_capsules')->onDelete('cascade');
            }
            
            // Remove added columns (be careful with this)
            $columnsToDrop = [];
            
            if (Schema::hasColumn('capsule_artifacts', 'title')) {
                $columnsToDrop[] = 'title';
            }
            
            if (Schema::hasColumn('capsule_artifacts', 'content')) {
                $columnsToDrop[] = 'content';
            }
            
            if (Schema::hasColumn('capsule_artifacts', 'artifact_type')) {
                $columnsToDrop[] = 'artifact_type';
            }
            
            if (Schema::hasColumn('capsule_artifacts', 'year')) {
                $columnsToDrop[] = 'year';
            }
            
            if (Schema::hasColumn('capsule_artifacts', 'media_path')) {
                $columnsToDrop[] = 'media_path';
            }
            
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};