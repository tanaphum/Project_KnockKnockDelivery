<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    public $primaryKey = 'profile_id';

    protected $fillable = [
        'user_id',
        'role_id'
    ];

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo('App\User', 'user_id', 'user_id');
    }

    public function role() {
        return $this->belongsTo('App\Role','role_id','role_id');
    }

}
