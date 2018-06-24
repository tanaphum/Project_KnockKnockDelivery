import { Component, OnInit, Input, Output,  EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerService } from '../../services/seller.service';



@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent implements OnInit {

  @Input() products: Object;
  @Output() reloadPage = new EventEmitter();

  private isDelete;
  private isEdit;
  private isClick:boolean = false;
  private product_id;
  private product_name;
  private product_description;
  private product_price;
  private unit_in_stock;
  private product_available;
  private selected_catagory;
  private error:boolean = false;
  private errorMessage:String;
  private seller;
  private catagory;
  private dafault_catagory: Number;


  constructor(
    private modalService: NgbModal,
    private sellerService: SellerService,

  ) { }

  ngOnInit() {
    console.log("ngOnInit table-data: ", this.products);
    this.seller = JSON.parse(localStorage.getItem("seller"));
    this.catagory = JSON.parse(localStorage.getItem("product_catagory"));

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
    this.catagory.forEach((element, idx) => {
      if (element.category_id == data.category.category_id) {
        this.dafault_catagory = idx + 1;
        this.selected_catagory = data.category.category_name;
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
    this.catagory.forEach((element, idx) => {
      if (element.category_id == data.category.category_id) {
        this.dafault_catagory = idx + 1;
        this.selected_catagory = idx + 1;
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
    console.log("onEdit");
    this.isClick = !this.isClick;
    var product = {
      product_name: this.product_name,
      product_description: this.product_description,
      product_price: this.product_price,
      unit_in_stock: this.unit_in_stock,
      product_status_id: 1,
      product_category_id: this.selected_catagory
    }
    console.log("product: ",product);
    console.log("id: ",this.product_id);


    this.sellerService.updateProduct(this.product_id,product,this.seller).subscribe(
      response => { 
        console.log("response onEdit: ", response);
        this.isClick = !this.isClick;
        this.isEdit = true;

      },
      error => {
        this.isClick = !this.isClick;
        this.error = true;
        this.errorMessage = error
        console.log("error: ", error)
      }
    )

  }


  onDelete(id) {
    console.log("onDelete");
    this.sellerService.deleteProduct(id).subscribe(
      response => { 
        console.log("response onDelete: ", response);
        this.isDelete = true;
      },
      error => console.log("error: ", error)

    )
  }

  onClose() {
    this.reloadPage.emit(null)
  }

}
