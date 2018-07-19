<?php

namespace App\Http\Controllers;

use App\Order;
use Illuminate\Http\Request;
use App\Http\Resources\OrderQRcodeResource as OrderQRcodeResource;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class OrderQRcodeController extends Controller
{
    private $order;
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    // public function testQRcode()
    // {
    //     QrCode::size(300)->generate('https://www.google.co.th', '../storage/app/public/qrcodes/QRcode'.time().'.svg');

    //     return response()->json([
    //         'message' => 'success'
    //     ]);
    // }

    public function shipperAcceptOrder($order_id)
    {
        $order = $this->order->where('order_id', $order_id)->first();
        if ($order === null) {
            return response()->json([
                'message' => 'order not found',
            ], 400);
        }

        $order->order_status_id = 5;

        $qr_id = (string)$order->order_id;
        QrCode::size(350)->generate('http://localhost:4200/..', '../storage/app/public/qrcodes/seller/Seller_QRcode_'.$qr_id.'_'.time().'.svg');
        $order->qrcode_seller = 'Seller_QRcode_'.$qr_id.'_'.time().'.svg';

        QrCode::size(350)->generate('http://localhost:4200/...', '../storage/app/public/qrcodes/buyer/Buyer_QRcode_'.$qr_id.'_'.time().'.svg');
        $order->qrcode_buyer = 'Buyer_QRcode_'.$qr_id.'_'.time().'.svg';

        $order->save();
        return response()->json(['result' => $order]);
    }

    public function getQRcodeSellerByOrderId($order_id)
    {
        $order = $this->order->where('order_id', $order_id)->first();
        if($order === null){
            return response()->json(['message'=> 'order not found'], 400);
        }

        return response()->json([ 'data' => [
            'qrcode_seller' => $order->qrcode_seller
        ]]);
    }

    public function getQRcodeBuyerByOrderId($order_id)
    {
        $order = $this->order->where('order_id', $order_id)->first();
        if($order === null){
            return response()->json(['message'=> 'Order not found'], 400);
        }

        return response()->json([ 'data' => [
            'qrcode_buyer' => $order->qrcode_buyer
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
            ], 400);
        }

        if (!is_null($order->order_status_id) || $order->order_status_id !== "") {
            $order->order_status_id = $request->order_status_id;
        }

        $order->save();

        return response()->json(['result' => $order]);
    }

}
