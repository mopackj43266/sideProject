import { Childscn1Component } from './../children/childscn1/childscn1.component';
import { F01002scn1Component } from './../f01002/f01002scn1/f01002scn1.component';
import { F02004Service } from './f02004.service';
import { Component, OnInit } from '@angular/core';
import { OptionsCode } from '../interface/base';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { Data, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';

interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f02004',
  templateUrl: './f02004.component.html',
  styleUrls: ['./f02004.component.css', '../../assets/css/f02.css']
})
export class F02004Component implements OnInit {

  constructor(
    private f02004Service: F02004Service,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private router: Router,
  ) { }

  loanAccount: string ='';//循環帳戶
  custId: string =''//客戶ID
  nationalId: string='' //身分證字號
  date: [Date, Date];//時間
  dateFormat = 'yyyy/MM/dd';
  drFlag: string='';//動撥狀態
  drFlagCode: OptionsCode[] = [];//員編
  drCreditMianData: Data[] = [];
  OpIdcode:sysCode[]=[]; //EL狀態中文
  total = 0;
  x: string;
  loading = true;
  pageIndex = 1;
  pageSize = 50;
  i;
  move:string='';
  moveList: Data[] = [];//動撥結果下拉
  ngOnInit(): void {
    this.moveList.push({ value: '', viewValue: '請選擇'});
    this.moveList.push({ value: 'Y', viewValue: '動撥成功'});
    this.moveList.push({ value: 'N', viewValue: '動撥失敗'});
    const baseUrl = 'f02/f02002';
    //員編
    this.f02004Service.getRescanEmpno(baseUrl).subscribe(data => {
      for (let i = 0; i < data.rspBody.length; i++) {
        if (data.rspBody[i].RESCANEMPNO != null) {
          this.drFlagCode.push({ value: data.rspBody[i].RESCANEMPNO, viewValue: data.rspBody[i].RESCANEMPNO });
        }
      }
      this.loading = false;
    });
    this.i=0;
    this.date = null;
  }




//取得表單
  getDrCreditMainData(pageIndex:number,pageSize:number) {
    const baseUrl = 'f02/f02004';
    let jsonObject: any = {};
    jsonObject['loanAccount'] = this.loanAccount;
    jsonObject['drFlag'] = this.drFlag;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['custId'] = this.custId;
    if (this.date != null) {
      jsonObject['applyTimeStartDate'] = this.datepipe.transform(new Date(this.date[0]).toString(), 'yyyyMMdd');
      jsonObject['applyTimeEndDate'] = this.datepipe.transform(new Date(this.date[1]).toString(), 'yyyyMMdd');


    } else {
      jsonObject['applyTimeStartDate'] = '';
      jsonObject['applyTimeEndDate'] = '';
    }
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    jsonObject['move'] = this.move;
    this.f02004Service.f02002(baseUrl, jsonObject).subscribe(data => {
      this.loading = false;
      if (data.rspBody.size == 0)
      {
        this.drCreditMianData=null;
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        });
      } else {
        this.i=1;
        this.total = data.rspBody.size;
        this.drCreditMianData = data.rspBody.list;
        for (const jsonObj of data.rspBody.drOpStatusList) {
          const codeNo = jsonObj.opId;
          const desc = jsonObj.opDesc;
          this.OpIdcode.push({ value: codeNo, viewValue: desc })
        }

      }
    });

  }



  //查詢
  search() {
    var startDate, endDate;
    if (this.loanAccount == '' && this.drFlag == '' && this.date == null && this.nationalId ==''&& this.custId=='' && this.move =='') {
      // this.clear();
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請至少選擇一項" }
      });
    } else {
      if (this.date != null)
       {
        startDate = new Date(this.date[0]);
        endDate = new Date(this.date[1]);
        if ((endDate - startDate) / 1000 / 60 / 60 / 24 > 90) {
          // this.clear();
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "查詢區間最多三個月內!" }
          });
        } else {
          this.getDrCreditMainData(this.pageIndex,this.pageSize);
        }
      } else {
        this.getDrCreditMainData(this.pageIndex,this.pageSize);
      }
    }

  }

  //清除資料
  clear() {
    this.loanAccount = '';
    this.drFlag = '';
    this.total = 0;
    this.loading = false;
    this.pageSize = 50;
    this.pageIndex = 1;
    this.drCreditMianData = null;
    this.date = null;
    this.nationalId ='';
    this.custId='';
    this.i=0;
    this.move = '';
  }

  onQueryParamsChange(params: NzTableQueryParams): void {

      if(this.i>0)
      {
        const { pageSize, pageIndex } = params

        this.getDrCreditMainData( pageIndex, pageSize);
      }

  }



  dateNull() {
    if (this.date.length < 1) {
      this.date = null;
    }
  }

  //千分號
  data_number(p: number)
  {
    this.x = '';
    this.x = (p + "")
    if (this.x != null) {
      this.x = this.x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return this.x
  }
  //取得EL狀態中文
  getOpId(codeVal: string): string {
    for (const data of this.OpIdcode) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }

}
