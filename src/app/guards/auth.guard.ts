import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, RoutesRecognized, UrlTree } from "@angular/router";
import { Observable, filter } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    private fmeaId!: string;
    private fmeaName!: string;

    constructor(
        private router: Router,
        public route: ActivatedRoute
        ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const token: string | null = localStorage.getItem('access-token') || null;
        if(state.url.includes('fmeaId')) {
            this.fmeaId = state.root.queryParams.fmeaId;
            this.fmeaName = state.root.queryParams.fmeaName;
            this.redirectToSignInFmea();
            return true;
        } else {
            if (token === null) this.redirectToSignIn();
            try {
            } catch {
                this.redirectToSignIn();
                alert('Invalid token')
            }
            return true;
        }
    }

    public redirectToSignIn(): void {
        this.router.navigateByUrl('/login')
    }

    public redirectToSignInFmea(): void {
        this.router.navigate([`/login/${this.fmeaId}/${this.fmeaName}`]);
    }

}