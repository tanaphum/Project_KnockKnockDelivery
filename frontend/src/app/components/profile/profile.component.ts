import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private validSeller: Boolean= true;
  private validBuyer: Boolean= true;
  private validDeliver: Boolean= true;

  private isSellerApprove: Boolean= true;
  private isBuyerApprove: Boolean= true;
  private isDeliverApprove: Boolean= true;
  
  private isAdmin:Boolean = false;
  private isShow: Boolean= false;

  private isSellerProfile: Boolean= true;
  private isBuyerProfile: Boolean= true;
  private isDeliverProfile: Boolean= true;

  private adminProfile;
  private userProfile;
  private sellerProfile;
  private buyerProfile;
  private deliverProfile;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService:AuthService
  ) { }

  ngOnInit() {
    this.getMasterData();

  }


  getUserProfile() {
    var id = localStorage.getItem('user_id');

    this.userService.getUserProfile(id).subscribe(
          response => {
            console.log("[Response] ",response.data)
              let seller = response.data.seller;
              let buyer = response.data.buyer;
              let shipper = response.data.shipper;
              let admin = response.data.admin;

              // console.log("[length] ",Object.keys(seller).length

              if(admin != null) {
                this.adminProfile =  response.data;
                this.isAdmin = !this.isAdmin;
              }          
              if(seller  != null) {
                console.log("[Response seller] ",response.data.seller)
                this.sellerProfile = response.data.seller
                this.validSeller = !this.validSeller;
                if(this.sellerProfile.profile_status_id == 1) {
                  this.isSellerApprove = !this.isSellerApprove
                }
              }
              if(buyer != null) {
                console.log("[Response buyer] ",response.data.buyer)

                this.buyerProfile = response.data.buyer
                this.validBuyer = !this.validBuyer;
                if(this.buyerProfile.profile_status_id == 1) {
                  this.isBuyerApprove = !this.isBuyerApprove
                }
              }
              if(shipper != null ) {
                console.log("[Response shipper] ",response.data.shipper)

                this.deliverProfile = response.data.shipper
                this.validDeliver = !this.validDeliver;
                if(this.deliverProfile.profile_status_id == 1) {
                  this.isDeliverApprove = !this.isDeliverApprove
                }
              }
             
            
            this.isShow = true;

          },
          error => {
            console.log("[Error] ",error)
          });
  }

  // async getUserProfile() {
  //   var id = localStorage.getItem('user_id');
  //   this.userService.getUserProfile(id).subscribe(
  //     data => {
  //       this.userProfile = data;
  //       if (this.userProfile.data.length != 0) {
  //         console.log("this.userProfile", this.userProfile.data);

  //         this.userProfile.data.forEach(async (profile,idx) => {
  //           console.log("idx: ",idx);
  //           console.log("this.userProfile: ",this.userProfile.data.length)
  //           if(profile.role.role_id == 1) {
  //             // this.adminProfile = await this.fetchProfileDetail(profile);
  //             this.isAdmin = !this.isAdmin;
  //           }
  //           if (profile.role.role_id == 2) {
  //             this.sellerProfile = await this.fetchProfileDetail(profile)
  //             console.log("sellerProfile: ", this.sellerProfile)
  //             this.validSeller = true;
  //           }
  //           if (profile.role.role_id == 3) {
  //             this.buyerProfile = await this.fetchProfileDetail(profile)
  //             console.log("buyerProfile: ", this.buyerProfile)
  //             this.validBuyer = true;
  //           }
  //           if (profile.role.role_id == 4) {
  //             this.deliverProfile = await this.fetchProfileDetail(profile)
  //             console.log("deliverProfile: ", this.deliverProfile)
  //             this.validDeliver = true;
  //           }
  //           if ((idx+1) == this.userProfile.data.length) {
  //             this.callback();
  //           }        
  //         })
  //       }
  //       else{
  //         console.log("Empty profile")
  //         this.isShow = true;
  //       }
  //     },
  //     error => console.log(error)
  //   )
  // }

  callback() {
    this.isShow = true;
  }

  getMasterData() {
    this.userService.getMasterData()
    .subscribe(
      Response => {
        localStorage.setItem('masterData', JSON.stringify(Response.data));
        this.getUserProfile();

      },
      error => {
        console.error("[Error] ",error)
        if(error.status == 401) {
          this.authService.removeToken();
          this.router.navigateByUrl('/login')

        }
    })
  }

  editBuyer() {
    console.log("Edit buyer")
  }

  createProfile(id) {
    console.log("createProfile", id);
    localStorage.setItem("create-profile-id", id);
    this.router.navigateByUrl('/create-profile')

  }

  async fetchProfileDetail(profile) {
    return this.userService.fetchProfileDetail(profile)

  }

  enterManageShop(sellerProfile) {
    console.log('enterManageShop')
    localStorage.setItem("seller",JSON.stringify(sellerProfile));
    localStorage.setItem("seller_id",JSON.stringify(sellerProfile.seller_id));

    this.router.navigateByUrl('/manage-shop')
  }

  enterShops() {
    this.router.navigateByUrl('/shops')

  }

  enterDeliver() {
    localStorage.setItem('seller_id',this.deliverProfile.profile_id)
    this.router.navigateByUrl('/deliver')
  }







}
