import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class F01004Scn1Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  private JCICSource = new Subject<any>();
  JCICSource$ = this.JCICSource.asObservable();
  private JCICAddSource = new Subject<any>();
  JCICAddSource$ = this.JCICAddSource.asObservable();
  private JCICItemsSource = new Subject<any>();
  JCICItemsSource$ = this.JCICItemsSource.asObservable();
  //歷史資料參數
  private HISTORYSource = new Subject<any>();
  HISTORYSource$ = this.HISTORYSource.asObservable();

  setJCICSource(data): void {
    this.JCICSource.next(data);
  }

  setJCICAddSource(data): void {
    this.JCICAddSource.next(data);
  }

  setJCICItemsSource(data): void {
    this.JCICItemsSource.next(data);
  }

  //設定歷史資料原值參數
  setHistorySource(data): void {
    this.HISTORYSource.next(data);
  }

  dialogData: any;

  saveOrEditMsgJson(baseUrl: string, json: JSON): any {
    return this.saveOrEditMsgJson(baseUrl, json);
  }

  send(baseUrl: string, json: JSON){
    return this.postJsonObject( baseUrl, json);
  }
}
