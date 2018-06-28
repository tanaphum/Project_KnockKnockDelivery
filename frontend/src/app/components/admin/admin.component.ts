import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private isLoad:boolean = false;
  private isMenu:boolean = false;
  private isHolding:boolean = false;

  roles: string[];
  selectedRole: string;

  constructor() {
    this.roles = ["Buyer", "Seller", "Deliver"]

   }

  ngOnInit() {
    this.isLoad =!this.isLoad;
  }

  userInSystem() {
    console.log("userInSystem");
    this.isMenu = !this.isMenu;
    this.isHolding = !this.isHolding;

  }

  holdingUser() {
    console.log("holdingUser")
    this.isMenu = !this.isMenu;


  }



}
