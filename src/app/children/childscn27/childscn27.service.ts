import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childscn27Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  postJson(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  getCustomerInfoSearch(formData: FormData): Observable<any> {
    const baseUrl = 'f01/childscn5';
    return this.postFormData(baseUrl, formData);
  }

  getSmsContent(codeNo: string): Observable<any> {
    const baseUrl = 'f01/childscn19action5';
    let targetUrl = `${baseUrl}?codeNo=${codeNo}`;
    return this.postHttpClient(targetUrl);
  }
  
}
