import * as moment from 'moment';
import { Router } from '@angular/router';
import { GridReadyEvent } from 'ag-grid-community';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DrawBoardService } from 'src/app/services/draw-board/draw-board.service';
import { ButtonRendererComponent } from 'src/app/components/partials/ag-grid-helper/button-renderer/button-renderer.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-action-icons/grid-action-icons.component';
import { DeleteDiagramModalComponent } from 'src/app/components/partials/modals/delete-diagram-modal/delete-diagram-modal.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-workflow-listing',
  templateUrl: './workflow-listing.component.html',
  styleUrls: ['./workflow-listing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class WorkflowListingComponent implements OnInit {
  public api: any
  public rowData: any;
  public columnDefs: any;
  public selectedRowToDlt: any;
  public searchString: string = '';
  public gridApi: any;
  public gridColumnApi: any;
  public frameworkComponents: any;
  public setFrameworksComponent() {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
      iconRenderer: GridActionIconsComponent
    }
  }

  @ViewChild('deleteModal') deleteModal!: DeleteDiagramModalComponent;

  constructor(
    private router: Router,
    private notification: NzNotificationService,
    private drawBoardServices: DrawBoardService,
    private clipboard: Clipboard
  ) {
    this.setFrameworksComponent();
  }

  ngOnInit() {
    this.setGridDataCols();
    this.getDiagrams();
  }

  getDiagrams() {
    this.drawBoardServices.getDiagram().subscribe((response: any) => {
      if (response) this.rowData = response;
    })
  }

  newWorkflow() {
    this.router.navigateByUrl('cloud-map');
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
    window.addEventListener("resize", function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  }

  OnDiagramView(e: any) {
    this.router.navigate([`/cloud-map/${e.rowData.id}`]);
  }

  onDiagramShare(e: any) {
    let link: string = '';

    location.origin.includes('localhost:4200') ?
      link = `http://localhost:4200/cloud-map?fmeaId=${e.rowData.id}&fmeaName=${e.rowData.name}` :
      link = `https://causemap.azurewebsites.net/cloud-map?fmeaId=${e.rowData.id}&fmeaName=${e.rowData.name}`

    this.clipboard.copy(link);
    this.createNotification('success', `${e.rowData.name} Copied to clipboard`);
  }

  showDeleteConfirm(e: any): void {
    this.selectedRowToDlt = e.rowData;
    this.deleteModal.isVisible = true;
  }

  public filterListing(searchString: KeyboardEvent): void {
    this.gridApi.setQuickFilter(this.searchString);
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
      if (i <= 3) tags.push(`<span class="border border-gray-400 rounded-full py-1 px-2 text-[10px] ml-2 mr-2 mb-2">${data.name}</span>`);
      if (i === 4) tags.push(`<span class="ml-2 text-[13px] mr-2 mb-2">...</span>`);
    });
    return tags.join(' ');
  }

  onDeleteClick(row: any) {
    this.drawBoardServices.deleteDiagram(row.id).subscribe((res: any) => {
      if (res.status === 'success') {
        console.log('...Fetching new records...');
        this.deleteModal.isVisible = false;
        this.getDiagrams();
        this.createNotification('success', 'Deleted Successfully.'); // ...need proper response from Malek...
      } else {
        this.createNotification('error', 'Something went wrong.');
      }
    });
  }

  createNotification(type: string, msgText: string) {
    this.notification.create(type, msgText, '', {
      nzPlacement: 'bottom',
    })
  }
}
