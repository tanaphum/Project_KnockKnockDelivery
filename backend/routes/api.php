<?php

Route::group([
    'middleware' => ['api','CORS'],
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', 'AuthController@login');
    Route::post('signup', 'AuthController@signup');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::put('user/{user_id}','AuthController@editUser');
    Route::post('me', 'AuthController@me');
    Route::put('editUser', 'AuthController@editUser');
});

Route::post('auth/sendPasswordResetLink', 'ResetPasswordController@sendEmail');
Route::post('auth/resetPassword', 'ChangePasswordController@process');

Route::group([
   'middleware' => ['auth:api','CORS'],
], function ($router) {
    Route::get('masterData', 'MasterDataController@getMasterData');
});

Route::group([
   'middleware' => ['auth:api','CORS'],
], function ($router) {
    Route::get('user/{user_id}/profiles', 'ProfileController@getProfilesByUserId');
});

Route::group([
   'middleware' => ['auth:api','CORS'],
], function ($router) {
    Route::get('sellers', 'SellerController@getSellers');
    Route::get('seller/profile/{profile_id}', 'SellerController@getSellerByProfileId');
    Route::post('seller', 'SellerController@createSeller');
    Route::post('seller/{seller_id}', 'SellerController@updateSeller');
    Route::post('seller/search/shop-name', 'SellerController@searchShopName');

    Route::get('seller/{seller_id}/products', 'ProductController@getProductsBySellerId');
    Route::post('seller/{seller_id}/product', 'ProductController@createProduct');
    Route::post('seller/{seller_id}/product/{product_id}', 'ProductController@updateProduct');
    Route::delete('seller/product/{product_id}', 'ProductController@deleteProduct');

    Route::get('shops/product-category/{product_category_id}', 'SellerController@getSellerByProductCategoryId');

});

Route::group([
   'middleware' => ['auth:api','CORS'],
], function ($router) {
    Route::get('buyer/profile/{profile_id}', 'BuyerController@getBuyerByProfileId');
    Route::post('buyer', 'BuyerController@createBuyer');
    Route::put('buyer/{buyer_id}', 'BuyerController@updateBuyer');
});

Route::group([
   'middleware' => ['auth:api','CORS'],
], function ($router) {
    Route::get('shipper/profile/{profile_id}', 'ShipperController@getShipperByProfileId');
    Route::post('shipper', 'ShipperController@createShipper');
    Route::post('shipper/{shipper_id}', 'ShipperController@updateShipper');
});

Route::group([
   'middleware' => ['auth:api','CORS'],
], function ($router) {
    Route::get('admin/{user_id}', 'AdminController@getAdminByUserId');
    Route::post('search/users', 'AdminController@searchUsers');
    // Route::put('admin/{admin_id}', 'AdminController@updateAdmin');
    Route::post('admin/updatestatus', 'AdminController@adminUpdateStatusUser');
    Route::put('admin/cancel-order/{order_id}', 'AdminController@cancelOrder');
});


Route::group([
   'middleware' => ['auth:api','CORS'],
], function ($router) {
    Route::get('products', 'ProductController@getProducts');
    Route::get('product/{product_id}', 'ProductController@getProductByProductId');
});

Route::group([
   'middleware' => ['auth:api','CORS'],
], function ($router) {
    Route::get('order/sellers', 'OrderController@getListSellersHaveOrders');
    Route::post('order/search/shop-name', 'OrderController@searchListSellersHaveOrders');
    Route::get('order/seller/{seller_id}/order-list', 'OrderController@getListOrdersBySellerId');
    Route::get('order/{order_id}', 'OrderController@getOrderByOrderId');
    Route::put('order/{order_id}', 'OrderController@updateStatusOrder');
    Route::post('order/{order_id}/uploadPaymentTransferSlip', 'OrderController@uploadPaymentTransferSlip');
    Route::post('order', 'OrderController@createOrder');
    Route::post('order-detail', 'OrderDetailController@createOrderDeatail');

    Route::get('order/seller/{seller_id}/histories', 'OrderHistoryController@getListOrderHistorySellerBySellerId');
    Route::get('order/buyer/{buyer_id}/histories', 'OrderHistoryController@getListOrderHistoryBuyerByBuyerId');
    Route::get('order/shipper/{shipper_id}/histories', 'OrderHistoryController@getListOrderHistoryDeliverByShipperId');
    Route::get('admin/order/histories', 'OrderHistoryController@getListOrdersHistory');
});

Route::group([
   'middleware' => ['auth:api','CORS'],
],function ($router){
    Route::get('qrcode/seller/order/{order_id}', 'OrderQRcodeController@getDataQRCodeByOrderId');
    Route::get('qrcode/buyer/order/{order_id}', 'OrderQRcodeController@getDataQRCodeByOrderId');
    Route::put('orderQRcode/order/{order_id}/shipper-accept', 'OrderQRcodeController@shipperAcceptOrder');
    Route::get('orderQRcode/seller/order/{order_id}', 'OrderQRcodeController@getQRcodeSellerByOrderId');
    Route::get('orderQRcode/buyer/order/{order_id}', 'OrderQRcodeController@getQRcodeBuyerByOrderId');
    Route::put('orderQRcode/order/{order_id}', 'OrderQRcodeController@qrcodeUpdateStatusOrderByOrderId');
});
