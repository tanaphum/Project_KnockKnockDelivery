import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private baseUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  getAllProducts(seller) {
    return this.http.get<Product>(`${this.baseUrl}seller/` + seller.seller_id + `/products`);
  }

  getCategories() {
    return this.http.get(`${this.baseUrl}categories/`);
  }

  createProduct(product, seller) {
    return this.http.post(`${this.baseUrl}seller/` + seller.seller_id + `/product`, product);

  }


}


export interface Product {
  data: [{
    product_id: null,
    product_name: "",
    product_description: "",
    product_price: "",
    unit_in_stock: null,
    product_available: null,
    category: {
      category_id: "",
      category_name: ""
    }
  }]
}


