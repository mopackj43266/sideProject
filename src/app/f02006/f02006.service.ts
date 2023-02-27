import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { Mapping } from '../interface/base';

@Injectable({
  providedIn: 'root'
})
export class F02006Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  f02006set(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }
  public getSysTypeCode(codeType: string): Observable<Mapping> {
    let targetUrl = `sys/getMappingCode?codeType=${codeType}`;
    return this.postHttpClient(targetUrl);
  }

}
