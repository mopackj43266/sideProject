import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../base.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class F03018Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }
  selectCustomer(baseUrl: string, formData: FormData): Observable<any> {
    return this.postFormData(baseUrl, formData);
  }

  	//rxjs中繼站
	private editreset = new Subject<any>();
	editreset$ = this.editreset.asObservable();

	//rxjs監聽 add頁面更新
	resetfn(): void {
		this.editreset.next()
	}

  getReturn(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = `${baseUrl}`;

    return this.postJsonObject(targetUrl, jsonObject);
  }

  downloadExcel(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = `${baseUrl}`;

    return this.postGetFile(targetUrl, jsonObject);
  }
  insert(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = `${baseUrl}`;

    return this.postJsonObject(targetUrl, jsonObject);
  }

  uploadExcel(baseUrl: string, fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.httpClient.post<any>(environment.allowOrigin + '/' + baseUrl, formData);
  }
  postExcel(baseUrl: string, formData: FormData): Observable<any> {
    return this.postFormData(baseUrl, formData);
  }
  gettable(baseUrl: string, applno: string) {
    let targetUrl = `${baseUrl}?applno=${applno}`;
    return this.postHttpClient(targetUrl);
  }
  oneseve(baseUrl: string,json:JSON) {
  let targetUrl = baseUrl;
  return this.postJsonObject(targetUrl,json);
  }

  getImpertmentParameter(jsonObject:JSON): Observable<any> {
    const baseUrl = 'f03/f03017';
    let targetUrl = `${baseUrl}`;
    // let targetUrl = `${baseUrl}?page=${page + 1}&per_page=${per_page}`;
    return this.postJsonObject(targetUrl, jsonObject)
    // return this.postHttpClient(targetUrl);
  }
  getElBigCompanyList(baseUrl: string, jsonObject: JSON): Observable<any> {
  return this.postJsonObject(baseUrl, jsonObject)
  // let targetUrl = `${baseUrl}?page=${pageIndex}&per_page=${pageSize}`;
  // return this.postHttpClient(targetUrl);
 }
  getValueTypeselect(baseUrl: string, jsonObject: JSON): Observable<any> {
  return this.postJsonObject(baseUrl, jsonObject)
  // let targetUrl = `${baseUrl}?page=${pageIndex}&per_page=${pageSize}`;
  // return this.postHttpClient(targetUrl);
 }

  onesave(jsonObject: any): any {
    const baseUrl = 'f03/f03018action3';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }
  postJson(baseUrl: string,  json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }
}
