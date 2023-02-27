import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class F03011Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  dssCallout(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  delDssCallout(baseUrl: string, json: JSON): Promise<Observable<any>> {
    return this.postJsonObject(baseUrl, json).toPromise();
  }

  add(baseUrl: string, json: JSON): any{
    return this.saveOrEditMsgJson(baseUrl, json);
  }

  update(baseUrl: string, data: any, oldtvNo: string, oldscklv:string, oldcalv:string): any {
    let jsonObject: any = {};
    jsonObject['tvNo'] = data.tvNo;
    jsonObject['scklv'] = data.scklv;
    jsonObject['calv'] = data.calv;
    jsonObject['oldtvNo'] = oldtvNo;
    jsonObject['oldscklv'] = oldscklv;
    jsonObject['oldcalv'] = oldcalv;
    return this.saveOrEditMsgJson(baseUrl, jsonObject);
  }
}
