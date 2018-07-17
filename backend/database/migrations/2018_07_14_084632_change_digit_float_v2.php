<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeDigitFloatV2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('receiver_latitude')->change();
            $table->decimal('receiver_longitude')->change();
        });

        Schema::table('sellers', function (Blueprint $table) {
            $table->decimal('shop_latitude')->change();
            $table->decimal('shop_longitude')->change();
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
