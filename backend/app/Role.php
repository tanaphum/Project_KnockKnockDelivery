<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = [
        'role_name'
    ];
    public function profiles() {
        return $this->hasMany('App\Profile','role_id','role_id');
    }
}
