import { Component, OnInit } from '@angular/core';
import { BuyerService } from '../../services/buyer.service';
import { DeliverService } from './../../services/deliver.service';
import { OrderService } from './../../services/order.service';
import { resolve } from 'url';



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  private orders = [];
  private isEmpty:boolean = true;
  private isShow:boolean = true;
  private seeMore_form = {}
  constructor(
    private BuyerService: BuyerService,
    private DeliverService: DeliverService,
    private OrderService: OrderService,

  ) { }

  ngOnInit() {
    this.checkFrom()
  }

  checkFrom() {
    let buyer = JSON.parse(localStorage.getItem('buyer'))
    let deliver = JSON.parse(localStorage.getItem('deliver'))
    console.log("[buyer] ",buyer);
    console.log("[deliver] ",deliver);

    if(buyer != null){
      this.getBuyerOrder(buyer);
    }
    else if(deliver != null) {
      this.getDeliverOrder(deliver);
    }
  }

  getBuyerOrder(buyer) {

    let id = buyer.buyer_id;
    this.BuyerService.getOrderByBuyerId(id)
    .subscribe(response => {
      console.log("[response] ", response.data.length)
      this.orders = response.data
      this.isShow = ! this.isShow
      if(this.orders.length>0)
      this.isEmpty = !this.isEmpty
    }, 
    error => {
      console.log('error',error);
    })
  }

  getDeliverOrder(deliver) {

    let id = deliver.shipper_id;
    this.DeliverService.getOrderByDeliverId(id)
    .subscribe(response => {
      console.log("[response] ", response.data.length)
      this.orders = response.data
      this.isShow = ! this.isShow
      if(this.orders.length>0)
      this.isEmpty = !this.isEmpty
      , error => {
        console.log('error',error);
      }
    })
  }


  getOrderDetail(id) {
    return new Promise((resolve, reject) => {
      this.OrderService.getOrderDetail(id)
      .subscribe(response => {
        console.log("[response] getOrderDetail: ",response.data);
        resolve(response.data);
      }, error => {
        console.log("[error] getOrderDetail: ",error);
        reject(error)
      })
    });
    


  }

  seeMore(order) {
    this.isShow = !this.isShow
    this.getOrderDetail(order.order_id)
    .then(result => {
      console.log("[detail] seeMore: ",result);
      this.seeMore_form = result
      this.isShow = !this.isShow

    }).catch(error => {
      console.log("[error] seeMore: ",error);

    })

  }

}
