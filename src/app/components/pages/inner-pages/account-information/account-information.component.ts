import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.scss']
})
export class AccountInformationComponent implements OnInit {

  public formGroup!: FormGroup;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeFormGroup();
  }

  public initializeFormGroup(): void {
    this.formGroup = new FormGroup({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      company: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required),
    })
  }

  public changePassword(): void {

  }

  public close(): void {
    this.router.navigateByUrl('/')
  }

}
