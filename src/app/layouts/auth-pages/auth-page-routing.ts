import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SigninComponent } from "src/app/components/pages/auth-pages/signin/signin.component";

const routes: Routes = [{
    path: '',
    component: SigninComponent,
    children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: SigninComponent, pathMatch: 'full', data: { title: 'Login' } },
        { path: 'login/:fmeaId/:fmeaName', component: SigninComponent, data: { title: 'Login FMEA' } },
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthPageRoutingModule { }