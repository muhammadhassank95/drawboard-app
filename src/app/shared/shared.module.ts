import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    AgGridModule,
    ReactiveFormsModule,
    //ngZorro
    NzTagModule,
    NzIconModule,
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzAvatarModule,
    NzToolTipModule,
    NzPopoverModule,
    NzCheckboxModule,
    NzNotificationModule
  ]
})
export class SharedModule { }
