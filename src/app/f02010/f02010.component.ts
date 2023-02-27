import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { MenuListService } from '../menu-list/menu-list.service';
import { F02010Service } from './f02010.service';

interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f02010',
  templateUrl: './f02010.component.html',
  styleUrls: ['./f02010.component.css', '../../assets/css/f02.css']
})
export class F02010Component implements OnInit {

  constructor(
    private f02010Service: F02010Service,
    public pipe: DatePipe,
    public dialog: MatDialog,
    private menuListService: MenuListService
  ) { }

  applno: string = '';
  nationalId: string = '';            //身分證字號
  custId: string = '';                //客戶ID
  flowRiskModeCode: sysCode[] = [];   //流程下拉
  flowRiskModeValue: string;          //流程
  dssResultCode: sysCode[] = [];      //流程階段下拉
  dssResultValue: string;             //流程階段
  queryTime: [Date, Date];            //查詢日期
  resultData = [];                    //查詢結果
  prodCode !: string;                 //產品名稱
  newData:any = [];
  pageIndex:number = 1;
   pageSize:number = 50;
  firstFlag = 1;
  total: number=0;
  quantity: number;
  sort: string;

  ngOnInit(): void {
    this.queryTime = [this.defult90Days(new Date()), new Date()];
    //流程下拉
    this.f02010Service.getSysTypeCode('FLOW_RISK_MODE').subscribe(data => {
      this.flowRiskModeCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.flowRiskModeCode.push({ value: codeNo, viewValue: desc })
      }
    });
    //流程階段下拉
    this.f02010Service.getSysTypeCode('DSS_RESULT').subscribe(data => {
      this.dssResultCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.dssResultCode.push({ value: codeNo, viewValue: desc })
      }
    });
    this.sort = 'ascend';
    this.flowRiskModeValue = '';
    this.dssResultValue = '';
  }

  changeOption() {
    if (this.flowRiskModeValue == '') {
      this.dssResultValue = '';
      return this.dssResultCode.push({ value: '', viewValue: '請選擇' })
    }
    this.dssResultCode = [];
    let jsonObject: any = {};
    jsonObject['flowRiskMode'] = this.flowRiskModeValue;
    this.f02010Service.getNewOption(jsonObject).subscribe(data => {
      this.dssResultCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.dssResultCode.push({ value: desc, viewValue: codeNo })
      }

      this.dssResultValue = '';
    });
  }

  select() {
    if (this.applno == '' && this.nationalId == '' && this.custId == '' && this.flowRiskModeValue == '' && this.dssResultValue == '' && this.queryTime == null) {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "至少輸入一個選項!" }
      });
    } else {
      this.getResult();
    }
  }

  getResult() {
    let jsonObject: any = {};
    this.resultData = [];
    this.newData = []
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['custId'] = this.custId;
    jsonObject['flowRiskMode'] = this.flowRiskModeValue;
    jsonObject['dssResult'] = this.dssResultValue;
    if (this.queryTime != null) {
      if (this.queryTime[0] != null) {
        jsonObject['queryTimeStart'] = this.pipe.transform(new Date(this.queryTime[0]), 'yyyyMMdd');
      }
      if (this.queryTime[1] != null) {
        jsonObject['queryTimeEnd'] = this.pipe.transform(new Date(this.queryTime[1]), 'yyyyMMdd');
      }
    }
    this.f02010Service.getResultData(jsonObject).subscribe(data => {
      if (data.rspBody.size > 0) {
        this.pageIndex = 1;
        this.resultData = data.rspBody.items;
        this.newData = this.f02010Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        this.total = data.rspBody.size;
        this.firstFlag = 2;
        this.sortChange('ascend', 'queryDate');
      } else {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        })
        this.resultData = []
        this.newData = [];
        this.total = 0;
      }
    });
  }

  getDetail(applno: string, DSS: string) {
    if (DSS == 'DSS4') {
      this.getDetail09(applno)
    } else if (DSS == 'DSS1') {
      this.getDetail02(applno)
    } else if (DSS == 'DSS2') {
      this.getDetail03(applno)
    }
  }

  getDetail02(applno: string) {
    let safeUrl = this.f02010Service.getNowUrlPath("/#/F01002/F01002SCN1/CHILDSCN10");
    sessionStorage.setItem('applno', applno);
    sessionStorage.setItem('param', 'Y');
    sessionStorage.setItem('winClose', 'N');
    sessionStorage.setItem('search', 'Y');
    let url = window.open(safeUrl);
    this.menuListService.setUrl({
      url: url
    });
  }

  getDetail09(applno: string) {
    let safeUrl = this.f02010Service.getNowUrlPath("/#/F01009/F01009SCN1/CHILDBWSCN2");
    sessionStorage.setItem('applno', applno);
    sessionStorage.setItem('param', 'Y');
    sessionStorage.setItem('winClose', 'N');
    sessionStorage.setItem('search', 'Y');
    sessionStorage.setItem('page', '010');
    let url = window.open(safeUrl);
    this.menuListService.setUrl({
      url: url
    });
  }

  getDetail03(applno: string) {
    let safeUrl = this.f02010Service.getNowUrlPath("/#/F01003/F01003SCN1/CHILDSCN10");
    sessionStorage.setItem('applno', applno);
    sessionStorage.setItem('param', 'Y');
    sessionStorage.setItem('winClose', 'N');
    sessionStorage.setItem('search', 'Y');
    let url = window.open(safeUrl);
    this.menuListService.setUrl({
      url: url
    });
  }

  clear() {
    this.total=0
    this.applno = '';
    this.nationalId = '';
    this.custId = '';
    this.flowRiskModeValue = '';
    this.dssResultValue = '';
    this.queryTime = null;
    this.newData = [];
    this.resultData = []
    this.pageIndex=1

  }

  dateNull(t: [Date, Date], name: string) {
    if (t.length < 1) {
      switch (name) {
        case 'queryTime':
          this.queryTime = null;
          break;
        case 'queryTime':
          this.queryTime = null;
          break;
      }
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // 判斷是否為第一次進頁面
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      if (this.firstFlag != 1) {
        // const { pageSize, pageIndex } = params;
        this.pageIndex = pageIndex;
        this.newData = this.f02010Service.getTableDate(pageIndex, this.pageSize, this.resultData);
      }
    }
  }

  sortChange(e: string, param: string) {
    switch (param) {
      case "queryDate":
        this.resultData = e === 'ascend' ? this.resultData.sort(
          (a, b) => a.QUERY_DATE.localeCompare(b.QUERY_DATE)) : this.resultData.sort((a, b) => b.QUERY_DATE.localeCompare(a.QUERY_DATE))
        this.newData = this.f02010Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
    }
  }

  defult90Days(startDate: Date) {
    startDate = new Date(Date.now() - (90 * 24 * 60 * 60 * 1000));
    return startDate;
  }

  typeChange(str: string) {
    if (str == '') {
      return str;
    } else {
      for (let row of this.dssResultCode) {
        if (row.value == str) {
          return row.viewValue;
        }
      }
    }
  }
}
