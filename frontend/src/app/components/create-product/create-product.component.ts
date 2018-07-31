import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SellerService } from '../../services/seller.service';



@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent implements OnInit {

  // @Input() name: String;
  private isClick: boolean = false;
  private isLoad: boolean = false;
  private isCreate: boolean = false;
  private form = {
    product_name: null,
    product_type: null,
    product_price: null,
    product_catagory: null,
    selected_catagory: null,
    product_description: null,
    product_image_1:null,
  }
  private dafault_catagory: Number;
  private catagory;
  private seller_id;
  private error = []
  private masterData;
  private bankAcc;
  private image = new FormData();
  private imageUrl = null;
  fileToUpload: File = null;

  context: CanvasRenderingContext2D;

  @ViewChild("mycanvas") mycanvas;


  constructor(
    private sellerService: SellerService,
  ) { }

  ngOnInit() {
    this.seller_id = localStorage.getItem("seller_id");
    console.log("[Seller id] ", this.seller_id);
    this.masterData = JSON.parse(localStorage.getItem('masterData'))
    this.catagory = this.masterData.product_category;

    // this.sellerService.getShopCategories().subscribe(
    //   response => {
    //     console.log("response from catagory: ",response)
    //     this.catagory = response['data']
    //     this.isLoad = true

    //   },
    //   error => console.log("response from catagory: ",error)
    // )
  }

  preview(file: FileList): void {
    this.form.product_image_1 = file.item(0)
    console.log("[fileUpload] ",this.form.product_image_1);
    var reader = new FileReader();
    reader.onload = (event:any) => {
      this.imageUrl = event.target.result
    }
    reader.readAsDataURL(this.form.product_image_1)

  }

  selectChange(id: any) {
    console.log("selectChange", id)
    // this.form.selected_catagory = this.form[$event];
  }


  setBankAccount() {
    this.bankAcc = JSON.parse(localStorage.getItem('masterData')).bank_account;
  }

  onCatagorySelected(event) {
    console.log("onCatagorySelected", event)
    this.form.selected_catagory = parseInt(event);
  }

  onCreate() {
    console.log("onCreate")
    console.log("form: ", this.form)
    console.log("Image: ", this.image)

    this.isClick = !this.isClick;

    if (this.form.product_price > 1000) {
      this.isClick = !this.isClick;
      this.error['product_price'] = 'product price not more than 1000'
    }
    else {

      let tempForm =
      {
        product_name: this.form.product_name,
        product_description: this.form.product_description,
        product_price: parseInt(this.form.product_price),
        product_category_id: parseInt(this.form.selected_catagory),
        product_image_1: this.form.product_image_1
      }

      let seller_id = this.seller_id;
      // console.log("tempForm: ", tempForm)


      this.sellerService.createProduct(tempForm, seller_id).subscribe(
        response => {
          console.log("response onCreate: ", response)
          this.isClick = !this.isClick;
          // this.isCreate = !this.isCreate;
          alert('Product has been create')
          this.onClear();
        },
        error => {
          this.isClick = !this.isClick;
          console.log("error: ", error)
        }
      )
    }

  }

  onClear() {
    console.log("clear")
    this.form.product_name = '';
    this.form.product_type = '';
    this.form.product_price = '';
    this.form.product_catagory = '';
    this.form.product_description = '';
    this.form.product_image_1 = '';
    this.form.selected_catagory = '';
    this.imageUrl = null
    this.error = [];

  }








}
