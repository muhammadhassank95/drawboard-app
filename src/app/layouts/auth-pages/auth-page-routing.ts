import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SigninComponent } from "src/app/components/pages/auth-pages/signin/signin.component";
import { SignupComponent } from "src/app/components/pages/auth-pages/signup/signup.component";

const routes: Routes = [{
    path: '',
    // component: SigninComponent,
    children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: SigninComponent, pathMatch: 'full', data: { title: 'Login' } },
        { path: 'create-account', component: SignupComponent, pathMatch: 'full', data: { title: 'Create Account' } }
    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthPageRoutingModule { }