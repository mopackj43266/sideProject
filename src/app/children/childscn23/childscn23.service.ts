import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';


@Injectable({
  providedIn: 'root'
})
export class Childscn23Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getdropdown( baseUrl: string ): Observable<any> {
    return this.postHttpClient(baseUrl);
  }
  AddUpDel(baseUrl: string, json: JSON)
  {
    return this.postJsonObject(baseUrl,json);
  }

  getDate_Json(baseUrl: string,  json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

}
