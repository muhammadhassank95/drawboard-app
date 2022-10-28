import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { GridReadyEvent } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/components/partials/ag-grid-helper/button-renderer/button-renderer.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-action-icons/grid-action-icons.component';
import { DrawBoardService } from 'src/app/services/draw-board/draw-board.service';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-workflow-listing',
  templateUrl: './workflow-listing.component.html',
  styleUrls: ['./workflow-listing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WorkflowListingComponent implements OnInit {

  public columnDefs: any;
  public rowData: any;
  public api: any
  public frameworkComponents: any;
  public searchString: string = '';
  public gridApi: any;
  public gridColumnApi: any;

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
      { field: "name", headerName: 'FMEA', minWidth: 300 },
      { field: "createdDate", headerName: 'Created On', valueFormatter: (param: any) => this.dateFormatter(param) },
      { field: "createdBy", headerName: 'Created By' },
      {
        field: "tag", headerName: 'Tags', minWidth: 300,
        valueGetter: (paramm: any) => this.tagsGetter(paramm),
        cellRenderer: (paramm: any) => this.renderCell(paramm)
      },
      // { field: "lastUpdate", valueFormatter: (param: any) => this.dateFormatterLastUpdate(param) },
      {
        headerName: 'Actions',
        cellRenderer: 'iconRenderer', minWidth: 200, maxWidth: 200,
        cellRendererParams: {
          onDiagramView: this.OnDiagramView.bind(this),
          onDiagramShare: this.onDiagramShare.bind(this),
          onDiagramDelete: this.showDeleteConfirm.bind(this),
        }
      }
    ]
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();

    params.api.sizeColumnsToFit();
    window.addEventListener("resize", function() {
      setTimeout(function() {
        params.api.sizeColumnsToFit();
      });
    });
  }

  OnDiagramView(e: any) {
    this.router.navigate([`/cloud-map/${e.rowData.id}`]);
  }

  onDiagramShare(e: any) {
    console.log('share', e)
    const link = `https://causemap.azurewebsites.net/cloud-map/${e.rowData.id}`;
  }

  showDeleteConfirm(e: any): void {
    console.log(e.rowData.name)
    this.modal.confirm({
      nzTitle: 'Delete FMEA',
      nzContent: 'Deleting an FMEA will send it to the Archives. Are you sure you want to delete <b>'+e.rowData.name+'</b>?',
      nzOkText: 'Yes',
      nzClassName: 'delete-modal',
      // nzOkType: 'primary',
      // nzOkDanger: true,
      nzOnOk: () => this.OnDiagramDelete(e),
      nzCancelText: 'Cancel',
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
