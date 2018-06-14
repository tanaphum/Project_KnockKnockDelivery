<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_statuses', function (Blueprint $table){
            $table->increments('order_status_id');
            $table->string('order_status_name');
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->increments('order_id');
            $table->date('order_date');
            $table->decimal('total', 8, 2);
            $table->string('buyer_location');
            $table->unsignedInteger('order_status_id');
            $table->unsignedInteger('seller_id');
            $table->unsignedInteger('buyer_id');
            $table->unsignedInteger('deliver_id');

            $table->foreign('order_status_id')->references('order_status_id')->on('order_statuses');
            $table->foreign('seller_id')->references('seller_id')->on('sellers');
            $table->foreign('buyer_id')->references('buyer_id')->on('buyers');
            $table->foreign('deliver_id')->references('deliver_id')->on('delivers');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_statuses');
        Schema::dropIfExists('orders');
    }
}
