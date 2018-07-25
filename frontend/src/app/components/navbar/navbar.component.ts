import { AuthService } from './../../services/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() isShow = new EventEmitter();

  public loggedIn: boolean
  private mySidebar;
  private UAT;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.authStatus.subscribe(value => this.loggedIn = value)
    this.mySidebar = document.getElementById("mySidebar");
    this.UAT = localStorage.getItem('UAT')

  }

  logout(event: MouseEvent) {
    event.preventDefault()

    this.isShow.emit(true)

    this.authService.logOut().subscribe(
      response => {
        console.log("[Response] ",response)
        this.authService.removeToken()
        this.authService.changeAuthStatus(false)
        this.router.navigateByUrl('/login')

      },error => {
        console.log("[Error] ",error)
      })

  }

  w3_open() {
      if (this.mySidebar.style.display === 'block') {
        this.mySidebar.style.display = 'none';
      } else {
        this.mySidebar.style.display = 'block';
      }
  }

  w3_close() {
    this.mySidebar.style.display = "none";
}

}
