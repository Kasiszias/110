<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('capsule_artifacts', function (Blueprint $table) {
            // Add the missing 'type' field that the application expects
            $table->string('type')->nullable()->after('artifact_type');
        });
    }

    public function down(): void
    {
        Schema::table('capsule_artifacts', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};