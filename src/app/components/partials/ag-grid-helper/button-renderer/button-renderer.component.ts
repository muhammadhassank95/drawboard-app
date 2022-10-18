import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss']
})
export class ButtonRendererComponent implements ICellRendererAngularComp {

  public params: any;
  public label: any;
  agInit(params: any): void{
    this.params = params;
    this.label = this.params.label;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event: any): void {
    if(this.params.onClick instanceof Function){
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onClick(this.params)
    }
  }

}
