<?php

namespace App\Http\Controllers;

use App\Order;
use Illuminate\Http\Request;
use App\Http\Resources\OrderQRcodeResource as OrderQRcodeResource;

class OrderQRcodeController extends Controller
{

    private $order;
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function UpdateStatusOrder(Request $request){
        $order_id = $request->input('order_id');
        $shipper_id = $request->input('shipper_id');

        $order = $this->order->where([
            ['order_id', $order_id],
            ['shipper_id', $shipper_id],
            ])->findorfail();
        $checkOrder = $this->order->where('order_id',$order_id)->findorfail();

        if(!$checkOrder){
            return response()->json([
                'message' => 'Unsuccessfully',
                'remark' => 'Order has not found !'
            ]);
        }
        if(!$order){
            return response()->json([
                'message' => 'Unsuccessfully',
                'remark' => 'Order Id and Shipper Id was not matches !'
            ]);
        }
        else{ 
            $orders = $this->order->where('order_status_id', $order_id)->first();
            if($orders->order_status_id === 1){
                $orders->order_status_id = 2;
                $orders->save();

                return OrderQRcodeResource::collection($orders);
            }
            else if($orders->order_status_id === 2){
                $orders->order_status_id = 3;
                $orders->save();

                return OrderQRcodeResource::collection($orders);
            }
            else if($orders->order_status_id === 3){
                $orders->order_status_id = 4;
                $orders->save();

                return OrderQRcodeResource::collection($orders);
            }
            else if($orders->order_status_id === 4){
                $orders->order_status_id = 5;
                $orders->save();

                return OrderQRcodeResource::collection($orders);
            }
            else if($orders->order_status_id === 5){
                $orders->order_status_id = 6;
                $orders->save();

                return OrderQRcodeResource::collection($orders);
            }
            else if($orders->order_status_id === 6){
                $orders->order_status_id = 7;
                $orders->save();

                return OrderQRcodeResource::collection($orders);
            }
            else if($orders->order_status_id === 7){
                $orders->order_status_id = 8;
                $orders->save();

                return OrderQRcodeResource::collection($orders);
            }
        }

    }
   
}
