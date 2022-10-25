import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public endpointUrl = environment.API.ENDPOINT;
  constructor(
    private httpClient: HttpClient
  ) { }

  // public get httpOptions(): any {
  //   return {
  //     headers: new HttpHeaders({
  //       'Content Type': 'application/json',
  //       Accept: 'application/json'
  //     })
  //   }
  // }

  public get(path: string): Observable<any> {
    // let httpOptions = { ...this.httpOptions };
    return this.httpClient.get(`${this.endpointUrl}${path}`).pipe(map((mapData: any) => mapData))
  }

  public post(path: string, data?: any): Observable<any> {
    return this.httpClient.post(`${this.endpointUrl}${path}`, data)
      .pipe(map((mapData: any) => mapData))
  }

  public put(path: string, data?: any): Observable<any> {
    return this.httpClient.put(`${this.endpointUrl}${path}`, data,)
      .pipe(map((mapData: any) => mapData))
  }

  public delete(pathWithId: string): Observable<any> {
    return this.httpClient.delete(`${this.endpointUrl}${pathWithId}`)
      .pipe(map((mapData: any) => mapData))
  }
}
