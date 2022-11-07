import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor() { }

  state(data: boolean): void {
    this.isLoading.next(data);
  }

  getState(): Observable<any> {
    return this.isLoading.asObservable();
  }

}
