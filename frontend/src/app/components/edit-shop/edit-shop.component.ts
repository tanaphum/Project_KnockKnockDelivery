import { Component, OnInit, ViewChild,Input, Output,  EventEmitter } from '@angular/core';
import { SellerService } from '../../services/seller.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-shop',
  templateUrl: './edit-shop.component.html',
  styleUrls: ['./edit-shop.component.css']
})
export class EditShopComponent implements OnInit {

  private form = {
    shop_name: null,
    seller_name: null,
    category_name: null,
    shop_description: null,
    shop_location: null,
    shop_img: null,
    selected_catagory: null,
    shop_latitude: null,
    shop_longitude: null
  }

  private user_form = {
    firstname: null,
    lastname: null,
    identity_no: null,
    telephone_number: null,
  }

  private isClick: boolean = false;
  private isEdit: boolean = false;
  private dafault_catagory: Number;
  private catagory;
  private seller;
  private user;
  private masterData;
  private error: boolean = false;
  private errorMessage;
  title: string = 'My first AGM project';
  latitude: any;
  longtitude: any;
  options = {
    suppressMarkers: true,
  };


  @Output() reloadPage = new EventEmitter();
  @ViewChild("mycanvas") mycanvas;

  fileToUpload: File = null;

  context: CanvasRenderingContext2D;


  constructor(
    private sellerService: SellerService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,

  ) {
    this.getGeoLocation()
   }

  ngOnInit() {
    // this.seller = JSON.parse(localStorage.getItem("seller_id"));
    this.getUserProfile()

  }
  getGeoLocation(){
    if (navigator.geolocation) {
        var options = {
          enableHighAccuracy: true
        };

        navigator.geolocation.getCurrentPosition(position=> {
          this.latitude = position.coords.latitude;
          this.longtitude = position.coords.longitude;
          this.form.shop_latitude = position.coords.latitude;
          this.form.shop_longitude = position.coords.longitude;

          }, error => {
            console.log(error);
          }, options);
    }
  }

  onChooseLocation(event) {
    this.latitude = event.coords.lat;
    this.longtitude = event.coords.lng;
    this.form.shop_latitude = event.coords.lat;
    this.form.shop_longitude = event.coords.lng;
  }

  setUpPage() {
    this.seller = JSON.parse(localStorage.getItem("seller"));
    console.log('[setUpPage] seller',this.seller);
    console.log('[setUpPage] user',this.user);

    this.form.shop_name = this.seller.shop_name;
    this.form.seller_name = this.seller.seller_name;
    this.form.shop_location = this.seller.shop_location;
    this.form.shop_latitude = this.seller.shop_latitude;
    this.form.shop_longitude = this.seller.shop_longitude;


    this.user_form.firstname = this.user.firstname;
    this.user_form.lastname = this.user.lastname;
    this.user_form.identity_no = this.user.identity_no;
    this.user_form.telephone_number = this.user.telephone_number;
  }

  onCatagorySelected(event) {
    console.log("onCatagorySelected", event)
    this.form.selected_catagory = parseInt(event);
  }

  preview(e: any): void {
    let canvas = this.mycanvas.nativeElement;
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, 300, 300);

    //Show render image to canvas
    var render = new FileReader();
    render.onload = function (event) {
      var img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0)
        // context.drawImage(img,0,0,400,400)

      }
      // img.src = event.target.result;
    };
    render.readAsDataURL(e.target.files[0]);


  }

  onSubmit() {
    this.isClick = !this.isClick;
    let temp = {
      shop_name: this.form.shop_name,
      shop_location: this.form.shop_location,
      shop_latitude:this.form.shop_latitude,
      shop_longitude:this.form.shop_longitude,
      shop_logo_image:null,
    }
    console.log("onSubmit", temp)


    this.sellerService.updateShop(temp, this.seller.seller_id).subscribe(
      response => {
        console.log("response onSubmit: ", response)
        this.isClick = !this.isClick;
        this.isEdit = !this.isEdit;
        // this.reloadPage.emit(null)
        if(response.message == 'Successfully') {
          alert("Update shop success!!!");
          this.updateProfile()
          .then(result => {
            this.router.navigateByUrl('/manage-shop')
          })

        }


      },
      error => { 
        console.log("error onSubmit: ", error) 
        this.isClick = !this.isClick;
        this.error = !this.error;
        this.errorMessage = error.error.message

      
      }
    )

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

  getUserProfile() {
    let id = localStorage.getItem('user_id')
    this.authService.me()
    .subscribe(response => {
      console.log('[response] getUserProfile: ',response);
      this.user = response
      this.setUpPage()

    },error => {
      console.log('[response] getUserProfile: ',error);

    }) 
  }

}
