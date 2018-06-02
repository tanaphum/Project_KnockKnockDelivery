<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    protected $fillable = [
        'status_name'
    ];

    public function sellers()
    {
        return $this->hasMany('App\Seller', 'status_id', 'status_id');
    }
}
