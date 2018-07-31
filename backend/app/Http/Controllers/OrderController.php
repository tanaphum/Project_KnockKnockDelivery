<?php

namespace App\Http\Controllers;

use App\Buyer;
use App\Http\Resources\ListOrdersBySellerIdResource;
use App\Order;
use App\OrderDetail;
use App\Seller;
use App\User;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    private $order;
    private $seller;
    private $buyer;
    public function __construct(Order $order, Seller $seller, Buyer $buyer)
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
        if ($seller === null) {
            return response()->json(['message' => 'Seller not found']);
        }

        $order->seller_id = $request->seller_id;

        $buyer = $this->buyer->where('buyer_id', $request->buyer_id)->first();
        if ($buyer === null) {
            return response()->json(['message' => 'Buyer not found']);
        }

        $order->buyer_id = $request->buyer_id;
        $order->order_status_id = 1;

        $order->save();

        return response()->json(['result' => $order]);
    }

    public function updateStatusOrder(Request $request, $order_id)
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
            $order->order_status_id = $request->order_status_id;
        }

        $order->save();

        $findOrder = $this->order->where('order_id', $order->order_id)->with('order_status')->first();

        return response()->json([
            'result' => [
                'order_id' => $findOrder->order_id,
                'receiver_firstname' => $findOrder->receiver_firstname,
                'receiver_lastname' => $findOrder->receiver_lastname,
                'receiver_location' => $findOrder->receiver_location,
                'receiver_latitude' => $findOrder->receiver_latitude,
                'receiver_longitude' => $findOrder->receiver_longitude,
                'service_charge' => $findOrder->service_charge,
                'order_total_price' => $findOrder->order_total_price,
                'created_at' => $findOrder->created_at->format('Y-m-d'),
                'updated_at' => $findOrder->updated_at->format('Y-m-d'),
                'seller_id' => $findOrder->seller_id,
                'buyer' => $findOrder->buyer_id,
                'order_status' => [
                    'order_status_id' => $findOrder->order_status->order_status_id,
                    'order_status_name' => $findOrder->order_status->order_status_name
                ],
                'order_details' => OrderDetail::getOrderDetailsByOrderId($findOrder->order_id)
            ]
        ]);
    }

    public function uploadPaymentTransferSlip(Request $request, $order_id)
    {
        $this->validate($request, [
            'payment_transfer_slip' => 'required|image|mimes:jpeg,jpg,png|max:10000',
        ]);

        $order = $this->order->where('order_id', $order_id)->first();
        if ($order === null) {
            return response()->json([
                'message' => 'order not found',
            ], 404);
        }

        if ($request->hasFile('payment_transfer_slip')) {
            // Get filename with the extension
            $filenameWithExt = $request->file('payment_transfer_slip')->getClientOriginalName();
            // Get just filename
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            // Get just ext
            $extension = $request->file('payment_transfer_slip')->getClientOriginalExtension();
            // Filename to store
            $fileNameToStore = $filename . '_' . time() . '.' . $extension;
            // Upload Image
            $path = $request->file('payment_transfer_slip')->storeAs('public/payment_transfer_slip/', $fileNameToStore);
        } else {
            $fileNameToStore = 'noimage.jpg';
        }

        if ($request->hasFile('payment_transfer_slip')) {
            $order->payment_transfer_slip = $fileNameToStore;
        }

        $order->order_status_id = 3;
        $order->save();

        if ($request->hasFile('payment_transfer_slip')) {
            $order->payment_transfer_slip = "/storage/payment_transfer_slip/" . $order->payment_transfer_slip;
        }

        return response()->json(['result' => $order]);
    }

    public function getListSellersHaveOrders()
    {
        $orders = $this->order->where('order_status_id', 1)->get();
        $order_sellers = array();
        foreach ($orders as $index => $item) {
            $seller_id = $item->seller_id;
            $order_sellers[$index] = $seller_id;
        }

        $sellers = $this->seller->whereIn('seller_id', $order_sellers)
            ->where('profile_status_id', 2)
            ->get();

        foreach ($sellers as $item) {
            $item->shop_logo_image = "/storage/seller/" . $item->shop_logo_image;
        }

        return response()->json(['data' => $sellers]);
    }

    public function searchListSellersHaveOrders(Request $request)
    {
        $orders = $this->order->where('order_status_id', 1)->get();
        $order_sellers = array();
        foreach ($orders as $index => $item) {
            $seller_id = $item->seller_id;
            $order_sellers[$index] = $seller_id;
        }

        $search = $request->search_data;
        $sellers = $this->seller->where('shop_name', 'LIKE', "%{$search}%")
            ->where('profile_status_id', 2)
            ->whereIn('seller_id', $order_sellers)
            ->get();

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
        if ($order === null) {
            return response()->json(['message' => 'Order not found']);
        }

        if ($order->shipper !== null) {
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
                        'shop_longitude' => $order->seller->shop_longitude,
                        'user' => User::getUserByProfileId($order->seller->profile_id),
                    ],
                    'buyer' => [
                        'buyer_id' => $order->buyer->buyer_id,
                        'user' => User::getUserByProfileId($order->buyer->profile_id),
                    ],
                    'shipper' => [
                        'shipper_id' => $order->shipper->shipper_id,
                        'bank_account' => [
                            'bank_account_id' => $order->shipper->bank_account->bank_account_id,
                            'bank_account_name' => $order->shipper->bank_account->bank_account_name,
                        ],
                        'bank_account_no' => $order->shipper->bank_account_no,
                        'user' => User::getUserByProfileId($order->shipper->profile_id),
                    ],
                    'order_details' => OrderDetail::getOrderDetailsByOrderId($order->order_id),
                ],
            ]);
        } else {
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
                        'shop_longitude' => $order->seller->shop_longitude,
                        'user' => User::getUserByProfileId($order->seller->profile_id),
                    ],
                    'buyer' => [
                        'buyer_id' => $order->buyer->buyer_id,
                        'user' => User::getUserByProfileId($order->buyer->profile_id),
                    ],
                    'shipper' => null,
                    'order_details' => OrderDetail::getOrderDetailsByOrderId($order->order_id),
                ],
            ]);
        }
    }

}
