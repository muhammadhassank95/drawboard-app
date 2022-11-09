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
  public createAccountFormGroup!: FormGroup;
  public showValidateSubGroup = false;
  public showPasswordSubGroup = false;
  constructor(
    private router: Router,
    private authService: SigninService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.initializeFormgroup();
  }

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
      console.log('this.createAccountFormGroup: ', this.createAccountFormGroup);
      this.authService.sendCodeApi(this.createAccountFormGroup.value.sendCodeSubGroup).subscribe((res: any) => {
        console.log('res: ', res);
        if(res.status === 'Success') {
          this.showValidateSubGroup = true;
          this.createNotification(res.status.toLowerCase(), res.message);
          alert(res.code);
        }
      })
    } else {
      this.createNotification('error', "Please enter Email, Full Name and Company field.");
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
        if(res.status === 'Success') { 
          this.showPasswordSubGroup = true;
          this.createNotification(res.status.toLowerCase(), res.message);
        } else {
          this.createNotification(res.status.toLowerCase(), res.message);
        }
      })
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
        if(res.status === 'Success') {
          this.createNotification(res.status.toLowerCase(), res.message);
          this.router.navigateByUrl('/login')
        } else {
          this.createNotification(res.status.toLowerCase(), res.message);
        }
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
