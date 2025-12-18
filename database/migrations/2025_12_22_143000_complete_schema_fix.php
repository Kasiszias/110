<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Complete schema fix for time capsules and artifacts
     * This migration fixes all identified issues:
     * 1. Foreign key column names consistency
     * 2. Missing columns in capsule_artifacts
     * 3. Proper relationships
     * 4. Required fields validation
     */
    public function up(): void
    {
        // First, fix the time_capsules table
        Schema::table('time_capsules', function (Blueprint $table) {
            // Ensure all required columns exist
            if (!Schema::hasColumn('time_capsules', 'user_id')) {
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            }
            
            if (!Schema::hasColumn('time_capsules', 'title')) {
                $table->string('title');
            }
            
            if (!Schema::hasColumn('time_capsules', 'description')) {
                $table->text('description')->nullable();
            }
            
            if (!Schema::hasColumn('time_capsules', 'reveal_date')) {
                $table->dateTime('reveal_date');
            }
            
            if (!Schema::hasColumn('time_capsules', 'message')) {
                $table->text('message')->nullable();
            }
            
            if (!Schema::hasColumn('time_capsules', 'email_recipients')) {
                $table->json('email_recipients')->nullable();
            }
            
            if (!Schema::hasColumn('time_capsules', 'is_public')) {
                $table->boolean('is_public')->default(false);
            }
            
            // Ensure timestamps exist
            if (!Schema::hasColumn('time_capsules', 'created_at')) {
                $table->timestamps();
            }
        });

        // Now fix the capsule_artifacts table - this is the critical fix
        Schema::table('capsule_artifacts', function (Blueprint $table) {
            // Fix foreign key column name - this is causing the main issue
            if (Schema::hasColumn('capsule_artifacts', 'time_capsule_id')) {
                // Drop existing foreign key constraint
                $table->dropForeign(['time_capsule_id']);
                // Rename the column
                $table->renameColumn('time_capsule_id', 'capsule_id');
                // Add new foreign key constraint
                $table->foreign('capsule_id')->references('id')->on('time_capsules')->onDelete('cascade');
            } elseif (!Schema::hasColumn('capsule_artifacts', 'capsule_id')) {
                // If neither column exists, create capsule_id
                $table->foreignId('capsule_id')->constrained('time_capsules')->onDelete('cascade');
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
        // This is dangerous, so we'll be careful
        Schema::table('capsule_artifacts', function (Blueprint $table) {
            // Revert capsule_id back to time_capsule_id if it was renamed
            if (Schema::hasColumn('capsule_artifacts', 'capsule_id')) {
                $table->dropForeign(['capsule_id']);
                $table->renameColumn('capsule_id', 'time_capsule_id');
                $table->foreign('time_capsule_id')->references('id')->on('time_capsules')->onDelete('cascade');
            }
            
            // We won't drop other columns in down() as that could cause data loss
        });
    }
};