import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerService } from '../../services/seller.service';
import { AdminService } from '../../services/admin.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { BuyerService } from '../../services/buyer.service';
import { DeliverService } from '../../services/deliver.service';
import { Alert } from '../../../../node_modules/@types/selenium-webdriver';



@Component({
  selector: 'app-admin-table-data',
  templateUrl: './admin-table-data.component.html',
  styleUrls: ['./admin-table-data.component.css']
})
export class AdminTableDataComponent implements OnInit {

  @Input() _headers: Object;
  @Input() _data: Object;
  @Input() _type: String = null;

  @Output() updateUser = new EventEmitter();

  private baseUrl = 'http://localhost:8000';
  private isShow:boolean = true;
  private userInfo:boolean = false;
  private editUser:boolean = false;
  private isOrderInfo:boolean = false;
  private isOpenQRCode:boolean = false;
  private adminSelect;
  private emit_data;
  private headers;
  private data;
  private imageUrl;
  private order = {}
  private product = {}
  private status;
  private user_info;
  private update_data;
  private dafault_bank;
  private error = [];
  private bankAccount = JSON.parse(localStorage.getItem('masterData')).bank_account


  constructor(
    private modalService: NgbModal,
    private sellerService: SellerService,
    private adminService: AdminService,
    private orderService: OrderService,
    private authService: AuthService,
    private buyerService: BuyerService,
    private deliverService: DeliverService,


  ) { }

  ngOnInit() {
    console.log('[ngOnInit] ' );
    console.log('[_headers] ',this._headers);
    console.log('[_data] ',this._data);
    console.log('[_type] ',this._type );


    this.setPage();
  }

  setPage() {
    this.adminSelect = localStorage.getItem('adminSelect')
    this.headers = this._headers;
    this.data = this._data;

  }

  openOrderInfo(order) {
    this.isShow = !this.isShow
    this.getOrderDetail(order.order_id)
    .then(result => {
      console.log("[detail] seeMore: ",result);
      this.order = result
      this.isShow = !this.isShow

    }).catch(error => {
      console.log("[error] seeMore: ",error);

    })
  }

  getOrderDetail(id) {
    return new Promise((resolve, reject) => {
      this.orderService.getOrderDetail(id)
      .subscribe(response => {
        console.log("[response] getOrderDetail: ",response.data);
        resolve(response.data);
      }, error => {
        console.log("[error] getOrderDetail: ",error);
        reject(error)
      })
    });



  }

  onClickUpdate(data) {
    console.log('[onClickUpdate] admin-data-table',data.user);

    this.emit_data = { id: data.user, status: data.status}
    this.updateUser.emit(this.emit_data)

  }

  openQRCode(order) {
    this.isShow = !this.isShow
    console.log('[open qr code] ',order);
    this.orderService.getQRcodeSellerByOrderId(order.order_id)
    .subscribe(response => {
      console.log("[response] ",response);
      this.imageUrl = response
      this.isShow = !this.isShow

    },error => {
      console.log("[error] ",error);

    })
  }

  onClickInfo(user) {
    this.userInfo = !this.userInfo
    console.log('[onClickInfo] ',user);
    if(this._type==='buyer') {
      this.user_info = {
        firstname: user.user.firstname,
        lastname: user.user.lastname,
        email: user.user.email,
        telephone_number: user.user.telephone_number,
        identity_no: user.user.identity_no,
        buyer_address: user.buyer_address,
      }
    }
    else if(this._type==='seller') {
      this.user_info = {
        firstname: user.user.firstname,
        lastname: user.user.lastname,
        email: user.user.email,
        telephone_number: user.user.telephone_number,
        identity_no: user.user.identity_no,
        shop_name:user.shop_name,
        shop_location:user.shop_location,
        shop_logo_image: user.shop_logo_image

      } 
    }
    else if(this._type==='deliver') {
      this.user_info = {
        firstname: user.user.firstname,
        lastname: user.user.lastname,
        email: user.user.email,
        telephone_number: user.user.telephone_number,
        identity_no: user.user.identity_no,
        bank_account_no:user.bank_account_no,
        bank_account_name:user.bank_account.bank_account_name,
        shipper_transfer_slip: user.shipper_transfer_slip
      } 
    }

    
  }

