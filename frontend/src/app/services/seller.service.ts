import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private baseUrl = 'http://localhost:8000/api/';
  private UAT = localStorage.getItem('UAT')
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ this.UAT
    })
  };

  constructor(private http: HttpClient) { }

  ngOnInit() {


  }

  updateShop(form, seller_id) {
    return this.http.post<shop>(`${this.baseUrl}seller/` + seller_id, form, this.httpOptions)
  }

  getAllProducts(seller_id) { 
    var temp = this.http.get<Product>(`${this.baseUrl}seller/` + seller_id + `/products`,this.httpOptions)
    console.log("getAllProducts from service: ", temp)
    return temp
  }


  getAllShops(){
    return this.http.get<shops>(`${this.baseUrl}sellers/`,this.httpOptions)
  }

  getShopByProfileId(id) {
    return this.http.get<shops>(`${this.baseUrl}seller/profile/`+id,this.httpOptions)
  }

  getShopCategories() {
    return this.http.get<shopCategorie>(`${this.baseUrl}shoptypes`,this.httpOptions)
  }

  getProductCategories() {
    return this.http.get<productCategorie>(`${this.baseUrl}categories`,this.httpOptions)
  }

  createProduct(product, seller_id) {
    let header = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+ this.UAT,
        'Accept':"application/json, text/plain, */*",

      })
    };
    
    // Display the key/value pairs
    // for (var pair of product.entries()) {
    //   console.log('[product] '+ pair[0]+ ', ' + pair[1]); 
    // } 

    let formData = new FormData();
    formData.append('product_name',product.product_name);
    formData.append('product_price',product.product_price)
    formData.append('product_category_id',product.product_category_id)
    formData.append('product_description',product.product_description)
    formData.append('product_image_1',product.product_image_1)


    console.log("tempForm: ", formData.getAll('product_category_id'))
    
    

    return this.http.post(`${this.baseUrl}seller/` + seller_id + `/product`, formData,header)

  }

  deleteProduct(id){
    return this.http.delete(`${this.baseUrl}seller/product/` + id,this.httpOptions)
  }

  updateProduct(id, product, seller) {
    return this.http.post<shop>(`${this.baseUrl}seller/` + seller.seller_id + `/product/` + id, product,this.httpOptions)

  }

  getOrderHistory(id) {
    return this.http.get<Product>(`${this.baseUrl}order/seller/${id}/histories`,this.httpOptions)

  }

  getGoogleMapAddress(lat,lng) {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${lat},${lng}&key=AIzaSyCxcKTh1HnMR-RN3vHZ0NSyDCT_TByefpk`)
  }

  searchShopName(keyWord) {
    let body = {
      search_data: keyWord
    }
    return this.http.post<shops>(`${this.baseUrl}seller/search/shop-name/`, body,this.httpOptions)

  }


  getShopByProductCategoryId(id) {
    return this.http.get<shops>(`${this.baseUrl}shops/product-category/${id}`,this.httpOptions)
  }

}


export interface shop {
  message:null,
  result:null
}

export interface address{
  results: [{
    address_components: null,
    formatted_address: null
  }]
}

export interface Product {
  data: [{
    product_id: null,
    product_name: null,
    product_description: null,
    product_price: null,
    unit_in_stock: null,
    product_available: null,
    category: {
      category_id: null,
      category_name: null
    }
  }]
}

export interface productCategorie {
  message: null,
  data: [
    { category_id: null, category_name: "" }]

}

export interface shopCategorie {
  message: null,
  data: [
    { category_id: null, category_name: "" }]

}

export interface shops {
  data: [{
    seller_id: null,
    seller_name: null,
    shop_name: null,
    shop_location: null,
    shop_type: {
        shop_type_id: null,
        shop_type_name: null
    },
    profile_status: {
        profile_status_id: null,
        profile_status_name: null
    },
    profile_id: 1
}]

}


