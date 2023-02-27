import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F06001Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getData(baseUrl: string, jsonObject: JSON): Observable<any>  {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  public async start(baseUrl: string, formData: FormData): Promise<Observable<any>> {
    return await this.postFormData(baseUrl, formData).toPromise();
  }

  saveFile(baseUrl: string, formData: FormData): Observable<any> {
    return this.postFormData(baseUrl, formData);
  }
}
