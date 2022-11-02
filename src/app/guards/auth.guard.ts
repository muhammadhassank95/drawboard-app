import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const token: string | null = localStorage.getItem('access-token') || null;
        if (token === null) this.redirectToSignIn();
        try {
        } catch {
            this.redirectToSignIn();
            alert('Invalid token')
        }
        return true;
    }

    public redirectToSignIn(): void {
        this.router.navigateByUrl('/login')
    }

}