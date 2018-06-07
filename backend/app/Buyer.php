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
        'status_id',
        'user_id'
    ];

    public function status()
    {
        return $this->belongsTo('App\Status','status_id', 'status_id');
    }

    public function profile()
    {
        return $this->belongsTo('App\Profile','profile_id', 'profile_id');
    }
}
