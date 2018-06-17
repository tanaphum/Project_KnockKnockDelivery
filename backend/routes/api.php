<?php

Route::group([
    'middleware' => ['api','CORS'],
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', 'AuthController@login');
    Route::post('signup', 'AuthController@signup');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
});

Route::group([
    // 'middleware' => 'jwt.auth',
    'middleware' => 'CORS',
], function ($router) {
    Route::get('user/{user_id}/profiles', 'ProfileController@getProfilesByUserId');
    Route::post('profile', 'ProfileController@createProfile');    
});

Route::group([
    // 'middleware' => 'jwt.auth',
    'middleware' => 'CORS',
], function ($router) {
    Route::get('sellers', 'SellerController@getSellers');
    Route::get('seller/profile/{profile_id}', 'SellerController@getSellerByProfileId');
    Route::get('shoptypes', 'ShopTypeController@getShopTypes');
    Route::post('seller', 'SellerController@createSeller');
    Route::put('seller/{profile_id}', 'SellerController@updateSeller');
    
    Route::get('seller/{seller_id}/products', 'ProductController@getProductsBySellerId');
    Route::post('seller/{seller_id}/product', 'ProductController@createProduct');
    Route::put('seller/{seller_id}/product/{product_id}', 'ProductController@updateProduct');
    Route::delete('seller/product/{product_id}', 'ProductController@deleteProduct');
});

Route::group([
    // 'middleware' => 'jwt.auth',
    'middleware' => 'CORS',
], function ($router) {
    Route::get('buyers', 'BuyerController@getBuyers');
    Route::get('buyer/profile/{profile_id}', 'BuyerController@getBuyerByProfileId');
    Route::post('buyer', 'BuyerController@createBuyer');
    Route::put('buyer/{buyer_id}', 'BuyerController@updateBuyer');
});

Route::group([
    // 'middleware' => 'jwt.auth',
    'middleware' => 'CORS',
], function ($router) {
    Route::get('delivers', 'DeliverController@getDelivers');
    Route::get('deliver/profile/{profile_id}', 'DeliverController@getDeliverByProfileId');
    Route::post('deliver', 'DeliverController@createDeliver');
    Route::put('deliver/{deliver_id}', 'DeliverController@updateDeliver');
});

Route::group([
    // 'middleware' => 'jwt.auth',
    'middleware' => 'CORS',
], function ($router) {
    Route::get('categories', 'CategoryController@getCategories');
    Route::get('products', 'ProductController@getProducts');
    Route::get('product/{product_id}', 'ProductController@getProductByProductId');
});
