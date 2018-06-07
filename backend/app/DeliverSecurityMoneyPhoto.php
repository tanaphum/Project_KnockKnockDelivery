<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DeliverSecurityMoneyPhoto extends Model
{
    protected $primaryKey = 'security_money_id';

    protected $fillable = [
        'security_money_filename',
        'security_money_date',
        'security_money_time',
        'deliver_id'
    ];

    public $timpstamps = false;

    public function delivers()
    {
        return $this->belongsTo('App\Deliver','deliver_id', 'deliver_id');
    }
}