  onClickEdit(user) {
    console.log('[onClickEdit] ',user);
    this.editUser = !this.editUser
    if(this._type === 'buyer') {
      this.user_info = {
        firstname: user.user.firstname,
        lastname: user.user.lastname,
        email: user.user.email,
        telephone_number: user.user.telephone_number,
        identity_no: user.user.identity_no,
        buyer_address:user.buyer_address,
        buyer_id: user.buyer_id,
        uid: user.user.user_id
      }
    }
    else if(this._type === 'seller') {
      this.user_info = {
        firstname: user.user.firstname,
        lastname: user.user.lastname,
        email: user.user.email,
        telephone_number: user.user.telephone_number,
        identity_no: user.user.identity_no,
        shop_name: user.shop_name,
        shop_location: user.shop_location,
        shop_latitude: user.shop_latitude,
        shop_longitude: user.shop_longitude,
        seller_id: user.seller_id,
        uid: user.user.user_id

      } 
    }
    else if(this._type === 'deliver') {
      this.user_info = {
        firstname: user.user.firstname,
        lastname: user.user.lastname,
        email: user.user.email,
        telephone_number: user.user.telephone_number,
        identity_no: user.user.identity_no,
        bank_account_no:user.bank_account_no,
        uid: user.user.user_id,
        shipper_id: user.shipper_id

      } 

      this.bankAccount.forEach((element, idx) => {
        if (element.bank_account_id == user.bank_account.bank_account_id) {
          this.user_info.bank_account_name = idx + 1;
          this.user_info.bank_account_id = user.bank_account.bank_account_id;

        }    
      });
    }

  }

  onBankSelected(event) {
    console.log("onBankSelected", event)
    this.user_info.bank_account_id = parseInt(event);
  }

  onEdit() {
   
    this.onEditRole();

  }

  onEditUser(role) {
    let data = {
      firstname: this.user_info.firstname,
      lastname: this.user_info.lastname,
      identity_no: this.user_info.identity_no,
      telephone_number: this.user_info.telephone_number,
      email: this.user_info.email,


    }
    this.authService.editUser(this.user_info.uid,data)
    .subscribe( response => {
      alert('User account information information has been edited');
      this.isShow = !this.isShow
      console.log('[response] onEditUser: ',response);
      this.updateTable(role,response)
    }, error => {
      this.isShow = !this.isShow
      console.log('[error] onEditUser: ',error);

    })
  }

