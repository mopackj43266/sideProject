import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Childscn15Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  //取Table資料
  getReason(baseUrl: string, applno: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = applno;
    return this.postJsonObject(baseUrl, jsonObject);
  }

  //儲存Table資料
  public async saveReason(baseUrl: string, json: JSON): Promise<Observable<any>> {
    return await this.postJsonObject(baseUrl, json).toPromise();
  }


}
