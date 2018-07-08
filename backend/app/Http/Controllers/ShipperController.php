<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Http\Resources\ShipperResource as ShipperResource;
use App\Profile;
use App\Shipper;
use App\User;

class ShipperController extends Controller
{
    private $deliver;
    private $profile;
    private $user;

    public function __construct(Shipper $shipper, Profile $profile, User $user)
    {
        $this->shipper = $shipper;
        $this->profile = $profile;
        $this->user = $user;
    }

    public function getShipperByProfileId($profile_id)
    {
        if ($profile_id <= 0) {
            return response()->json(['message' => 'Bad Request'], 400);
        }

        $shipper = $this->shipper->with('profile_status', 'profile')->where('profile_id', $profile_id)->get();
        if ($shipper->isEmpty()) {
            return response()->json(['message' => 'Shipper not found'], 404);
        }

        return ShipperResource::collection($shipper);
    }

    public function createShipper(Request $request)
    {
        $this->validate($request, [
            'bank_account_id' => 'required',
            'bank_account_no' => 'required|min:8|max:20',
            'shipper_transfer_slip' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
            'user_id' => 'required',
        ]);

        $user = $this->user->find($request->user_id);
        if ($user === null) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $checkRole = $this->profile->where('user_id', $request->user_id)->where('role_id', 4)->count();
        if ($checkRole > 0) {
            return response()->json([
                'message' => 'this role already exists in your profiles',
            ], 400);
        }

        if ($request->hasFile('shipper_transfer_slip')) {
            // Get filename with the extension
            $filenameWithExt = $request->file('shipper_transfer_slip')->getClientOriginalName();
            // Get just filename
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            // Get just ext
            $extension = $request->file('shipper_transfer_slip')->getClientOriginalExtension();
            // Filename to store
            $fileNameToStore = $filename . '_' . time() . '.' . $extension;
            // Upload Image
            $path = $request->file('shipper_transfer_slip')->storeAs('public/shipper', $fileNameToStore);
        } else {
            $fileNameToStore = 'noimage.jpg';
        }

        $profile = new Profile();
        $profile->user_id = $request->user_id;
        $profile->role_id = 4;

        $profile->save();

        $shipper = new Shipper();
        $shipper->bank_account_id = $request->bank_account_id;
        $shipper->bank_account_no = $request->bank_account_no;
        $shipper->shipper_transfer_slip = $fileNameToStore;
        $shipper->profile_status_id = 1;
        $shipper->profile_id = $profile->profile_id;

        $saveShipper = $shipper->save();
        if (!$saveShipper) {
            $profile->delete();
            return response()->json(['message' => 'Bad Request'], 400);
        } else {
            $saveShipper;
        }

        $shipper->shipper_transfer_slip = "/storage/shipper/".$shipper->shipper_transfer_slip;
        return response()->json([
            'message' => 'Successfully',
            'result' => $shipper,
        ]);
    }

    public function updateShipper(Request $request, $shipper_id)
    {
        $this->validate($request, [
            'bank_account_id' => 'required',
            'bank_account_no' => 'required|min:8|max:20',
            'shipper_transfer_slip' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
        ]);

        $shipper = $this->shipper->where('shipper_id', $shipper_id)->first();
        if ($shipper === null) {
            return response()->json(['message' => 'Shipper not found'], 404);
        }

        if ($request->hasFile('shipper_transfer_slip')) {
            Storage::delete('public/shipper/'.$shipper->shipper_transfer_slip);

            // Get filename with the extension
            $filenameWithExt = $request->file('shipper_transfer_slip')->getClientOriginalName();
            // Get just filename
            $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
            // Get just ext
            $extension = $request->file('shipper_transfer_slip')->getClientOriginalExtension();
            // Filename to store
            $fileNameToStore = $filename . '_' . time() . '.' . $extension;
            // Upload Image
            $path = $request->file('shipper_transfer_slip')->storeAs('public/shipper', $fileNameToStore);
        } else {
            $fileNameToStore = 'noimage.jpg';
        }

        $shipper->bank_account_id = $request->bank_account_id;
        $shipper->bank_account_no = $request->bank_account_no;
        if ($request->hasFile('shipper_transfer_slip')) {
            $shipper->shipper_transfer_slip = $fileNameToStore;
        }

        $saveShipper = $shipper->save();
        $shipper->shipper_transfer_slip = "/storage/shipper/".$shipper->shipper_transfer_slip;

        return response()->json([
            'message' => 'Successfully',
            'result' => $shipper,
        ]);
    }

}
