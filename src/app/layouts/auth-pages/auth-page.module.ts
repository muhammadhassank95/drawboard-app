import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthPageRoutingModule } from './auth-page-routing';
import { FormsModule } from '@angular/forms';

import { AuthPagesComponent } from './auth-pages.component';
import { SigninComponent } from 'src/app/components/pages/auth-pages/signin/signin.component';
import { SignupComponent } from 'src/app/components/pages/auth-pages/signup/signup.component';

@NgModule({
  declarations: [
    AuthPagesComponent,
    SigninComponent,
    SignupComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    AuthPageRoutingModule,
  ]
})
export class AuthPageModule { }
