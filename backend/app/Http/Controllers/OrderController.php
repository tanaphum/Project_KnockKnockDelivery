<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Order;
use App\Http\Resources\ListOrdersResource;

class OrderController extends Controller
{
    private $order;
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function createOrder()
    {

    }

    public function getListOrders()
    {
        $orders = $this->order->where('order_status_id', 1)->get();
        
        return ListOrdersResource::collection($orders);
    }

    public function getListOrdersSellerBySellerId()
    {
        
    }

    public function getListOrdersBuyerByBuyerId()
    {

    }

    public function getListOrdersDeliverByDeliverId()
    {

    }
    
}
