import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childscn2Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getTransLog(baseUrl: string, json: JSON){
    return this.postJsonObject( baseUrl, json);
  }
}
