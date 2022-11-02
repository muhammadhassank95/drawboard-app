import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SigninService } from 'src/app/services/auth/signin.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public loading = false;
  public hide: boolean = true;
  public signinFormGroup!: FormGroup;

  constructor(
    private router: Router,
    private signinService: SigninService
  ) { }

  ngOnInit(): void {
    this.initializeFormgroup();
    this.authCheck();
  }

  public authCheck(): void {
    const token = localStorage.getItem('access-token');
    if (token !== null) {
      this.router.navigateByUrl('/workflow-listing')
    }
  }

  public initializeFormgroup(): void {
    this.signinFormGroup = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }


  public onClickLogin(): void {
    this.loading = true;
    if (this.signinFormGroup.valid) {
      this.signinService.processSignin(this.signinFormGroup.value)
        .subscribe((response: any) => {
          const token = response.token;
          const userRoles = response.userRoles;
          const expiration = response.expiration;
          localStorage.setItem('access-token', token);
          localStorage.setItem('user', JSON.stringify(response));
          localStorage.setItem('user-roles', JSON.stringify(userRoles));
          if (response.token !== null) {
            // userRoles?.includes('Global') ? this.router.navigateByUrl('/global-risks') : this.router.navigateByUrl('/risks')
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
        },)
    } else {
      this.loading = false;
    }
  }

  onClickSignUp() {
    console.log('...Work In Progress...')
    // this.router.navigateByUrl('/signup')
  }
}
