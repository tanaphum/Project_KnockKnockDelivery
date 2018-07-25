declare var google: any;
import { Component, OnInit,ViewChild } from '@angular/core';
import { DeliverService } from '../../services/deliver.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deliver-orders',
  templateUrl: './deliver-orders.component.html',
  styleUrls: ['./deliver-orders.component.css']
})
export class DeliverOrdersComponent implements OnInit {

  private haveOrder: boolean = false;
  private orders_num = 0;
  private orders = [];
  private orderDetail = [];
  private keyWord = '';
  private isShow:boolean = true;
  shop_latitude: any;
  shop_longtitude: any;
  receiver_latitude: any;
  receiver_longitude: any;
  dir = undefined;
  options = {
    suppressMarkers: true,
  };
  distance: any;

  labelOptionShop = {
    color: '#fff',
    fontFamily: '',
    fontSize: '15px',
    fontWeight: 'bold',
    text: 'S',
    }

    labelOptionReceiver = {
      color: '#fff',
      fontFamily: '',
      fontSize: '15px',
      fontWeight: 'bold',
      text: 'R',
      }
  
  private deliver_profile;
  private isUpdate:boolean = false;
  private form = {
    bank_account_id:null,
    bank_account_no:null,
    profile_status_id:null,
    shipper_transfer_slip:null,
    selected_bank:null

  }
  private dafault_bank;
  private error;
  private bankAcc;
  @ViewChild("mycanvas") mycanvas;

  constructor(
    private deliverService: DeliverService,
    private orderService: OrderService,
    private router: Router

  ) { }

  ngOnInit() {
    this.getShopOrders()
    this.getProfile();
    this.setBankAccount();
    this.setOrderNum();
  }

  getAcceptOrder() {
    let accept_order = localStorage.getItem('accept_order');
    console.log("[Accept order] ",accept_order);
    if(accept_order != null) {

  }
}
  
  setBankAccount() {
    this.bankAcc = JSON.parse(localStorage.getItem('masterData')).bank_account;
  }

  setOrderNum(){
    
    let id = JSON.parse(localStorage.getItem('deliver')).shipper_id
    this.deliverService.getOrderByDeliverId(id)
    .subscribe(
      response => {
        console.log("[response] setOrderNum",response.data.length)
        this.orders_num = response.data.length
        if(this.orders_num != 0) {
          this.haveOrder = !this.haveOrder
        }

        this.isShow = !this.isShow

      },
      error => {
        console.log("[response] ",error)

      }
    )
  }

  getProfile() {
    let id = JSON.parse(localStorage.getItem('deliver')).profile_id
    this.deliverService.getDeliverByProfileId(id)
    .subscribe(
      response => {
        console.log("[response] ",response)
        this.deliver_profile = response.data[0]
        this.form.bank_account_id = response.data[0].bank_account.bank_account_id;
        this.form.bank_account_no = response.data[0].bank_account_no;
        this.form.profile_status_id = response.data[0].profile_status.profile_status_id;

        this.bankAcc.forEach((element, idx) => {
          if (element.bank_account_id == this.form.bank_account_id) {
            this.dafault_bank = idx + 1;
            this.form.selected_bank = idx + 1;
          }    
        });


      },
      error => {
        console.log("[response] ",error)

      }
    )
  }

  calculateDistance(lat1, lng1, lat2, lng2) {
    const nyc = new google.maps.LatLng(lat1, lng1);
    const london = new google.maps.LatLng(lat2,lng2);
    this.distance = (google.maps.geometry.spherical.computeDistanceBetween(nyc, london)/1000)*1.609344;
  }

  getShopOrders() {
    let id = localStorage.getItem('seller_order_id');
    // return new Promise(function(resolve, reject) {


    // });
    this.orderService.getOrderBySellerId(id)
    .subscribe(response => {
      console.log("[response] ",response)
      this.orders = response.data;
      // this.getOrderDetail(this.orders)

      this.orders.forEach(element => {
        element["shop_latitude"] = +element.seller.shop_latitude;
        element["shop_longtitude"] = +element.seller.shop_longitude;
        element["direction"] = {
          origin: {
            lat: +element.seller.shop_latitude,
            lng: +element.seller.shop_longitude
          },
          destination: {
            lat: +element.receiver_latitude,
            lng: +element.receiver_longitude
          }
        };
        this.calculateDistance(+element.seller.shop_latitude,+element.seller.shop_longitude,
          +element.receiver_latitude,+element.receiver_longitude);
          element["distance"] = this.distance;
          element["serviceCharge"] = this.distance;
        })


    },error => {
      console.log("[error] ",error)
    })

  }

  getOrderDetail(orders) {
    console.log("[getOrderDetail] ",orders)
    orders.forEach((element,idx) => {
      this.orderService.getOrderDetail(element.order_id)
      .subscribe(response => {
        console.log("[response] ",response )
        // element['order_total_price'] = response.data.order_total_price;
      },error => {
        console.log("[error] ",error )
      })
      console.log("[getOrderDetail] ",orders.length)
      console.log("[idx] ",idx)

      if(orders.length-1 === idx) {
        this.isShow = !this.isShow
      }

    })


  }

  acceptOrder(order) {
    let shipper_id = JSON.parse(localStorage.getItem('deliver')).shipper_id

    console.log("[Accept Order] ",order)
    this.isShow = !this.isShow
    let body = {
      order_status_id: 2,
      shipper_id:shipper_id
    }
    this.orderService.updateOrder(order.order_id,body)
    .subscribe(response => {
      console.log("[response] ",response)
      this.isShow = !this.isShow
      alert('Sucess accept this order')
      localStorage.setItem('accept_order',JSON.stringify(order))
      this.router.navigateByUrl('/deliver')
    }
    ,error => {
      console.log("[error] ",error)
      alert('Fail to accept this order')

    });
  }

  openAcceptOrder() {
    this.router.navigateByUrl('/order')

  }

  searchShop() {
    console.log("[Key word] ",this.keyWord);
    this.isShow = !this.isShow
    this.orders = [];
    this.orderService.searchSellerHaveOrders(this.keyWord)
    .subscribe(response => {
      console.log("[response] searchShop",response.data);
      this.orders = response.data

      this.orders.forEach((element,index) => {
        element["shop_latitude"] = +element.seller.shop_latitude;
        element["shop_longtitude"] = +element.seller.shop_longitude;
        element["direction"] = {
          origin: {
            lat: +element.seller.shop_latitude,
            lng: +element.seller.shop_longitude
          },
          destination: {
            lat: +element.receiver_latitude,
            lng: +element.receiver_longitude
          }
        };
        console.log('[index]',index);
        console.log('[this.orders.length]',this.orders.length);

        
        if(index == this.orders.length) {
          this.isShow = !this.isShow
        }
      })

    },error => {
      console.log("[error] searchShop",error);

    })
  }



}
