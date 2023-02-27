import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childscn5Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }
  //rxjs中繼站
  private addreset = new Subject<any>();
  addreset$ = this.addreset.asObservable();
  //rxjs監聽 add頁面更新
  resetfn(company:string,number:string): void {
    let map: Map<string, string> = new Map();
    map.set('company', company);
    map.set('number', number);
    this.addreset.next(map)

  }
  //基本資料參數
  private CustomerInfoSource = new Subject<any>();
  HISTORYSource$ = this.CustomerInfoSource.asObservable();


  //設定基本資料值參數
  setHistorySource(data): void {
    this.CustomerInfoSource.next(data);
  }

  getCustomerInfoSearch(jsonObject: JSON): Observable<any> {

    const baseUrl = 'f01/childscn5';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getCuListSearch(jsonObject: JSON): Observable<any> {

    const baseUrl = 'f01/childscn5';

    return this.postJsonObject(baseUrl, jsonObject);
  }

  update(jsonObject: JSON): any {

    const baseUrl = 'f01/childscn5action1';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  insertHistory(jsonObject: JSON): any {

    const baseUrl = 'f01/childscn2action2';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getBigcompany(jsonObject: JSON): any {
    const baseUrl = 'f01/childscn5';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getData(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }
}
