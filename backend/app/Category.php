<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $primaryKey = 'category_id';

    public $fillable = [
        'category_name'
    ];

    public $timpstamps = false;
}
