import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childscn22Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  doDss1Search(jsonObject: any): any {
    const baseUrl = 'f01/childscn22action1';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }

  doDss2Search(jsonObject: any): any {
    const baseUrl = 'f01/childscn22action2';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }

  doDss4Search(jsonObject: any): any {
    const baseUrl = 'f01/childscn22action4';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }

  doDss3Search(jsonObject: any): any {
    const baseUrl = 'f01/childscn22action1';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }
}
