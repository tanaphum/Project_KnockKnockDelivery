import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SellerService } from '../../services/seller.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-table-data',
  templateUrl: './admin-table-data.component.html',
  styleUrls: ['./admin-table-data.component.css']
})
export class AdminTableDataComponent implements OnInit {

  @Input() _headers: Object;
  @Input() data_history: Object;
  @Input() _type: String;

  @Output() reloadPage = new EventEmitter();

  private baseUrl = 'http://localhost:8000';

  private headers;
  private data;

  constructor(
    private modalService: NgbModal,
    private sellerService: SellerService,
    private adminService: AdminService,

  ) { }

  ngOnInit() {
    this.setPage();
  }

  setPage() {
    this.headers = this._headers;
    this.data = this.data_history;
  }

}
