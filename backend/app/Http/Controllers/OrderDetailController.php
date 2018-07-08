<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\OrderDetail;

class OrderDetailController extends Controller
{
    private $order_detail;

    public function __construct(OrderDetail $order_detail){
        $this->order_detail = $order_detail;
    }

    public function createOrderDeatail(Request $request)
    {
        foreach($request as $item){
            $order_detail = new OrderDetail();
            $order_detail->product_id = $item->product_id;
            $order_detail->unit_of_product = $item->unit_of_product;
            $order_detail->order_id = $item->order_id;

            $order_detail->save();
        }

        return response()->json([
            'message' => 'Successfully',
        ]);
    }

    public function getOrderDetailsByOrderId($order_id)
    {
        $order_details = $this->order_detail->where('order_id', $order_id)->get();

        return response()->json([
            'message' => 'Successfully',
            'data' => $order_details
        ]);
    }

}
