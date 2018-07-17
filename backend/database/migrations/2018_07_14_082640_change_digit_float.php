<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeDigitFloat extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->float('receiver_latitude', 8,7)->change();
            $table->float('receiver_longitude', 8,7)->change();
        });

        Schema::table('sellers', function (Blueprint $table) {
            $table->float('shop_latitude', 8,7)->change();
            $table->float('shop_longitude', 8,7)->change();
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
