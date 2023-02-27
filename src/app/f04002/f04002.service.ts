import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F04002Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }


  getSTEP_ERRORFunction(baseUrl: string, step: String,page: number,per_page: number): Observable<any> {

    let jsonObject: any = {};

    jsonObject['step'] = step;
    jsonObject['page'] = page;
    jsonObject['per_page'] = per_page;
    return this.postJsonObject(baseUrl, jsonObject);

  }

  newSearch_Decline_STEP_ERRORFunction(baseUrl: string,step: string, formData: string[], result: string): Observable<any> {
    let jsonObject: any = {};

    jsonObject['step'] = step;
    jsonObject['applnoList'] = formData;
    jsonObject['result'] = result;
    return this.postJsonObject(baseUrl, jsonObject);
  }




}
