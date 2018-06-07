<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    protected $primaryKey = 'status_id';

    protected $fillable = [
        'status_name'
    ];

    public function sellers()
    {
        return $this->hasMany('App\Seller', 'status_id', 'status_id');
    }

    public function buyers()
    {
        return $this->hasMany('App\Buyer', 'status_id', 'status_id');
    }

    public function delivers()
    {
        return $this->hasMany('App\Deliver', 'status_id', 'status_id');
    }
}
