import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomeComponent } from '../home/home.component';
import { RegisterComponent } from '../register/register.component';
import { PlayComputerComponent } from '../play-computer/play-computer.component';
import { AuthGuard } from '../auth.guard';
import { LoginComponent } from '../login/login.component';

const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'play/computer', component: PlayComputerComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, { enableTracing: false })
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
