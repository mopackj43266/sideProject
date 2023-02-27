import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F06006Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getData(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  saveData(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  finish(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  delete(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  getBankInfo(jsonObject: any) {
    const baseUrl = 'f06/f06006action7';
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, jsonObject);
  }
}
