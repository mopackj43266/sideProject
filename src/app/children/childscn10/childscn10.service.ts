import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childscn10Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  officialList : any[] = [];

  getDSSSearch(formData: FormData): Observable<any>  {
    const baseUrl = 'f01/childscn10action';
    return this.postFormData(baseUrl, formData);
  }

  getDate(baseUrl: string, formData: FormData): Observable<any> {
    return this.postFormData(baseUrl, formData);
  }

  getDate_Json(baseUrl: string,  json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  //取徵信照會Table/新增/編輯/刪除
  postJsonObject_CALLOUT(baseUrl: string, json: JSON){
    return this.postJsonObject(baseUrl, json);
  }
  setOfficialList(i:any)
  {
    this.officialList = i;
  }
  getOfficialList()
  {
    return this.officialList;
  }

}
