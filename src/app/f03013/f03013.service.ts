import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F03013Service extends BaseService {
  baseUrl = 'f03/';
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  createCalendar(jsonObject: JSON): any {
    let targetUrl = this.baseUrl + 'f03013action1';
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }
  queryIsWorkDay(jsonObject: JSON): Observable<any> {
    let targetUrl = this.baseUrl + 'f03013action2';
    return this.postJsonObject(targetUrl, jsonObject);
  }
  updateWorkingDate(jsonObject: JSON): Observable<any> {
    let targetUrl = this.baseUrl + 'f03013action3';
    return this.postJsonObject(targetUrl, jsonObject);
  }
}
