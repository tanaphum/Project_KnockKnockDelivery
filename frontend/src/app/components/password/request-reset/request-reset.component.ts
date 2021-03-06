import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.css']
})
export class RequestResetComponent implements OnInit {

  public form = {
    email: null
  };
  private error = null


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.form)
    this.error = null
    this.authService.sendPasswordResetLink(this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }

  handleResponse(res) {
    console.log('res.data:',res.data)
    this.form.email = null;
    this.router.navigateByUrl('/login')
  }

  handleError(error) {
    this.error = error.error.error;
    this.router.navigateByUrl('/login')

  }

}
