import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public alias: string;
  public password: string;
  public error: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  public submit() {
    this.auth.login(this.alias, this.password)
      .pipe(first())
      .subscribe(
        result => this.router.navigate(['play/computer']),
        err => this.error = `Could not authenticate ${this.alias}:${this.password}`
      );
  }

}
