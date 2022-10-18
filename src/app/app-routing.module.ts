import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';

const innerRoutes: Route = {
  path: '',
  loadChildren: () => import('./layouts/inner-pages/inner-page.module').then((m) => m.InnerPageModule)
}

const routes: Routes = [innerRoutes];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
