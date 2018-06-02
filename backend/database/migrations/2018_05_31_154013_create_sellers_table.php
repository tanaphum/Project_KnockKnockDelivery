<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSellersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sellers', function (Blueprint $table) {
            $table->increments('seller_id');
            $table->string('seller_name');
            $table->string('shop_name');
            $table->string('shop_location');
            $table->unsignedInteger('shop_type_id');
            $table->unsignedInteger('status_id');
            $table->unsignedInteger('profile_id');

            $table->foreign('shop_type_id')->references('shop_type_id')->on('shop_types');
            
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
        Schema::dropIfExists('sellers');
    }
}
