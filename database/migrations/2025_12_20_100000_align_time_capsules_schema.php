<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations to properly align time_capsules table with controller expectations.
     * This migration will:
     * 1. Drop conflicting fields from the original migration
     * 2. Add the missing fields that the controller expects
     * 3. Convert contents from JSON to TEXT for compatibility
     */

    public function up(): void
    {
        Schema::table('time_capsules', function (Blueprint $table) {
            // Safely drop fields that exist and conflict with controller expectations
            $columnsToDrop = [];
            
            if (Schema::hasColumn('time_capsules', 'bury_date')) {
                $columnsToDrop[] = 'bury_date';
            }
            
            if (Schema::hasColumn('time_capsules', 'recipients')) {
                $columnsToDrop[] = 'recipients';
            }
            
            if (Schema::hasColumn('time_capsules', 'revealed')) {
                $columnsToDrop[] = 'revealed';
            }
            
            if (Schema::hasColumn('time_capsules', 'visible')) {
                $columnsToDrop[] = 'visible';
            }
            
            if (Schema::hasColumn('time_capsules', 'access_code')) {
                $columnsToDrop[] = 'access_code';
            }
            
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
            

            // Add missing fields that controller expects if they don't exist
            if (!Schema::hasColumn('time_capsules', 'message')) {
                $table->text('message')->nullable()->comment('Personal message in the capsule')->after('description');
            }
            

            if (!Schema::hasColumn('time_capsules', 'email_recipients')) {
                $table->json('email_recipients')->nullable()->comment('Email recipients for the capsule')->after('message');
            }
            
            // Rename public field to is_public if it exists and is_public doesn't already exist
            if (Schema::hasColumn('time_capsules', 'public') && !Schema::hasColumn('time_capsules', 'is_public')) {
                $table->renameColumn('public', 'is_public');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_capsules', function (Blueprint $table) {
            // Restore original fields
            $table->json('contents')->nullable();
            $table->dateTime('bury_date');
            $table->json('recipients')->nullable();
            $table->boolean('public')->default(false);
            $table->boolean('revealed')->default(false);
            $table->boolean('visible')->default(false);
            $table->string('access_code')->nullable();
            
            // Remove the new fields
            $table->dropColumn(['message', 'email_recipients', 'is_public']);
            
            // Rename is_public back to public if it exists
            if (Schema::hasColumn('time_capsules', 'is_public')) {
                $table->renameColumn('is_public', 'public');
            }
        });
    }
};