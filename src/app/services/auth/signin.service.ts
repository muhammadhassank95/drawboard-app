import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { ISignIn } from 'src/app/shared/interfaces/signup.interface';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})

export class SigninService {
  constructor(
    private api: ApiService
  ) { }

  public getSigninDatas(): Observable<any> {
    return this.api.get('/signinData')
  }

  public processSignin(data: any): Observable<any> {
    return this.api.post(`/Authenticate/login`, data)
  }

  public registerAdmin(data: any): Observable<any> {
    return this.api.post(`/Authenticate/register-admin`, data)
  }

  /* CreateAccount Api's */
  public sendCodeApi(data: any): Observable<any> {
    return this.api.post(`/Authenticate/SendCode`, data)
  }

  public validateCodeApi(data: any): Observable<any> {
    return this.api.post(`/Authenticate/ValidateCode`, data)
  }
  
  public createAccountApi(data: any): Observable<any> {
    return this.api.post(`/Authenticate/register`, data)
  }
}