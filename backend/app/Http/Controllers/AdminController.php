<?php

namespace App\Http\Controllers;

use App\Admin;
use App\User;
use App\Seller;
use App\Buyer;
use App\Shipper;
use App\Profile;
use Illuminate\Http\Request;
use App\Http\Resources\AdminResource as AdminResource;
use App\Http\Resources\AdminCollection;
use App\Http\Resources\SearchBuyerResource as SearchBuyerResource;
use App\Http\Resources\SearchShipperResource as SearchShipperResource;
use App\Http\Resources\SearchSellerResource as SearchSellerResource;

class AdminController extends Controller
{

    private $user;
    private $admin;
    private $seller;
    private $buyer;
    private $shipper;
    private $profile;

    public function __construct(Admin $admin, User $user, Seller $seller , Buyer $buyer, Shipper $shipper,Profile $profile)
    {
        $this->admin = $admin;
        $this->user = $user;
        $this->seller = $seller;
        $this->buyer = $buyer;
        $this->shipper = $shipper;
        $this->profile = $profile;
    }

    public function getAdminByUserId($user_id)
    {
        if($user_id <= 0)
        {
            return response()->json('Bad Request', 400);
        }

        $admin = $this->profile->with('user', 'role')->where('user_id', $user_id)->first();
        if($admin === null)
        {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        return response()->json([
            'message' => 'Successfully',
            'data' => [
                'profile_id' => $admin->profile_id,
                'user' => $admin->user,
                'role' => $admin->role
            ]
        ]);
    }

    public function searchUsers(Request $request){
        $role_id = $request->role_id;
        $profile_status_id = $request->profile_status_id;

        $sellers = null;
        if ($role_id == 2){
            if($profile_status_id == 2)
            {
                $sellers = $this->seller->with('profile_status')
                            ->where('profile_status_id',[$profile_status_id,4])
                            ->get();
            }else{
                $sellers = $this->seller->with('profile_status')->where('profile_status_id',$profile_status_id)->get();
            }
            return SearchSellerResource::collection($sellers);
        }
        else if ($role_id == 3){
            $buyers = null;
            if($profile_status_id == 2)
            {
                $buyers = $this->buyer->with('profile_status')
                            ->where('profile_status_id',[$profile_status_id,4])
                            ->get();
            }else{
                $buyers = $this->buyer->where('profile_status_id',$profile_status_id)->get();
            }
            return SearchBuyerResource::collection($buyers);
        }
        else if ($role_id == 4){
            if($profile_status_id == 2)
            {
                $shippers = $this->shipper->with('profile_status')
                            ->where('profile_status_id',[$profile_status_id,4])
                            ->get();
            }else{
                $shippers = $this->shipper::where('profile_status_id',$profile_status_id)->get();
            }
            return SearchShipperResource::collection($shippers);
        }else{
            return response()->json(['message' =>'Bad Request'], 400);
        }
    }

    public function updateAdmin(Request $request, $admin_id){

        if($admin_id < 0)
        {
            return response()->json('Error', 400);
        }

        $admin = Admin::where('admin_id',$admin_id)->first();

        if(!$admin)
        {
            return response()->json('Buyer not found', 404);
        }

        $admin->admin_firstname = $request->admin_firstname;
        $admin->admin_lastname = $request->admin_lastname;
        $admin->telephone_number = $request->telephone_number;
        $admin->citizen_id = $request->citizen_id;

        $admin->save();

        return response()->json(
            [
                'message' => 'Successfully',
                'result' => $admin
            ]
        );

    }

    public function adminUpdateStatusUser(Request $request){
        $id = $request->id;
        $role_id = $request->role_id;
        $profile_status_id = $request->profile_status_id;

        if ($role_id == 2){
            $seller = $this->seller->where('seller_id',$id)->first();
            if ($seller === null) {
                return response()->json(['message' => 'Seller not found'], 404);
            }
            $seller->profile_status_id = $profile_status_id;
            $seller->save();

            $seller->shop_logo_image = "/storage/seller/".$seller->shop_logo_image;
            return response()->json(
                [
                    'message' => 'Successfully',
                    'result' => $seller
                ]
            );
        }
        else if ($role_id == 3){
            $buyer = $this->buyer->where('buyer_id',$id)->first();
            if ($buyer === null) {
                return response()->json(['message' => 'Buyer not found'], 404);
            }

            $buyer->profile_status_id = $profile_status_id;
            $buyer->save();

            return response()->json(
                [
                    'message' => 'Successfully',
                    'result' => $buyer
                ]
            );
        }
        else if ($role_id == 4){
            $shipper = $this->shipper->where('shipper_id', $id)->first();
            if ($shipper === null) {
                return response()->json(['message' => 'Shipper not found'], 404);
            }

            $shipper->profile_status_id = $profile_status_id;
            $shipper->save();

            return response()->json(
                [
                    'message' => 'Successfully',
                    'result' => $shipper
                ]
            );
        }else{
            return response()->json(['message' =>'Bad Request'], 400);
        }

    }


}
