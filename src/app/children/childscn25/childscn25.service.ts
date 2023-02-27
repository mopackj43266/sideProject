import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childscn25Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

//取Table資料
  getRpmAndSrp(baseUrl: string,applno: string){
    let jsonObject: any = {};
    jsonObject['applno'] = applno;
    return this.postJsonObject(baseUrl, jsonObject);
  }
}
