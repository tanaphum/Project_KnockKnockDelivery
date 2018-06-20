import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerService } from '../../services/seller.service';



@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})
export class TableDataComponent implements OnInit {

  @Input() products: Object;

  private product_id;
  private product_name;
  private product_description;
  private product_price;
  private unit_in_stock;
  private product_available;
  private error;
  private isDelete;

  constructor(
    private modalService: NgbModal,
    private sellerService: SellerService,

  ) { }

  ngOnInit() {
    console.log("ngOnInit table-data: ", this.products);
    this.isDelete = false;
  }

  openInfo(data) {
    this.product_id = data.product_id;
    this.product_name = data.product_name;
    this.product_description = data.product_description;
    this.product_price = data.product_price;
    this.unit_in_stock = data.unit_in_stock;
    this.product_available = data.product_available;
  }

  openEdit(data) {
    this.product_id = data.product_id;
    this.product_name = data.product_name;
    this.product_description = data.product_description;
    this.product_price = data.product_price;
    this.unit_in_stock = data.unit_in_stock;
    this.product_available = data.product_available;
  }

  openDelete(data) {
    this.product_id = data.product_id;
    this.product_name = data.product_name;
  }

  onEdit() {
    console.log("onEdit");

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

}
