import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  form = {
    Name: null,
    Email: null,
    Subject: null,
    Message: null
  };

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
  }


}
