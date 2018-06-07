<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBuyersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('buyers', function (Blueprint $table) {
            $table->increments('buyer_id');
            $table->string('buyer_firstname');
            $table->string('buyer_lastname');
            $table->string('telophone_number');
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
        Schema::dropIfExists('buyers');
    }
}
