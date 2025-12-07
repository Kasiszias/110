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
        Schema::create('capsule_artifacts', function (Blueprint $table) {
        $table->id();
        $table->foreignId('capsule_id')->constrained('time_capsules')->onDelete('cascade');
        $table->enum('type', ['personal', 'historical', 'future']);
        $table->string('title');
        $table->text('content');          // Text, image URL, video URL, etc.
        $table->integer('year')->default(0); // 0 for personal / no year
        $table->json('metadata')->nullable(); // Source, attribution, etc.
        $table->integer('layer_z_index')->default(0); // Visual stacking
        $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capsule_artifacts');
    }
};
