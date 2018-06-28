<?php

namespace App\Http\Controllers;

use App\Admin;
use App\User;
use App\Seller;
use App\Buyer;
use App\Deliver;
use App\Profile;
use Illuminate\Http\Request;
use App\Http\Resources\AdminResource as AdminResource;
use App\Http\Resources\AdminCollection;
use App\Http\Resources\SellerResource as SellerResource;
use App\Http\Resources\BuyerResource as BuyerResource;
use App\Http\Resources\DeliverResource as DeliverResource;

use App\Http\Requests\AdminRequest;



class AdminController extends Controller
{
    
    private $user;
    private $admin;

    public function __construct(Admin $admin, User $user, Seller $seller , Buyer $buyer, Deliver $deliver)
    {
        $this->admin = $admin;
        $this->user = $user;
        $this->seller = $seller;
        $this->buyer = $buyer;
        $this->deliver = $deliver;
    }

    public function getAdminByProfileId($profile_id)
    {
        if($profile_id <= 0)
        {
            return response()->json('Bad Request', 400);
        }

        $admin = $this->admin->where('profile_id', $profile_id)->get();
        if($admin->isEmpty())
        {
            return response()->json(['message' => 'Admin not found'], 404);
        }
    
        return response()->json([
            'message' => 'Successfully',
            'result' => $admin
        ]);
    
    }

    public function createAdmin(Request $request){


        $profile = new Profile();
        $profile->user_id = $request->user_id;
        $profile->role_id = 1;

        $profile->save();


        $admin = new Admin();
        $admin->admin_firstname = $request->admin_firstname;
        $admin->admin_lastname = $request->admin_lastname;
        $admin->telephone_number = $request->telephone_number;
        $admin->citizen_id = $request->citizen_id;
        $admin->profile_id = $profile->profile_id;

        $saveAdmin = $admin->save();
        if(!$saveAdmin)
        {
            return response()->json(['message' =>'Bad Request'], 400);
        }
        else
        {
            $saveAdmin;
        }

        return response()->json([
            'message' => 'Successfully',
            'result' => $admin
        ]);
    }


    public function searchUsers(Request $request){
        $role_id = $request->input('role_id');
        $profile_status_user_id = $request->input('profile_status_user_id');

        if ($role_id == 2){
            $seller = $this->seller::where('profile_status_id',$profile_status_user_id)->get();
            return SellerResource::collection($seller);
        }
        else if ($role_id == 3){
            $buyer = $this->buyer::where('profile_status_id',$profile_status_user_id)->get();
            return BuyerResource::collection($buyer);
        }
        else if ($role_id == 4){
            $deliver = $this->deliver::where('profile_status_id',$profile_status_user_id)->get();
            return DeliverResource::collection($deliver);
        }else{
            return response()->json(['message' =>'Bad Request'], 400);
        }

    }

    public function updateAdmin(AdminRequest $request, $admin_id){

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
        $role_id = $request->input('role_id');
        $id = $request->input('id');
        $profile_status_id = $request->input('profile_status_id');

        if ($role_id == 2){
            $seller = Seller::where('seller_id',$id)->first();
            $seller->profile_status_id = $profile_status_id;
            $seller->save();

            return response()->json(
                [ 
                    'message' => 'Successfully',
                    'result' => $seller
                ]
            );
        }
        else if ($role_id == 3){
            $buyer = Buyer::where('buyer_id',$id)->first();
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
            $deliver = Deliver::where('deliver_id',$id)->first();
            $deliver->profile_status_id = $profile_status_id;
            $deliver->save();

            return response()->json(
                [ 
                    'message' => 'Successfully',
                    'result' => $deliver
                ]
            );
        }else{
            return response()->json(['message' =>'Bad Request'], 400);
        }

    }

    
}
