<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Order;
use App\Http\Resources\ListOrderHistoryResource as ListOrderHistoryResource;


class OrderHistoryController extends Controller
{
    private $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function getListOrdersHistory()
    {
        $orders = $this->order->with('order_status')->orderBy('updated_at', 'DESC')->get();
        return ListOrderHistoryResource::collection($orders);
    }

    public function getListOrderHistorySellerBySellerId($seller_id)
    {
        $seller_order_histories = $this->order->with('order_status')
                        ->where('seller_id', $seller_id)
                        // ->where('order_status_id', 8)
                        ->orderBy('updated_at', 'DESC')
                        ->get();

        return ListOrderHistoryResource::collection($seller_order_histories);
    }

    public function getListOrderHistoryBuyerByBuyerId($buyer_id)
    {
        $buyer_order_histories = $this->order->with('order_status')
                        ->where('buyer_id', $buyer_id)
                        // ->where('order_status_id', 8)
                        ->orderBy('updated_at', 'DESC')
                        ->get();
        return ListOrderHistoryResource::collection($buyer_order_histories);
    }

    public function getListOrderHistoryDeliverByShipperId($shipper_id)
    {
        $shipper_order_histories = $this->order->with('order_status')
                        ->where('shipper_id', $shipper_id)
                        // ->where('order_status_id', 8)
                        ->orderBy('updated_at', 'DESC')
                        ->get();

        return ListOrderHistoryResource::collection($shipper_order_histories);
    }
}
