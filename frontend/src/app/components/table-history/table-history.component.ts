import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerService } from '../../services/seller.service';
import { AdminService } from '../../services/admin.service';
import { OrderService } from '../../services/order.service';


@Component({
  selector: 'app-table-history',
  templateUrl: './table-history.component.html',
  styleUrls: ['./table-history.component.css']
})
export class TableHistoryComponent implements OnInit {

  @Input() _headers: Object;
  @Input() _data: Object;
  @Input() _type: String = null;

  @Output() updateUser = new EventEmitter();


  private baseUrl = 'http://localhost:8000';
  private isShow: boolean = false;
  private isOrderInfo: boolean = false;
  private isOpenQRCode: boolean = false;
  private emit_data;
  private headers;
  private data;
  private imageUrl = null;
  private order = {}
  private product = {}

  constructor(
    private modalService: NgbModal,
    private sellerService: SellerService,
    private adminService: AdminService,
    private orderService: OrderService,

  ) { }

  ngOnInit() {
    console.log('[ngOnInit] ');
    console.log('[_headers] ', this._headers);
    console.log('[_data] ', this._data);
    console.log('[_type] ', this._type);
    this.setPage();

  }

  setPage() {
    this.headers = this._headers;
    this.data = this._data;

  }

  openOrderInfo(order) {
    this.isShow = !this.isShow
    this.isOrderInfo =!this.isOrderInfo
    this.getOrderDetail(order.order_id)
      .then(result => {
        console.log("[detail] seeMore: ", result);
        this.order = result
        this.isShow = !this.isShow

      }).catch(error => {
        console.log("[error] seeMore: ", error);
        this.isShow = !this.isShow


      })
  }

  getOrderDetail(id) {
    return new Promise((resolve, reject) => {
      this.orderService.getOrderDetail(id)
        .subscribe(response => {
          console.log("[response] getOrderDetail: ", response.data);
          resolve(response.data);
        }, error => {
          console.log("[error] getOrderDetail: ", error);
          reject(error)
        })
    });

  }


  onClickUpdate(id, status) {
    console.log('[onClickUpdate] admin-data-table', id, status);
    this.emit_data = { id, status }
    this.updateUser.emit(this.emit_data)

  }

  openQRCode(order) {
    // this.isShow = !this.isShow
    this.isOpenQRCode = !this.isOpenQRCode
    console.log('[open qr code] ', order);
    this.orderService.getQRcodeSellerByOrderId(order.order_id)
      .subscribe(response => {
        console.log("[response] ", response);
        this.imageUrl = response
        // this.isShow = !this.isShow

      }, error => {
        console.log("[error] ", error);

      })
  }



}
