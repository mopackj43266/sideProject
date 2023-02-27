import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class F01002Scn2Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  //徵信照會編輯
  private JCICSource = new Subject<any>();
  JCICSource$ = this.JCICSource.asObservable();
  //徵信照會新增
  private JCICAddSource = new Subject<any>();
  JCICAddSource$ = this.JCICAddSource.asObservable();
  //徵信照會項目
  private JCICItemsSource = new Subject<any>();
  JCICItemsSource$ = this.JCICItemsSource.asObservable();
  //徵審代碼
  private CREDITSource = new Subject<any>();
  CREDITSource$ = this.CREDITSource.asObservable();
  //歷史資料參數
  private HISTORYSource = new Subject<any>();
  HISTORYSource$ = this.HISTORYSource.asObservable();


  //徵信照會編輯
  setJCICSource(data): void {
    this.JCICSource.next(data);
  }
  //徵信照會新增
  setJCICAddSource(data): void {
    this.JCICAddSource.next(data);
  }
  //徵信照會項目
  setJCICItemsSource(data): void {
    this.JCICItemsSource.next(data);
  }

  //徵審代碼
  setCREDITSource(data): void {
    this.CREDITSource.next(data);
  }

  //設定歷史資料原值參數
  setHistorySource(data): void {
    this.HISTORYSource.next(data);
  }

  dialogData: any;

  saveOrEditMsgJson(baseUrl: string, json: JSON): any {
    return this.saveOrEditMsgJson(baseUrl, json);
  }

  send(baseUrl: string, json: JSON) {
    return this.postJsonObject(baseUrl, json);
  }
}
