import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F02004Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getRescanEmpno(baseUrl: string): Observable<any> {
    return this.postHttpClient(baseUrl);
  }

  f02002(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }
  getStatusDesc(): Observable<any>{
    let targetUrl = 'f02/f02001';
    let jsonObject: any = {};
    return this.postJsonObject(targetUrl, jsonObject);
  }
  

}
