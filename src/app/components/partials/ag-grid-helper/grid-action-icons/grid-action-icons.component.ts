import { Component, Input, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-grid-action-icons',
  templateUrl: './grid-action-icons.component.html',
  styleUrls: ['./grid-action-icons.component.scss']
})
export class GridActionIconsComponent implements ICellRendererAngularComp {

  public params: any;
  public type: string = '';
  public currentRoute: string = '';
  public categoryActions: any[] = [];
  @Input() showTestRun: boolean = true;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;
    this.setType(params);
    return true;
  }

  setType(params: any): void {
    this.type = params?.type ?? '';
  }

  OnDiagramView(event: any): void {
    if(this.params.onDiagramView instanceof Function){
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onDiagramView(params);
    }
  }

  OnDiagramDelete(event: any): void {
    if(this.params.onDiagramDelete instanceof Function){
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onDiagramDelete(params);
    }
  }

  OnDiagramShare(event: any): void {
    if(this.params.onDiagramDelete instanceof Function){
      const params: any = {
        event: event,
        rowData: this.params.node.data,
      };
      this.params.onDiagramShare(params);
    }
  }

}
