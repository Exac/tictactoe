import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(alias: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string }>('http://localhost:3000/api/auth', { alias: alias, password: password })
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.token);
          return true;
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }

  register(alias: string, email: string, password: string): Observable<boolean> {
    return this.http.post('http://localhost:3000/api/register', {alias: alias, email: email, password: password})
      .pipe(
        map(result => {
          console.log('register() response: ', result);
          return true;
        })
      )
  }

}
