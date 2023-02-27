import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F01005Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  // pageIndex: number, pageSize: number, empno: string, swcID: string, swcApplno: string
  getCaseList(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01005';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getEmpNo(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01005fn2';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getLockCase(jsonObject: JSON) {
    const baseUrl = 'f01/f01005fn1';

    return this.postJsonObject(baseUrl, jsonObject);
  }

  saveCaseMemo(jsonObject: JSON): any  {
    const baseUrl = 'f01/f01005fn3';
    return this.postJsonObject(baseUrl, jsonObject);
  }

  getCalloutList(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01005fn4';

    return this.postJsonObject(baseUrl, jsonObject);
  }
}