import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F01012Service  extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getLockCase(jsonObject: JSON) {
    const baseUrl = 'f01/f01012fn1';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getEmpNo(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01012fn2';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getCaseList(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01012';

    return this.postJsonObject(baseUrl, jsonObject);
  }
}
