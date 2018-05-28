import { IsNotLoggedInService } from './services/is-not-logged-in.service';
import { IsLoggedInService } from './services/is-logged-in.service';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
    canActivate: [IsNotLoggedInService]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [IsNotLoggedInService]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [IsNotLoggedInService]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [IsNotLoggedInService]

  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'request-password-reset',
    component: RequestResetComponent,
    canActivate: [IsNotLoggedInService]
  },
  {
    path: 'response-password-reset',
    component: ResponseResetComponent,
    canActivate: [IsNotLoggedInService]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
