import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { LoaderService } from '../services/loader/loader.service';
import { Observable, finalize } from 'rxjs';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor{
    private activeRequest: number = 0;

    constructor(private loaderService: LoaderService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.body && req.body.loader != null){
            if((req.body.loader as boolean) === false){
                delete req.body.loader
                return next.handle(req)
            }
        }

        if(!req.url.includes('test/endpoint')){ // loader exception
            this.loaderService.state(true)
        }
        this.activeRequest++;
        if(this.activeRequest === 0){
            this.loaderService.state(false);
        }

        return next.handle(req).pipe(
            finalize(() => {
                this.stopLoader();
            })
        )
    }

    private stopLoader(): void {
        this.activeRequest--;
        if(this.activeRequest === 0){
            this.loaderService.state(false);
        }
    }

}