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
    location: null,
    user_id:null
  }

  deliverForm = {
    name: null,
    email: null,
    password: null,
    password_confirmation: null,
    user_id:null,
    bank_account_id:null
  }


  error = []



  constructor(
    private userService: UserService,
    private sellerService: SellerService,
    private router: Router,
  ) {
    this.getGeoLocation();
    this.setBankAccount();
    // this.getDirection();
    // this.initMap();
   }

  ngOnInit() {
    this.fetchMasterType();
  }

  //  initMap() {
  //   var uluru = {lat: -25.363, lng: 131.044};
  //   var map = new google.maps.Map(document.getElementById('map'), {
  //     zoom: 4,
  //     center: uluru
  //   });

  //   var contentString = '<div id="content">'+
  //       '<div id="siteNotice">'+
  //       '</div>'+
  //       '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
  //       '<div id="bodyContent">'+
  //       '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
  //       'sandstone rock formation in the southern part of the '+
  //       'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
  //       'south west of the nearest large town, Alice Springs; 450&#160;km '+
  //       '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
  //       'features of the Uluru - Kata Tjuta National Park. Uluru is '+
  //       'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
  //       'Aboriginal people of the area. It has many springs, waterholes, '+
  //       'rock caves and ancient paintings. Uluru is listed as a World '+
  //       'Heritage Site.</p>'+
  //       '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
  //       'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
  //       '(last visited June 22, 2009).</p>'+
  //       '</div>'+
  //       '</div>';

  //   var infowindow = new google.maps.InfoWindow({
  //     content: contentString
  //   });

  //   var marker = new google.maps.Marker({
  //     position: uluru,
  //     map: map,
  //     title: 'Uluru (Ayers Rock)'
  //   });
  //   marker.addListener('click', function() {
  //     infowindow.open(map, marker);
  //   });
  //   infowindow.open(map, marker);
  // }
  // public getDirection() {
  //   this.dir = {
  //     origin: { lat: 18.752179139651357, lng: 98.97422075271606 },
  //     destination: { lat: 18.762179139651357, lng:  98.97522075271606 }
  //   }
  // }


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

  // readImageUrl(event:any) {
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();

  //     reader.onload = (event:any) => {
  //       this.sellerForm.shopImg = event.target.result;
  //     }

  //     reader.readAsDataURL(event.target.files[0]);
  //   }
  // }

  onCatagorySelected(event) {
    console.log("onCatagorySelected", event)
    this.sellerForm.shop_type_id = parseInt(event);
  }

  createSeller() {
    console.log("[This Seller] ", this.sellerForm)
    let temp = this.sellerForm;
    this.isShow = !this.isShow
    temp.user_id = localStorage.getItem("user_id")
    console.log("[Temp body] ",temp);
    // this.sellerForm.user_id = localStorage.getItem("user_id")
    this.userService.createSeller(temp).subscribe(
      data => {
        console.log("response from create seller", data);
        alert("Create seller success!!!");
        this.isShow = !this.isShow
        this.router.navigateByUrl('/profile')

      },
      error => {
        console.log(error)
        this.isShow = !this.isShow
        alert(error.error.message);
      }
    )

  }

  onBankSelected(event) {
    console.log("onBankSelected", event)
    this.deliverForm.bank_account_id = parseInt(event);
  }
  createDeliver() {
    console.log("[This deliver] ", this.deliverForm)
    this.isShow = !this.isShow

    this.deliverForm.user_id = localStorage.getItem("user_id")
    this.userService.createDeliver(this.deliverForm).subscribe(
      data => {
        console.log("response from create deliver", data)
        this.isShow = !this.isShow
        alert("Create deliver success!!!");
        this.router.navigateByUrl('/profile')

    // console.log("[This Seller] ",this.sellerForm)
    // this.sellerForm.user_id = localStorage.getItem("user_id")
    // this.userService.createSeller(this.sellerForm).subscribe(
    //   data => {
    //     console.log("response from create seller",data)
    //   },
    //   error => {
    //     console.log(error)
    //     this.isShow = !this.isShow
    //     alert(error.error.message);
    //   }
    // )
  },
    error => {
      console.log(error)
      this.isShow = !this.isShow
      alert(error.error.message);
    })
  }

  createBuyer() {
    console.log("[This Buyer] ", this.buyerForm)
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

  setBankAccount () {
    this.bankAcc = JSON.parse(localStorage.getItem('masterData')).bank_account
  }



}
