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
  private isHolding: boolean = true;

  private isBuyer: boolean = true;
  private isSeller: boolean = true;
  private isDeliver: boolean = true;

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
    this.isHolding  = !this.isHolding;
    localStorage.setItem('adminSelect',"holdingUser")
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
    console.log("userInSystem");
    localStorage.setItem('adminSelect',"userInSystem")

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
    return new Promise(function(resolve, reject) {
      this.roles.forEach((element,index) => {
        if(this.roles.length <= index) {
          this.selectedRole = element;
          this.searchByRole()
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
        this.userInsystem['seller'].forEach((element, index) => {
          console.log("element ",element)

          let temp = {
            profile_id: element.profile_id,
            id: element.seller_id,
            name: element.shop_name,
            location: element.shop_location,
            email: element.user.email,
            status: element.profile_status.profile_status_name,
          }

          this.display_seller[index] = temp;

        });
        this.isDeliver = true;
        this.isBuyer = true;
        this.isSeller = false;
        console.log("[this.display_seller]", this.display_seller)

      }
      else if (this.selectedRole == 'Buyer') {
        this.userInsystem['buyer'].forEach((element, index) => {
          console.log("element buyer",element)

          let temp = {
            profile_id: element.profile_id,
            id: element.buyer_id,
            name: element.user.firstname,
            location: element.buyer_address,
            status: element.profile_status.profile_status_name,
            email: element.user.email,

          }

          this.display_buyer[index] = temp;

        });
        this.isDeliver = true;
        this.isBuyer = false;
        this.isSeller = true;
        console.log("[this.display_buyer]", this.display_buyer)

      }
      else if (this.selectedRole == 'Deliver') {
        this.userInsystem['deliver'].forEach((element, index) => {
          let temp = {
            id: element.shipper_id,
            profile_id: element.profile_id,
            name:element.user.firstname + '' +element.user.lastname,
            bank_account_no: element.bank_account_no,
            bank_account_name: element.bank_account.bank_account_name,
            email: element.user.email,
            status: element.profile_status.profile_status_name,
          }

          this.display_shipper[index] = temp;

        });
        this.isDeliver = false;
        this.isBuyer = true;
        this.isSeller = true;
        console.log("[this.display_shipper]", this.display_shipper)


      }
    }
    else {
      console.log("[this.isHolding false]", this.isHolding)
      if (this.selectedRole == 'Seller') {
        this.holdingUsers['seller'].forEach((element, index) => {
          let temp = {
            id: element.seller_id,
            profile_id: element.profile_id,
            name: element.shop_name,
            location: element.shop_location,
            status: element.profile_status.profile_status_name,
            email:element.user.email

          }

          this.display_seller[index] = temp;

        });
        this.isDeliver = true;
        this.isBuyer = true;
        this.isSeller = false;
        console.log("[this.display seller]", this.display_seller)

      }
      else if (this.selectedRole == 'Buyer') {
        this.holdingUsers['buyer'].forEach((element, index) => {
          console.log("element ",element)

          let temp = {
            id: element.buyer_id,
            location: element.buyer_location,
            profile_id: element.profile_id,
            status: element.profile_status.profile_status_name,
            email:element.user.email

          }

          this.display_buyer[index] = temp;

        });
        this.isDeliver = true;
        this.isBuyer = false;
        this.isSeller = true;
        console.log("[this.display_buyer]", this.display_buyer)

      }
      else if (this.selectedRole == 'Deliver') {
        this.holdingUsers['deliver'].forEach((element, index) => {
          console.log("[Selected deliver] here!!!");
          let temp = {
            id: element.shipper_id,
            bank_account_no: element.bank_account_no,
            bank_account_name: element.bank_account.bank_account_name,
            status: element.profile_status.profile_status_name,
            profile_id: element.profile_id,
            email:element.user.email
          }
          this.display_shipper[index] = temp;

        });
        this.isDeliver = false;
        this.isBuyer = true;
        this.isSeller = true;
        console.log("[this.display_shipper]", this.display_shipper)


      }

    }
  }

  onClickUpdate(user,status) {
    let state = localStorage.getItem('adminSelect');
    console.log("[user] ",user)
    console.log("[state] ",state)

    let role_id;
    let role;
    if(!this.isDeliver) {
      role_id = 4
      role = 'deliver'
    }
    else if(!this.isSeller) {
      role_id =2
      role = 'seller'

    }
    else if(!this.isBuyer) {
      role_id =3
      role = 'buyer'

    }
    let body = {
      "id": user.id,
      "role_id": role_id,
      "profile_status_id": status
    }
    console.log("[body] ",body)
    this.adminService.updateUserStatus(body)
    .subscribe(response => {
      console.log("[Response] ",response);
      if(response.message == 'Successfully') {
        if(state == 'userInSystem'){
          if(!this.isDeliver) {
            this.display_shipper.forEach(outer => {
              if(outer.seller_id = response.result.seller_id) {
                this.masterData.profile_status.forEach(inner => {
                  if(inner.profile_status_id == response.result.profile_status_id) {
                    outer.status = inner.profile_status_name
                  }
                });
              }
            });
          }
          else if(!this.isSeller) {
            this.display_seller.forEach(outer => {
              if(outer.seller_id = response.result.seller_id) {
                this.masterData.profile_status.forEach(inner => {
                  if(inner.profile_status_id == response.result.profile_status_id) {
                    outer.status = inner.profile_status_name
                  }
                });
              }
            });
          }
          else if(!this.isBuyer) {
            this.display_buyer.forEach(outer => {
              if(outer.seller_id = response.result.seller_id) {
                this.masterData.profile_status.forEach(inner => {
                  if(inner.profile_status_id == response.result.profile_status_id) {
                    outer.status = inner.profile_status_name
                  }
                });
              }
            });
          }
        }
        else if(state == 'holdingUser') {

        }
      }
    },
    error => {
      console.log("[Error] ",error);
    })

  }

  approve() {

  }

  reject() {

  }






}
