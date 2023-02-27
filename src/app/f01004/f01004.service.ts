import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F01004Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getCaseList(jsonObject:JSON): Observable<any> {
    const baseUrl = 'f01/f01004';
    let targetUrl = `${baseUrl}`;

    return this.postJsonObject(targetUrl, jsonObject);
  }

  getEmpNo(jsonObject:JSON): Observable<any> {
    const baseUrl = 'f01/f01004fn2';
    return this.postJsonObject(baseUrl, jsonObject);
  }

  getLockCase(jsonObject: JSON){
    const baseUrl = 'f01/f01004fn1';
    return this.postJsonObject(baseUrl, jsonObject);
  }

  saveCaseMemo(jsonObject: JSON): any  {
    const baseUrl = 'f01/f01004fn3';
    return this.postJsonObject(baseUrl, jsonObject);
  }
}
