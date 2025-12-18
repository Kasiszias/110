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
        Schema::table('capsule_artifacts', function (Blueprint $table) {
            if (!Schema::hasColumn('capsule_artifacts', 'title')) {
                $table->string('title')->nullable()->after('id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('capsule_artifacts', function (Blueprint $table) {
            if (Schema::hasColumn('capsule_artifacts', 'title')) {
                $table->dropColumn('title');
            }
        });
    }
};