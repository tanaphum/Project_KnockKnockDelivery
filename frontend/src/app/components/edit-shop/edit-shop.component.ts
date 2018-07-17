import { Component, OnInit, ViewChild,Input, Output,  EventEmitter } from '@angular/core';
import { SellerService } from '../../services/seller.service';
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

  private isClick: boolean = false;
  private isEdit: boolean = false;
  private dafault_catagory: Number;
  private catagory;
  private seller;
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
    private router: Router,

  ) {
    this.getGeoLocation()
   }

  ngOnInit() {
    this.seller = JSON.parse(localStorage.getItem("seller_id"));
    // this.getShopCatagory();


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

  // getShopCatagory() {
  //   // this.catagory = JSON.parse(localStorage.getItem("shop_catagory"));
  //   // this.masterData = JSON.parse(localStorage.getItem('masterData'))
  //   // this.catagory = this.masterData.product_category;
  //   // this.catagory.forEach((element, idx) => {
  //   //   if (element.shop_type_id == this.seller.shop_type.shop_type_id) {
  //   //     this.dafault_catagory = idx + 1;
  //   //     this.form.selected_catagory = idx + 1;
  //   //     this.setUpPage()
  //   //   }

  //   // });
  //   this.masterData = JSON.parse(localStorage.getItem('masterData'))
  //   this.catagory = this.masterData.product_category;
  //   this.catagory.forEach((element, idx) => {
  //     if (element.shop_type_id == this.seller.shop_type.shop_type_id) {
  //       this.dafault_catagory = idx + 1;
  //       this.form.selected_catagory = idx + 1;
  //       this.setUpPage()
  //     }

  //   });

  // }

  setUpPage() {
    this.form.shop_name = this.seller.shop_name;
    this.form.seller_name = this.seller.seller_name;
    this.form.shop_location = this.seller.shop_location;
    this.form.shop_latitude = this.seller.shop_latitude;
    this.form.shop_longitude = this.seller.shop_longitude;

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


    this.sellerService.updateShop(temp, this.seller).subscribe(
      response => {
        console.log("response onSubmit: ", response)
        this.isClick = !this.isClick;
        this.isEdit = !this.isEdit;
        // this.reloadPage.emit(null)
        if(response.message == 'Successfully') {
          alert("Update shop success!!!");
          this.router.navigateByUrl('/manage-shop')
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

}
