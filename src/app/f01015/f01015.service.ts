import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class F01015Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getReturn(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = `${baseUrl}`;

    return this.postJsonObject(targetUrl, jsonObject);
  }
  update(jsonObject: JSON): any {

    const baseUrl = 'f01/f01015action3';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  update2(jsonObject: JSON): any {

    const baseUrl = 'f01/f01016action1';

    return this.postJsonObject(baseUrl, jsonObject);
  }
  getImpertmentParameter(jsonObject:JSON): Observable<any> {
    const baseUrl = 'f01/f01015action1';
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject)
  }
  getImpertmentParameter2(jsonObject:JSON): Observable<any> {
    const baseUrl = 'f01/f01015action4';
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject)
  }

  creditDescCode = [
    {value: '1', viewValue: '尚未處理' },
    {value: 'N', viewValue: '主管退回' },
    {value: 'Y', viewValue: '主管同意' }
  ];

}
