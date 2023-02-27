import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childscn19Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getCustomerInfoSearch(formData: FormData): Observable<any> {
    const baseUrl = 'f01/childscn5';
    return this.postFormData(baseUrl, formData);
  }

  getRescanSearch(jsonObject: any): any {
    const baseUrl = 'f01/childscn19action1';
    return this.postJsonObject(baseUrl, jsonObject);
  }

  addRescan(jsonObject: any): any {
    const baseUrl = 'f01/childscn19action2';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }

  deleteRescanByRowid(jsonObject: any): any {
    const baseUrl = 'f01/childscn19action3';
    return this.saveOrEditMsgJson(baseUrl, jsonObject);
  }

  getSmsSearch(applno: string): Observable<any> {
    const baseUrl = 'f01/childscn19action4';
    let targetUrl = `${baseUrl}?applno=${applno}`;
    return this.postHttpClient(targetUrl);
  }

  getSmsContent(codeNo: string): Observable<any> {
    const baseUrl = 'f01/childscn19action5';
    let targetUrl = `${baseUrl}?codeNo=${codeNo}`;
    return this.postHttpClient(targetUrl);
  }

  addSms(jsonObject: any): any {
    const baseUrl = 'f01/childscn19action6';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }
  setrepair(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  postJson(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

}
