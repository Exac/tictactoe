import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private user_id: number;

  constructor(private router: Router, public jwtHelper: JwtHelperService) {

  }

  ngOnInit() {

  }

  public logout() {
    localStorage.removeItem('access_token');
    this.user_id = -1;
    this.router.navigate(['login']);
  }

  public activating() {
    this.updateUser_id();
  }

  public deactivating() {
    this.updateUser_id();
  }

  private updateUser_id() {
    const jwtString = localStorage.getItem('access_token');
    let t = this.jwtHelper.decodeToken(jwtString);
    this.user_id = t ? t.user_id : -1;
    console.log(t);
  }

}
