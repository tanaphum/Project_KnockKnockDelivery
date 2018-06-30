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

  isShow: boolean = false;
  error = []

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(){
    console.log("onSubmit signup: ");
    console.log("this.form.password.lenght: ",this.form.password.lenght);
    console.log("this.form.password_confirmation.lenght: ",this.form.password_confirmation.lenght)

    this.isShow = !this.isShow;   
    if(this.form.password.length < 8 || this.form.password_confirmation.length < 8){
      this.isShow = !this.isShow;   
      this.error['password'] = 'Password and confirm password must contain more than 8 character long';
    }
    else if(this.form.password != this.form.password_confirmation){
      this.isShow = !this.isShow;   
      this.error['password'] = 'Password and confirm password not match';
    }
    else{
      this.authService.signup(this.form).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      )
    }

  }

  handleResponse(data) {
    this.authService.handleToken(data.access_token)
    this.authService.changeAuthStatus(true)
    this.authService.setUserId(data.user.user_id)
    this.router.navigateByUrl('/profile')
    this.isShow = !this.isShow;   

  }

  handleError(error){
    this.error = error.error.errors;  
    this.isShow = !this.isShow;   

  }

}
