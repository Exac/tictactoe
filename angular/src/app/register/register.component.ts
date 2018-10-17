import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public alias: string;
  public password: string;
  public email: string;
  public error: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  public submit () {
    this.auth.register(this.alias, this.email, this.password)
      .pipe(first())
      .subscribe(
        result => {
          console.log('Logged in.');
          this.router.navigate(['home'])
        },
        err => this.error = 'That alias or email is already taken!'
      );
  }
  
}
