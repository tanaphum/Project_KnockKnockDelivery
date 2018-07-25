import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MiddlewareService {

  private baseUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient) { }

  sendRequest(url, method, body, headers) {
    return new Promise((resolve,reject) => {
      if(method === 'get') {
        return this.http.get(`${this.baseUrl}${url}`, headers)
        .subscribe(response => {
          resolve(response)
        },
        error => {
          reject(error)
        })
      }
      else if(method === 'post') {
        return this.http.post(`${this.baseUrl}${url}`, body, headers)
      }
      else if(method === 'put') {
        return this.http.put(`${this.baseUrl}${url}`, body, headers)

      }
      else if(method === 'delete') {

      }
    });

  }
}
