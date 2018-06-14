import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private validSeller: Boolean;
  private validBuyer: Boolean;
  private validDeliver: Boolean;
  private isShow: Boolean;

  private isSellerProfile: Boolean;
  private isBuyerProfile: Boolean;
  private isDeliverProfile: Boolean;

  private userProfile;
  private sellerProfile;
  private buyerProfile;
  private deliverProfile;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.isShow = false;
    this.validSeller = false;
    this.validBuyer = false;
    this.validDeliver = false;
    this.isSellerProfile = false;
    this.isBuyerProfile = false;
    this.isDeliverProfile = false;
    this.getUserProfile();
  }

  async getUserProfile() {
    var id = localStorage.getItem("user_id");
    this.userService.getUserProfile(id).subscribe(
      data => {
        this.userProfile = data;
        if (this.userProfile.data != undefined) {
          console.log("this.userProfile", this.userProfile.data);
          this.userProfile.data.forEach(async profile => {
            if (profile.role.role_id == 2) {
              this.sellerProfile = await this.fetchProfileDetail(profile);
              console.log("sellerProfile: ", this.sellerProfile);
              this.validSeller = true;
              // this.isShow = true;
            } else if (profile.role.role_id == 3) {
              this.buyerProfile = await this.fetchProfileDetail(profile);
              console.log("buyerProfile: ", this.buyerProfile);
              this.validBuyer = true;
              // this.isShow = true;
            } else if (profile.role.role_id == 4) {
              this.deliverProfile = await this.fetchProfileDetail(profile);
              console.log("deliverProfile: ", this.deliverProfile);
              this.validDeliver = true;
              // this.isShow = true;
            }
          });
          this.isShow = true;
        }
      },
      error => console.log(error)
    );
  }

  createProfile(id) {
    console.log("createProfile", id);
    localStorage.setItem("create-profile-id", id);
    this.router.navigateByUrl("/create-profile");
  }

  async fetchProfileDetail(profile) {
    return await this.userService.fetchProfileDetail(profile);
  }

  enterManageShop(sellerProfile) {
    console.log("enterManageShop");
    localStorage.setItem("seller", JSON.stringify(sellerProfile));
    this.router.navigateByUrl("/manage-shop");
  }
}
