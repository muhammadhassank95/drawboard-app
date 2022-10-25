import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DrawBoardComponent } from "src/app/components/pages/inner-pages/draw-board/draw-board.component";
import { WorkflowListingComponent } from "src/app/components/pages/inner-pages/workflow-listing/workflow-listing.component";
import { InnerPagesComponent } from "./inner-pages.component";

const routes: Routes = [{
    path: '',
    component: InnerPagesComponent,
    children: [
        { path: '', redirectTo: 'workflow-listing', pathMatch: 'full' },
        { path: 'workflow-listing', component: WorkflowListingComponent, pathMatch: 'full', data: { title: 'Workflow Listing' } },
        { path: 'cloud-map/:id', component: DrawBoardComponent, pathMatch: 'full', data: { title: 'Cloud Map' } },
        { path: 'cloud-map', component: DrawBoardComponent, pathMatch: 'full', data: { title: 'Cloud Map' } },
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InnerPageRoutingModule { }