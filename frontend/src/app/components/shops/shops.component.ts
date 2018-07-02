import { Component, OnInit } from '@angular/core';
import { BuyerService } from '../../services/buyer.service';
import { SellerService } from '../../services/seller.service';

import { Router } from '@angular/router';




@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {

  private products;
  private product_catagory;
  private shops;
  private isShow: boolean = false;
  private cart_num = 0;


  private form = {
    product_name: null,
    product_description: null,
    product_price:null
  }

  private shop = {
    shop_name: null,
    shop_type: null,
    shop_location:null
  }


  constructor(
    private BuyerService: BuyerService,
    private SellerService: SellerService,

    private router: Router
  ) { }

  ngOnInit() {
    this.getAllProducts();
    this.setCartNum();

  }

  getAllProducts() {
    this.BuyerService.getAllProducts().subscribe(
      response => {
        console.log("getAllProducts: ", response.data);
        this.products = response.data;
        this.getProductCatagory();
      },
      error => console.log(error)
    )

  }

  getProductCatagory() {
    this.BuyerService.getProductCategories().subscribe(
      response => {
        console.log("getProductCatagory: ", response.data);
        this.product_catagory = response.data;
        this.getAllShops();
      },
      error => console.log(error)
    )


  }


  getAllShops() {
    this.SellerService.getAllShops().subscribe(
      response => {
        console.log("getAllShops: ", response.data);
        this.shops = response.data;
        // this.isShow = !this.isShow;    

      },
      error => console.log(error)
    )
  }

  openInfo(product){
    console.log("onClick product: ",product)
    this.form.product_name= product.product_name,
    this.form.product_description= product.product_description,
    this.form.product_price=product.product_price
  }

  openShopInfo(shop){
    console.log("onClick shop: ",shop)
    this.shop.shop_name = shop.shop_name,
    this.shop.shop_type = shop.shop_type.shop_type_name,
    this.shop.shop_location = shop.shop_location
  }

  goToShop(shop) {
    console.log("onClick goToShop: ",shop)

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

  setCartNum(){
    let cart = JSON.parse(localStorage.getItem("cart"));
    console.log("Cart lenght: ",cart.length)
    this.cart_num = cart.length;

  }

  goToCart() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    console.log("Cart : ",cart)
    this.router.navigateByUrl('/cart')


  }

}
