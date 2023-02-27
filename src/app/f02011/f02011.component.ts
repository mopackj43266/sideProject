import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { NzTableComponent, NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from '../base.service';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { OptionsCode } from '../interface/base';
import { F02011Service } from './f02011.service';


@Component({
  selector: 'app-f02011',
  templateUrl: './f02011.component.html',
  styleUrls: ['./f02011.component.css', '../../assets/css/f02.css']
})
export class F02011Component implements OnInit {

  constructor(
    private f02011Service: F02011Service,
    private pipe: DatePipe,
    private dialog: MatDialog,
    private BaseService: BaseService
  ) { }

  applno: string = ''; //案件編號
  nationalId: string = ''; //身分證字號
  custId: string = ''; //客戶ID
  cuCname: string = '';//客戶姓名
  applyTime: [Date, Date]; //本行進件日期
  applyStatus: string = ''; //申請回饋處理狀態
  applyStatusCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }];
  underwriteStatus: string = ''; //核保回饋回覆結果
  underwriteStatusCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }];
  noticeStatus: string = ''; //通知單回饋結果
  noticeStatusCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }];
  applyFeedbackDate: [Date, Date]; //申請回饋排程處理日期
  underwriteDate: [Date, Date]; //核保回饋回覆日期
  noticeDate: [Date, Date];//通知單回饋排程處理日期
  L3Empno: string = ''; //徵信人員
  L3EmpnoCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }];
  L2Empno: string = ''; //授信人員
  L2EmpnoCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }];
  firstFlag: boolean = false;

  resultData: Data = []; //查詢資料
  newData: any[] = [];
  pageSize = 50;
  pageIndex = 1;
  total = 0;
  scrollY = '400px';

  @ViewChild('scrollToTop', { static: false }) nzTableComponent?: NzTableComponent<any[]>;

  ngOnInit(): void {
    let jsonObject: any = {};
    const baseUrl = "f02/f02011";
    this.f02011Service.getData(baseUrl, jsonObject).subscribe(data => {
      //徵信人員下拉
      for (const jsonObj of data.rspBody.l3EmpNoList) {
        this.L3EmpnoCode.push({
          value: jsonObj['EMP_NO'],
          viewValue: jsonObj['EMP_NO'] + ":" + jsonObj['EMP_NAME']
        });
      }

      //授信人員下拉
      for (const jsonObj of data.rspBody.l2EmpNoList) {
        this.L2EmpnoCode.push({
          value: jsonObj['EMP_NO'],
          viewValue: jsonObj['EMP_NO'] + ":" + jsonObj['EMP_NAME']
        });
      }
    });

    //取申請回饋處理狀態
    this.f02011Service.getSysTypeCode('APPLY_STATUS')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.applyStatusCode.push({ value: codeNo, viewValue: desc })
        }
      });

    // 取核保回饋回覆結果
    this.f02011Service.getSysTypeCode('Underwrite_STATUS')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.underwriteStatusCode.push({ value: codeNo, viewValue: desc })
        }
      });

    // 取通知單回饋結果
    this.f02011Service.getSysTypeCode('Notice_STATUS')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.noticeStatusCode.push({ value: codeNo, viewValue: desc })
        }
      });
  }

  select(pageIndex?: number, close?: boolean) {
    if (this.check()) {
      let jsonObject: any = {};
      let baseUrl = 'f02/f02011action1';
      jsonObject['applno'] = this.applno;
      jsonObject['nationalId'] = this.nationalId;
      jsonObject['custId'] = this.custId;
      jsonObject['cuCname'] = this.cuCname;
      if (this.applyTime != null) {
        jsonObject['applyTimeStart'] = this.pipe.transform(new Date(this.applyTime[0]), 'yyyyMMdd');
        jsonObject['applyTimeEnd'] = this.pipe.transform(new Date(this.applyTime[1]), 'yyyyMMdd');
      }
      jsonObject['applyStatus'] = this.applyStatus;
      jsonObject['underwriteStatus'] = this.underwriteStatus;
      jsonObject['noticeStatus'] = this.noticeStatus;

      if (this.applyFeedbackDate != null) {
        jsonObject['applyFeedbackDateStart'] = this.pipe.transform(new Date(this.applyFeedbackDate[0]), 'yyyyMMdd');
        jsonObject['applyFeedbackDateEnd'] = this.pipe.transform(new Date(this.applyFeedbackDate[1]), 'yyyyMMdd');
      }
      if (this.underwriteDate != null) {
        jsonObject['underwriteDateStart'] = this.pipe.transform(new Date(this.underwriteDate[0]), 'yyyyMMdd');
        jsonObject['underwriteDateEnd'] = this.pipe.transform(new Date(this.underwriteDate[1]), 'yyyyMMdd');
      }
      if (this.noticeDate != null) {
        jsonObject['noticeDateStart'] = this.pipe.transform(new Date(this.noticeDate[0]), 'yyyyMMdd');
        jsonObject['noticeDateEnd'] = this.pipe.transform(new Date(this.noticeDate[1]), 'yyyyMMdd');
      }
      jsonObject['L3Empno'] = this.L3Empno;
      jsonObject['L2Empno'] = this.L2Empno;

      this.f02011Service.getData(baseUrl, jsonObject).subscribe(data => {
        if (data.rspBody.size > 0) {
          this.total = data.rspBody.size;
          this.resultData = data.rspBody.item;
          this.newData = this.f02011Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
          this.firstFlag = true;
          this.scrollToIndex(1);
        } else {
          this.newData = null;
          this.total = 0;
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "查無資料" }
          })
        }
      });
    } else {
      this.clear();
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請至少選擇一項條件" }
      });
    }
  }

  //明細
  detail(applno: string) {
    sessionStorage.setItem('applno', applno);
    //開啟徵審主畫面
    let safeUrl = this.BaseService.getNowUrlPath("/#/F01002/F01002SCN1");
    window.open(safeUrl);
  }


  //分頁控制
  onQueryParamsChange(params: NzTableQueryParams): void {
    this.scrollToIndex(1);
    // 判斷是否為第一次進頁面
    const { pageIndex } = params;
    if (this.firstFlag) {
      this.pageIndex = pageIndex;
      this.newData = this.f02011Service.getTableDate(pageIndex, this.pageSize, this.resultData);
      // this.selectData(pageIndex, this.pageSize, this.order, this.sor);
    }
  }

  sortChange(e: string, param: string) {
    switch (param) {
      case "APPLNO":
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
          : this.resultData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
        this.newData = this.f02011Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
    }
  }

  //查詢條件需至少輸入一項才能進行查詢。
  check(): boolean {
    if (this.applno == '' && this.nationalId == '' && this.custId == '' && this.cuCname == ''
      && this.applyTime == null && this.applyStatus == '' && this.underwriteStatus == ''
      && this.noticeStatus == '' && this.applyFeedbackDate == null && this.underwriteDate == null
      && this.noticeDate == null && this.L3Empno == '' && this.L2Empno == '') {
      this.total = 0;
      return false
    } else {
      return true;
    }
  }

  dateNull(t: [Date, Date], name: string) {
    if (t.length < 1) {
      switch (name) {
        case 'applyTime':
          this.applyTime = null;
          break;
        case 'applyFeedbackDate':
          this.applyFeedbackDate = null;
          break;
        case 'underwriteDate':
          this.underwriteDate = null;
          break;
        case 'noticeDate':
          this.noticeDate = null;
          break;
      }
    }
  }

  clear() {
    this.applno = '';
    this.nationalId = '';
    this.custId = '';
    this.cuCname = '';
    this.applyTime = null;
    this.applyStatus = '';
    this.underwriteStatus = '';
    this.noticeStatus = '';
    this.applyFeedbackDate = null;
    this.underwriteDate = null;
    this.noticeDate = null;
    this.L3Empno = '';
    this.L2Empno = '';
    this.newData = [];
    this.total = 0;
    this.pageIndex = 1;
    this.scrollY = '400px';
  }

  //to top
  scrollToIndex(index: number): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrollToIndex(index);
    if (this.total < this.pageSize) {
      this.scrollY = 40 * this.total + 'px';
    } else {
      this.scrollY = '400px';
    }
  }
}
