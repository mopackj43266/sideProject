import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F04001Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  saveFlowStep(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f04/f04001fn2';
    

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getLockApplno(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f04/f04001fn1';
    return this.postJsonObject(baseUrl, jsonObject);
  }

}
