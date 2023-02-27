import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F01002Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getCaseList(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01002';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getEmpNo(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01002fn2';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getLockCase(jsonObject: JSON) {
    const baseUrl = 'f01/f01002fn1';

    return this.postJsonObject(baseUrl, jsonObject);
  }

  saveCaseMemo(jsonObject: JSON): any  {
    const baseUrl = 'f01/f01002fn3';
    return this.postJsonObject(baseUrl, jsonObject);
  }

  getCalloutList(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01002fn4';

    return this.postJsonObject(baseUrl, jsonObject);
  }

  updateCalloutTime(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01002fn5';

    return this.postJsonObject(baseUrl, jsonObject);
  }

  updateCalloutYN(jsonObject: JSON):any {
    const baseUrl = 'f01/f01002fn6';

    return this.saveOrEditMsgJson(baseUrl, jsonObject);
  }

}
