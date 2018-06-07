<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ShopType;

class ShopTypeController extends Controller
{
    private $shoptype;
    
    public function __construct(ShopType $shoptype)
    {
        $this->shoptype = $shoptype;
    }

    public function getShopTypes()
    {
        $shoptypes = $this->shoptype->all();

        return response()->json(
            [
                'message' => 'Successfully',
                'data' => $shoptypes
            ]
        );
    }
}
