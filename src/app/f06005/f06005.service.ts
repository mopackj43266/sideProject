import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F06005Service extends BaseService {

  constructor(protected httpClient: HttpClient) {super(httpClient);  }

   //rxjs中繼站
   private addreset = new Subject<any>();
   addreset$ = this.addreset.asObservable();
 
   //rxjs監聽 add頁面更新
   resetfn(data:{}): void {
     this.addreset.next(data)
   }
   getData(baseUrl: string, jsonObject: JSON): Observable<any> {
     return this.postJsonObject(baseUrl, jsonObject);
   }
   inquiry(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, jsonObject);
  }
   
   
   insertHistory(jsonObject: JSON): any {

    const baseUrl = 'f01/childscn2action2';

    return this.postJsonObject(baseUrl, jsonObject);
  }
}