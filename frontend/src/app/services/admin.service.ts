import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:8000/api/';
  private UAT = localStorage.getItem('UAT')
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+ this.UAT
    })
  };

  constructor(private http: HttpClient) { }

  getAllUserInSystem(role_id) {
    let body = {
      "role_id": role_id,
      "profile_status_id": 2
    }
    return this.searchUsers(body)

  }

  getAllHoldingUser(role_id) {
    let body = {
      "role_id": role_id,
      "profile_status_id": 1
    }
    return this.searchUsers(body)
  }

  searchUsers(body) {
    return  this.http.post<users>(`${this.baseUrl}search/users`, body,this.httpOptions)
  }

  updateUserStatus(body) {
    return  this.http.post<updateUser>(`${this.baseUrl}admin/updatestatus`, body,this.httpOptions)

  }

}

export interface users {
  data: [
    {
        seller_name: null,
        shop_name: null,
        shop_location: null,
        shop_type: {
            shop_type_id: null,
            shop_type_name: null
        },
        profile_status: {
            profile_status_id: null,
            profile_status_name: null
        },
        profile_id: null
    }
]
}

export interface updateUser {
  message:null,
  result: 
    {
      shipper_id:null,
      seller_id:null,
      buyer_id:null,
      profile_status_id:null

    }

}
