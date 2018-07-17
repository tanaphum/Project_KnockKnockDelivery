import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8000/api/auth';
  private iss = {
    login: 'http://localhost:8000/api/auth/login',
    signup: 'http://localhost:8000/api/auth/signup'
  };
  private UAT = localStorage.getItem('UAT')

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer '+ this.UAT,
      'Accept':'application/json, text/plain, */*',

    })
  };

  private userLoggedIn = new BehaviorSubject<boolean>(this.loggedIn());
  authStatus = this.userLoggedIn.asObservable()

  constructor(private http: HttpClient) { }

  // middleware(url, data, headers, method) {
  //   const _this = this;
  //   return {
  //     subscribe: (cbSuccess, cbError) => {
  //       _this.http.post(`${this.baseUrl}/${url}`, data, headers)
  //         .subscribe(cbSuccess, error => {

  //           _this.refresh()
  //             .subscribe(
  //               token => {
  //                 //SET TOKEN
  //                 _this.http.post(`${this.baseUrl}/${url}`, data, headers).subscribe(cbSuccess, cbError);
  //               }, 
  //               cbError
  //             );

  //           cbError(error);
  //         }
  //       );
  //     }
  //   }
  // }

  // xservice(data) {
  //   return this.middleware('/fetchxxx', { foo:'bar'}, {}, 'POST');   
  // }

  signup(data) {
    return this.http.post(`${this.baseUrl}/signup`, data)
  }

  login(data) {
    return this.http.post(`${this.baseUrl}/login`, data)
  }

  logOut() {
    return this.http.post(`${this.baseUrl}/logout`,{},this.httpOptions)
  }

  refresh() {
    return this.http.post(`${this.baseUrl}/refresh`, {})

  }

  handleToken(token) {
    this.setToken(token);
  }

  setToken(token) {
    return  new Promise(function(resolve, reject) {
      localStorage.setItem('UAT', token);
      resolve(true)
    });
  }

  setUserId(data) {
    localStorage.setItem("user_id",data)
  }

  getToken() {
    return localStorage.getItem('UAT');
  }

  removeToken() {
    // localStorage.removeItem('UAT');
    // localStorage.removeItem('product_catagory');
    // localStorage.removeItem('seller');
    // localStorage.removeItem('shop_catagory');
    // localStorage.removeItem('user_id');
    // localStorage.removeItem('cart');
    // localStorage.removeItem('masterData');
    // localStorage.removeItem('accept_order');
    // localStorage.removeItem('adminSelect');
    // localStorage.removeItem('orders');
    // localStorage.removeItem('seller_id');
    // localStorage.removeItem('seller_order_id');
    localStorage.clear();



  }

  isValidToken() {
    const token = this.getToken();
    if (token) {
      const payload = this.payload(token);
      if (payload) {
        return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
      }
    }
    return false;
  }

  payload(token) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload) {
    return JSON.parse(atob(payload));
  }

  loggedIn() {
    return this.isValidToken();
  }

  changeAuthStatus(value: boolean) {
      this.userLoggedIn.next(value);
  }

  setUserProfile(data) {
    return  new Promise(function(resolve, reject) {
      localStorage.setItem('user_id', data.user.user_id);
      resolve(true)
    });
  }

  sendPasswordResetLink(data) {
    return this.http.post(`${this.baseUrl}/sendPasswordResetLink`, data)
  }
  
  changePassword(data) {
    return this.http.post(`${this.baseUrl}/resetPassword`, data)
  }
  
}
