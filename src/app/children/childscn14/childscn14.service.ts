import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Childscn14Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  // getImageInfo(jsonObject: JSON): Observable<any>  {
  //   const baseUrl = 'f01/childscn14action';
  //   return this.postJsonObject(baseUrl, jsonObject);
  // }

  //取Table資料
  childscn14(baseUrl: string, jsonObject: JSON) {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  //上傳圖檔
  public async childscn14Action2(baseUrl: string, formData: FormData): Promise<Observable<any>> {
    return await this.postFormData(baseUrl, formData).toPromise();
  }

  //下載檔案
  downloadFile(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = `${baseUrl}`;

    return this.postGetFile(targetUrl, jsonObject);
  }

  private WordString:string=''
  //儲存本案影像來源文字
  setWord(i:string)
  {
    this.WordString = i;
  }
  //取得本案影像來源文字
  getWord()
  {
    return this.WordString;
  }
}
