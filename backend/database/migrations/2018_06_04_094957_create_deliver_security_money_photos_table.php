<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDeliverSecurityMoneyPhotosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('deliver_security_money_photos', function (Blueprint $table) {
            $table->increments('security_money_id');
            $table->string('security_money_filename');
            $table->date('security_money_date');
            $table->time('security_money_time');
            $table->unsignedInteger('deliver_id');

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
        Schema::dropIfExists('deliver_security_money_photos');
    }
}
