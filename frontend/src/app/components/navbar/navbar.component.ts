import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public loggedIn: boolean;
  private mySidebar;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.authStatus.subscribe(value => this.loggedIn = value);
    this.mySidebar = document.getElementById('mySidebar');

  }

  logout(event: MouseEvent) {
    event.preventDefault();
    this.authService.removeToken();
    this.authService.changeAuthStatus(false);
    this.router.navigateByUrl('/login');
  }

  w3_open() {
      if (this.mySidebar.style.display === 'block') {
        this.mySidebar.style.display = 'none';
      } else {
        this.mySidebar.style.display = 'block';
      }
  }

  w3_close() {
    this.mySidebar.style.display = 'none';
}

}
