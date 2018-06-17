import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})


export class UserService {

    private user_id;
    private baseUrl = 'http://localhost:8000/api/';


    constructor(private http: HttpClient) { }

    ngOnInit() {


    }

    getUserProfile(id) {
        return this.http.get(`${this.baseUrl}user/` + id + `/profiles`)
    }

    createSeller(seller) {
        var seller_form = {
            seller_name: seller.sellerName,
            shop_name: seller.shopName,
            shop_location: seller.location,
            shop_type_id: seller.selectedType,
            status_id: 1,
            profile_id: seller.profile_id
        }
        return this.http.post(`${this.baseUrl}seller`, seller_form)
    }

    async fetchProfileDetail(profile) {
        var role = profile.role.role_name.toLowerCase();
        const response = await this.http.get<Profile>(`${this.baseUrl}` + role + `/profile/` + profile.profile_id).toPromise();
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
