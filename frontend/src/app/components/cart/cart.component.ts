import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  private isShow: boolean = false;
  private cart;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.getCart();
  }

  getCart() {
    this.cart = JSON.parse(localStorage.getItem("cart"));
    console.log("Cart : ", this.cart)

  }

  deleteProduct(product) {
    console.log("Delete product", product)
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].product_name == product.product_name) {
        this.cart.splice(i, 1);
        localStorage.setItem("cart",JSON.stringify(this.cart));
        this.getCart();
      }
    }

  }

  backToShop() {
    this.router.navigateByUrl('/shops')

  }

  decrease(product) {

  }

  increase(product) {

  }

  calculatePrice(product) {

  }

}
