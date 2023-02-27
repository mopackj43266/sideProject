import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childbwscn14Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }


  getDate_Json(baseUrl: string,  json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

   //Tabele
   postJsonObject_PERSON_MAIN(baseUrl: string, json: JSON){
    return this.postJsonObject(baseUrl, json);


  }

}
