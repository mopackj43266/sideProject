import { OptionsCode } from './../interface/base';
import { Component, OnInit } from '@angular/core';
import { F02009Service } from './f02009.service';
import { DatePipe } from '@angular/common';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { F02001Service } from '../f02001/f02001.service';
import { BaseService } from '../base.service';
import { F01016Service } from '../f01016/f01016.service';

// Kim 凍結/解凍/降額 案件查詢
interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f02009',
  templateUrl: './f02009.component.html',
  styleUrls: ['./f02009.component.css', '../../assets/css/f02.css']
})
export class F02009Component implements OnInit {

  constructor(
    private f02009Service: F02009Service,
    public pipe: DatePipe,
    public dialog: MatDialog,
    private f02001Service: F02001Service,
    private BaseService: BaseService,
    private f01016Service: F01016Service,
  ) { }

  applno: string = ''; //案件編號
  nationalId: string = '';//身分證字號
  custId: string = '';//客戶ID
  total: number;
  loading = false;
  pageSize: number;
  pageIndex: number;
  reasonValue: string = ''//執行原因值
  reasonDetailCode: sysCode[] = []; //執行細項
  l4EMPNO: string = '';//複審人員
  l4EMPNOArry: sysCode[] = [];//複審人員陣列
  apply_TIME: [Date, Date];//進件日期
  limitCode: sysCode[] = []; //額度號
  firstFlag = 1;
  resultData = [];
  order: string;
  sortArry = ['ascend', 'descend']
  quantity: number;
  sor: string;
  newData: any[] = [];
  executeCode: sysCode[] = [
    { value: '', viewValue: '請選擇' },
    { value: 'FRZ', viewValue: 'FRZ-凍結' },
    { value: 'DWN', viewValue: 'DWN-降額' },
    { value: 'HLD', viewValue: 'HLD-解凍' }
  ];//執行策略
  ngOnInit(): void {
    this.quantity = 0;
    this.review();
  }
  changePage() {
    this.pageIndex = 1;
    this.pageSize = 50;
    this.total = 1;
  }
  search(pageIndex: number, pageSize: number) {

    let url = "f02/f02009action1"
    let jsonObject: any = {};
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    jsonObject['applno'] = this.applno;
    jsonObject['nationalID'] = this.nationalId;
    jsonObject['customerID'] = this.custId;
    jsonObject['creditEmpNo'] = this.l4EMPNO;
    //進件日期
    if (this.apply_TIME != null) {
      if (this.dealwithData365(this.apply_TIME)) {
        jsonObject['creditTimeStart'] = this.pipe.transform(new Date(this.apply_TIME[0]), 'yyyyMMdd');
        jsonObject['creditTimeEnd'] = this.pipe.transform(new Date(this.apply_TIME[1]), 'yyyyMMdd');
      }
      else {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "進件日期查詢區間最多一年內!" }
        });
        this.clear();
        return;
      }
    }
    else {
      jsonObject['creditTimeStart'] = '';
      jsonObject['creditTimeEnd'] = '';
    }
    //進件日期
    if (this.apply_TIME != null) {
      if (this.dealwithData90(this.apply_TIME)) {
        jsonObject['creditTimeStart'] = this.pipe.transform(new Date(this.apply_TIME[0]), 'yyyyMMdd');
        jsonObject['creditTimeEnd'] = this.pipe.transform(new Date(this.apply_TIME[1]), 'yyyyMMdd');
      }
      else {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "執行區間最多三個月內!" }
        });
        this.clear();
        return;
      }
    }
    else {
      jsonObject['creditTimeStart'] = '';
      jsonObject['creditTimeEnd'] = '';
    }

    this.f02009Service.inquiry(url, jsonObject).subscribe(data => {
      this.quantity = 0;
      if (data.rspBody.length > 500) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "筆數大於五百請增加查詢條件，重新查詢" }
        })
        this.clear();
      }
      else if (data.rspBody.length == 0) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        })
        this.clear();
      }
      else {
        this.resultData = data.rspBody;
        this.reasonValue = data.rspBody.REASON_CODE;
        this.changereasonDetail();
        this.newData = this.f02001Service.getTableDate(pageIndex, this.pageSize, this.resultData);
        this.quantity = data.rspBody.length;
        this.total = data.rspBody.length;
        this.firstFlag = 2;
      }
    })

  }
  clear() {
    this.applno = '';
    this.nationalId = '';
    this.custId = '';
    this.l4EMPNO = '';
    this.apply_TIME = null;
    this.resultData = [];
    this.newData = [];
    this.order = '';
    this.sor = '';
    this.quantity = 0;
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    // 判斷是否為第一次進頁面
    const { pageSize, pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      if (this.firstFlag != 1) {
        // const { pageSize, pageIndex } = params;
        this.pageIndex = pageIndex;
        this.newData = this.f02001Service.getTableDate(pageIndex, this.pageSize, this.resultData);
      }
    }
  }
  // 執行原編下拉
  review() {
    let url = "f02/f02009"
    let jsonObject: any = {};
    this.f02009Service.inquiry(url, jsonObject).subscribe(data => {
      this.l4EMPNOArry.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody) {
        const codeNo = jsonObj.EMP_NO;
        const desc = jsonObj.EMP_NAME;
        this.l4EMPNOArry.push({ value: codeNo, viewValue: codeNo + desc })
      }

    })
  }


  dateNull(t: [Date, Date], name: string) {
    if (t.length < 1) {
      switch (name) {
        case 'apply_TIME':
          this.apply_TIME = null;
          break;

      }
    }
  }
  Detail(applno: string, customerId: string, nationalId: string, reasonCode: string, executeType: string, creditTime: string, creditEmpno: string,
    reasonDetail: string, limitNo: string, contactYn: string, contactType: string, contactContent: string, creditMemo: string, reserveLimit: string, mobile: string)//明細
  {

    let jsonObject: any = {};
    jsonObject['applno'] = applno;
    jsonObject['nationalID'] = nationalId;
    let apiurl = 'f02/f02009action2';
    this.f02009Service.inquiry(apiurl, jsonObject).subscribe(data => {
      if (data.rspMsg == "success") {
        sessionStorage.setItem('applno', applno);
        sessionStorage.setItem('reasonCode', reasonCode);//執行原因
        sessionStorage.setItem('executeType', executeType.substring(0, 3));//執行策略
        sessionStorage.setItem('creditTime', creditTime);//本次執行時間
        sessionStorage.setItem('creditEmpno', creditEmpno);//本次執行員編
        sessionStorage.setItem('customerId', customerId);//customerId
        sessionStorage.setItem('nationalId', nationalId);//身分證
        sessionStorage.setItem('reasonDetail', reasonDetail); //執行細項
        sessionStorage.setItem('limitNo', limitNo); //額度號
        sessionStorage.setItem('contactYn', contactYn); //通知客戶
        sessionStorage.setItem('contactType', contactType); //通知方式
        sessionStorage.setItem('contactContent', contactContent); //通知內容
        sessionStorage.setItem('creditMemo', creditMemo); //本次執行說明
        sessionStorage.setItem('reserveLimit', reserveLimit); //欲站額度
        sessionStorage.setItem('mobile', mobile); //手機
        sessionStorage.setItem('checkTime', creditTime); //本次執行時間
        // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
        sessionStorage.setItem('page', '09');
        sessionStorage.setItem('searchUserId', BaseService.userId);
        sessionStorage.setItem('searchEmpName', BaseService.empName);
        sessionStorage.setItem('searchEmpId', BaseService.empId);

        //開啟徵審主畫面
        let safeUrl = this.BaseService.getNowUrlPath("/#/F01016/F01016SCN1");
        window.open(safeUrl);

        sessionStorage.setItem('winClose', 'N');//window.open開啟B視窗後 將原本A視窗session值做調整
        sessionStorage.setItem('search', 'N');

        sessionStorage.removeItem('applno');
        sessionStorage.removeItem('reasonCode');//執行原因
        sessionStorage.removeItem('executeType');//執行策略
        sessionStorage.removeItem('creditTime');//本次執行時間
        sessionStorage.removeItem('creditEmpno');//本次執行員編
        sessionStorage.removeItem('customerId');
        sessionStorage.removeItem('nationalId');//身分證
        sessionStorage.removeItem('reasonDetail'); //執行細項
        sessionStorage.removeItem('limitNo'); //額度號
        sessionStorage.removeItem('contactYn'); //通知客戶
        sessionStorage.removeItem('contactType'); //通知方式
        sessionStorage.removeItem('contactContent'); //通知內容
        sessionStorage.removeItem('creditMemo'); //本次執行說明
        sessionStorage.removeItem('reserveLimit'); //本次執行說明
        sessionStorage.removeItem('mobile'); //本次執行說明
      } else {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查詢案件紀錄異常" }
        });
      }

    })

  }


  dealwithData365(stime: any)//判斷一年時間
  {
    var startDate, endDate;
    startDate = new Date(stime[0]);
    endDate = new Date(stime[1]);
    if ((endDate - startDate) / 1000 / 60 / 60 / 24 > 365) {
      return false;
    }
    else {
      return true;
    }
  }
  dealwithData90(stime: any)//判斷三個月時間
  {
    var startDate, endDate;
    startDate = new Date(stime[0]);
    endDate = new Date(stime[1]);
    if ((endDate - startDate) / 1000 / 60 / 60 / 24 > 90) {
      return false;
    }
    else {
      return true;
    }
  }
  conditionCheck() //擋空白查詢
  {
    if (this.applno == '' && this.nationalId == '' && this.custId == '' && this.l4EMPNO == '' && this.apply_TIME == null
    ) {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請至少選擇一項條件" }
      });
    } else {
      this.changePage();
      this.search(this.pageIndex, this.pageSize);
    }

  }
  sortChange(e: string, param: string) {

    switch (param) {
      case "APPLNO":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
          : this.resultData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
        this.newData = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
    }
    // this.resultData = e === 'ascend' ? this.resultData.sort(
    //   (a, b) => a.START_TIME.localeCompare(b.START_TIME)) : this.resultData.sort((a, b) => b.START_TIME.localeCompare(a.START_TIME))

  }

  //取本次執行原因細項下拉
  changereasonDetail() {
    let jsonObject: any = {};
    // this.reasonDetail = '';
    jsonObject['reasonCode'] = this.reasonValue
    this.reasonDetailCode = [];
    this.executeCode = [];
    this.limitCode = [];
    // this.reasonDetail = "";
    this.reasonDetailCode.push({ value: '', viewValue: '請選擇' })
    this.f02009Service.getReturn('f01/f01015action2', jsonObject).subscribe(data => {

      for (const jsonObj of data.rspBody.items) {
        const codeNo = jsonObj.reasonCode;
        const desc = jsonObj.reasonDesc;
        this.reasonDetailCode.push({ value: codeNo, viewValue: desc });
      }
    });
    if (this.reasonValue == 'A' || this.reasonValue == 'C') {
      return this.executeCode = [
        { value: '', viewValue: '請選擇' },
        { value: 'FRZ', viewValue: 'FRZ-凍結' },

      ];

    }
    else if (this.reasonValue == 'B' || this.reasonValue == 'D') {
      return this.executeCode = [
        { value: '', viewValue: '請選擇' },
        { value: 'HLD', viewValue: 'HLD-解凍' },

      ];
    } else {
      return this.executeCode = [
        { value: '', viewValue: '請選擇' },
        { value: 'DWN', viewValue: 'DWN-降額' },

      ];
    }
  }

  //本次執行原因細項轉換中文
  changeDetailChinese(codeVal: string) {
    for (const jsonObj of this.reasonDetailCode) {
      if (jsonObj.value == codeVal) {
        return jsonObj.viewValue
      }
    }
  }
}
