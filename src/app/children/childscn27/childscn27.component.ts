import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Childscn27Service } from './childscn27.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { DatePipe } from '@angular/common';
import { BaseService } from 'src/app/base.service';

interface sysCode {
  value: string;
  viewValue: string;
}

//Nick 簡訊
@Component({
  selector: 'app-childscn27',
  templateUrl: './childscn27.component.html',
  styleUrls: ['./childscn27.component.css', '../../../assets/css/f01.css']
})
export class Childscn27Component implements OnInit {

  constructor(
    private childscn27Service: Childscn27Service,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Childscn27Component>,
    private pipe: DatePipe,
  ) { }

  private applno: string;                           //案編
  mobile: string;                                   //客戶手機
  smsSetCode: sysCode[] = [];                       //sms模板下拉
  smsSet: string;                                   //sms模板
  content: string;                                  //sms內容
  messageContent: string;                           //由sms模板代入sms內容
  realSmsTime: string;                              //預計發送時間(日期)
  realSmsTimeValue: Date;                           //預計發送時間類型
  mytime: Date | null = null;                       //預計發送時間(時分)
  smsDataSource = new MatTableDataSource<any>();    //簡訊資訊檔
  sms_M_Code = new MatTableDataSource<any>();    //sms mappingcode
  stepName: string;
  page: string;
  BW_creditResult: string; //審核結果

  disabledHours(): number[] {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 21, 22, 23];
  }


  ngOnInit(): void {
    this.page = sessionStorage.getItem('page');
    //取案編
    this.applno = sessionStorage.getItem('applno');
    this.BW_creditResult = sessionStorage.getItem('BW_creditResult');
    // if (this.page == '9' || this.page == '10') {
    //   //取sms樣板下拉
    //   this.childscn27Service.getSysTypeCode('BW_SMS_SET').subscribe(data => {
    //     for (const jsonObj of data.rspBody.mappingList) {
    //       const codeNo = jsonObj.codeNo;
    //       const desc = jsonObj.codeDesc;
    //       this.smsSetCode.push({ value: codeNo, viewValue: desc })
    //     }
    //     this.sms_M_Code.data = data.rspBody.mappingList;
    //   });
    // } else {
    //取sms樣板下拉
    this.childscn27Service.getSysTypeCode('SMS_SET').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.smsSetCode.push({ value: codeNo, viewValue: desc })
      }
      this.sms_M_Code.data = data.rspBody.mappingList;
    });
    // }

    this.getSmsList();
  }

  //發送簡訊
  async addSms() {
    this.messageContent = this.content;
    if (this.mobile == null || this.mobile == "" || this.mobile.length != 10) {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請輸入手機號碼" }
      });
    } else if (this.smsSet == null || this.smsSet == "") {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇SMS樣板" }
      });
    } else if (this.content == null || this.content == "") {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "SMS內容異常" }
      });
    }
    else {
      //判斷日期時間是否在現在以前
      var date = this.pipe.transform(this.realSmsTime, 'yyyy-MM-dd') + this.pipe.transform(this.mytime, ' HH:mm') + ":00";
      var newDate = date.replace(/-/g, '/'); // 變成"2012/01/01 12:30:10";
      var keyDate = new Date(newDate)
      if (keyDate.getTime() < Date.now()) {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請輸入正確日期時間" }
        });
        return;
      }
      let msgStr: string = "";
      const baseUrl = 'f01/childscn27action1';
      let jsonObject: any = {};
      jsonObject['applno'] = this.applno;
      jsonObject['empno'] = BaseService.userId;
      jsonObject['mobile'] = this.mobile;
      jsonObject['realSmsTime'] = this.pipe.transform(this.realSmsTime, 'yyyyMMdd') + this.pipe.transform(this.mytime, 'HHmm');
      jsonObject['smsSet'] = this.smsSet;
      await this.childscn27Service.postJson(baseUrl, jsonObject).subscribe(data => {
        if (data.rspCode == '9999') {
          msgStr = data.rspMsg;
        } else {
          msgStr = data.rspMsg == "success" ? "傳送成功!" : "傳送失敗!"
        }
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: msgStr }
        });
        if (data.rspMsg == "success" && data.rspCode === '0000') {
          this.getSmsList();
          this.realSmsTime = null;
          this.mytime = null;
          this.content = null;
          this.smsSet = null;
        }
      });
    }

  }

  // 選取sms模板後會將內容代入sms內容
  changeSelect(smsSet: string) {
    for (const jsonObj of this.sms_M_Code.data) {
      this.content = jsonObj.codeNo == smsSet ? jsonObj.codeTag : this.content;
    }
    // this.childscn27Service.getSmsContent(smsSet).subscribe(data => {
    //   this.content = data.rspBody[0].codeTag;
    // })
  };

  //取該案件簡訊發送資訊/從客戶資訊查詢客戶手機
  getSmsList() {
    const baseUrl = 'f01/childscn27';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childscn27Service.postJson(baseUrl, jsonObject).subscribe(data => {
      this.smsDataSource = data.rspBody.items;
      if (this.mobile == null || this.mobile == "") {
        this.mobile = data.rspBody.phone;
      }
    });
  };

  // 離開該彈窗
  cancel(): void {
    this.dialogRef.close();
  }

  //只能數字
  data_number(x: string) {
    if (x != null) {
      x = x.replace(/[^\d]/g, '');
    }
    return x
  }

  getPage(): string {
    return this.page;
  }
}
