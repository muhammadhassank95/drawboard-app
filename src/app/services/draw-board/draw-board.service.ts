import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class DrawBoardService {

  constructor(private apiService: ApiService) { }

  public getDiagram(): Observable<any>{ 
    return this.apiService.get('/Diagrams');
  }

  public getDiagramByid(id: string): Observable<any>{ 
    return this.apiService.get(`/Diagrams/${id}`);
  }

  public addDiagram(data: any): Observable<any>{
    console.error('data',data)
    return this.apiService.post(`/Diagrams`, data);
  }

  public updateDiagram(id: string,data: any): Observable<any>{
    console.error('data update',data)
    return this.apiService.put(`/Diagrams/${id}`, data);
  }


}
