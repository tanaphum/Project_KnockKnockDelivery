import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BuyerService {

  private baseUrl = 'http://localhost:8000/api/';


  constructor(private http: HttpClient) { }

  getAllProducts() {
    return this.http.get(`${this.baseUrl}products`)

  }
}
