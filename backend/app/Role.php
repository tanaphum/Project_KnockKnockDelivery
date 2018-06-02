<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'roleName'
    ];
    public function profiles() {
        return $this->hasMany('App\Profile','role_id','role_id');
    }
}
