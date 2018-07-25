import { masterData } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private isLoad: boolean = true;
  private isMenu: boolean = false;
  private isHolding: boolean = false;
  private isUserIn: boolean = false;
  private isHistory: boolean = false;

  private isBuyer: boolean = true;
  private isSeller: boolean = true;
  private isDeliver: boolean = true;
  private ready: boolean = false;

  private roles: string[];
  private selectedRole: string;
  private holdingUsers = [];
  private userInsystem = [];
  private user = [];
  private display_users = [];
  private display_seller = [];
  private display_buyer = [];
  private display_shipper = [];

  private selected_user;
  private masterData;
  private type;

  private headers_history = [{
    order_id: 'Order id',
    order_status: {
      order_status_id: 'Order status id',
      order_status_name: 'Order status'
    },
    updated_at: 'Updated at'
  }]

  private headers_seller = [{
    ID: 'ID',
    Shop_Name: 'Shop Name',
    Location: 'Location',
    Email: 'Email',
    Status: 'Status',
  }]

  private headers_buyer = [{
    ID: 'ID',
    Name: 'Name',
    Address: 'Address',
    Email: 'Email',
    Status: 'Status',
  }]

  private headers_deliver = [{
    ID: 'ID',
    Name: 'Name',
    Bank_Account_No: 'Bank Account No',
    Bank_Account_Name: 'Bank Account Name',
    Email: 'Email',
    Status: 'Status',
  }]

  private _data = [];
  private data_holding = [];
  private data_inSystem = [];


  dtOptions: DataTables.Settings = {};

  constructor(
    private adminService: AdminService,
  ) {
    this.roles = ["Buyer", "Seller", "Deliver"]
  }

  ngOnInit() {
    // this.isLoad = !this.isLoad;
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.setMasterData()
  }


  setMasterData() {
    this.masterData = JSON.parse(localStorage.getItem('masterData'));

  }



  holdingUser() {
    this.isMenu = !this.isMenu;
    this.isLoad = !this.isLoad;
    this.isHolding = !this.isHolding;
    localStorage.setItem('adminSelect', "holdingUser")
    console.log("holdingUser");
    this.adminService.getAllHoldingUser(2).subscribe(
      response => {
        // console.log("[Response 2]: ", response.data);
        this.holdingUsers['seller'] = response.data;
        this.adminService.getAllHoldingUser(3).subscribe(
          response => {
            // console.log("[Response 3]: ", response.data);
            this.holdingUsers['buyer'] = response.data;
            this.adminService.getAllHoldingUser(4).subscribe(
              response => {
                // console.log("[Response 4]: ", response.data);
                this.holdingUsers['deliver'] = response.data;
                console.log("[this.holdingUsers] ", this.holdingUsers)

                this.isLoad = !this.isLoad;

              },
              error => {
                console.log("[Error]", error)
              }
            )
          },
          error => {
            console.log("[Error]", error)
          }
        )
      },
      error => {
        console.log("[Error]", error)
      }
    )



  }



  userInSystem() {
    this.isMenu = !this.isMenu;
    this.isLoad = !this.isLoad;
    this.isUserIn = !this.isUserIn;
    console.log("userInSystem");
    localStorage.setItem('adminSelect', "userInSystem")

    this.adminService.getAllUserInSystem(2).subscribe(
      response => {
        // console.log("[Response 2]: ", response.data);
        this.userInsystem['seller'] = response.data;
        this.adminService.getAllUserInSystem(3).subscribe(
          response => {
            // console.log("[Response 3]: ", response.data);
            this.userInsystem['buyer'] = response.data;
            this.adminService.getAllUserInSystem(4).subscribe(
              response => {
                // console.log("[Response 4]: ", response.data);
                this.userInsystem['deliver'] = response.data;
                console.log("[this.userInSystem] ", this.holdingUsers)
                this.isLoad = !this.isLoad;


              },
              error => {
                console.log("[Error]", error)
              }
            )
          },
          error => {
            console.log("[Error]", error)
          }
        )
      },
      error => {
        console.log("[Error]", error)
      }
    )
  }

  setUpPage() {
    return new Promise(function (resolve, reject) {
      this.roles.forEach((element, index) => {
        if (this.roles.length <= index) {
          this.selectedRole = element;
          // this.searchByRole()
        }
        else {
          resolve
        }

      });
    });

  }



  onRoleSelected(role) {
    console.log("onBankSelected", role)
    this.selectedRole = role;
  }


  searchByRole() {
    console.log("[selectedRole] ", this.selectedRole);
    this.display_users = [];
    if (this.isHolding) {
      console.log("[this.isHolding true]", this.isHolding)

      if (this.selectedRole == 'Seller') {
        // this.userInsystem['seller'].forEach((element, index) => {
        //   console.log("element ",element)

        //   let temp = {
        //     profile_id: element.profile_id,
        //     id: element.seller_id,
        //     name: element.shop_name,
        //     location: element.shop_location,
        //     email: element.user.email,
        //     status: element.profile_status.profile_status_name,
        //   }

        //   this.display_seller[index] = temp;

        // });
        this.isDeliver = true;
        this.isBuyer = true;
        this.isSeller = false;
        this.type = 'seller'

      }
      else if (this.selectedRole == 'Buyer') {
        // this.userInsystem['buyer'].forEach((element, index) => {
        //   console.log("element buyer",element)

        //   let temp = {
        //     profile_id: element.profile_id,
        //     id: element.buyer_id,
        //     name: element.user.firstname,
        //     location: element.buyer_address,
        //     status: element.profile_status.profile_status_name,
        //     email: element.user.email,

        //   }

        //   this.display_buyer[index] = temp;

        // });
        this.isDeliver = true;
        this.isBuyer = false;
        this.isSeller = true;
        this.type = 'buyer'

        console.log("[this.display_buyer]", this.display_buyer)

      }
      else if (this.selectedRole == 'Deliver') {
        // this.userInsystem['deliver'].forEach((element, index) => {
        //   let temp = {
        //     id: element.shipper_id,
        //     profile_id: element.profile_id,
        //     name:element.user.firstname + '' +element.user.lastname,
        //     bank_account_no: element.bank_account_no,
        //     bank_account_name: element.bank_account.bank_account_name,
        //     email: element.user.email,
        //     status: element.profile_status.profile_status_name,
        //   }

        //   this.display_shipper[index] = temp;

        // });
        this.isBuyer = true;
        this.isSeller = true;
        this.type = 'deliver'
        this.isDeliver = false;


        console.log("[this.display_shipper]", this.display_shipper)


      }
    }
    else {
      console.log("[this.isHolding false]", this.isHolding)
      if (this.selectedRole == 'Seller') {
        // this.holdingUsers['seller'].forEach((element, index) => {
        //   let temp = {
        //     id: element.seller_id,
        //     profile_id: element.profile_id,
        //     name: element.shop_name,
        //     location: element.shop_location,
        //     status: element.profile_status.profile_status_name,
        //     email:element.user.email

        //   }

        //   this.display_seller[index] = temp;

        // });
        this.isDeliver = true;
        this.isBuyer = true;
        this.isSeller = false;
        this.type = 'seller'

        console.log("[this.display seller]", this.display_seller)

      }
      else if (this.selectedRole == 'Buyer') {
        // this.holdingUsers['buyer'].forEach((element, index) => {
        //   console.log("element ",element)

        //   let temp = {
        //     id: element.buyer_id,
        //     address: element.buyer_address,
        //     profile_id: element.profile_id,
        //     status: element.profile_status.profile_status_name,
        //     email:element.user.email,
        //     name:element.user.firstname
        //   }

        //   this.display_buyer[index] = temp;

        // });
        this.isDeliver = true;
        this.isBuyer = false;
        this.isSeller = true;
        this.type = 'buyer'

        console.log("[this.display_buyer]", this.display_buyer)

      }
      else if (this.selectedRole == 'Deliver') {
        // this.holdingUsers['deliver'].forEach((element, index) => {
        //   console.log("[Selected deliver] here!!!");
        //   let temp = {
        //     id: element.shipper_id,
        //     bank_account_no: element.bank_account_no,
        //     bank_account_name: element.bank_account.bank_account_name,
        //     status: element.status,
        //     profile_id: element.profile_id,
        //     email:element.user.email,
        //     name:element.user.firstname
        //   }
        //   this.display_shipper[index] = temp;

        // });
        this.isDeliver = false;
        this.isBuyer = true;
        this.isSeller = true;
        this.type = 'deliver'

        console.log("[this.display_shipper]", this.display_shipper)


      }

    }
  }

  onClickUpdate(data) {
    console.log("[onClickUpdate] admin",data);
    
    this.isLoad = !this.isLoad;

    let role_id;
    let role;
    if (!this.isDeliver) {
      role_id = 4
      role = 'deliver'
    }
    else if (!this.isSeller) {
      role_id = 2
      role = 'seller'

    }
    else if (!this.isBuyer) {
      role_id = 3
      role = 'buyer'

    }
    let body = {
      "id": data.id,
      "role_id": role_id,
      "profile_status_id": data.status
    }
    console.log("[body] ", body)
    this.adminService.updateUserStatus(body)
      .subscribe(response => {
        console.log("[Response] ", response);
          this.isLoad = !this.isLoad;
          let status = this.checkUpdateResult(response)
          .then(result => {
            console.log("[status name] : ",result);
            alert("This profile has been "+result)
            location.reload();
          }).catch(error => {
            console.log('[error] ',error);
          })

        
      },
        error => {
          console.log("[Error] ", error);
        })

  }

  checkUpdateResult(response) {
    let status = response.result.profile_status_id
    return new Promise((resolve,reject) => {
      this.masterData.profile_status.forEach(element => {
          if(element.profile_status_id === status) {
            return resolve(element.profile_status_name);
          }
      });
    });

  }

  approve() {

  }

  reject() {

  }


  OrderHistory() {
    this.isMenu = !this.isMenu;
    this.setOrderHistory();

  }

  setOrderHistory() {
    this.isHistory = !this.isHistory;
    this.isLoad = !this.isLoad;
    this.adminService.getAllOrderHistory()
      .subscribe(response => {
        console.log("[response] ", response.data);
        this._data = response.data
        this.type = 'history'
        this.ready = !this.ready
        this.isLoad = !this.isLoad;

        // this.setHoldingUSer();

      }, error => {
        console.log("[error] ", error);

      })
  }

  setUserInsystem() {
    this.isLoad = !this.isLoad;
    this.adminService.getAllOrderHistory()
      .subscribe(response => {
        console.log("[response] ", response.data);
        this._data = response.data
        this.ready = !this.ready
        this.isLoad = !this.isLoad;
      }, error => {
        console.log("[error] ", error);

      })
  }

  setHoldingUSer() {
    this.adminService.getAllHoldingUser(2).subscribe(
      response => {
        this.holdingUsers['seller'] = response.data;
        this.adminService.getAllHoldingUser(3).subscribe(
          response => {
            this.holdingUsers['buyer'] = response.data;
            this.display_buyer = response.data
            this.adminService.getAllHoldingUser(4).subscribe(
              response => {
                this.holdingUsers['deliver'] = response.data;
                console.log("[this.holdingUsers] ", this.holdingUsers)
                this._data = response.data

                this.isLoad = !this.isLoad;

              },
              error => {
                console.log("[Error]", error)
              }
            )
          },
          error => {
            console.log("[Error]", error)
          }
        )
      },
      error => {
        console.log("[Error]", error)
      }
    )
  }






}
