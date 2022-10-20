import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridReadyEvent } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/components/partials/ag-grid-helper/button-renderer/button-renderer.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-action-icons/grid-action-icons.component';

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
    public router: Router
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
  }

  newWorkflow(): void {
    this.router.navigateByUrl('cloud-map')
  }

  public setGridDataCols(): void {
    this.columnDefs = [
      { field: "name" }, 
      { field: "tags" }, 
      { field: "createdBy" }, 
      { field: "dateTime" }, 
      { field: "lastUpdated" },
      {
        headerName: 'Actions',
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onDiagramView: this.OnDiagramView.bind(this)
        }
      }
    ]
    this.rowData = [
      { id: 1, name: "Boiler Feed Water Pump", tags: "boiler, water, pump", createdBy: 'Arnold', dateTime: '10/19/2022', lastUpdated: '10/20/2022' },
      { id: 2, name: "Surveillance", tags: "lorem,ipsum,test", createdBy: 'Malek', dateTime: '10/20/2022', lastUpdated: '10/20/2022' },
      { id: 3, name: "Detailed Offline Pump Inspection", tags: "tag1,tag2,tag3", createdBy: 'Matthew', dateTime: '10/17/2022', lastUpdated: '10/19/2022' },
    ]
  }

  public onGridReady(params: GridReadyEvent){
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }

  public OnDiagramView(e: any): void {
    console.error('eeee',e)
    // this.router.navigate(['/cloud-map', e.rowData]);

  }

}
