<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;
use App\Seller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\SellerProductResource;
use App\Http\Requests\ProductRequest;

class ProductController extends Controller
{
    private $product;

    public function __construct(Product $product, Seller $seller)
    {
        $this->product = $product;
        $this->seller = $seller;
    }

    public function getProducts()
    {
        $products = $this->product->all();

        foreach ($products as $item)
        {
            $item->product_price = number_format($item->product_price, 2, '.', ',');
        }

        return ProductResource::collection($products);
    }

    public function getProductByProductId($product_id)
    {
        if($product_id <= 0)
        {
            return response()->json(['message' =>'Bad Request'], 400);
        }   

        $product = $this->product->with('category', 'seller', 'product_status')->where('product_id', $product_id)->get();
        if($product->isEmpty())
        {
            return response()->json(['message' =>'Product not found'], 404);
        }

        foreach ($product as $item)
        {
            $item->product_price = number_format($item->product_price, 2, '.', ',');
        }

        return ProductResource::collection($product);
    }

    public function getProductsBySellerId($seller_id)
    {
        if($seller_id <= 0)
        {
            return response()->json(['message' =>'Bad Request'], 400);
        }
        
        $sellerProduct = $this->product->where('seller_id', $seller_id)->get();

        foreach ($sellerProduct as $item)
        {
            $item->product_price = number_format($item->product_price, 2, '.', ',');
        }
        
        return SellerProductResource::collection($sellerProduct);
    }

    public function createProduct(ProductRequest $request, $seller_id )
    {
        $seller = $this->seller->find($seller_id);
        if($seller === null)
        {
            return response()->json(['message' => 'Seller not found'], 404);
        }

        $product = new Product();
        $product->product_name = $request->product_name;
        $product->product_description = $request->product_description;
        $product->product_price = $request->product_price;
        $product->unit_in_stock = $request->unit_in_stock;
        $product->product_status_id = 1;
        $product->product_category_id = $request->product_category_id;
        $product->seller_id = $seller_id;

        $saveProduct = $product->save();

        if(!$saveProduct)
        {
            return response()->json(['message' =>'Bad Request'], 400);
        }

        $saveProduct;

        return response()->json([
            'message' => 'Successfully',
            'result' => $product
        ]);
    }

    public function updateProduct(ProductRequest $request, $seller_id ,$product_id)
    {
        if($product_id <= 0)
        {
            return response()->json(['message' =>'Bad Request'], 400);
        }

        $product = $this->product->where('product_id', $product_id);
        
        if($product->count() <= 0)
        {
            return response()->json(['message'=> 'Product not found'], 404);
        }

        $product = $product->first();
        $product->product_name = $request->product_name;
        $product->product_description = $request->product_description;
        $product->product_price = $request->product_price;
        $product->unit_in_stock = $request->unit_in_stock;
        $product->product_status_id = $request->product_status_id;
        $product->product_category_id = $request->product_category_id;
        $product->seller_id = $request->seller_id;

        $saveProduct = $product->save();

        if(!$saveProduct)
        {
            return response()->json(['message' =>'Bad Request'], 400);
        }

        $saveProduct;

        return response()->json([
            'message' => 'Successfully',
            'result' => $product
        ]);
    }

    public function deleteProduct($product_id)
    {
        if($product_id <= 0)
        {
            return response()->json(['message' =>'Bad Request'], 400);
        }

        $product = $this->product->find($product_id);
        $product->delete();

        return response()->json([
            'message' => 'Successfully',
        ]); 
    }

}
