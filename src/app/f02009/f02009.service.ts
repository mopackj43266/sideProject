import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F02009Service  extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  dialogData: any;
  getCaseList2(baseUrl: string, pageIndex: number, pageSize: number, formData: FormData): Observable<any> {
    let targetUrl = `${baseUrl}?page=${pageIndex + 1}&per_page=${pageSize}`;
    return this.postFormData(targetUrl, formData);
  }

  getStatusDesc(): Observable<any>{
    let targetUrl = 'f02/f02001';
    let jsonObject: any = {};
    return this.postJsonObject(targetUrl, jsonObject);
  }

  changeStatsCode(jsonObject: JSON): Observable<any>{
    let targetUrl = 'f02/f02001scn1';
    return this.postJsonObject(targetUrl, jsonObject);
  }
  inquiry(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, jsonObject);
  }
  getReturn(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = `${baseUrl}`;

    return this.postJsonObject(targetUrl, jsonObject);
  }
}
