import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F01006Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  private restart = new Subject<any>();
  restart$ = this.restart.asObservable();

  restartfn(): void {
    this.restart.next()
  }

  getCaseList(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01006';
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  addRestart(jsonObject: any): any {
    const baseUrl = 'f01/f01006action1';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }

  getInterestData(jsonObject: any): any {
    const baseUrl = 'f01/f01006action2';
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject);

  }

  getReasonData(jsonObject: any): any {
    const baseUrl = 'f01/f01006action3';
    let targetUrl = `${baseUrl}`;

    return this.postJsonObject(targetUrl, jsonObject);

  }
  getDate_Json(baseUrl: string,  json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }
  getInterestBase(baseUrl: string, json: JSON): any {
    return this.saveOrEditMsgJson(baseUrl, json);
  }
  getImfornation(baseUrl: string, json: JSON){
    return this.postJsonObject(baseUrl, json);
  }

}
