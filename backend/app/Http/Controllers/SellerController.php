<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\SellerResource as SellerResource;
use App\Http\Requests\SellerRequest;
use App\Seller;
use App\Profile;
use App\User;
use App\SellerPhoto;

class SellerController extends Controller
{
    private $profile;
    private $seller;
    private $user;
    private $sellerPhoto;

    public function __construct(Seller $seller, Profile $profile, User $user, SellerPhoto $sellerPhoto)
    {
        $this->seller = $seller;
        $this->profile = $profile;
        $this->user = $user;
        $this->sellerPhoto = $sellerPhoto;
    }

    public function getSellers()
    {
        $sellers = $this->seller->all();

        return SellerResource::collection($sellers);
    }

    public function getSellerByProfileId($profile_id)
    {
        if($profile_id <= 0)
        {
            return response()->json('Bad Request', 400);
        }

        $seller = $this->seller->with('shoptype','profile_status')->where('profile_id', $profile_id)->get();
        if($seller->isEmpty())
        {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        return SellerResource::collection($seller);
    }

    public function createSeller(SellerRequest $request)
    {
        $user = $this->user->find($request->user_id);
        if($user === null)
        {
            return response()->json([
                'message' => 'User not found'
            ], 404 );
        }

        $checkRole = $this->profile->where('user_id', $request->user_id)->where('role_id', 2)->count();
        if($checkRole > 0)
        {
            return response()->json([
                'message' => 'this role already exists in your profiles'
            ], 400 );
        }

        $profile = new Profile();
        $profile->user_id = $request->user_id;
        $profile->role_id = 2;

        $profile->save();

        $seller = new Seller();
        $seller->seller_name = $request->seller_name;
        $seller->shop_name = $request->shop_name;
        $seller->shop_type_id = $request->shop_type_id;
        $seller->shop_location = $request->shop_location;
        $seller->profile_status_id = 1;
        $seller->profile_id = $profile->profile_id;
        $seller->shop_latitude = $request->shop_latitude;
        $seller->shop_longitude = $request->shop_longitude;

        $saveSeller = $seller->save();
        if(!$saveSeller)
        {
            $profile->delete();
            return response()->json(['message' =>'Bad Request'], 400);
        }
        else
        {
            $saveSeller;
        }

        foreach ($request->seller_photos as $photo) {
            $filename = $photo->store('photos');
            $this->sellerPhoto->create([
                'seller_id' => $seller->seller_id,
                'seller_photo_filename' => $filename
            ]);
        }


        return response()->json([
            'message' => 'Successfully',
            'result' => $seller
        ]);
    }

    public function updateSeller(SellerRequest $request, $seller_id )
    {
        $seller = $this->seller->where('seller_id', $seller_id)->first();

        if($seller_id->count() == 0)
        {
            return response()->json(['message'=>'Seller not found'], 404);
        }
     
        $seller->seller_name = $request->seller_name;
        $seller->shop_name = $request->shop_name;
        $seller->shop_type_id = $request->shop_type_id;
        $seller->shop_location = $request->shop_location;
        if ($request->profile_status_id == null)
        {
            $seller->profile_status_id = 1;
        }
        else
        {
            $seller->profile_status_id = $request->profile_status_id;
        }
        $seller->shop_latitude = $request->shop_latitude;
        $seller->shop_longitude = $request->shop_longitude;   
        $seller->save();
        
        return response()->json(
            [
                'message' => 'Successfully',
                'result' => $seller
            ]
        );
    }

}
