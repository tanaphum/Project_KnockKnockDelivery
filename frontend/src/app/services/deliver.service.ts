import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeliverService {

  private baseUrl = 'http://localhost:8000/api/';
  private UAT = localStorage.getItem('UAT')
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json,multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      'Authorization': 'Bearer '+ this.UAT,
      'Accept':'application/json, text/plain, */*',

    })
  };

  constructor(
    private http: HttpClient,
  ) { }

  getDeliverByProfileId(id) {
    return this.http.get<profile>(`${this.baseUrl}shipper/profile/`+id,this.httpOptions)
  }

  createDeliver(body) {
    return this.http.post(`${this.baseUrl}shipper`,body,this.httpOptions)
  }

  updateDeliver(body,id) {
    let header = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+ this.UAT,
        'Accept':"application/json, text/plain, */*",

      })
    };
    let formData = new FormData();
    formData.append('bank_account_id',body.bank_account_id);
    formData.append('bank_account_no',body.bank_account_no)
    formData.append('shipper_transfer_slip',body.shipper_transfer_slip_Image)

    return this.http.post(`${this.baseUrl}shipper/`+id,body,header)
  }

  getOrderByDeliverId(id) {
    return this.http.get<profile>(`${this.baseUrl}order/shipper/${id}/histories`,this.httpOptions)
  }


}


export interface profile {
  data:[{
    shipper_id:null,
    bank_account:{
      bank_account_id:null,
      bank_account_name:null
    },
    bank_account_no:null,
    shipper_transfer_slip:null,
    profile_status:{
      profile_status_id:null,
      profile_status_name:null
    },
    profile_id:null
  }]
}