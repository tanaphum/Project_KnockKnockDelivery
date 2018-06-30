import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SellerService } from '../../services/seller.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent implements OnInit {

  private create_profile_id;
  private user_id;
  private isCreateBuyer: Boolean = false;
  private isCreateSeller: Boolean = false;
  private isCreateDeliver: Boolean = false;
  isShow: boolean = false;

  sellerForm = {
    sellerName: null,
    shopName: null,
    location: null,
    type:null,
    selectedType:null,
    shopImg: null,
    profile_id: null,
    status_id:1,
  }

  private shopCatagory;

  buyerForm = {
    buyerName: null,
    location: null,
  }

  deliverForm = {
    name: null,
    email: null,
    password: null,
    password_confirmation: null
  }


  error = []



  constructor(    
    private userService: UserService,
    private sellerService: SellerService,

  ) { }

  ngOnInit() {
    this.validateCreateProfile();
  }

  validateCreateProfile() {
    this.create_profile_id = localStorage.getItem("create-profile-id");
    if (this.create_profile_id == 2) {
      this.isShow = !this.isShow;   
      this.sellerService.getShopCategories().subscribe(
        Response => {
          this.isShow = !this.isShow;   
          console.log("Response from get catagory: ",Response.data);
          this.shopCatagory = Response.data;
        },
        error => {
          console.log("[Error] from get catagory: ",error);
        }
      )
      this.isCreateSeller = !this.isCreateSeller;
    }
    else if (this.create_profile_id == 3) {
      this.isCreateBuyer = !this.isCreateBuyer;
    }
    else if (this.create_profile_id == 4) {
      this.isCreateDeliver = !this.isCreateDeliver;
    }


  }

  onSubmit() {

  }

  readImageUrl(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
  
      reader.onload = (event:any) => {
        this.sellerForm.shopImg = event.target.result;
      }
  
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  createSeller() {
    this.sellerForm.profile_id = localStorage.getItem("user_id")
    this.userService.createSeller(this.sellerForm).subscribe(
      data => {
        console.log("response from create seller",data)
      },
      error => console.log(error)
    )


  }

}
