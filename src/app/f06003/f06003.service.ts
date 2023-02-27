import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F06003Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getData(baseUrl: string, jsonObject: JSON): Observable<any>  {
    return this.postJsonObject(baseUrl, jsonObject);
  }
  inquiry(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = baseUrl;
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
