import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F02010Service extends BaseService{

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getResultData(jsonObject: JSON): Observable<any> {
    let targetUrl = 'f02/f02010action1';
    return this.postJsonObject(targetUrl, jsonObject);
  }

  getNewOption(jsonObject: JSON): Observable<any> {
    let targetUrl = 'f02/f02010action2';
    return this.postJsonObject(targetUrl, jsonObject);
  }
  getTableDate(pageIndex: number, pageSize: number, data: any): any {
    let start: number = (pageIndex - 1) * pageSize;
    let count: number = 0;
    let newData = [];
    for (let index = start; index < data.length; index++) {
      newData.push(data[index]);
      count = count + 1;
      if (count == pageSize) {
        break;
      }
    }
    return newData;
  }
}
