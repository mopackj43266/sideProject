import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class F01007scn1Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  dialogData: any;

  //歷史資料參數
  private HISTORYSource = new Subject<any>();
  HISTORYSource$ = this.HISTORYSource.asObservable();

   //設定歷史資料原值參數
   setHistorySource(data): void {
    this.HISTORYSource.next(data);
  }

  saveOrEditMsgJson(baseUrl: string, json: JSON): any {
    return this.saveOrEditMsgJson(baseUrl, json);
  }

  send(baseUrl: string, json: JSON){
    return this.postJsonObject( baseUrl, json);
  }
}
