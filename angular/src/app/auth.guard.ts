import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private jwtHelper: JwtHelperService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('access_token')) {
      const jwtString = localStorage.getItem('access_token');
      let token = this.jwtHelper.decodeToken(jwtString);
      if (!this.jwtHelper.isTokenExpired()) {
        return true;
      }
    }

    // redirect user to login page if failed.
    this.router.navigate(['login']);
    return false;
  }
}
