<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrderDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->increments('order_detail_id');
            $table->unsignedInteger('order_product_id');
            $table->unsignedInteger('order_id');
            $table->integer('amount_of_product');

            $table->foreign('order_id')->references('order_id')->on('orders');
            $table->foreign('order_product_id')->references('product_id')->on('products');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_details');
    }
}
