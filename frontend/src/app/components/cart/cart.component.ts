declare var google: any;
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { isNull } from '../../../../node_modules/@angular/compiler/src/output/output_ast';
 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  private baseUrl = 'http://localhost:8000';
  private isCheckOut: boolean = true;
  private isWarting: boolean = true;
  private isSameShop: boolean = true;
  private isNewOrder: boolean = true;
  private isSame: boolean = false;
  private isMoreThan: boolean = false;
  private isShow:boolean = true;
  private seller_id;
  private buyer_id;
  private sumPrice = 0;
  private serviceCharge = 0;
  private totalPrice = 0;
  private cart;
  private shop_latitude;
  private shop_longitude;
  private error = {
    receiver_firstname: null,
    receiver_lastname: null,
    receiver_location: null,
  };
  private orderForm = {
    receiver_firstname: "",
    receiver_lastname:  "",
    receiver_location:  "",
    receiver_latitude: null,
    receiver_longitude: null,
  }
  latitude: any;
  longtitude: any;
  distance: any;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private userService: UserService,

  ) {
    this.getGeoLocation();
   }

  ngOnInit() {
    this.getCart();
    this.setSellerId();
    this.setBuyerId();
    this.checkSameShop();
  }

  setSellerId() {
    this.seller_id = localStorage.getItem('seller_id')
  }

  setBuyerId() {
    let uid = localStorage.getItem('user_id')
    this.userService.getUserProfile(uid)
    .subscribe(Response => {
      console.log("[Response] ",Response)
      this.buyer_id = Response.data.buyer.buyer_id;
    },error => {
      console.log("[error] ",error)
    }
    )
  }

  getCart() {
    this.cart = JSON.parse(localStorage.getItem("cart"));
    this.cart.forEach((element,index) => {
        this.cart[index].amount =1;
        this.cart[index].master_price = element.product_price;
        this.shop_latitude = element.seller.shop_latitude;
        this.shop_longitude = element.seller.shop_longtitude;

      });
    console.log("Cart : ", this.cart)
    this.calculateTotalPrice();
    this.checkSameShop();


  }

  getGeoLocation(){
    if (navigator.geolocation) {
        var options = {
          enableHighAccuracy: true
        };

        navigator.geolocation.getCurrentPosition(position=> {
          this.latitude = position.coords.latitude;
          this.longtitude = position.coords.longitude;
          this.orderForm.receiver_latitude = position.coords.latitude;
          this.orderForm.receiver_longitude = position.coords.longitude;

          }, error => {
            console.log(error);
          }, options);
    }
  }
  onChooseLocation(event) {
    this.latitude = event.coords.lat;
    this.longtitude = event.coords.lng;
    this.orderForm.receiver_latitude = event.coords.lat;
    this.orderForm.receiver_longitude = event.coords.lng;
  }

  deleteProduct(product) {
    console.log("Delete product", product)
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].product_name == product.product_name) {
        this.cart.splice(i, 1);
        localStorage.setItem("cart", JSON.stringify(this.cart));
        this.getCart();

      }
    }

  }

  backToShop() {
    this.router.navigateByUrl('/shops')

  }

  decrease(product) {
    console.log("[Product] ",product)
    this.cart.forEach(element => {
      if(element.product_name == product.product_name) {
        element.amount -=1;
        this.calculatePrice(product)
      }
    });
  }

  increase(product) {
    console.log("[Product] ",product)
    this.cart.forEach(element => {
      if(element.product_name == product.product_name) {
        element.amount +=1;
        this.calculatePrice(product)

      }
    });
  }

  calculatePrice(product) {
    this.cart.forEach(element => {
      if(element.product_name == product.product_name) {
        element.product_price = element.master_price*element.amount
        this.calculateTotalPrice()
      }
    });
  }

  calculateTotalPrice() {
    this.totalPrice = 0;
    this.cart.forEach(element => {
      this.totalPrice += parseInt(element.product_price);
    })
    
  }

  checkOut() {
    console.log("check out",this.cart)
    this.isCheckOut = !this.isCheckOut;
  }

  cancel() {
    console.log("cancel")
    this.isCheckOut = !this.isCheckOut;
  }

  checkProduct() {
    this.cart.forEach(element => {

    });
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const nyc = new google.maps.LatLng(lat1, lng1);
    const london = new google.maps.LatLng(lat2,lng2);
    this.distance = (google.maps.geometry.spherical.computeDistanceBetween(nyc, london)/1000)*1.609344;
  }

  createNewOrderRequest() {
    this.isShow = ! this.isShow;
    let orders = localStorage.getItem('orders')
    let seller_id = localStorage.getItem('seller_id')
    let buyer_id = localStorage.getItem('buyer_id')

    let result = [];
    let temp = [];
    let data = {
      receiver_firstname: this.orderForm.receiver_firstname,
      receiver_lastname: this.orderForm.receiver_lastname,
      receiver_location: this.orderForm.receiver_location,
      receiver_latitude: this.orderForm.receiver_latitude,  
      receiver_longitude: this.orderForm.receiver_longitude,
      order_total_price: this.sumPrice,
      service_charge: this.serviceCharge,
      seller_id: seller_id,
      buyer_id: buyer_id
    }

    console.log("[data] ",data)


    this.orderService.createOrder(data)
    .subscribe(Response => {
      console.log("[Response] ",Response);
      result.push(Response.result)
      this.isNewOrder = !this.isNewOrder
      this.isShow = ! this.isShow;

      alert('Create order success')
      this.router.navigateByUrl('/shops')

      if(orders == null){
        localStorage.setItem('orders',JSON.stringify(result));
        localStorage.removeItem('cart')
      }
      else{
        temp = JSON.parse(orders)
        temp.push(result)
        localStorage.setItem('orders',JSON.stringify(temp));

      }
      this.prepareOrderDetail(Response.result);
      
    },error => {
      console.error("error");
    })
    

  }

  prepareOrderDetail(newOrder) {
    let order_id = newOrder.order_id
    let body = [];
    this.cart.forEach((element,idx) => {
      body.push({
        order_id: order_id,
        product_id: element.product_id,
        unit_of_product:element.amount
      })
      if(idx === this.cart.length-1) {
        this.createNewOrderDetailRequest(body)
      }
    });
  }

  createNewOrderDetailRequest(body) {
    console.log('[init] createNewOrderDetailRequest: ',body);

    this.orderService.createOrderDetail(body)
    .subscribe(response => {
      console.log('[response] ',response);
      this.deleteCart();

    },error => {
      console.log('[error] ',error);
      alert(error.message)
      this.isShow = !this.isShow

    })
  }

  isCreatedOrder() {
    console.log('[isCreatedOrder] ',this.orderForm);

    this.error.receiver_firstname = false
    this.error.receiver_lastname = false
    this.error.receiver_location = false
    if(this.orderForm.receiver_firstname.length == 0 ) {
      this.error.receiver_firstname = 'Please input receiver firstname.'
    }
    if(this.orderForm.receiver_lastname.length == 0 ) {
      this.error.receiver_lastname = 'Please input receiver lastname.'
    }    
    if(this.orderForm.receiver_location.length == 0 ) {
      this.error.receiver_location = 'Please input receiver location.'
    }
    if(this.error.receiver_firstname == false && this.error.receiver_lastname == false && this.error.receiver_location == false) {
      this.isNewOrder = !this.isNewOrder
      this.calculateDistance(this.shop_latitude,this.shop_longitude,
      +this.orderForm.receiver_latitude,+this.orderForm.receiver_longitude);
        if(this.distance > 8 && this.distance <= 40){
          this.serviceCharge = Math.round(25+((this.distance-1)*14))
        }else if (this.distance > 5 && this.distance <= 8){
          this.serviceCharge = Math.round(25+((this.distance-1)*11))
        }
        else if (this.distance > 1 && this.distance <= 5){
          this.serviceCharge = Math.round(25+((this.distance-1)*8))
        }
        else{
          this.serviceCharge = 25;
        }
      this.sumPrice = this.totalPrice + this.serviceCharge;
    }
    console.log('[error] ',this.error)


  }

  cancelOrderRequest() {
    this.isNewOrder = !this.isNewOrder
    this.isCheckOut = !this.isCheckOut
  }

  deleteCart() {
    localStorage.setItem('cart','[]');
  }

  checkSameShop() {
    for(let i=1;i<=this.cart.length ; i++) {
      // console.log("seller.seller_id - 1",this.cart[i-1].seller.seller_id)
      // console.log("seller.seller_id",this.cart[i].seller.seller_id)
      if(this.cart[i-1].seller.seller_id != this.cart[i].seller.seller_id) {
        this.isSame = !this.isSame;
      }
    }
  }

}
