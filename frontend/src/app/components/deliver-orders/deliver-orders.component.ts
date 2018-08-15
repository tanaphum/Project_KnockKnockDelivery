declare var google: any;
import { Component, OnInit,ViewChild } from '@angular/core';
import { DeliverService } from '../../services/deliver.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-deliver-orders',
  templateUrl: './deliver-orders.component.html',
  styleUrls: ['./deliver-orders.component.css']
})
export class DeliverOrdersComponent implements OnInit {

  private baseUrl = 'http://localhost:8000';
  private haveOrder: boolean = false;
  private orders_num = 0;
  private orders = [];
  private seller = [];
  private user;
  private isEdit:boolean = false
  private orderDetail = [];
  private keyWord = '';
  private isOrder: boolean = true;
  private isShow:boolean = true;
  shop_latitude: any;
  shop_longtitude: any;
  receiver_latitude: any;
  receiver_longitude: any;
  dir = undefined;
  options = {
    suppressMarkers: true,
  };
  private user_form = {
    firstname: null,
    lastname: null,
    identity_no: null,
    telephone_number: null,
  }
  distance: any;
  private see_more = {
    order_id:'',
    recieverName: '',
    receiverLocation: '',
    shopName:'',
    shopLocation:'',
    create_at:'',
    service_charge:'',
    total_price:'',
    shop_latitude: null,
    shop_longitude: null,
    receiver_latitude: null,
    receiver_longitude: null,
    origin: {
      lat: null,
      lng: null
    },
    destination: {
      lat: null,
      lng: null
    }

  }

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
    shipper_transfer_slip_Image:null,
    selected_bank:null

  }
  private dafault_bank;
  private error = [];
  private bankAcc;
  @ViewChild("mycanvas") mycanvas;

  constructor(
    private deliverService: DeliverService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.seller = JSON.parse(localStorage.getItem('shop'))
    console.log('[this.seller] ',this.seller );
    this.shop_latitude = +this.seller["shop_latitude"];
    this.shop_longtitude = +this.seller["shop_longitude"]
    
    this.getShopOrders()
    this.getProfile();
    this.setBankAccount();
    this.setOrderNum();
    this.getUserProfile();

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
    let order;
    let id = JSON.parse(localStorage.getItem('deliver')).shipper_id
    this.deliverService.getOrderByDeliverId(id)
    .subscribe(
      response => {
        console.log("[response] setOrderNum",response.data)

        order = response.data
        order.forEach(element => {
          if(element.order_status.order_status_id != 7 && element.order_status.order_status_id != 6) {
            this.orders_num += 1;
            this.haveOrder = true
          }
        })  
        

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
      console.log("[response] getShopOrders",response)
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
        element["shop_longitude"] = +element.seller.shop_longitude;
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

  seeMore(order) {
    console.log('[See more] ',order);
    
    this.isOrder = !this.isOrder
    this.see_more = {
      order_id:order.order_id,
      recieverName: order.receiver_firstname + ' ' +order.receiver_lastname,
      receiverLocation: order.receiver_location,
      shopName:order.seller.shop_name,
      shopLocation:order.seller.shop_location,
      create_at:order.created_at,
      service_charge:order.service_charge,
      total_price:order.order_total_price,
      shop_latitude: order.direction.origin.lat,
      shop_longitude: order.direction.origin.lng,
      receiver_latitude: order.direction.destination.lat,
      receiver_longitude: order.direction.destination.lng,
      origin: {
        lat: order.direction.origin.lat,
        lng: order.direction.origin.lng
      },
      destination: {
        lat: order.direction.destination.lat,
        lng: order.direction.destination.lng
      }
    }
  }

  goBack() {
    this.isOrder = !this.isOrder
  }

  goBackDeliver() {
    this.router.navigateByUrl('/deliver')
  }

  onUpdateProfile() {
    console.log("[Update]",this.form)
    console.log("[Update]",this.user_form)
    this.error['bank_account_no'] = false;
    this.error['firstname'] = false;
    this.error['lastname'] = false;
    this.error['identity_no'] = false;
    this.error['telephone_number'] = false;
    if(this.form.bank_account_no == null) {
      this.error['bank_account_no'] = 'Please fill in bank account no.'
    }
    if(this.user_form.firstname.length == 0) {
      this.error['firstname'] = 'Please fill in first name.'
    }
    if(this.user_form.lastname.length == 0) {
      this.error['lastname'] = 'Please fill in last name.'
    }
    if(this.user_form.identity_no == null) {
      this.error['identity_no'] = 'Please fill in citizen id'
    }
    if(this.user_form.telephone_number == null) {
      this.error['telephone_number'] = 'Please fill in telephone number'
    }
    else{
      let id = this.deliver_profile.shipper_id;
      let form = {
        bank_account_id:this.form.bank_account_id,
        bank_account_no:this.form.bank_account_no,
        shipper_transfer_slip_Image:this.form.shipper_transfer_slip_Image,
        // profile_status_id:this.form.profile_status_id
      }
      this.isEdit  = !this.isEdit
      this.updateProfile().then(result => {
      this.deliverService.updateDeliver(form,id)
      .subscribe(response => {
        console.log("[Response] ",response)
        alert("This profile has been updated!!!")
        this.isEdit  = !this.isEdit
      },
      error => {
        console.log("[Error] ",error)
  
        })
      })
    }

  }


  getUserProfile() {
    let id = localStorage.getItem('user_id')
    this.authService.me()
    .subscribe(response => {
      console.log('[response] getUserProfile: ',response);
      this.user = response

      this.user_form.firstname = this.user.firstname;
      this.user_form.lastname = this.user.lastname;
      this.user_form.identity_no = this.user.identity_no;
      this.user_form.telephone_number = this.user.telephone_number;
    },error => {
      console.log('[response] getUserProfile: ',error);

    }) 
  }

  updateProfile() {
    let id = localStorage.getItem('user_id')
    return new Promise((resolve,reject) => {
      this.authService.editUser(id,this.user_form)
      .subscribe(response => {
        console.log('[response] updateProfile: ',response);
        resolve(response)
        
      }, error => {
        console.log('[error] updateProfile: ',error);
        reject(error)

  
      })
    })

  }




}
