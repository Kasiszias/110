<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {

        Schema::create('capsule_artifacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capsule_id')->constrained('time_capsules')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->json('content')->nullable();
            $table->string('artifact_type')->nullable();
            $table->integer('year')->nullable();
            $table->string('media_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capsule_artifacts');
    }
};