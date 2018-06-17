import { Component, OnInit, ViewChild } from '@angular/core';
import { SellerService } from '../../services/seller.service';


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
    selected_catagory: null
  }

  private dafault_catagory: Number;
  private catagory;
  private seller;
  private error;

  @ViewChild("mycanvas") mycanvas;

  fileToUpload: File = null;

  context: CanvasRenderingContext2D;


  constructor(
    private sellerService: SellerService,
  ) { }

  ngOnInit() {
    this.seller = JSON.parse(localStorage.getItem("seller"));
    this.getShopCatagory();


  }

  getShopCatagory() {
    this.catagory = JSON.parse(localStorage.getItem("shop_catagory"));
    this.catagory.forEach((element, idx) => {
      if (element.shop_type_id == this.seller.shop_type.shop_type_id) {
        this.dafault_catagory = idx + 1;
        this.form.selected_catagory = idx + 1;
        this.setUpPage()
      }

    });


  }

  setUpPage() {
    this.form.shop_name = this.seller.shop_name;
    this.form.seller_name = this.seller.seller_name;
    this.form.shop_location = this.seller.shop_location;

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
    console.log("onSubmit", this.form)

    var temp = {
      seller_name: this.form.seller_name,
      shop_name: this.form.shop_name,
      shop_location: this.form.shop_location,
      shop_type_id: this.form.selected_catagory,
      profile_status_id: 1,
      profile_id: this.seller.profile_id
    }

    this.sellerService.updateShop(temp, this.seller).subscribe(
      response => console.log("response onSubmit: ", response),
      error => console.log("error onSubmit: ", error)
    )

  }

}
