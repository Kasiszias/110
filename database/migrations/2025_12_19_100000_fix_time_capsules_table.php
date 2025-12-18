<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('time_capsules', function (Blueprint $table) {
            // Only drop columns that actually exist
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
            
            // Add missing fields that the controller expects
            if (!Schema::hasColumn('time_capsules', 'email_recipients')) {
                $table->json('email_recipients')->nullable()->after('is_public');
            }
            if (!Schema::hasColumn('time_capsules', 'message')) {
                $table->string('message')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_capsules', function (Blueprint $table) {
            // Only restore fields if they were dropped
            if (Schema::hasColumn('time_capsules', 'email_recipients')) {
                $table->dropColumn('email_recipients');
            }
            if (Schema::hasColumn('time_capsules', 'message')) {
                $table->dropColumn('message');
            }
        });
    }
};