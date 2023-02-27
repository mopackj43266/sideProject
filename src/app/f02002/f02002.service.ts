import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F02002Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getRescanEmpno(baseUrl: string): Observable<any> {
    return this.postHttpClient(baseUrl);
  }

  f02002(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  postJson(baseUrl: string, json: JSON)
  {
    return this.postJsonObject(baseUrl,json);
  }
  public async fromUp(baseUrl: string, formData: FormData): Promise<Observable<any>> {
    return await this.postFormData(baseUrl, formData).toPromise();
  }

  setformdata(baseUrl: string, formData: FormData)
  {
    return this.postFormData(baseUrl,formData);
  }
}
