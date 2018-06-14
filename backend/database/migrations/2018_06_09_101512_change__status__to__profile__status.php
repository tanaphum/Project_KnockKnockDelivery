<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeStatusToProfileStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::rename('statuses', 'profile_statuses');

        Schema::table('profile_statuses', function (Blueprint $table) {
            $table->renameColumn('status_id', 'profile_status_id');
            $table->renameColumn('status_name', 'profile_status_name');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

    }
}
