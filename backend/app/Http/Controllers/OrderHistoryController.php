<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Order;

class OrderHistoryController extends Controller
{
    private $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function getOrderHistorySellerBySellerId()
    {
        
    }

    public function getOrderHistoryBuyerByRoleId()
    {

    }

    public function getOrderHistoryDeliverByDeliverId()
    {

    }
}
 