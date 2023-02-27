import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { OptionsCode } from 'src/app/interface/base';

@Injectable({
  providedIn: 'root'
})
export class Childscn8Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }


  //取徵信照會Table/新增/編輯/刪除
  postJsonObject_CALLOUT(baseUrl: string, json: JSON) {
    return this.postJsonObject(baseUrl, json);
  }

  sCON_TYPE_Code: OptionsCode[] = [];//聯絡方式下拉選單
  sTEL_CONDITION_Code: OptionsCode[] = [];//電話狀況下拉選單
  sTEL_CHECK_Code: OptionsCode[] = [];//電話種類下拉選單
  sHOURS_Code: OptionsCode[] = [];//時下拉選單
  sMINUTES_Code: OptionsCode[] = [];//分下拉選單


  //編輯
  public async EditCALLOUT(baseUrl: string, data: any): Promise<Observable<any>> {
    const formdata: FormData = new FormData();
    baseUrl = `${baseUrl}?rowID=${data.ID}`;
    formdata.append('conTel', data.con_TEL);
    formdata.append('phone', data.phone);
    formdata.append('conTarget', data.con_TARGET);
    formdata.append('custType', data.cust_TYPE);
    formdata.append('conMemo', data.con_MEMO);
    formdata.append('note', data.note);

    return await this.postFormData(baseUrl, formdata).toPromise();
  }

  //刪除
  DeleteCALLOUT(baseUrl: string, ID: string): Observable<any> {
    baseUrl = `${baseUrl}?rowID=${ID}`;
    return this.postHttpClient(baseUrl);
  }

  //時下拉選單
  getHOURS() {
    if (this.sHOURS_Code == null || this.sHOURS_Code.length == 0) {
      this.sHOURS_Code.push({ value: "", viewValue: "" })
      this.getSysTypeCode('HOURS')
        .subscribe(data => {
          for (const jsonObj of data.rspBody.mappingList) {
            const codeNo = jsonObj.codeNo;
            const desc = jsonObj.codeDesc;
            this.sHOURS_Code.push({ value: codeNo, viewValue: desc })
          }
        });
    }
    return this.sHOURS_Code;
  }
  //分下拉選單
  getMINUTES() {
    if (this.sMINUTES_Code == null || this.sMINUTES_Code.length == 0) {
      this.sMINUTES_Code.push({ value: "", viewValue: "" })
      this.getSysTypeCode('MINUTES')
        .subscribe(data => {
          for (const jsonObj of data.rspBody.mappingList) {
            const codeNo = jsonObj.codeNo;
            const desc = jsonObj.codeDesc;
            this.sMINUTES_Code.push({ value: codeNo, viewValue: desc })
          }
        });
    }
    return this.sMINUTES_Code;
  }
  //聯絡方式下拉選單
  getCON_TYPE() {
    if (this.sCON_TYPE_Code == null || this.sCON_TYPE_Code.length == 0) {
      this.getSysTypeCode('CON_TYPE')
        .subscribe(data => {
          for (const jsonObj of data.rspBody.mappingList) {
            const codeNo = jsonObj.codeNo;
            const desc = jsonObj.codeDesc;
            this.sCON_TYPE_Code.push({ value: codeNo, viewValue: desc })
          }
        });
    }
    return this.sCON_TYPE_Code;
  }
  //電話狀況下拉選單
  getTEL_CONDITION() {
    if (this.sTEL_CONDITION_Code == null || this.sTEL_CONDITION_Code.length == 0) {
      this.getSysTypeCode('TEL_CONDITION')
        .subscribe(data => {
          for (const jsonObj of data.rspBody.mappingList) {
            const codeNo = jsonObj.codeNo;
            const desc = jsonObj.codeDesc;
            this.sTEL_CONDITION_Code.push({ value: codeNo, viewValue: desc })
          }
        });
    }
    return this.sTEL_CONDITION_Code;
  }
  getTEL_CHECK() {
    if (this.sTEL_CHECK_Code == null || this.sTEL_CHECK_Code.length == 0) {
      this.getSysTypeCode('TEL_CHECK')//電話種類下拉選單
        .subscribe(data => {
          for (const jsonObj of data.rspBody.mappingList) {
            const codeNo = jsonObj.codeNo;
            const desc = jsonObj.codeDesc;
            this.sTEL_CHECK_Code.push({ value: codeNo, viewValue: desc })
          }
        });
    }
    return this.sTEL_CHECK_Code;
  }

}
