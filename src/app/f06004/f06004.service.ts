import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F06004Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getData(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  saveData(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  finish(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  delete(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  checkAcc(debtData: any[]): boolean {
    let existAcc: string[] = [];
    for (let index = 0; index < debtData.length; index++) {
      if (existAcc.indexOf(debtData[index].ACCOUNT_NO) == -1) {
        existAcc.push(debtData[index].ACCOUNT_NO);
      } else {
        return false;
      }
    }
    return true;
  }

  checkBlank(checkBlank: any): boolean {
    for (let index = 0; index < checkBlank.length; index++) {
      if (checkBlank[index] == '' || checkBlank[index] == null || checkBlank[index] == undefined || checkBlank[index] == '0') {
        return false;
      }
    }
    return true;
  }

  checkOnlyNumber(checkArray: any): boolean {
    for (let index = 0; index < checkArray.length; index++) {
      if (!Number(checkArray[index])) {
        return false;
      }
    }
    return true;
  }
}
