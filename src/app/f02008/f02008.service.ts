import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F02008Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getData(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  postJson(baseUrl: string, json: JSON) {
    return this.postJsonObject(baseUrl,json);
  }
}
