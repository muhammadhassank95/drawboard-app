import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';


@NgModule({
  declarations: [],
  imports: [], 
  exports: [
    AgGridModule,
    ReactiveFormsModule,
    //ngZorro
    NzInputModule,
    NzButtonModule
  ]
})
export class SharedModule { }
