import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F03005Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  dialogData: any;

  getAdrCodeList(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  addOrEditAdrCodeSet(baseUrl: string, data: any): any {
    let jsonObject: any = {};
    jsonObject['reasonKind'] =  data.reasonKind;
    jsonObject['upReasonCode'] = data.upReasonCode;
    jsonObject['reasonCode'] = data.reasonCode;
    jsonObject['reasonDesc'] = data.reasonDesc;
    jsonObject['reasonSort'] = data.reasonSort;
    jsonObject['reasonFlag'] = data.reasonFlag;
    jsonObject['reasonLevel'] = data.reasonLevel;
    return this.saveOrEditMsgJson(baseUrl, jsonObject);
  }
}
