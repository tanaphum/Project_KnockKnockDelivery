declare var google: any;
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';



import { Router } from '@angular/router';
 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  // private isShow: boolean = false;
  private isCheckOut: boolean = true;
  private isWarting: boolean = true;
  private isSameShop: boolean = true;
  private isNewOrder: boolean = true;
  private seller_id;
  private buyer_id;
  private totalPrice = 0;
  private cart;
  private orderForm = {
    receiver_firstname: null,
    receiver_lastname:  null,
    receiver_location:  null,
    receiver_latitude: null,
    receiver_longitude: null,
  }
  latitude: any;
  longtitude: any;

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

      });
    console.log("Cart : ", this.cart)
    this.calculateTotalPrice();

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
    });
  }

  checkOut() {
    console.log("check out")
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

  createNewOrderRequest() {
    let data = {
      receiver_firstname: this.orderForm.receiver_firstname,
      receiver_lastname: this.orderForm.receiver_lastname,
      receiver_location: this.orderForm.receiver_location,
      receiver_latitude: this.orderForm.receiver_latitude,  
      receiver_longitude: this.orderForm.receiver_longitude,
      order_total_price: this.totalPrice,
      service_charge: "40",
      seller_id: this.seller_id,
      buyer_id: this.buyer_id
    }

    console.log("[data] ",data)


    this.orderService.createOrder(data)
    .subscribe(Response => {
      console.log("[Response] ",Response);
      this.isNewOrder = !this.isNewOrder
      alert('Create order success')
      this.deleteCart();
      
    },error => {
      console.error("error");
    })
    

  }

  isCreatedOrder() {
    this.router.navigateByUrl('/shops')
  }

  cancelOrderRequest() {
    this.isCheckOut = !this.isCheckOut
  }

  deleteCart() {
    localStorage.setItem('cart','[]');
  }

}
