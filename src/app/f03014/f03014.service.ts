
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class F03014Service extends BaseService {
  constructor(protected httpClient: HttpClient, private pipe: DatePipe) { super(httpClient); }
  dialogData: any;

  //查詢
  selectCustomer(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }
  //新增
  // Add(baseUrl: string, formData: FormData): Observable<any> {
  //   return this.postFormData(baseUrl, formData);
  // }
  Add(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }
  //更新
  update(baseUrl: string, formData: FormData): Observable<any> {
    return this.postFormData(baseUrl, formData);
  }
  downloadExcel(baseUrl: string, jsonObject:JSON): Observable<any> {

    return this.postGetFile(baseUrl, jsonObject);
  }
  postExcel(baseUrl: string, fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient.post<any>(environment.allowOrigin + '/' + baseUrl, formData);
  }
  public async seve(baseUrl: string, json: JSON):Promise<Observable<any>> {
    return this.postJsonObject(baseUrl, json).toPromise();
  }
  }
