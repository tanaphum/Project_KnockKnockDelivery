import { Component, OnInit } from '@angular/core';
import { BuyerService } from '../../services/buyer.service';
import { SellerService } from '../../services/seller.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

    private baseUrl = 'http://localhost:8000';
    private products;
    private isShow: boolean = true;
    private cart_num = 0;
    private seller_id;
    private form = {
        product_name: null,
        product_description: null,
        product_price: null,
        product_image_1:null
    }

    private shop = [];




    constructor(
        private BuyerService: BuyerService,
        private SellerService: SellerService,

        private router: Router
    ) { }

    ngOnInit() {
        this.setCartNum();
        this.setSellerID();
        
    }

    setSellerID() {
      this.seller_id = localStorage.getItem('seller_id');
      this.getAllProduct();
      this.getShopDetail(this.seller_id);
    }

    getAllProduct() {
      console.log("Seller id = ",this.seller_id)
      this.SellerService.getAllProducts(this.seller_id)
      .subscribe(response => {
        console.log("[Response] ",response.data);
        this.products = response.data;
        this.isShow = !this.seller_id
      },
      error => {
        console.log("[Error] ",error);

      })
    }

    getShopDetail(id) {
      this.SellerService.getShopByProfileId(id)
      .subscribe(response => {
        console.log("[Response] ",response);
        this.shop = response.data
      },
      error => {
        console.log("[Error] ",error);
    })
    }

    

  openInfo(product){
    console.log("onClick product: ",product)
    this.form.product_name= product.product_name
    this.form.product_description= product.product_description
    this.form.product_price=product.product_price
    this.form.product_image_1=product.product_image_1

  }

  setCartNum(){
    let cart = JSON.parse(localStorage.getItem("cart"));
    console.log("cart: ",cart);

    if(cart != null) {
          this.cart_num = cart.length;
    } 
    else if(cart == {}) {
      this.cart_num = 0;

    }

  }

  addToCart(product) {
    console.log("addToCart: ",product)
    let cart = JSON.parse(localStorage.getItem("cart"));
    if(cart == null){
      let obj = [];
      obj.push(product);
      // console.log("product: ",product);
      localStorage.setItem("cart",JSON.stringify(obj));
      this.setCartNum();

    }
    else{
      cart.push(product)
      console.log("cart: ",cart);
      localStorage.setItem("cart",JSON.stringify(cart));
      this.setCartNum();

    }
  }

  goToCart() {
    let cart = JSON.parse(localStorage.getItem("cart"));

    console.log("Cart : ",cart)

    if(cart == null) {
      localStorage.setItem("cart","[]");
    }

    this.router.navigateByUrl('/cart')
  }

  goToOrder() {
    this.router.navigateByUrl('/order')

  }

  goToShops() {
    this.router.navigateByUrl('/shops')

  }

}
