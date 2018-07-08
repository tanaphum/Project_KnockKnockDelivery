<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Buyer extends Model
{

    protected $primaryKey = 'buyer_id';

    protected $fillable = [
        'buyer_address'
    ];

    public $timestamps = false;

    public function profile_status()
    {
        return $this->belongsTo('App\ProfileStatus','profile_status_id', 'profile_status_id');
    }

    public function profile()
    {
        return $this->belongsTo('App\Profile','profile_id', 'profile_id');
    }
}
