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
        Schema::create('time_capsules', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->text('description')->nullable();
        $table->json('contents')->nullable();      // Array of artifact IDs or summary
        $table->dateTime('bury_date')->nullable();
        $table->dateTime('reveal_date');
        $table->json('recipients')->nullable();    // Array of emails
        $table->boolean('public')->default(false);
        $table->string('access_code')->nullable(); // For private sharing
        $table->boolean('revealed')->default(false);
        $table->boolean('visible')->default(false);
        $table->timestamps();
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_capsules');
    }
};
