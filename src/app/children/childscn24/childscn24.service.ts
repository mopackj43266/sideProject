import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childscn24Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  doDssBack(jsonObject: any): any {
    const baseUrl = 'f01/childscn0action2';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }
  return(jsonObject: any): any {
    const baseUrl = 'f04/f04004action1';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }
  postJson(baseUrl: string,  json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }
}
