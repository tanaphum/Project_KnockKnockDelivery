declare var google: any;
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
  private isShow: boolean = true;
  private bankAcc;
  private imageUrl = null;
  private imageUrlTransfer = null;
  latitude: any;
  longtitude: any;
  dir = undefined;
  options = {
    suppressMarkers: true,
  };

  sellerForm = {
    shop_name: null,
    shop_location: null,
    shop_type_id:null,
    user_id:null,
    shop_logo_image: null,
    shop_latitude:null,
    shop_longitude:null
  }

  form = {
    shop_name: '_',
    shop_location: 'Chiang Mai',
    shop_latitude: '134.343',
    shop_longitude: '34.4234234',
    shop_type_id: '1',
    user_id: '3',
    shop_logo_image: undefined
  }

  private shopCatagory;

  buyerForm = {
    buyerName: null,
    buyer_location: null,
    user_id:null
  }

  deliverForm = {
    name: null,
    email: null,
    password: null,
    password_confirmation: null,
    user_id:null,
    bank_account_id:null,
    shipper_transfer_slip_Image: null,
    bank_account_no: null
  }


  error = []



  constructor(
    private userService: UserService,
    private sellerService: SellerService,
    private router: Router,
  ) {
    this.getGeoLocation();
    this.setBankAccount();
   }

  ngOnInit() {
    this.fetchMasterType();
  }


  getGeoLocation(){
    if (navigator.geolocation) {
        var options = {
          enableHighAccuracy: true
        };

        navigator.geolocation.getCurrentPosition(position=> {
          this.latitude = position.coords.latitude;
          this.longtitude = position.coords.longitude;
          this.sellerForm.shop_latitude = position.coords.latitude;
          this.sellerForm.shop_longitude = position.coords.longitude;

          }, error => {
            console.log(error);
          }, options);
    }
  }

  onChooseLocation(event) {
    this.latitude = event.coords.lat;
    this.longtitude = event.coords.lng;
    this.sellerForm.shop_latitude = event.coords.lat;
    this.sellerForm.shop_longitude = event.coords.lng;
  }

  validateCreateProfile() {
    this.create_profile_id = localStorage.getItem("create-profile-id");
    if (this.create_profile_id == 2) {
      this.isShow = !this.isShow;
      // this.sellerService.getShopCategories().subscribe(
      //   Response => {
      //     this.isShow = !this.isShow;
      //     console.log("Response from get catagory: ",Response.data);
      //     this.shopCatagory = Response.data;
      //   },
      //   error => {
      //     console.log("[Error] from get catagory: ",error);
      //   }
      // )
      this.isCreateSeller = !this.isCreateSeller;
    }
    else if (this.create_profile_id == 3) {
      this.isCreateBuyer = !this.isCreateBuyer;
      this.isShow = !this.isShow;

    }
    else if (this.create_profile_id == 4) {
      this.isCreateDeliver = !this.isCreateDeliver;
      this.isShow = !this.isShow;

    }


  }

  fetchMasterType(){
    this.userService.getMasterData().subscribe(
      Response => {
        console.log("[Response] ",Response)
        this.shopCatagory = Response.data.shop_type;
        this.validateCreateProfile();


      },
      error => console.log("[Error] ",error)
    )
  }

  onSubmit() {

  }

  preview(file: FileList): void {
    this.sellerForm.shop_logo_image = file.item(0)
    console.log("[fileUpload] ",this.sellerForm.shop_logo_image);
    var reader = new FileReader();
    reader.onload = (event:any) => {
      this.imageUrl = event.target.result
    }
    reader.readAsDataURL(this.sellerForm.shop_logo_image)
  }

  previewShipperTransferImage(file: FileList): void {
    this.deliverForm.shipper_transfer_slip_Image = file.item(0)
    console.log("[fileUpload] ",this.deliverForm.shipper_transfer_slip_Image);
    var reader = new FileReader();
    reader.onload = (event:any) => {
      this.imageUrlTransfer = event.target.result
    }
    reader.readAsDataURL(this.deliverForm.shipper_transfer_slip_Image)
  }

  onCatagorySelected(event) {
    console.log("onCatagorySelected", event)
    this.sellerForm.shop_type_id = parseInt(event);
  }

  createSeller() {
    this.error['shopName'] = false
    this.error['shop_location'] = false
    this.error['shop_logo_image'] = false

    console.log("[This Seller] ", this.sellerForm)
    if(this.sellerForm.shop_name == null ) {
      this.error['shopName'] = 'Please fill in shop name.'
    }
    if(this.sellerForm.shop_location == null ) {
      this.error['shop_location'] = 'Please fill in shop location.'
    }
    if(this.sellerForm.shop_logo_image == null ) {
      this.error['shop_logo_image'] = 'Please fill in shop location.'
    }
    else{
      let temp = this.sellerForm;
      this.isShow = !this.isShow
      temp.user_id = localStorage.getItem("user_id")
      console.log("[Temp body] ",temp);
      // this.sellerForm.user_id = localStorage.getItem("user_id")
      this.userService.createSeller(temp).subscribe(
        data => {
          console.log("response from create seller", data);
          alert("Create seller success!!!");
  
          this.router.navigateByUrl('/profile')
  
        },
        error => {
          console.log(error)
          this.isShow = !this.isShow
          alert(error.error.message);
        }
      )
    }
  }

  onBankSelected(event) {
    console.log("onBankSelected", event)
    this.deliverForm.bank_account_id = parseInt(event);
  }
  createDeliver() {
    console.log("[This deliver] ", this.deliverForm)

    if(this.deliverForm.bank_account_no == null) {
      this.error['bank_account_no'] = 'Please fill in bank account number'
    }
    if(this.deliverForm.bank_account_id == null) {
      this.error['dafault_bank'] = 'Please select bank.'
    }
    if(this.deliverForm.shipper_transfer_slip_Image == null) {
      this.error['shipper_transfer_slip_Image'] = 'Please upload Transfer slip’s image.'
    }
    else{ 
      this.isShow = !this.isShow
      this.deliverForm.user_id = localStorage.getItem("user_id")
      this.userService.createDeliver(this.deliverForm).subscribe(
        data => {
          console.log("response from create deliver", data)
          this.isShow = !this.isShow
          alert("Create deliver success!!!");
          this.router.navigateByUrl('/profile')
    },
      error => {
        console.log(error)
        this.isShow = !this.isShow
        alert(error.error.message);
      })
    }

  }

  createBuyer() {
    console.log("[This Buyer] ", this.buyerForm)

    if(this.buyerForm.buyer_location == null) {
      this.error['buyer_location'] = 'Please fill in address.'
    }
    else {
      let temp = this.buyerForm;
      this.isShow = !this.isShow
  
      temp.user_id = localStorage.getItem("user_id")
      this.userService.createBuyer(temp).subscribe(
        data => {
          console.log("response from create buyer", data)
          alert("Create buyer success!!!");
          this.isShow = !this.isShow
          this.router.navigateByUrl('/profile')
        },
        error => {
          console.log(error)
          this.isShow = !this.isShow
          alert(error.error.message);
        })
    }

  }

  setBankAccount () {
    this.bankAcc = JSON.parse(localStorage.getItem('masterData')).bank_account
  }



}
