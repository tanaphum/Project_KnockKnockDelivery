import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  private orders = [];
  constructor() { }

  ngOnInit() {
    this.getOrder()
  }

  getOrder() {
    this.orders = JSON.parse(localStorage.getItem('orders'));
    console.log("[orders] ",this.orders)
  }

}
