<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Shipper extends Model
{
    public $primaryKey = 'shipper_id';

    protected $fillable = [
        'bank_account_no',
        'shipper_transfer_slip',
        'bank_account_id',
    ];

    public $timestamps = false;

    public function bank_account()
    {
        return $this->belongsTo('App\BankAccount','bank_account_id', 'bank_account_id');
    }

    public function profile_status()
    {
        return $this->belongsTo('App\ProfileStatus','profile_status_id', 'profile_status_id');
    }

    public function profile()
    {
        return $this->belongsTo('App\Profile','profile_id', 'profile_id');
    }
}
