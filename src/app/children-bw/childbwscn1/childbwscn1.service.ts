import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';


@Injectable({
  providedIn: 'root'
})
export class Childbwscn1Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  postJson(baseUrl: string,  json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  saveCreditmemo(baseUrl: string, json: JSON): any {
    return this.saveOrEditMsgJson(baseUrl, json);
  }

}
