import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public showLoader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }

  getLoader(): Observable<boolean> {
    return this.showLoader.asObservable();
  }

  show() {
    this.showLoader.next(true);
  }

  hide() {
    this.showLoader.next(false);
  }
}
