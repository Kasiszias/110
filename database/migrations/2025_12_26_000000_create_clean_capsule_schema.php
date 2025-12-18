<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Drop existing tables if they exist
        Schema::dropIfExists('capsule_artifacts');
        Schema::dropIfExists('time_capsules');

        // Create time_capsules table with correct schema
        Schema::create('time_capsules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('contents')->default('[]'); // FIX: Default empty JSON array
            $table->text('message')->nullable();
            $table->dateTime('reveal_date');
            $table->boolean('is_public')->default(false);
            $table->json('email_recipients')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('reveal_date');
            $table->index('is_public');
        });

        // Create capsule_artifacts table
        Schema::create('capsule_artifacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capsule_id')->constrained('time_capsules')->onDelete('cascade');
            $table->string('title');
            $table->text('contents')->nullable();
            $table->string('type')->default('text'); // text, photo, video, document, etc.
            $table->integer('year')->nullable();
            $table->string('media_path')->nullable();
            $table->timestamps();

            $table->index('capsule_id');
            $table->index('type');
        });
    }

    public function down()
    {
        Schema::dropIfExists('capsule_artifacts');
        Schema::dropIfExists('time_capsules');
    }
};