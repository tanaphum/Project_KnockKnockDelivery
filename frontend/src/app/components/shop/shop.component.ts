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
    private isEmpty: boolean = true;
    private cart_num = 0;
    private seller = [];
    private seller_id;
    private form = {
        product_name: null,
        product_description: null,
        product_price: null,
        product_image_1:null
    }
    private orders_num = 0;
    private shop = [];
    private buyer_profile ={
      buyer_address:'',
      buyer_id:'',
      profile_id:'',
      profile_status:{
        profile_status_id:'',
        profile_status_name:''
      }
    }




    constructor(
        private BuyerService: BuyerService,
        private SellerService: SellerService,

        private router: Router
    ) { }

    ngOnInit() {
        this.setCartNum();
        this.setSellerID();
        this.setOrderNum();

    }

    setSellerID() {
      this.seller_id = localStorage.getItem('seller_id');
      this.getAllProduct();
      this.getShopDetail();
    }

    getAllProduct() {
      console.log("Seller id = ",this.seller_id)
      this.SellerService.getAllProducts(this.seller_id)
      .subscribe(response => {
        console.log("[Response] ",response.data);
        this.products = response.data;
        if(this.products.lenght > 0){
          this.isEmpty = !this.isEmpty
        }
        this.getBuyerProfile();

        // this.isShow = !this.seller_id
      },
      error => {
        console.log("[Error] ",error);

      })
    }

    getShopDetail() {
      this.seller = JSON.parse(localStorage.getItem('shop'))


    }

    getBuyerProfile() {
      let id = JSON.parse(localStorage.getItem('buyer')).profile_id
      this.BuyerService.getBuyerByProfileId(id).subscribe(
        Response=> {
          console.log("[Response] getBuyerProfile: ",Response.data)
          this.buyer_profile = Response.data[0]
          this.isShow = !this.isShow;    
  
        }
        ,error => {
          console.log("[Error] getBuyerProfile: ",error)
          this.isShow = !this.isShow;    
        });
  
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
      obj['seller_id'] = this.seller_id
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

  setOrderNum(){
    // let orders = JSON.parse(localStorage.getItem("orders"));
    // console.log("orders: ",orders);
    // if(orders != null) {
    //       this.orders_num = orders.length;
    // } 
    // else if(orders == {}) {
    //   this.orders_num = 0;
    // }

    let id = localStorage.getItem('buyer_id')
    this.BuyerService.getOrderByBuyerId(id)
    .subscribe(response => {
      console.log("[response] ", response)
      this.orders_num = response.data.length
      , error => {
        console.log('error',error);
      }
    })


  }


  onEditBuyer() {
    let id = localStorage.getItem('buyer_id')
    console.log("[buyer] ",this.buyer_profile)
    let temp = {
      buyer_address: this.buyer_profile.buyer_address,
      profile_status_id: 1
    }

    this.BuyerService.updateBuyer(temp,id)
    .subscribe(response => {
      console.log("[response] onEditBuyer: ",response)
    }
    ,error => {console.log("[error] onEditBuyer: ",error)})
  }

}
