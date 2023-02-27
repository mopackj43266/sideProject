import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../base.service';



@Injectable({
  providedIn: 'root'
})
export class F01016Service extends BaseService {

  applno: string //案編
  page: string //頁數
  empno: string//員編

  constructor(protected httpClient: HttpClient) { super(httpClient); }
  private restart = new Subject<any>();
  restart$ = this.restart.asObservable();

  restartfn(): void {
    this.restart.next()
  }

  getReturn(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  getCaseList(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01016';
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject)
  }

  getbaSuiManage(jsonObject: any): any {
    const baseUrl = 'f01/f01016action2';
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  //紀錄案編
  setApplno(applno: string) {
    this.applno = applno

  }
  //取得案編
  getApplno() {
    return this.applno
  }
  //紀錄頁數
  setPage(page: string) {
    this.page = page
  }
  //取得頁數
  getPage() {
    return this.page
  }
  //紀錄員編
  setEmpno(empno: string) {
    this.empno = empno
  }
  //取得員編
  getEmpno() {
    return this.empno
  }
}
