<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('time_capsules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('title');
            $table->text('description');
            $table->json('contents');
            $table->dateTime('bury_date');
            $table->dateTime('reveal_date');
            $table->json('recipients')->nullable();
            $table->boolean('public')->default(false);
            $table->boolean('revealed')->default(false);
            $table->boolean('visible')->default(false);
            $table->string('access_code')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('time_capsules');
    }
};