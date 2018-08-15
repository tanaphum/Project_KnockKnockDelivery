import { Component, OnInit, Input, Output,  EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerService } from '../../services/seller.service';



@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent implements OnInit {

  @Input() products;
  @Output() reloadPage = new EventEmitter();
  @Output() isLoad = new EventEmitter();

  private isDelete;
  private isEdit;
  private isClick:boolean = false;
  private product_id;
  private product_name;
  private product_description;
  private product_price;
  private unit_in_stock;
  private product_available;
  private product_status
  private status
  private selected_catagory;
  private selected_status;
  private error = [];
  private errorMessage:String;
  private seller;
  private catagory;
  private product_image;
  private dafault_catagory: Number;
  private dafault_status: Number;

  private baseUrl = 'http://localhost:8000';


  constructor(
    private modalService: NgbModal,
    private sellerService: SellerService,

  ) { }

  ngOnInit() {
    console.log("ngOnInit table-data: ", this.products);
    this.seller = JSON.parse(localStorage.getItem("seller"));
    let masterData = JSON.parse(localStorage.getItem('masterData'))
    this.catagory = masterData.product_category;
    this.status = masterData.product_status;


    this.isDelete = false;
    this.isEdit = false;
  }

  openInfo(data) {
    this.product_id = data.product_id;
    this.product_name = data.product_name;
    this.product_description = data.product_description;
    this.product_price = data.product_price;
    this.unit_in_stock = data.unit_in_stock;
    this.product_available = data.product_available;
    this.product_image = this.baseUrl+data.product_image_1

    console.log("this.product_image ",this.product_image)


    this.catagory.forEach((element, idx) => {
      if (element.product_category_id == data.product_category.product_category_id) {
        this.dafault_catagory = idx + 1;
        this.selected_catagory = data.product_category.product_category_name;
      }
    });

  }

  openEdit(data) {
    this.product_id = data.product_id;
    this.product_name = data.product_name;
    this.product_description = data.product_description;
    this.product_price = data.product_price;
    this.unit_in_stock = data.unit_in_stock;
    this.product_available = data.product_available;
    this.product_image = this.baseUrl+data.product_image_1
    console.log("this.product_image ",this.product_image)
    this.catagory.forEach((element, idx) => {
      if (element.product_category_id == data.product_category.product_category_id) {
        this.dafault_catagory = idx + 1;
        this.selected_catagory = idx + 1;
      }
    });

    this.status.forEach((element, idx) => {
      if (element.product_status_id == data.product_status.product_status_id) {
        this.dafault_status = idx + 1;
        this.selected_status = idx + 1;
      }
    });
  }

  openDelete(data) {
    this.product_id = data.product_id;
    this.product_name = data.product_name;
  }

  onCatagorySelected(event) {
    console.log("onCatagorySelected", event)
    this.selected_catagory = parseInt(event);
  }

  onEdit() {
    this.error['product_name'] = false;
    this.error['product_price'] = false;
    this.error['product_description'] = false;

    if(this.product_name.length == 0 ) {
      this.error['product_name'] = 'Please fill in Product name.'
    }
    if(this.product_price.length == 0 ) {
      this.error['product_price'] = 'Please fill in Product price.'
    }
    if(this.product_description.length == 0 ) {
      this.error['product_description'] = 'Please fill in Product description.'
    }
    else {
      this.isClick = !this.isClick;
      var product = {
        product_name: this.product_name,
        product_description: this.product_description,
        product_price: this.product_price,
        unit_in_stock: this.unit_in_stock,
        product_status_id: this.selected_status,
        product_category_id: this.selected_catagory,
        product_image_1:null,
        product_image_2:null,
        product_image_3:null
      }
      console.log("product: ",product);
      console.log("id: ",this.product_id);
  
  
      this.sellerService.updateProduct(this.product_id,product,this.seller).subscribe(
        response => { 
          console.log("response onEdit: ", response);
          this.isClick = !this.isClick;
          // this.isEdit = true;
          alert('Product has been edit')
          this.updateDataInTable(response.result)
        },
        error => {
          this.isClick = !this.isClick;
          // this.error = true;
          this.errorMessage = error
          console.log("error: ", error)
        }
      )
  
    }

  }


  onDelete(id) {
    console.log("onDelete");
    this.sellerService.deleteProduct(id).subscribe(
      response => { 
        console.log("response onDelete: ", response);
        this.isDelete = true;
        alert('Product has been delete')

      },
      error => console.log("error: ", error)

    )
  }

  onClose() {
    // this.reloadPage.emit(null)
  }


  updateDataInTable(data) {
    this.products.forEach(element => {
      if(element.product_id === data.product_id) {
        element.product_name = data.product_name
        element.product_price = data.product_price
        element.product_description = data.product_description
        this.catagory.forEach((element, idx) => {
          if (element.product_category_id == data.product_category_id) {
            element.dafault_catagory = idx + 1;
            element.selected_catagory = idx + 1;
          }
        });
        this.status.forEach((element, idx) => {
          if (element.product_status_id == data.product_status_id) {
            element.dafault_status = idx + 1;
            element.selected_status = idx + 1;
          }
        });
      }
    });
  }

}
