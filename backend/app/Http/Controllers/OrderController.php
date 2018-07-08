<?php

namespace App\Http\Controllers;

use App\Http\Resources\ListOrdersOfShipperResource;
use App\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    private $order;
    public function __construct(Order $order)
    {
        $this->order = $order;
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
            'total' => 'required',
            'payment_transfer_slip' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
            'seller_id' => 'required',
            'buyer_id' => 'required',
        ]);

        $order = new Order();
        $order->receiver_firstname = $request->receiver_firstname;
        $order->receiver_lastname = $request->receiver_lastname;
        $order->receiver_location = $request->receiver_location;
        $order->receiver_latitude = $request->receiver_latitude;
        $order->receiver_longitude = $request->receiver_longitude;
        $order->order_date = date('Y-m-d');
        $order->order_total_price = $request->order_total_price;
        $order->seller_id = $request->seller_id;
        $order->buyer_id = $request->buyer_id;
        $order->order_status_id = 1;

        $order->save();

        return response()->json([
            'message' => 'Successfully',
            'result' => $order,
        ]);
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

        return response()->json([
            'message' => "Successfully",
            'order' => $order,
        ]);
    }

    public function getListOrdersOfShipper()
    {
        $orders = $this->order->where('order_status_id', 1)->get();
        return ListOrdersOfShipperResource::collection($orders);
    }

    public function getShopHistoryBySellerId($seller_id)
    {
        $shop_history = $this->order->where('order_status_id', 8)->get();
        return response()->json([
            'message' => "Successfully",
            'order' => $order,
        ]);
    }

}
