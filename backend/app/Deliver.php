<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Deliver extends Model
{
    protected $primaryKey = 'deliver_id';

    protected $fillable = [
        'deliver_firstname',
        'deliver_lastname',
        'dateOfBirth',
        'telephone_number',
        'user_id',
    ];

    protected $hidden = [
        'profile_status_id'
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
