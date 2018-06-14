<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProfileStatus extends Model
{
    protected $primaryKey = 'profile_status_id';

    protected $fillable = [
        'profile_status_name'
    ];

    public function sellers()
    {
        return $this->hasMany('App\Seller', 'profile_status_id', 'profile_status_id');
    }

    public function buyers()
    {
        return $this->hasMany('App\Buyer', 'profile_status_id', 'profile_status_id');
    }

    public function delivers()
    {
        return $this->hasMany('App\Deliver', 'profile_status_id', 'profile_status_id');
    }
}
