<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Http\Resources\SellerResource as SellerResource;
use App\Profile;
use App\Seller;
use App\User;

class SellerController extends Controller
{
    private $profile;
    private $seller;
    private $user;

    public function __construct(Seller $seller, Profile $profile, User $user)
    {
        $this->seller = $seller;
        $this->profile = $profile;
        $this->user = $user;
    }

    public function getSellers()
    {
        $sellers = $this->seller->where('profile_status_id',2)->get();

        return SellerResource::collection($sellers);
    }

    public function getSellerByProfileId($profile_id)
    {
        if ($profile_id <= 0) {
            return response()->json('Bad Request', 400);
        }

        $seller = $this->seller->with('profile_status')->where('profile_id', $profile_id)->get();
        if ($seller->isEmpty()) {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        return SellerResource::collection($seller);
    }

    public function createSeller(Request $request)
    {
        $this->validate($request, [
            'shop_name' => 'required|max:50',
            'shop_location' => 'required|max:199',
            'shop_latitude' => 'required',
            'shop_longitude' => 'required',
            'shop_logo_image' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
            'user_id' => 'required'
        ]);

        $user = $this->user->find($request->user_id);
        if ($user === null) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $checkRole = $this->profile->where('user_id', $request->user_id)->where('role_id', 2)->count();
        if ($checkRole > 0) {
            return response()->json([
                'message' => 'this role already exists in your profiles',
            ], 400);
        }

        if ($request->hasFile('shop_logo_image')) {
            // Get filename with the extension
            $filenameWithExt = $request->file('shop_logo_image')->getClientOriginalName();
            // Get just filename
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            // Get just ext
            $extension = $request->file('shop_logo_image')->getClientOriginalExtension();
            // Filename to store
            $fileNameToStore = $filename . '_' . time() . '.' . $extension;
            // Upload Image
            $path = $request->file('shop_logo_image')->storeAs('public/seller', $fileNameToStore);
        } else {
            $fileNameToStore = 'noimage.jpg';
        }

        $profile = new Profile();
        $profile->user_id = $request->user_id;
        $profile->role_id = 2;

        $profile->save();

        $seller = new Seller();
        $seller->shop_name = $request->shop_name;
        $seller->shop_location = $request->shop_location;
        $seller->shop_latitude = $request->shop_latitude;
        $seller->shop_longitude = $request->shop_longitude;
        $seller->shop_logo_image = $fileNameToStore;
        $seller->profile_status_id = 1;
        $seller->profile_id = $profile->profile_id;

        $saveSeller = $seller->save();
        if (!$saveSeller) {
            $profile->delete();
            return response()->json(['message' => 'Bad Request'], 400);
        } else {
            $saveSeller;
        }

        $seller->shop_logo_image = "/storage/seller/".$seller->shop_logo_image;
        return response()->json([
            'message' => 'Successfully',
            'result' => $seller,
        ]);
    }

    public function updateSeller(Request $request, $seller_id)
    {
        $this->validate($request, [
            'shop_name' => 'required|max:50',
            'shop_location' => 'required|max:199',
            'shop_latitude' => 'required',
            'shop_longitude' => 'required',
            'shop_logo_image' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
        ]);

        $seller = $this->seller->where('seller_id', $seller_id)->first();
        if ($seller === null) {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        if ($request->hasFile('shop_logo_image')) {
            Storage::delete('public/seller/'.$seller->shop_logo_image);

            // Get filename with the extension
            $filenameWithExt = $request->file('shop_logo_image')->getClientOriginalName();
            // Get just filename
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            // Get just ext
            $extension = $request->file('shop_logo_image')->getClientOriginalExtension();
            // Filename to store
            $fileNameToStore = $filename . '_' . time() . '.' . $extension;
            // Upload Image
            $path = $request->file('shop_logo_image')->storeAs('public/seller', $fileNameToStore);
        }

        $seller->shop_name = $request->shop_name;
        $seller->shop_location = $request->shop_location;
        $seller->shop_latitude = $request->shop_latitude;
        $seller->shop_longitude = $request->shop_longitude;
        if ($request->hasFile('shop_logo_image')) {
            $seller->shop_logo_image = $fileNameToStore;
        }

        $seller->save();
        $seller->shop_logo_image = "/storage/seller/".$seller->shop_logo_image;

        return response()->json([
            'message' => 'Successfully',
            'result' => $seller,
        ]);
    }

}
