import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F01011Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  uploadExcel(baseUrl: string, fileToUpload: File, empNo: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('empNo', empNo);
    formData.append('userId',BaseService.userId );
    return this.httpClient.post<any>(environment.allowOrigin + '/' + baseUrl, formData);
  }
}

