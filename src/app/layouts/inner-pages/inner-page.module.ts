import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InnerPageRoutingModule } from './inner-page.routing';
import { DrawBoardComponent } from 'src/app/components/pages/inner-pages/draw-board/draw-board.component';
import { FormsModule } from '@angular/forms';
import { InnerPagesComponent } from './inner-pages.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkflowListingComponent } from 'src/app/components/pages/inner-pages/workflow-listing/workflow-listing.component';
import { ButtonRendererComponent } from 'src/app/components/partials/ag-grid-helper/button-renderer/button-renderer.component';
import { GridActionIconsComponent } from 'src/app/components/partials/ag-grid-helper/grid-action-icons/grid-action-icons.component';



@NgModule({
  declarations: [
    DrawBoardComponent, 
    InnerPagesComponent, 
    WorkflowListingComponent,
    ButtonRendererComponent,
    GridActionIconsComponent
  ],
  imports: [
    CommonModule,
    InnerPageRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class InnerPageModule { }
