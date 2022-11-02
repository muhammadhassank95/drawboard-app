import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountInformationComponent } from "src/app/components/pages/inner-pages/account-information/account-information.component";
import { DrawBoardComponent } from "src/app/components/pages/inner-pages/draw-board/draw-board.component";
import { WorkflowListingComponent } from "src/app/components/pages/inner-pages/workflow-listing/workflow-listing.component";
import { AuthGuard } from "src/app/guards/auth.guard";
import { InnerPagesComponent } from "./inner-pages.component";

const routes: Routes = [{
    path: '',
    canActivate: [AuthGuard],
    component: InnerPagesComponent,
    children: [
        { path: '', redirectTo: 'workflow-listing', pathMatch: 'full' },
        { path: 'workflow-listing', component: WorkflowListingComponent, pathMatch: 'full', data: { title: 'Workflow Listing' } },
        { path: 'cloud-map/:id', component: DrawBoardComponent, pathMatch: 'full', data: { title: 'Cloud Map' } },
        { path: 'cloud-map', component: DrawBoardComponent, pathMatch: 'full', data: { title: 'Cloud Map' } },
        { path: 'account-information', component: AccountInformationComponent, pathMatch: 'full', data: { title: 'Account Information' } },
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InnerPageRoutingModule { }