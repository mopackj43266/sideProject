import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class F06007Service extends BaseService {
  strgy: string;
  constructor(protected httpClient: HttpClient) { super(httpClient); }
  //rxjs中繼站
  private addreset = new Subject<any>();
  private opidreset = new Subject<any>();
  addreset$ = this.addreset.asObservable();
  //opid rxjs中繼站
  opidreset$ = this.opidreset.asObservable();
  customerId: string = '';
  checkSrp: string = '';
  jsonData: {}
  opidCheck: string //opid
  settleData: [Date, Date]
  recordTime: [Date, Date]
  firstFlag: number = 0;
  //rxjs監聽 add頁面更新
  resetfn(): void {
    this.addreset.next()
  }
  resetfn1(): void {
    this.addreset.next()
  }
  resetfn2(): void {
    this.addreset.next()
  }

  opidresetfn(opid: string): void {
    this.opidreset.next(opid)
    console.log(opid)

  }
  getData(baseUrl: string, jsonObject: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, jsonObject);
  }
  inquiry(baseUrl: string, jsonObject: JSON): Observable<any> {
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, jsonObject);
  }
  getTableDate(pageIndex: number, pageSize: number, data: any): any {
    let start: number = (pageIndex - 1) * pageSize;
    let count: number = 0;
    let newData = [];
    for (let index = start; index < data.length; index++) {
      newData.push(data[index]);
      count = count + 1;
      if (count == pageSize) {
        break;
      }
    }
    return newData;
  }
  saveOutBoundRecord(jsonObject: any): any {
    const baseUrl = 'f06/f06002action6';
    let targetUrl = `${baseUrl}`;
    return this.saveOrEditMsgJson(targetUrl, jsonObject);
  }

  stepHandle(jsonObject: any): Observable<any> {
    const baseUrl = 'f06/f06002action7';
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  getAccount(jsonObject: any): Observable<any> {
    const baseUrl = 'f06/f06002action8';
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  getAplyIntRt(jsonObject: any): Observable<any> {
    const baseUrl = 'f06/f06002action9';
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  // 取銀行下拉
  getDsbsbrcdCode(jsonObject: any): Observable<any> {
    const baseUrl = 'f06/f06002action10';
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  getBankCode(jsonObject: any): Observable<any> {
    const baseUrl = 'f06/f06002action12';
    let targetUrl = baseUrl;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  // 取opid,若離開申請書欄位頁籤可以透過opid回到原步驟
  getCreditmainInfo(jsonObject: any): any {
    const baseUrl = 'f06/f06002action11';
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  // 取strgy,判斷當前方案
  // getStrgy(jsonObject: any): any {
  //   const baseUrl = 'f06/f06002action12';
  //   let targetUrl = `${baseUrl}`;
  //   return this.saveOrEditMsgJson(targetUrl, jsonObject);
  // }

  // 同一關係人關係(step3,2900)
  relCode = [
    { group: '', value: '', viewValue: '請選擇' },
    { group: '', value: '00', viewValue: '不填寫' },
    { group: 'X', value: '02', viewValue: '配偶' },
    { group: 'X', value: '03', viewValue: '祖父母' },
    { group: 'X', value: '04', viewValue: '父母' },
    { group: 'X', value: '05', viewValue: '兄弟姐妹' },
    { group: 'X', value: '06', viewValue: '子女' },
    { group: 'X', value: '07', viewValue: '孫子女' },
    { group: 'B', value: '08', viewValue: '本人公司資訊' },
    { group: 'B', value: '09', viewValue: '配偶公司資訊' }
  ];

  // 通知方式(step3,2900)
  checkOptionsForStep3 = [
    { label: 'Line訊息通知', value: 'oaNotiYn', checked: false },
    { label: 'email', value: 'emalNotiYn', checked: false },
    { label: '推播', value: 'pushNotiYn', checked: false }
  ];

  // 方案選擇(step1,2700)
  strgyCode = [
    { value: '03', label: '債整+現金' },
    { value: '01', label: '純現金' }];

  getCaseList(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f01/f01006';
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  getTransferResult(jsonObject: JSON): Observable<any> {
    const baseUrl = 'f06/f06002action13';
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  /**根據數字獲取漢字*/
  public changeToCN(num: number): string {
    let words = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    let adds = ["", '十', '百', '千', '萬', '億', '十', '百', '千'];
    if (words[num]) {
      return words[num];
    }
    else if (num > 10 && num < 20) {
      let numStr = num.toString();
      let n = numStr.substring(1, 2);
      let result = adds[1] + words[n];
      return result;
    }
    else if (num > 10) {
      let result = "";
      let numStr = num.toString();
      for (var i = 0; i < numStr.length; ++i) {
        let n = numStr.substring(i, i + 1);
        let m = numStr.length - i - 1;
        result += words[n] + adds[m];
      }
      return result;
    }
    else return "零";
  }

  getLineId(jsonObject: any): Observable<any> {
    const baseUrl = 'f06/f06002action14';
    let targetUrl = `${baseUrl}`;
    return this.postJsonObject(targetUrl, jsonObject);
  }

  setCustomerId(id: string) {
    this.customerId = id;
  }
  getCustomerId() {
    return this.customerId;
  }

  setCheckSrp(srp: string) {
    this.checkSrp = srp;
  }
  getCheckSrp() {
    return this.checkSrp;
  }

  async getOpid(jsonObject: JSON): Promise<Observable<any>> {
    const baseUrl = 'f06/f06002action15';
    let targetUrl = `${baseUrl}`;
    return await this.postJsonObject(targetUrl, jsonObject).toPromise();
  }
  async getStatusCode(jsonObject: JSON): Promise<Observable<any>> {
    const baseUrl = 'f06/f06002action16';
    let targetUrl = `${baseUrl}`;
    return await this.postJsonObject(targetUrl, jsonObject).toPromise();
  }

  saveSearchData(value: any, settleDate: any, recordTime: any) {
    this.jsonData = value
    this.settleData = settleDate
    this.recordTime = recordTime
  }
  getSearchData(): Map<string, object> {
    // return this.jsonData
    let test: Map<string, object> = new Map();
    test.set('jsonData', this.jsonData);
    test.set('settleData', this.settleData);
    test.set('recordTime', this.recordTime);

    return test;
  }

  current: number = 0;
  getCurrent() {
    return this.current;
  }
  setCurrent(current: number) {
    this.current = current;
  }

  //導頁
  private checkCurrent = new Subject<any>();
  checkCurrent$ = this.checkCurrent.asObservable();

  //設定歷史資料原值參數
  setCheckCurrent(data): void {
    this.checkCurrent.next(data);
  }
  setFirstFlag(firstFlag: number) {
    this.firstFlag = firstFlag;
  }
  getFirstFlag() {
    return this.firstFlag;
  }

}
