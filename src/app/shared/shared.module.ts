import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    AgGridModule,
    ReactiveFormsModule,
    //ngZorro
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzTagModule,
    NzAvatarModule,
    NzToolTipModule
  ]
})
export class SharedModule { }
