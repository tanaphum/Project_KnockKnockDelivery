<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->increments('category_id');
            $table->string('category_name');
        });

        Schema::create('products', function (Blueprint $table) {
            $table->increments('product_id');
            $table->string('product_name');
            $table->string('product_description');
            $table->string('product_price');
            $table->integer('unit_in_stock');
            $table->boolean('product_available');
            $table->unsignedInteger('product_category_id');
            $table->unsignedInteger('seller_id');
            $table->timestamps();

            $table->foreign('product_category_id')->references('category_id')->on('categories');
            $table->foreign('seller_id')->references('seller_id')->on('sellers');
        });

        Schema::create('product_photos', function (Blueprint $table) {
            $table->increments('product_photos_id');
            $table->string('product_photos_filename');
            $table->unsignedInteger('product_id');

            $table->foreign('product_id')->references('product_id')->on('products');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_photos');
    }
}
