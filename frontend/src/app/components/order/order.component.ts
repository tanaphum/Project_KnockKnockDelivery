declare var google: any;
import { Component, OnInit } from '@angular/core';
import { BuyerService } from '../../services/buyer.service';
import { DeliverService } from './../../services/deliver.service';
import { OrderService } from './../../services/order.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  private orders = [];
  private ordersdetail = [];
  private upload_order = {
    order_id: '', 
    order_status: {}, 
    updated_at: ''
  };
  private upload_img = null;
  private isSeeMore:boolean = false;
  private isUploadTransfer:boolean = false;
  private isOpenQRCode:boolean = false;
  private error = {
    image:null
  }
  private isEmpty:boolean = true;
  private isShow:boolean = true;
  private isBuyer:boolean = true;
  private isShipper:boolean = true;
  private imageUrl =null;
  private qrCodeImageUrl;
  private placeHolder = 'http://via.placeholder.com/250x300'
  private baseUrl = 'http://localhost:8000';
  private seeMore_form = {}
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
  constructor(
    private BuyerService: BuyerService,
    private DeliverService: DeliverService,
    private OrderService: OrderService,
    private router: Router

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
      this.isBuyer = !this.isBuyer;
    }
    else if(deliver != null) {
      this.getDeliverOrder(deliver);
      this.isShipper = !this.isShipper
    }
  }

  getBuyerOrder(buyer) {

    let id = buyer.buyer_id;
    this.BuyerService.getOrderByBuyerId(id)
    .subscribe(response => {
      console.log("[response]", response.data.length)
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


  calculateDistance(lat1, lng1, lat2, lng2) {
    const nyc = new google.maps.LatLng(lat1, lng1);
    const london = new google.maps.LatLng(lat2,lng2);
    this.distance = (google.maps.geometry.spherical.computeDistanceBetween(nyc, london)/1000)*1.609344;
  }

  getOrderDetail(id) {
    return new Promise((resolve, reject) => {
      this.OrderService.getOrderDetail(id)
      .subscribe(response => {
        console.log("[response] getOrderDetail: ",response.data);
        this.ordersdetail = response.data;
        this.ordersdetail["shop_latitude"] = +response.data["seller"].shop_latitude;
        this.ordersdetail["shop_longtitude"] = +response.data["seller"].shop_longitude;
          this.ordersdetail["direction"] = {
            origin: {
              lat: +response.data["seller"].shop_latitude,
              lng: +response.data["seller"].shop_longitude
            },
            destination: {
              lat: +response.data["receiver_latitude"],
              lng: +response.data["receiver_longitude"]
            }
          };
      
        resolve(response.data);
      }, error => {
        console.log("[error] getOrderDetail: ",error);
        reject(error)
      })
    });
    


  }

  seeMore(order) {
    this.isShow = !this.isShow
    this.seeMore_form = {}
    this.isSeeMore = !this.isSeeMore

    this.getOrderDetail(order.order_id)
    .then(result => {
      console.log("[detail] seeMore: ",result);
      this.seeMore_form = result
      this.isShow = !this.isShow


    }).catch(error => {
      console.log("[error] seeMore: ",error);
      this.isShow = !this.isShow

    })

  }

  scanQRCode(order) {
    console.log('Scan QR Code');
    localStorage.setItem('order',JSON.stringify(order))
    this.router.navigateByUrl('/scanner')
  }

  openQrCode(order) {
          this.isOpenQRCode = !this.isOpenQRCode
    console.log('[open qr code] ',order);
    this.OrderService.getDataQRcodeBuyerByOrderId(order.order_id)
    .subscribe(response => {
      console.log("[response] ",response);
      this.qrCodeImageUrl = response
      console.log('[qrCodeImageUrl] ',this.qrCodeImageUrl);
    },error => {
      console.log("[error] ",error);

    })
  }

  uploadTransfer(order) {
    this.upload_order = order;
    this.isUploadTransfer = !this.isUploadTransfer
    console.log("[upload transfer] ",order);
  }

  updateOrder() {
    console.log('this.upload_img',this.upload_img);
    
    if(this.upload_img == null ) {
      this.error.image = 'Please upload Transfer slip image.'
    }
    else {
      this.isShow = !this.isShow
      let form = new FormData();
      form.append("payment_transfer_slip",this.upload_img);
  
      this.OrderService.UploadTransferSlipByOrderId(this.upload_order.order_id,form)
      .subscribe(response => {
        // this.isShow = !this.isShow
        console.log("[upload response] ",response);
        alert('Successful, please wait for shipper to confirm')
        location.reload();
  
      },error => {
        alert("Upload image fail")
        this.isShow = !this.isShow
  
      })
  
    }


  }

  preview(file: FileList): void {
    this.upload_img = file.item(0)
    console.log("[fileUpload] ",this.upload_img);
    var reader = new FileReader();
    reader.onload = (event:any) => {
      this.imageUrl = event.target.result
    }
    reader.readAsDataURL(this.upload_img)

  }

  acceptTransfer(order) {
    this.isShow = !this.isShow
    this.OrderService.ShipperAcceptOrder(order.order_id)
    .subscribe(response => {
      console.log("[response] acceptTransfer ",response);
      alert('Transfer slip has been approve')
      this.isShow = !this.isShow
      location.reload()    
    },error => {
      console.log("[error] acceptTransfer ",error);

    })
  }

}
