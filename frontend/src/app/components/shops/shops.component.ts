import { Component, OnInit } from '@angular/core';
import { BuyerService } from '../../services/buyer.service';
import { SellerService } from '../../services/seller.service';
import { UserService } from '../../services/user.service';



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
  private isShow: boolean = true;
  private cart_num = 0;
  private baseUrl = 'http://localhost:8000';



  private form = {
    product_name: null,
    product_description: null,
    product_price:null,
    product_id:null,
    product_image_1:null
  }

  private shop = {
    shop_name: null,
    shop_location:null,
    shop_logo_image:null,
    seller_id:null
  }


  constructor(
    private BuyerService: BuyerService,
    private SellerService: SellerService,
    private UserService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setCartNum();
    this.getAllProducts();
  }

  getAllProducts() {
    this.BuyerService.getAllProducts().subscribe(
      response => {
        console.log("getAllProducts: ", response.data);
        this.products = response.data;
        this.getAllMasterData();
      },
      error => console.log(error)
    )

  }


  getAllMasterData() {
    this.UserService.getMasterData().subscribe(
      response => {
        console.log("getAllMasterData: ", response.data.product_category);
        this.product_catagory = response.data.product_category;
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
        this.isShow = !this.isShow;    

      },
      error => console.log(error)
    )
  }

  openInfo(product){
    console.log("onClick product: ",product)
    this.form.product_name= product.product_name,
    this.form.product_description= product.product_description,
    this.form.product_price=product.product_price,
    this.form.product_id=product.product_id
    this.form.product_image_1 = product.product_image_1

  }

  openShopInfo(shop){
    console.log("onClick shop: ",shop)
    this.shop.shop_name = shop.shop_name
    this.shop.shop_location = shop.shop_location
    this.shop.shop_logo_image = shop.shop_logo_image
    this.shop.seller_id = shop.seller_id;



  }

  goToShop(shop) {
    console.log("onClick goToShop: ",shop)
    localStorage.setItem("seller_id",shop.seller_id)
    this.router.navigateByUrl('/shop')

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
    console.log("cart: ",cart);

    if(cart != null) {
          this.cart_num = cart.length;
    } 
    else if(cart == {}) {
      this.cart_num = 0;

    }

  }

  goToCart() {
    let cart = localStorage.getItem("cart");

    console.log("Cart : ",cart)

    if(cart == null) {
      localStorage.setItem("cart","[]");
    }

    this.router.navigateByUrl('/cart')


  }

  goToOrder() {
    this.router.navigateByUrl('/order')

  }

}
