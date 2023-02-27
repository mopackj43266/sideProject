import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childbwscn3Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getJCICSearch(json: JSON): Observable<any> {
    const baseUrl = 'f01/childbwscn3action';
    return this.postJsonObject(baseUrl, json);
  }

  getDate(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  getMASTERJCICSearch(json: JSON): Observable<any> {
    const baseUrl = 'f01/childbwscn3action1';
    return this.postJsonObject(baseUrl, json);
  }
  getMASTERJCICList(json: JSON): Observable<any> {
    const baseUrl = 'f01/childbwscn3action3';
    return this.postJsonObject(baseUrl, json);
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
