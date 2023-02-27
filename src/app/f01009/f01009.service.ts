import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F01009Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  getCaseList(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01009';
    return this.postJsonObject(baseUrl, jsonObject);
  }

  getLockCase(jsonObject: JSON){
    const baseUrl = 'f01/f01009fn1';
    return this.postJsonObject(baseUrl, jsonObject);
  }

  getEmpNo(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01009fn2';
    return this.postJsonObject(baseUrl, jsonObject);
  }

  saveCaseMemo(jsonObject: JSON): any  {
    const baseUrl = 'f01/f01009fn3';
    return this.saveOrEditMsgJson(baseUrl, jsonObject);
  }

  postJson(baseUrl: string,  json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

}
