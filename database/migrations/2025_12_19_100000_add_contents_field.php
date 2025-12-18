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
            // Only add contents field if it doesn't exist
            if (!Schema::hasColumn('time_capsules', 'contents')) {
                $table->text('contents')->nullable()->after('message');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('time_capsules', function (Blueprint $table) {
            $table->dropColumn('contents');
        });
    }
};