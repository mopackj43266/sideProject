import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childscn3Service extends BaseService{

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  gettable(baseUrl: string, applno: string) {
    let targetUrl = `${baseUrl}?applno=${applno}`;
    return this.postHttpClient(targetUrl);
  }
  oneseve(baseUrl: string,json:JSON) {
  let targetUrl = baseUrl;
  return this.postJsonObject(targetUrl,json);
  }

}
