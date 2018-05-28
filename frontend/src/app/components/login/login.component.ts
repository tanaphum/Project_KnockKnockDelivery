import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form = {
    email: null,
    password: null
  };
  error = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit() {

  }

  onSubmit() {
    this.authService.login(this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(data) {
    this.authService.handleToken(data.access_token);
    this.authService.changeAuthStatus(true);
    this.router.navigateByUrl('/profile');
  }

  handleError(error) {
    this.error = error.error.error;
  }

}
