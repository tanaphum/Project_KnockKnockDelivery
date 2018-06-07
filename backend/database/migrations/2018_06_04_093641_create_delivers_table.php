<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDeliversTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('delivers', function (Blueprint $table) {
            $table->increments('deliver_id');
            $table->string('deliver_firstname');
            $table->string('deliver_lastname');
            $table->date('dateOfBirth');
            $table->string('telephone_number');
            $table->unsignedInteger('status_id');
            $table->unsignedInteger('profile_id');
            
            $table->foreign('status_id')->references('status_id')->on('statuses');
            $table->foreign('profile_id')->references('profile_id')->on('profiles');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('delivers');
    }
}
