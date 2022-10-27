import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridReadyEvent } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/components/partials/ag-grid-helper/button-renderer/button-renderer.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-action-icons/grid-action-icons.component';
import { DrawBoardService } from 'src/app/services/draw-board/draw-board.service';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';

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
  public searchString: string = '';

  constructor(
    private router: Router,
    private drawBoardServices: DrawBoardService,
    private modal: NzModalService
  ) {
    this.setFrameworksComponent()
  }

  public setFrameworksComponent() {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      iconRenderer: GridActionIconsComponent
    }
  }

  ngOnInit() {
    this.setGridDataCols();
    this.getDiagrams();
  }

  getDiagrams() {
    this.drawBoardServices.getDiagram().subscribe((response: any) => {
      if (response) {
        this.rowData = response;
      }
    })
  }

  newWorkflow() {
    this.router.navigateByUrl('cloud-map')
  }

  setGridDataCols() {
    this.columnDefs = [
      { field: "name", headerName: 'FMEA' },
      { 
        field: "tag", headerName: 'Tags', 
        valueGetter: (paramm: any) => this.tagsGetter(paramm), 
        cellRenderer: (paramm: any) => this.renderCell(paramm) 
      },
      { field: "createdBy" },
      { field: "createdDate", valueFormatter: (param: any) => this.dateFormatter(param) },
      { field: "lastUpdate", valueFormatter: (param: any) => this.dateFormatterLastUpdate(param) },
      {
        headerName: 'Actions',
        cellRenderer: 'iconRenderer',
        cellRendererParams: {
          onDiagramView: this.OnDiagramView.bind(this),
          onDiagramShare: this.onDiagramShare.bind(this),
          onDiagramDelete: this.showDeleteConfirm.bind(this),
        }
      }
    ]
  }

  onGridReady(params: GridReadyEvent) {
    this.api = params.api;
    params.api.sizeColumnsToFit();
  }

  OnDiagramView(e: any) {
    this.router.navigate([`/cloud-map/${e.rowData.id}`]);
  }

  onDiagramShare(e: any) {
    console.log('share', e)
  }

  showDeleteConfirm(e: any): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this diagram?',
      // nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.OnDiagramDelete(e),
      nzCancelText: 'No',
      nzOnCancel: () => true
    });
  }

  OnDiagramDelete(e: any) {
    this.drawBoardServices.deleteDiagram(e.rowData.id).subscribe((res: any) => {
      console.log('...Fetching new records...')
      this.getDiagrams()
    });
  }

  public filterListing(searchString: KeyboardEvent): void {
    this.api.setQuickFilter(this.searchString)
  }

  dateFormatter(params: any) {
    return params ? moment.utc(params.data.createdDate).format('MM/DD/YYYY') : "";
  }

  dateFormatterLastUpdate(params: any) {
    return params ? moment.utc(params.data.lastUpdate).format('MM/DD/YYYY') : "";
  }

  tagsGetter(params: any): any {
    let tags: any = [];
    params.data.tags.forEach((data: any, i: number) => {
      tags.push(data.name)
    })
    return tags;
  }

  renderCell(params: any): any {
    let tags: any = [];
    params.data.tags.forEach((data: any, i: number) => {
      if(i <= 3){
        tags.push(`<span class="border border-gray-400 rounded-full py-1 px-2 text-[10px]">${data.name}</span>`)
      }
      if(i === 4){
        tags.push(`<span class="ml-1 text-[13px]">...</span>`)
      }
    })
    return `${[...tags]}`;
  }
}
