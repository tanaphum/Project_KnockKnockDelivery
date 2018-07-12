<?php

namespace App\Http\Controllers;

use App\Http\Resources\ListOrdersBySellerIdResource;
use App\Order;
use App\Seller;
use App\Buyer;
use App\OrderDetail;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    private $order;
    private $seller;
    private $buyer;
    public function __construct(Order $order, Seller $seller,Buyer $buyer)
    {
        $this->order = $order;
        $this->seller = $seller;
        $this->buyer = $buyer;
    }

    public function createOrder(Request $request)
    {
        $this->validate($request, [
            'receiver_firstname' => 'required|max:50',
            'receiver_lastname' => 'required|max:50',
            'receiver_location' => 'required|max:199',
            'receiver_latitude' => 'required',
            'receiver_longitude' => 'required',
            'order_total_price' => 'required',
            'service_charge' => 'required',
            'seller_id' => 'required',
            'buyer_id' => 'required',
        ]);

        $order = new Order;
        $order->receiver_firstname = $request->receiver_firstname;
        $order->receiver_lastname = $request->receiver_lastname;
        $order->receiver_location = $request->receiver_location;
        $order->receiver_latitude = $request->receiver_latitude;
        $order->receiver_longitude = $request->receiver_longitude;
        $order->service_charge = $request->service_charge;
        $order->order_total_price = $request->order_total_price;

        $seller = $this->seller->where('seller_id', $request->seller_id)->first();
        if($seller === null)
            return response()->json(['message' => 'Seller not found']);

        $order->seller_id = $request->seller_id;

        $buyer = $this->buyer->where('buyer_id', $request->buyer_id)->first();
        if($buyer === null)
            return response()->json(['message' => 'Buyer not found']);

        $order->buyer_id = $request->buyer_id;
        $order->order_status_id = 1;

        $order->save();

        return response()->json(['result' => $order]);
    }

    public function updateOrder(Request $request, $order_id)
    {
        $this->validate($request, [
            'order_status_id' => 'required',
        ]);

        $order = $this->order->where('order_id', $order_id)->first();
        if ($order === null) {
            return response()->json([
                'message' => 'order not found',
            ], 400);
        }

        if (!is_null($order->shipper_id) || $order->shipper_id !== "") {
            $order->shipper_id = $request->shipper_id;
        }

        if (!is_null($order->order_status_id) || $order->order_status_id !== "") {
            $order->order_status_id = $request->shipper_id;
        }

        if ($request->hasFile('payment_transfer_slip')) {
            Storage::delete('public/payment_transfer_slip/' . $shipper->shipper_transfer_slip);

            // Get filename with the extension
            $filenameWithExt = $request->file('payment_transfer_slip')->getClientOriginalName();
            // Get just filename
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            // Get just ext
            $extension = $request->file('payment_transfer_slip')->getClientOriginalExtension();
            // Filename to store
            $fileNameToStore = $filename . '_' . time() . '.' . $extension;
            // Upload Image
            $path = $request->file('payment_transfer_slip')->storeAs('public/payment_transfer_slip', $fileNameToStore);
        } else {
            $fileNameToStore = 'noimage.jpg';
        }

        if ($request->hasFile('payment_transfer_slip')) {
            $order->payment_transfer_slip = $request->payment_transfer_slip;
        }

        $order->save();

        if ($request->hasFile('payment_transfer_slip')) {
            $order->payment_transfer_slip = "storage/payment_transfer_slip/" . $request->payment_transfer_slip;
        }

        return response()->json(['result' => $order]);
    }

    public function getListSellersHaveOrders()
    {
        $orders = $this->order->where('order_status_id', 1)->get();
        $order_sellers = array();
        foreach($orders as $index => $item){
            $seller_id = $item->seller_id;
            $order_sellers[$index] = $seller_id;
        }

        $sellers = $this->seller->whereIn('seller_id', $order_sellers)->get();

        return response()->json(['data' => $sellers]);
    }

    public function getListOrdersBySellerId($seller_id)
    {
        $orders = $this->order
                    ->where('order_status_id', 1)
                    ->where('seller_id', $seller_id)
                    ->orderBy('created_at', 'DESC')
                    ->get();

        return ListOrdersBySellerIdResource::collection($orders);
    }

    public function getOrderByOrderId($order_id)
    {
        $order = $this->order->where('order_id', $order_id)->first();
        if($order === null)
            return response()->json(['message' => 'Order not found']);

        if($order->shipper !== null){
            return response()->json([
                'data' => [
                    'order_id' => $order->order_id,
                    'receiver_firstname' => $order->receiver_firstname,
                    'receiver_lastname' => $order->receiver_lastname,
                    'receiver_location' => $order->receiver_location,
                    'receiver_latitude' => $order->receiver_latitude,
                    'receiver_longitude' => $order->receiver_longitude,
                    'service_charge' => $order->service_charge,
                    'order_total_price' => $order->order_total_price,
                    'created_at' => $order->created_at->format('Y-m-d'),
                    'updated_at' => $order->updated_at->format('Y-m-d'),
                    'seller' => [
                        'seller_id' => $order->seller->seller_id,
                        'shop_name' => $order->seller->shop_name,
                        'shop_location' => $order->seller->shop_location,
                        'shop_latitude' => $order->seller->shop_latitude,
                        'shop_longitude' => $order->seller->shop_longitude
                    ],
                    'buyer' => [
                        'buyer_id' => $order->buyer->buyer_id,
                    ],
                    'shipper' => [
                        'shipper_id' => $order->shipper->shipper||null,
                        'bank_account' => [
                            'bank_account_id' => $order->shipper->bank_account->bank_account_id||null,
                            'bank_account_name' => $order->shipper->bank_account->bank_account_name||null
                        ] || null,
                        'bank_account_no' => $order->shipper->bank_account_no || null,
                    ],
                    'order_details' => OrderDetail::getOrderDetailsByOrderId($order->order_id)
                ]
            ]);
        }else{
            return response()->json([
                'data' => [
                    'order_id' => $order->order_id,
                    'receiver_firstname' => $order->receiver_firstname,
                    'receiver_lastname' => $order->receiver_lastname,
                    'receiver_location' => $order->receiver_location,
                    'receiver_latitude' => $order->receiver_latitude,
                    'receiver_longitude' => $order->receiver_longitude,
                    'service_charge' => $order->service_charge,
                    'order_total_price' => $order->order_total_price,
                    'created_at' => $order->created_at->format('Y-m-d'),
                    'updated_at' => $order->updated_at->format('Y-m-d'),
                    'seller' => [
                        'seller_id' => $order->seller->seller_id,
                        'shop_name' => $order->seller->shop_name,
                        'shop_location' => $order->seller->shop_location,
                        'shop_latitude' => $order->seller->shop_latitude,
                        'shop_longitude' => $order->seller->shop_longitude
                    ],
                    'buyer' => [
                        'buyer_id' => $order->buyer->buyer_id,
                    ],
                    'shipper' => null,
                    'order_details' => OrderDetail::getOrderDetailsByOrderId($order->order_id)
                ]
            ]);
        }
    }

}
