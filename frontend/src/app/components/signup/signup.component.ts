import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form = {
    name: null,
    email: null,
    password: null,
    password_confirmation: null
  }

  error = []

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(){
    this.authService.signup(this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    )
  }

  handleResponse(data) {
    this.authService.handleToken(data.access_token)
    this.authService.changeAuthStatus(true)
    this.router.navigateByUrl('/profile')
  }

  handleError(error){
    this.error = error.error.errors;  
  }

}
