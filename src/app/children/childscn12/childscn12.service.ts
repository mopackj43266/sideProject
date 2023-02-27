import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../base.service';

interface sysCode {
  codE_NO: string;
  codE_DESC: string;

}

@Injectable({
  providedIn: 'root'
})
export class Childscn12Service extends BaseService {
  Condition!: sysCode[] ;
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getInComeFunction( baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  public async childscn12Action(baseUrl: string, json: JSON): Promise<Observable<any>> {
    return await this.postJsonObject(baseUrl, json).toPromise();
  }

  postJson(baseUrl: string, json: JSON) {
    return this.postJsonObject(baseUrl, json);
  }

}
