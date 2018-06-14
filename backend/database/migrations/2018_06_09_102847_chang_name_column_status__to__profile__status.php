<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangNameColumnStatusToProfileStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sellers', function (Blueprint $table) {
            $table->renameColumn('status_id', 'profile_status_id');
        });

        Schema::table('buyers', function (Blueprint $table) {
            $table->renameColumn('status_id', 'profile_status_id');
        });

        Schema::table('delivers', function (Blueprint $table) {
            $table->renameColumn('status_id', 'profile_status_id');
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
