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
        $table->boolean('is_public')->default(false)->after('reveal_date');
    });
}

public function down(): void
{
    Schema::table('time_capsules', function (Blueprint $table) {
        $table->dropColumn('is_public');
    });
}

};