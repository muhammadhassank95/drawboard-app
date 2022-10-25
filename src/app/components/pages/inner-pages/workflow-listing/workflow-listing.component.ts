import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridReadyEvent } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/components/partials/ag-grid-helper/button-renderer/button-renderer.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-action-icons/grid-action-icons.component';
import { DrawBoardService } from 'src/app/services/draw-board/draw-board.service';
import * as moment from 'moment';

@Component({
  selector: 'app-workflow-listing',
  templateUrl: './workflow-listing.component.html',
  styleUrls: ['./workflow-listing.component.scss']
})
export class WorkflowListingComponent implements OnInit {

  public columnDefs: any;
  public rowData: any;
  public api: any
  public frameworkComponents: any;

  constructor(
    public router: Router,
    public drawBoardServices: DrawBoardService
  ) { 
    this.setFrameworksComponent()
  }

  public setFrameworksComponent(): void {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      iconRenderer: GridActionIconsComponent
    }
  }

  ngOnInit(): void {
    this.setGridDataCols();
    this.getDiagrams();
  }

  public getDiagrams(): void {
    this.drawBoardServices.getDiagram().subscribe((response: any) => {
      if(response){
        this.rowData = response;
      } 
    })
  }

  newWorkflow(): void {
    this.router.navigateByUrl('cloud-map')
  }

  public setGridDataCols(): void {
    this.columnDefs = [
      { field: "name", headerName: 'FMEA' }, 
      { field: "tag", headerName: 'Tags' }, 
      { field: "createdBy" }, 
      { field: "createdDate", valueFormatter: (param: any) => this.dateFormatter(param) }, 
      { field: "lastUpdate", valueFormatter: (param: any) => this.dateFormatterLastUpdate(param) },
      {
        headerName: 'Actions',
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onDiagramView: this.OnDiagramView.bind(this)
        }
      }
    ]
    
  }

  public onGridReady(params: GridReadyEvent){
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }

  public OnDiagramView(e: any): void {
    console.error('eeee',e)
    this.router.navigate([`/cloud-map/${e.rowData.id}`]);

  }

  dateFormatter(params: any) {
    return params ? moment.utc(params.data.createdDate).format('MM/DD/YYYY') : "";
  }

  dateFormatterLastUpdate(params: any) {
    return params ? moment.utc(params.data.lastUpdate).format('MM/DD/YYYY') : "";
  }

}
