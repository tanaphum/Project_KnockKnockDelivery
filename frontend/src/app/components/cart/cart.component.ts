import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  // private isShow: boolean = false;
  private isCheckOut: boolean = true;
  private isWating: boolean = true;
  private isCreateOrder: boolean = true;

  private amount_price =0;
  private cart;

  private order = {
    location:null,
  }

  private error;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.getCart();
  }

  getCart() {
    this.cart = JSON.parse(localStorage.getItem("cart"));
    this.cart.forEach((element,index) => {
        this.cart[index].amount =1;
        this.cart[index].master_price = element.product_price;

      });
      this.amountPrice();

    console.log("Cart : ", this.cart)
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

      }
      this.amountPrice();

    });
  }

  amountPrice(){
    this.amount_price =0;
    this.cart.forEach(element => {
          
      this.amount_price += parseInt(element.product_price)


    });

  }

  createReq() {
    console.log("createReq")
    this.isCreateOrder = !this.isCreateOrder
  }

  checkOut() {
    console.log("check out")
    //call api to create order and remove cart here!!!
    this.isCheckOut = !this.isCheckOut;
  }

  cancel() {
    console.log("cancel")
    this.isCheckOut = !this.isCheckOut;
  }

}
