<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Initialmigrate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('user_id');
            $table->string('firstname');
            $table->string('lastname');
            $table->string('identity_no');
            $table->string('telephone_number');
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_resets', function (Blueprint $table) {
            $table->string('email')->index();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->increments('role_id');
            $table->string('role_name');
        });

        Schema::create('profile_statuses', function (Blueprint $table) {
            $table->increments('profile_status_id');
            $table->string('profile_status_name');
        });

        Schema::create('shop_types', function (Blueprint $table) {
            $table->increments('shop_type_id');
            $table->string('shop_type_name');
        });

        Schema::create('product_categories', function (Blueprint $table) {
            $table->increments('product_category_id');
            $table->string('product_category_name');
        });

        Schema::create('product_statuses', function (Blueprint $table) {
            $table->increments('product_status_id');
            $table->string('product_status_name');
        });

        Schema::create('order_statuses', function (Blueprint $table){
            $table->increments('order_status_id');
            $table->string('order_status_name');
        });

        Schema::create('bank_accounts', function (Blueprint $table){
            $table->increments('bank_account_id');
            $table->string('bank_account_name');
        });


        Schema::create('profiles', function (Blueprint $table) {
            $table->increments('profile_id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('role_id');

            $table->foreign('user_id')->references('user_id')->on('users');
            $table->foreign('role_id')->references('role_id')->on('roles');
        });

        Schema::create('sellers', function (Blueprint $table) {
            $table->increments('seller_id');
            $table->string('shop_name');
            $table->string('shop_location');
            $table->float('shop_latitude')->nullable();
            $table->float('shop_longitude')->nullable();
            $table->string('shop_logo_image')->nullable();
            $table->unsignedInteger('shop_type_id');
            $table->unsignedInteger('profile_status_id');
            $table->unsignedInteger('profile_id');

            $table->foreign('shop_type_id')->references('shop_type_id')->on('shop_types');
            $table->foreign('profile_status_id')->references('profile_status_id')->on('profile_statuses');
            $table->foreign('profile_id')->references('profile_id')->on('profiles');
        });

        Schema::create('buyers', function (Blueprint $table) {
            $table->increments('buyer_id');
            $table->string('buyer_location');
            $table->unsignedInteger('profile_status_id');
            $table->unsignedInteger('profile_id');

            $table->foreign('profile_status_id')->references('profile_status_id')->on('profile_statuses');
            $table->foreign('profile_id')->references('profile_id')->on('profiles');
        });

        Schema::create('shippers', function (Blueprint $table) {
            $table->increments('shipper_id');
            $table->string('bank_account_no');
            $table->string('shipper_transfer_slip');
            $table->unsignedInteger('bank_account_id');
            $table->unsignedInteger('profile_status_id');
            $table->unsignedInteger('profile_id');

            $table->foreign('bank_account_id')->references('bank_account_id')->on('bank_accounts');
            $table->foreign('profile_status_id')->references('profile_status_id')->on('profile_statuses');
            $table->foreign('profile_id')->references('profile_id')->on('profiles');
        });

        Schema::create('admins', function (Blueprint $table) {
            $table->increments('admin_id');

            $table->unsignedInteger('profile_id');
            $table->foreign('profile_id')->references('profile_id')->on('profiles');
        });

        Schema::create('products', function (Blueprint $table) {
            $table->increments('product_id');
            $table->string('product_name');
            $table->string('product_description');
            $table->decimal('product_price', 8, 2);
            $table->integer('unit_in_stock');
            $table->string('product_image_1');
            $table->string('product_image_2')->nullable();
            $table->string('product_image_3')->nullable();
            $table->unsignedInteger('product_status_id');
            $table->unsignedInteger('product_category_id');
            $table->unsignedInteger('seller_id');
            $table->timestamps();

            $table->foreign('product_status_id')->references('product_status_id')->on('product_statuses');
            $table->foreign('product_category_id')->references('product_category_id')->on('product_categories');
            $table->foreign('seller_id')->references('seller_id')->on('sellers');
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->increments('order_id');
            $table->string('recieve_firstname');
            $table->string('recieve_lastname');
            $table->string('receiver_address');
            $table->float('receiver_latitude')->nullable();
            $table->float('receiver_longitude')->nullable();
            $table->date('order_date');
            $table->date('order_date_finished')->nullable();
            $table->decimal('total', 8, 2);
            $table->decimal('service_charge', 8, 2);
            $table->decimal('order_total_price', 8, 2);
            $table->string('payment_transfer_slip')->nullable();
            $table->unsignedInteger('order_status_id');
            $table->unsignedInteger('seller_id');
            $table->unsignedInteger('buyer_id');
            $table->unsignedInteger('shipper_id')->nullable();

            $table->foreign('order_status_id')->references('order_status_id')->on('order_statuses');
            $table->foreign('seller_id')->references('seller_id')->on('sellers');
            $table->foreign('buyer_id')->references('buyer_id')->on('buyers');
            $table->foreign('shipper_id')->references('shipper_id')->on('shippers');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
