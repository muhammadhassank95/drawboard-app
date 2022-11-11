import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SigninService } from 'src/app/services/auth/signin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public password?: string;
  public isValidEmail = false;
  public passwordVisible = false;
  public showValidateSubGroup = false;
  public showPasswordSubGroup = false;
  public confirmPasswordVisible = false;
  public createAccountFormGroup!: FormGroup;

  constructor(
    private router: Router,
    private authService: SigninService,
    private notification: NzNotificationService
  ) {
    this.initializeFormgroup();
  }

  ngOnInit() { }

  initializeFormgroup() {
    this.createAccountFormGroup = new FormGroup({
      sendCodeSubGroup: new FormGroup({
        fullName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        company: new FormControl('', Validators.required),
        position: new FormControl('')
      }),

      validateSubGroup: new FormGroup({
        code: new FormControl('', Validators.required)
      }),

      passwordSubGroup: new FormGroup({
        isAgreeOnCondition: new FormControl(false, Validators.required),
        password: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.required)
      })
    });
  }

  sendCodeClicked() {
    if (this.createAccountFormGroup.controls.sendCodeSubGroup.status === 'VALID') {
      this.isValidEmail = false;
      console.log('this.createAccountFormGroup: ', this.createAccountFormGroup);
      this.authService.sendCodeApi(this.createAccountFormGroup.value.sendCodeSubGroup).subscribe((res: any) => {
        console.log('res: ', res);
        if (res.status === 'Success') {
          this.showValidateSubGroup = true;
          alert(res.code);
        }
        this.createNotification(res.status.toLowerCase(), res.message);
      },
        err => {
          console.log(err);
          this.createNotification('error', 'Something went wrong. Please try again.');
          // check error status code is 500, if so, do some action
        });
    } else {
      this.isValidEmail = true;
      this.createNotification('error', "Please enter valid Email address.");
    }
  }

  onValidateCodeClicked() {
    if (this.createAccountFormGroup.controls.validateSubGroup.status === 'VALID') {
      const validateCodePayload = {
        ...this.createAccountFormGroup.value.validateSubGroup,
        email: this.createAccountFormGroup.value.sendCodeSubGroup.email
      }
      this.authService.validateCodeApi(validateCodePayload).subscribe((res: any) => {
        console.log('res: ', res);
        if (res.status === 'Success') {
          this.showPasswordSubGroup = true;
        }
        this.createNotification(res.status.toLowerCase(), res.message);
      },
        err => {
          console.log(err);
          this.createNotification('error', 'Something went wrong. Please try again.');
          // check error status code is 500, if so, do some action
        });
    } else {
      this.createNotification('error', "Please Enter Code.");
    }
  }

  onAccountCreationSaveClicked() {
    console.log('this.createAccountFormGroup: ', this.createAccountFormGroup);
    if (this.createAccountFormGroup.status === 'VALID') {

      const createAccountPayload = {
        lastName: '',
        code: this.createAccountFormGroup.value.validateSubGroup.code,
        email: this.createAccountFormGroup.value.sendCodeSubGroup.email,
        company: this.createAccountFormGroup.value.sendCodeSubGroup.fullName,
        password: this.createAccountFormGroup.value.passwordSubGroup.password,
        firstName: this.createAccountFormGroup.value.sendCodeSubGroup.fullName,
      }

      this.authService.createAccountApi(createAccountPayload).subscribe((res: any) => {
        console.log('res: ', res);
        debugger;
        if (res?.status === 'Success') {
          this.router.navigateByUrl('/login')
        }
        this.createNotification(res.status.toLowerCase(), res.message);
      },
        err => {
          console.log(err);
          this.createNotification('error', 'Make sure your password is complex. Please try again.');
          // check error status code is 500, if so, do some action
        });
    } else {
      this.createNotification('error', "Please check the required fields.");
    }
  }

  createNotification(type: string, msgText: string) {
    this.notification.create(type, msgText, '', {
      nzPlacement: 'bottom',
    })
  }
}
