import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandleSubscribeService {

  constructor() { }

  private calloutSource = new Subject<void>();
  calloutSource$ = this.calloutSource.asObservable();

  updateCallout(): void {
    this.calloutSource.next();
  }

}
