<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $primaryKey = 'admin_id';

    public $timestamps = false;

    protected $fillable = [
        'admin_firstname',
        'admin_lastname',
        'telephone_number',
        'citizen_id',
        'user_id'
    ];
}
