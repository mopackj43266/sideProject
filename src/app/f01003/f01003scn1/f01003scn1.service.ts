import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class F01003Scn1Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  dialogData: any;

  //歷史資料參數
  private HISTORYSource = new Subject<any>();
  HISTORYSource$ = this.HISTORYSource.asObservable();

  //設定歷史資料原值參數
  setHistorySource(data): void {
    this.HISTORYSource.next(data);
  }

  send(baseUrl: string, json: JSON) {
    return this.postJsonObject(baseUrl, json);
  }

  //記錄代償資訊
  private DebtSource = new Subject<any>();
  DebtSource$ = this.DebtSource.asObservable();

  setDebtSource(data): void {
    this.DebtSource.next(data);
  }
}