  onEditRole() {
    if(this._type==='buyer') {
      this.error['buyer_address'] = false
      this.error['firstname'] = false
      this.error['lastname'] = false
      this.error['identity_no'] = false
      this.error['telephone_number'] = false
      if(this.user_info.buyer_address.length == 0) {
        this.error['buyer_address'] = 'Please fill in address.'
      }
      if(this.user_info.firstname.length == 0) {
        this.error['firstname'] = 'Please fill in first name.'
      }
      if(this.user_info.lastname.length == 0) {
        this.error['lastname'] = 'Please fill in last name.'
      }
      if(this.user_info.identity_no == null) {
        this.error['identity_no'] = 'Please fill in citizen id'
      }
      if(this.user_info.telephone_number == null) {
        this.error['telephone_number'] = 'Please fill in telephone number'
      }
      
      else if (this.user_info.buyer_address.length != 0 && this.user_info.firstname.length != 0 &&
        this.user_info.lastname.length != 0 && this.user_info.identity_no != null && this.user_info.telephone_number != null){
      
      this.isShow = !this.isShow
      let temp = {
        buyer_address: this.user_info.buyer_address,
        profile_status_id: 1
      }  

      this.buyerService.updateBuyer(temp,this.user_info.buyer_id)
      .subscribe(response => {
        console.log("[response] ",response)
        this.onEditUser(response);

      }
      ,error => {
        console.log("[error] ",error)
      })
    }
    }
    else if(this._type==='seller') {
      
      this.error['firstname'] = false
      this.error['lastname'] = false
      this.error['identity_no'] = false
      this.error['telephone_number'] = false
      this.error['shop_name'] = false;
      this.error['shop_location'] = false;
    
      if(this.user_info.firstname.length == 0) {
        this.error['firstname'] = 'Please fill in first name.'
      }
      if(this.user_info.lastname.length == 0) {
        this.error['lastname'] = 'Please fill in last name.'
      }
      if(this.user_info.identity_no == null) {
        this.error['identity_no'] = 'Please fill in citizen id'
      }
      if(this.user_info.telephone_number == null) {
        this.error['telephone_number'] = 'Please fill in telephone number'
      }
      if(this.user_info.shop_name.length == 0) {
        this.error['shop_name'] = 'Please fill in shop name'
      }
      if(this.user_info.shop_location.length == 0) {
        this.error['shop_location'] = 'Please fill in address'
      }
      
      else if (this.user_info.telephone_number != null && this.user_info.firstname.length != 0 && this.user_info.lastname.length != 0 && 
        this.user_info.identity_no != null && this.user_info.shop_name.length != 0 && this.user_info.shop_location.length != 0){

      this.isShow = !this.isShow

      let temp = {
        shop_name: this.user_info.shop_name,
        shop_location: this.user_info.shop_location,
        shop_latitude:this.user_info.shop_latitude,
        shop_longitude:this.user_info.shop_longitude,
        shop_logo_image:null,
      }
      console.log("onSubmit", temp)
      this.sellerService.updateShop(temp, this.user_info.seller_id).subscribe(
        response => {
          console.log("response onSubmit: ", response)
          alert('User account information information has been edited.')
          if(response.message == 'Successfully') {
            this.onEditUser(response);
          }
        },
        error => { 
          console.log("error onSubmit: ", error) 
          this.isShow = !this.isShow

        }
      )
    }
  
    }
    else if(this._type==='deliver') {
      console.log("[Update]")

      this.error['bank_account_no'] = false
      this.error['firstname'] = false
      this.error['lastname'] = false
      this.error['identity_no'] = false
      this.error['telephone_number'] = false
    
      if(this.user_info.firstname.length == 0) {
        this.error['firstname'] = 'Please fill in first name.'
      }
      if(this.user_info.lastname.length == 0) {
        this.error['lastname'] = 'Please fill in last name.'
      }
      if(this.user_info.identity_no == null) {
        this.error['identity_no'] = 'Please fill in citizen id'
      }
      if(this.user_info.bank_account_no == null) {
        this.error['bank_account_no'] = 'Please fill in back account number'
      }
      if(this.user_info.telephone_number == null) {
        this.error['telephone_number'] = 'Please fill in telephone number'
      }
      
      else if (this.user_info.telephone_number != null && this.user_info.firstname.length != 0 &&
        this.user_info.lastname.length != 0 && this.user_info.identity_no != null && this.user_info.bank_account_no != null){

      this.isShow = !this.isShow
      let id = this.user_info.shipper_id;
      let form = {
        bank_account_id: this.user_info.bank_account_id,
        bank_account_no: this.user_info.bank_account_no,

      }
      this.deliverService.updateDeliver(form,id)
      .subscribe(response => {
        console.log("[Response] ",response)
        this.onEditUser(response);
      },
      error => {
        console.log("[Error] ",error)
  
      })
    }
  }
  }

  updateTable(role,user) {
    console.log('[role] ',role);
    console.log('[user] ',user);

    if(this._type==='buyer') {
      this.data.forEach(element => {
        if(element.buyer_id === user.user.buyer_id) {
          element.user.firstname = user.user.firstname
          element.user.lastname = user.user.lastname
          element.buyer_address = role.result.buyer_address
          element.email = user.user.email
          element.user.telephone_number = user.user.telephone_number
          element.user.identity_no = user.user.identity_no

        }
      });
    }
    else if(this._type==='seller') {  
      this.data.forEach(element => {
          if(element.seller_id === role.result.seller_id) {
            element.shop_name = role.result.shop_name
            element.shop_location = role.result.shop_location
            element.user.email = user.user.email
            element.user.firstname = user.user.firstname
            element.user.lastname = user.user.lastname
            element.user.telephone_number = user.user.telephone_number
            element.user.identity_no = user.user.identity_no
          }
      });
    }
    else if(this._type==='deliver') {
      this.data.forEach(element => {
        if(element.shipper_id === role.result.shipper_id) {
          element.user.firstname = user.user.firstname
          element.user.lastname = user.user.lastname
          element.bank_account_no = role.result.bank_account_no
          // element.bank_account.bank_account_name = role.result.bank_account_no
          element.bank_account_id = role.result.bank_account_id
          element.user.email = user.user.email
          element.user.telephone_number = user.user.telephone_number
          element.user.identity_no = user.user.identity_no


          this.bankAccount.forEach((ele, idx) => {
            if (ele.bank_account_id == role.result.bank_account_id) {
              element.bank_account.bank_account_name = ele.bank_account_name;
            }    
          });

        }
      });
    } 
  }


  confirmFunction(data) {
    console.log('data: ',data);

    if (confirm("Confirm")) {
      console.log("You pressed OK!");
      this.onClickUpdate(data)
    } else {
      console.log("You pressed Cancel!");
    }
  }




}
