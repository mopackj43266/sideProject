import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../base.service';
import { Mapping, OptionsCode } from '../interface/base';


@Injectable({
  providedIn: 'root'
})
export class F01008Service extends BaseService {

  constructor(protected httpClient: HttpClient,) { super(httpClient); }

  private JCICSource = new Subject<any>();
  JCICSource$ = this.JCICSource.asObservable();
  private JCICAddSource = new Subject<any>();
  JCICAddSource$ = this.JCICAddSource.asObservable();
  private JCICItemsSource = new Subject<any>();
  JCICItemsSource$ = this.JCICItemsSource.asObservable();
  sCON_TYPE_Code: OptionsCode[] = [];//聯絡方式下拉選單
  sTEL_CONDITION_Code: OptionsCode[] = [];//電話狀況下拉選單
  sTEL_CHECK_Code: OptionsCode[] = [];//電話種類下拉選單
  sHOURS_Code: OptionsCode[] = [];//時下拉選單
  sMINUTES_Code: OptionsCode[] = [];//分下拉選單

  setJCICSource(data): void {
    this.JCICSource.next(data);
  }

  setJCICAddSource(data): void {

    this.JCICAddSource.next(data);
  }
  setJCICDelSource(data): void {

    this.JCICItemsSource.next(data);
  }

  getEmpNo(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01008fn2';

    return this.postJsonObject(baseUrl, jsonObject);
  }

  getLockCase(jsonObject: JSON) {
    const baseUrl = 'f01/f01008fn1';

    return this.postJsonObject(baseUrl, jsonObject);
  }

  getCaseList(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01008';

    return this.postJsonObject(baseUrl, jsonObject);
  }

  f01008scn2(jsonObject: JSON,url:string): Observable<any> {

    return  this.postJsonObject(url, jsonObject);
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
  public getSysTypeCode(codeType: string): Observable<Mapping> {
    let targetUrl = `sys/getMappingCode?codeType=${codeType}`;
    return this.postHttpClient(targetUrl);
  }

  getResearchNum(baseUrl: string, jsonObject: JSON): any {
    return this.saveOrEditMsgJson(baseUrl, jsonObject);
  }
  getImfornation(baseUrl: string, json: JSON){
    return this.postJsonObject(baseUrl, json);
  }
  getInterestBase(baseUrl: string, json: JSON): any {
    return this.saveOrEditMsgJson(baseUrl, json);
  }

}
