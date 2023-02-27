import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class F03016Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getImpertmentParameter(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  update(baseUrl: string, jsonObject: any): any {

    return this.saveOrEditMsgJson(baseUrl, jsonObject);

  }
}

