import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class F03010Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  //取話術Table
  Speaking(baseUrl: string, json: JSON){
    return this.postJsonObject(baseUrl, json);
  }

  //編輯
  saveSpeaking(baseUrl: string, data: any): any {
    let jsonObject: any = {};
    jsonObject['speakingAbbreviation'] = data.speakingAbbreviation;
    jsonObject['stopFlag'] = data.stopFlag;
    jsonObject['speakingContent'] = data.speakingContent;
    return this.saveOrEditMsgJson(baseUrl, jsonObject);
  }
}
