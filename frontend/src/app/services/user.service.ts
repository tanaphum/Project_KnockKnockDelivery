import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})


export class UserService {

    private user_id;
    private baseUrl = 'http://localhost:8000/api/';
    private UAT = this.setUAT();

    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json,multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
          'Authorization': 'Bearer '+ this.setUAT(),
          'Accept':'application/json, text/plain, */*',

        })
      };

    constructor(private http: HttpClient) { }

    ngOnInit() {
        
    }

    setUAT() {
        return localStorage.getItem('UAT')
    }



    getUserProfile(id) {
        return this.http.get<user>(`${this.baseUrl}user/` + id + `/profiles`,this.httpOptions)
    }

    getMasterData() {
        return this.http.get<masterData>(`${this.baseUrl}masterData`,this.httpOptions)
    }

    createSeller(seller) {
        let header = {
            headers: new HttpHeaders({
              'Authorization': 'Bearer '+ this.UAT,
              'Accept':"application/json, text/plain, */*",
      
            })
          };
    let formData = new FormData();
    formData.append('shop_name',seller.shop_name);
    formData.append('shop_location',seller.shop_location)
    formData.append('shop_latitude',seller.shop_latitude)
    formData.append('shop_longitude',seller.shop_longitude)
    formData.append('user_id',seller.user_id)
    formData.append('shop_logo_image',seller.shop_logo_image)
        
        return this.http.post(`${this.baseUrl}seller`, formData, header)
    }

    createDeliver(deliver) {
        let header = {
            headers: new HttpHeaders({
              'Authorization': 'Bearer '+ this.UAT,
              'Accept':"application/json, text/plain, */*",
      
            })
          };
    let formData = new FormData();
    formData.append('bank_account_id',deliver.bank_account_id);
    formData.append('bank_account_no',deliver.bank_account_no)
    formData.append('shipper_transfer_slip',deliver.shipper_transfer_slip_Image)
    formData.append('user_id',deliver.user_id)

        return this.http.post(`${this.baseUrl}shipper`, formData,header)
    }

    createBuyer(buyer) {
        var buyer_form = {
            buyer_address: buyer.buyer_location,
            user_id: buyer.user_id,
        }
        return this.http.post(`${this.baseUrl}buyer`, buyer_form,this.httpOptions)
    }

    async fetchProfileDetail(profile) {
        var role = profile.role.role_name.toLowerCase();
        const response = await this.http.get<Profile>(`${this.baseUrl}` + role + `/profile/` + profile.profile_id,this.httpOptions).toPromise();
        console.log("fetchProfileDetail response: ", response)
        return response.data[0];

    }


}

export interface Profile {
    data: [{
        seller_id: "",
        seller_name: "",
        shop_name: "",
        shop_location: "",
        shop_type: {
            shop_type_id: "",
            shop_type_name: ""
        },
        profile_status: {
            profile_status_id: "",
            profile_status_name: ""
        },
        profile_id: ""
    }]
}

export interface user {
    data: {
        seller:null,
        buyer:{
            buyer_id:null
        },
        shipper:null,
        admin:null
    },
    message:null,
    
}

export interface masterData {
    data: {
        profile_status:null,
        shop_type:null,
        bank_account:null,
        product_category:null,
        product_status:null,
        order_status:null

    },
    message:null
}


