<?php

namespace App\Http\Controllers;

use App\Order;
use App\Seller;
use App\Buyer;
use App\Shipper;
use App\OrderDetail;
use App\User;
use Illuminate\Http\Request;
use App\Http\Resources\QRCodeDataResource as QRCodeDataResource;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class OrderQRcodeController extends Controller
{
    private $order;
    private $seller;
    private $buyer;
    private $shipper;
    public function __construct(Order $order, Seller $seller, Buyer $buyer, Shipper $shipper)
    {
        $this->order = $order;
        $this->seller = $seller;
        $this->buyer = $buyer;
        $this->shipper = $shipper;
    }

    public function shipperAcceptOrder($order_id)
    {
        $order = $this->order->where('order_id', $order_id)->first();
        if ($order === null) {
            return response()->json([
                'message' => 'order not found',
            ], 404);
        }

        $order->order_status_id = 4;

        $qr_id = (string)$order->order_id;
        $seller_link = 'http://localhost:4200/qrcode/seller/order/'.$qr_id;
        QrCode::size(350)->generate($seller_link , '../storage/app/public/qrcodes/seller/Seller_QRcode_Order_'.$qr_id.'.svg');
        $order->qrcode_seller = 'Seller_QRcode_Order_'.$qr_id.'.svg';

        $buyer_link = 'http://localhost:4200/qrcode/buyer/order/'.$qr_id;
        QrCode::size(350)->generate($buyer_link, '../storage/app/public/qrcodes/buyer/Buyer_QRcode_Order_'.$qr_id.'.svg');
        $order->qrcode_buyer = 'Buyer_QRcode_Order_'.$qr_id.'.svg';

        $order->save();
        return response()->json(['result' => $order]);
    }

    public function getDataQRCodeByOrderId($order_id)
    {
        $order = $this->order->where('order_id', $order_id)->first();
        if($order === null){
            return response()->json(['message'=> 'order not found'], 404);
        }

        $seller = $this->seller->where('seller_id', $order->seller_id)->first();

        if($order->shipper_id === null){
            return response()->json(['message'=> 'Bad Request'], 400);
        }
        $shipper = $this->shipper->where('shipper_id', $order->shipper_id)->first();

        return response()->json([
            'order_id' => $order->order_id,
            'receiver_firstname' => $order->receiver_firstname,
            'receiver_lastname' => $order->receiver_lastname,
            'receiver_location' => $order->receiver_location,
            'seller' => [
                "shop_name" => $seller->shop_name,
                "shop_location" => $seller->shop_location
            ],
            'shipper' => [
                'user' => User::getUserByProfileId($shipper->profile_id)
            ],
            'order_details' => OrderDetail::getOrderDetailsByOrderId($order->order_id)
        ]);
    }

    public function getQRcodeSellerByOrderId($order_id)
    {
        $order = $this->order->where('order_id', $order_id)->first();
        if($order === null){
            return response()->json(['message'=> 'order not found'], 404);
        }

        return response()->json([ 'data' => [
            'qrcode_seller' => '/storage/qrcodes/seller/'.$order->qrcode_seller
        ]]);
    }

    public function getQRcodeBuyerByOrderId($order_id)
    {
        $order = $this->order->where('order_id', $order_id)->first();
        if($order === null){
            return response()->json(['message'=> 'Order not found'], 404);
        }

        return response()->json([ 'data' => [
            'qrcode_buyer' => '/storage/qrcodes/buyer/'.$order->qrcode_buyer
        ]]);
    }

    public function qrcodeUpdateStatusOrderByOrderId(Request $request, $order_id){
        $this->validate($request, [
            'order_status_id' => 'required'
        ]);

        $order = $this->order->where('order_id', $order_id)->first();
        if ($order === null) {
            return response()->json([
                'message' => 'order not found',
            ], 404);
        }

        if (!is_null($order->order_status_id) || $order->order_status_id !== "") {
            $order->order_status_id = $request->order_status_id;
        }

        $order->save();

        return response()->json(['result' => $order]);
    }

}
