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
    firstname: null,
    lastname: null,
    identity_no: null,
    telephone_number: null,
    email: null,
    password: null,
    password_confirmation: null,

  }
  isValid: boolean = false;
  isShow: boolean = false;
  error = []

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onChange() {
    console.log("onChange ");

    if (this.form.firstname != null && this.form.lastname != null && this.form.identity_no != null && this.form.telephone_number != null && this.form.email != null && this.form.password != null && this.form.password_confirmation != null) {
      console.log("isValid");

      this.isValid = true;
    }
  }

  onSubmit() {
    console.log("onSubmit signup: ",this.form);

    // if (this.form.firstname != null && this.form.lastname != null && this.form.identity_no != null && this.form.telephone_number != null && this.form.email != null && this.form.password != null && this.form.password_confirmation != null) {
      if(this.form.firstname == null) {
        this.error['firstname'] = 'Please fill in firstname.';
        // this.isShow = !this.isShow
      }
      if(this.form.lastname == null) {
        this.error['lastname'] = 'Please fill in lastname.';
        // this.isShow = !this.isShow
      }
      if(this.form.telephone_number == null) {
        this.error['telephone_number'] = 'Please fill in telephone_number.';
        // this.isShow = !this.isShow
      }
      if(this.form.email == null) {
        this.error['email'] = 'Please fill in email.';
        // this.isShow = !this.isShow
      }
      if(this.form.password == null || this.form.password_confirmation == null) {
        this.error['password'] = 'Please fill in password.';
        // this.isShow = !this.isShow
      }
      if(this.form.password == null) {
        this.error['password'] = 'Please fill in password.';
        // this.isShow = !this.isShow
      }
      if(this.form.password_confirmation == null) {
        this.error['password_confirmation'] = 'Please fill in confirm password.';
        // this.isShow = !this.isShow
      }
      if(this.form.identity_no == null  ) {
        this.error['identity_no'] = 'Citizen id is require';
        // this.isShow = !this.isShow
      }
      if(this.form.identity_no != null) {
        if (this.form.identity_no.length < 13) {
          this.error['identity_no'] = 'Citizen id must more than 13 digit';
        }
      }
      if(this.form.password != null || this.form.password_confirmation != null ) {
        if (this.form.password.length < 8 || this.form.password_confirmation.length < 8 ) {
          this.error['password'] = 'Password and confirm password must contain more than 8 character long';
          // this.isShow = !this.isShow
        }
      }
      if (this.form.password != this.form.password_confirmation) {
        console.log('[Password and confirm password not match]');
        
        this.error['password'] = 'Password and confirm password not match';
        // this.isShow = !this.isShow
      }
      else{
        this.form.telephone_number = '0' + this.form.telephone_number.toString();
        this.isShow = !this.isShow
        this.isValid = !this.isValid
        this.authService.signup(this.form).subscribe(
          data => this.handleResponse(data),
          error => this.handleError(error)
        )
      }
    // }
    // else {
    //   alert("All input required")
    //   this.isShow = !this.isShow

    // }


  }

  handleResponse(data) {
    this.isShow = !this.isShow
    this.authService.handleToken(data.access_token)
    this.authService.changeAuthStatus(true)
    this.authService.setUserId(data.user.user_id)
    this.router.navigateByUrl('/profile')

  }

  handleError(error) {
    this.isValid = !this.isValid
    this.isShow = !this.isShow
    this.error = error.error.errors;

  }

}
