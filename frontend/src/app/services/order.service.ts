import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:8000/api/';
  private UAT = localStorage.getItem('UAT')
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.UAT
    })
  };

  constructor(
    private http: HttpClient,
  ) { 
    
  }

  createOrder(order) {
    return this.http.post<order>(`${this.baseUrl}order`, order, this.httpOptions)
  }

  createOrderDetail(order) {
    return this.http.post<order>(`${this.baseUrl}order-detail`, order, this.httpOptions)
  }

  getOrders() {
    return this.http.get<orders>(`${this.baseUrl}order/sellers`, this.httpOptions)
  }

  getOrderBySellerId(sid) {
    return this.http.get<orders>(`${this.baseUrl}order/seller/` + sid + `/order-list`, this.httpOptions)
  }


  getOrderDetail(oid) {
    return this.http.get<orders>(`${this.baseUrl}order/` + oid, this.httpOptions)
  }

  updateOrder(oid, body) {
    return this.http.put(`${this.baseUrl}order/` + oid, body, this.httpOptions)

  }

  getDataQRcodeBuyerByOrderId(id) {
    return this.http.get<orders>(`${this.baseUrl}orderQRcode/buyer/order/` + id, this.httpOptions)

  }

  UploadTransferSlipByOrderId(order_id, body) {
    let header = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.UAT,
        'Accept': "application/json, text/plain, */*",

      })
    };
    return this.http.post(`${this.baseUrl}order/${order_id}/uploadPaymentTransferSlip`, body, header)

  }

  getQRcodeSellerByOrderId(id) {
    return this.http.get<image>(`${this.baseUrl}orderQRcode/seller/order/${id}`, this.httpOptions)
  }

  QRcodeUpdateStatusOrderByOrderId(id,body) {
    return this.http.put(`${this.baseUrl}orderQRcode/order/${id}`,body, this.httpOptions)

  }

  ShipperAcceptOrder(id) {
    return this.http.put(`${this.baseUrl}orderQRcode/order/${id}/shipper-accept`, this.httpOptions)

  }

  searchSellerHaveOrders(keyWord) {
    let body = {
      search_data: keyWord
    }
    return this.http.post<orders>(`${this.baseUrl}order/search/shop-name`, body, this.httpOptions)
  }



}

export interface image {
  response: {
    data: {
      qrcode_buyer: ''
    }
  }
}

export interface order {
  result: null
}

export interface orders {
  data: [{}]
}
