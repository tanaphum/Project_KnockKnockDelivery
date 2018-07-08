<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource as ProductResource;
use App\Http\Resources\SellerProductResource as SellerProductResource;
use App\Product;
use App\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    private $product;
    private $seller;

    public function __construct(Product $product, Seller $seller)
    {
        $this->product = $product;
        $this->seller = $seller;
    }

    public function getProducts()
    {
        $products = $this->product->with('product_category', 'seller', 'product_status')
                    ->where('product_status_id', 1)->get();

        foreach ($products as $item) {
            $item->product_price = number_format($item->product_price, 2, '.', ',');
        }

        return ProductResource::collection($products);
    }

    public function getProductByProductId($product_id)
    {
        if ($product_id <= 0) {
            return response()->json(['message' => 'Bad Request'], 400);
        }

        $product = $this->product->with('product_category', 'seller', 'product_status')
                    ->where('product_id', $product_id)->get();
        if ($product->isEmpty()) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        foreach ($product as $item) {
            $item->product_price = number_format($item->product_price, 2, '.', ',');
        }

        return ProductResource::collection($product);
    }

    public function getProductsBySellerId($seller_id)
    {
        if ($seller_id <= 0) {
            return response()->json(['message' => 'Bad Request'], 400);
        }
        $seller = $this->seller->where('seller_id', $seller_id)->first();
        if ($seller === null) {
            return response()->json(['message' => 'Seller not found'], 400);
        }

        $sellerProduct = $this->product->where('seller_id', $seller_id)->get();
        foreach ($sellerProduct as $item) {
            $item->product_price = number_format($item->product_price, 2, '.', ',');
        }

        return SellerProductResource::collection($sellerProduct);
    }

    public function createProduct(Request $request, $seller_id)
    {
        $this->validate($request, [
            'product_name' => 'required|max:100',
            'product_description' => 'required|max:199',
            'product_price' => 'required',
            'product_image_1' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
            'product_image_2' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
            'product_image_3' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
            'product_category_id' => 'required',
        ]);

        $seller = $this->seller->find($seller_id);
        if ($seller === null) {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        $product = new Product();
        $product->product_name = $request->product_name;
        $product->product_description = $request->product_description;
        $product->product_price = $request->product_price;
        $product->product_status_id = 1;
        $product->product_category_id = $request->product_category_id;
        $product->seller_id = $seller->seller_id;

        for ($i = 1; $i <= 3; $i++) {
            if ($request->hasFile('product_image_'.$i)) {
                // Get filename with the extension
                $filenameWithExt = $request->file('product_image_'.$i)->getClientOriginalName();
                // Get just filename
                $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
                // Get just ext
                $extension = $request->file('product_image_'.$i)->getClientOriginalExtension();
                // Filename to store
                ini_set(
                    $fileNameToStore = $filename.'_'.strtoupper(bin2hex(openssl_random_pseudo_bytes(16))).'.'.$extension
                , 300);
                // Upload Image
                ini_set(
                    $path = $request->file('product_image_'.$i)->storeAs('public/product', $fileNameToStore)
                    , 300);
            } else {
                $fileNameToStore = 'noimage.jpg';
            }

            if ($i == 1) {
                $product->product_image_1 = $fileNameToStore;
            }

            if ($i == 2) {
                $product->product_image_2 = $fileNameToStore;
            }

            if ($i == 3) {
                $product->product_image_3 = $fileNameToStore;
            }

        }

        $saveProduct = $product->save();

        if (!$saveProduct) {
            return response()->json(['message' => 'Bad Request'], 400);
        }

        $saveProduct;
        $product->product_image_1 = "/storage/product/".$product->product_image_1;
        $product->product_image_2 = "/storage/product/".$product->product_image_2;
        $product->product_image_3 = "/storage/product/".$product->product_image_3;

        return response()->json([
            'message' => 'Successfully',
            'result' => $product,
        ]);
    }

    public function updateProduct(Request $request, $seller_id, $product_id)
    {
        $this->validate($request, [
            'product_name' => 'required|max:100',
            'product_description' => 'required|max:199',
            'product_price' => 'required',
            'product_image_1' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
            'product_image_2' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
            'product_image_3' => 'image|nullable|mimes:jpeg,jpg,png|max:10000',
            'product_category_id' => 'required',
            'product_status_id' => 'required',
        ]);

        $product = $this->product->where('product_id', $product_id)->first();
        if ($product === null) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->product_name = $request->product_name;
        $product->product_description = $request->product_description;
        $product->product_price = $request->product_price;
        $product->product_status_id = $request->product_status_id ;
        $product->product_category_id = $request->product_category_id;

        for ($i = 1; $i <= 3; $i++) {
            if ($request->hasFile('product_image_'.$i)) {
                // Get filename with the extension
                $filenameWithExt = $request->file('product_image_'.$i)->getClientOriginalName();
                // Get just filename
                $filename = pathinfo($filenameWithExt, PATHINFO_FILENAME);
                // Get just ext
                $extension = $request->file('product_image_'.$i)->getClientOriginalExtension();
                // Filename to store
                ini_set(
                    $fileNameToStore = $filename.'_'.strtoupper(bin2hex(openssl_random_pseudo_bytes(16))).'.'.$extension
                , 300);

                // Upload Image
                ini_set(
                    $path = $request->file('product_image_'.$i)->storeAs('public/product', $fileNameToStore)
                    , 300);
            } else {
                $fileNameToStore = 'noimage.jpg';
            }

            if ($i == 1 && $request->hasFile('product_image_1')) {
                Storage::delete('public/product/'.$product->product_image_1);
                $product->product_image_1 = $fileNameToStore;
            }

            if ($i == 2 && $request->hasFile('product_image_2')) {
                Storage::delete('public/product/'.$product->product_image_2);
                $product->product_image_2 = $fileNameToStore;
            }

            if ($i == 3 && $request->hasFile('product_image_3')) {
                Storage::delete('public/product/'. $product->product_image_3);
                $product->product_image_3 = $fileNameToStore;
            }
        }

        $saveProduct = $product->save();

        if (!$saveProduct) {
            return response()->json(['message' => 'Bad Request'], 400);
        }

        $saveProduct;
        $product->product_image_1 = "/storage/product/".$product->product_image_1;
        $product->product_image_2 = "/storage/product/".$product->product_image_2;
        $product->product_image_3 = "/storage/product/".$product->product_image_3;

        return response()->json([
            'message' => 'Successfully',
            'result' => $product,
        ]);
    }

    public function deleteProduct($product_id)
    {
        if ($product_id <= 0) {
            return response()->json(['message' => 'Bad Request'], 400);
        }

        $product = $this->product->where('product_id',$product_id)->first();
        if ($product === null) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json([
            'message' => 'Successfully'
        ]);
    }

}
