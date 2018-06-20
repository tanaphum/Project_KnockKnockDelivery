import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.component.html',
  styleUrls: ['./response-reset.component.css']
})
export class ResponseResetComponent implements OnInit {

  public error=[];
  public form = {
    email : null,
    password : null,
    password_confirmation:null,
    resetToken :null
  }

  constructor(
    private route:ActivatedRoute,
    private authService: AuthService,
    private router:Router,
  ) {
    route.queryParams.subscribe(params => {
      this.form.resetToken = params['token']
    });
   }

  ngOnInit() {
  }

  onSubmit(){
    this.authService.changePassword(this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    )
   }
   handleResponse(data){
     let _router = this.router;
    _router.navigateByUrl('/login')
   }
 
   handleError(error){
     this.error = error.error.errors;
   }
   

}
