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

  private keyWord = '';
  private products;
  private product_catagory;
  private shops;
  private isShow: boolean = true;
  private cart_num = 0;
  private orders_num = 0;
  private baseUrl = 'http://localhost:8000';
  private buyer_profile ={
    buyer_address:'',
    buyer_id:'',
    profile_id:'',
    profile_status:{
      profile_status_id:'',
      profile_status_name:''
    }
  }
  latitude = 18.800738;
  longtitude = 98.950392;



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
    this.setOrderNum();
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
        console.log("[Response] getAllShops: ", response.data);
        this.shops = response.data;
        this.getBuyerProfile();

      },
      error => console.log(error)
    )
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


  getOrder() {

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
    localStorage.setItem("shop",JSON.stringify(shop))

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

  openEditBuyer() {
    
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

  searchShop() {
    console.log("[Key word] ",this.keyWord);
    this.isShow = !this.isShow
    this.shops = [];
    this.SellerService.searchShopName(this.keyWord)
    .subscribe(response => {
      console.log("[response] searchShop",response);
      this.shops = response.data
      this.isShow = !this.isShow

    },error => {
      console.log("[error] searchShop",error);

    })
  }

}
