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

  ngOnInit() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+ this.UAT,
        'Accept':'application/json, text/plain, */*',
  
      })
    };
  }
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
    let header = {
      headers: new HttpHeaders({
        Authorization: 'Bearer '+ this.UAT,
        Accept: 'application/json, text/plain, */*',
        Connection: 'keep-alive',
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' 
      })
    };

    return this.http.post(`${this.baseUrl}/logout`,{},header)
  }

  refresh() {
    console.log('[refresh]');
  
    return this.http.post<authResponse>(`${this.baseUrl}/refresh`, {},this.httpOptions)

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

  editUser(id,data) {
    return this.http.put(`${this.baseUrl}/user/${id}`,data,this.httpOptions)
  }

  me() {
    return this.http.post(`${this.baseUrl}/me`,{},this.httpOptions)
  }
  
}

export interface authResponse {
  access_token:'',
  token_type:'',
  expires_in:'',
  user:''
}
