import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';


@Injectable({
  providedIn: 'root'
})
export class Childbwscn13Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getWebInfo( baseUrl: string, json: JSON ): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  public async childbwscn13Action(baseUrl: string, formData: FormData): Promise<Observable<any>> {
    return await this.postFormData(baseUrl, formData).toPromise();
  }

  public async childbwscn13Del(baseUrl: string, json: JSON): Promise<Observable<any>> {
    return await this.postJsonObject(baseUrl, json).toPromise();
  }
}
