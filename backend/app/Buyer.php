<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Buyer extends Model
{

    protected $primaryKey = 'buyer_id';

    public $timestamps = false;

    protected $fillable = [
        'buyer_firstname',
        'buyer_lastname',
        'telephone_number',
        'profile_status_id',
        'user_id'
    ];

    public function profile_status()
    {
        return $this->belongsTo('App\ProfileStatus','profile_status_id', 'profile_status_id');
    }

    public function profile()
    {
        return $this->belongsTo('App\Profile','profile_id', 'profile_id');
    }
}
