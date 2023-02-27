import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OptionsCode } from '../interface/base';
import { F06005Service } from './f06005.service';
import { BaseService } from '../base.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { F06005pickupComponent } from './f06005pickup/f06005pickup.component';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-f06005',
  templateUrl: './f06005.component.html',
  styleUrls: ['./f06005.component.css', '../../assets/css/f03.css']
})
export class F06005Component implements OnInit {
  limit: number;
  addreset$: Subscription //rxjs訂閱者
  clientList: any[] = [];
  client: string = '';
  newData: [];
  total: number;
  loading = false;
  pageSize: number = 50;
  pageIndex: number = 1;
  firstFlag = 1;
  test: string = '';
  te: string = ''
  L3empno: string = ''//徵信人員員編
  L3empnoList: any[] = []//徵信人員員編清單
  L3empnoCode: any[] = []//徵信人員員編下拉
  resultData: [] //查詢資料
  bcnList: any[] = []; //銀行名下拉
  bcnListCode: any[] = []; //銀行名下拉
  bcnValue: string = ""; //銀行名值
  bbCList: any[] = []; //分行別下拉
  bbCListCode: any[] = []; //分行別下拉
  bbcValue: string = ""; //分行別值
  custId: string = '';//客戶ID
  settleDate: [Date, Date];//預計撥款日

  dsbsacctnbr: string = '';
  constructor(
    private f06005Service: F06005Service,
    public dialog: MatDialog,
    public pipe: DatePipe,

  ) {
    this.addreset$ = this.f06005Service.addreset$.subscribe((data) => {
      this.searchTable(data.custId, data.b1empno)
    });
  }

  ngOnInit(): void {
    this.L3empnoSearch()
  }

  changePage() {
    this.pageIndex = 1;
    this.pageSize = 20;
    this.total = 1;
  }

  //徵信人員員編下拉
  L3empnoSearch() {
    this.L3empno = '';
    this.L3empnoCode.push({ value: '', viewValue: '請選擇', })
    let jsonObject: any = {};
    const baseUrl = "f06/f06005action5";
    this.f06005Service.inquiry(baseUrl, jsonObject).subscribe(data => {
      this.L3empnoList = data.rspBody
      for (const jsonObj of this.L3empnoList) {
        const codeNo = jsonObj.EMP_NO;
        const desc = jsonObj.EMP_NAME;
        this.L3empnoCode.push({ value: codeNo, viewValue: desc })
      }

    })
  }


  searchTable(custId: string, empno: string) {
    let jsonObject: any = {};
    const baseUrl = "f06/f06005";
    jsonObject['custId'] = this.custId
    jsonObject['l3empno'] = this.L3empno
    if (this.settleDate != null) {
      if (this.settleDate[0] != null) {
        jsonObject['settleDateStart'] = this.pipe.transform(new Date(this.settleDate[0]), 'yyyyMMdd');
      }
      if (this.settleDate[1] != null) {
        jsonObject['settleDateEnd'] = this.pipe.transform(new Date(this.settleDate[1]), 'yyyyMMdd');
      }
    }
    this.f06005Service.inquiry(baseUrl, jsonObject).subscribe(data => {
      console.log(data)
      if (data.rspBody.size > 0) {
        this.resultData = data.rspBody.dataList;
        this.newData = this.f06005Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        this.total = data.rspBody.dataList.length;
        this.firstFlag = 2;
        this.bcnList = data.rspBody.bcnList
        this.bbCList = data.rspBody.bbCList
        //銀行名下拉
        for (const jsonObj of this.bcnList) {
          const codeNo = jsonObj.bnkCd;
          const desc = jsonObj.bnkNm;
          this.bcnListCode.push({ value: codeNo, viewValue: desc })
        }
        //分行別下拉
        for (const jsonObj of this.bbCList) {
          const codeNo = jsonObj.branchCd;
          const desc = jsonObj.branchNm;
          this.bbCListCode.push({ value: codeNo, viewValue: desc })
        }

        this.firstFlag = 2;
      }
      else {
        this.clear()
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        });

        return;
      }
    })

  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // 判斷是否為第一次進頁面
    const { pageSize, pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      if (this.firstFlag != 1) {
        // const { pageSize, pageIndex } = params;
        this.pageIndex = pageIndex;
        this.newData = this.f06005Service.getTableDate(pageIndex, this.pageSize, this.resultData);
        const matTable = document.getElementById('matTable');
        matTable.scrollIntoView();
      }
    }
  }
  //清除
  clear() {
    this.custId = '';
    this.L3empno = '';
    this.settleDate = null;
    this.newData = [];
  }
  //取件
  pickup(applno: string, custId: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = applno
    const dialogRef = this.dialog.open(F06005pickupComponent, {
      panelClass: 'mat-dialog-transparent',
      height: '90%',
      width: '90%',
      data: {
        applno: applno,
        custId: custId,
      }
    })
  }

  //金額加千分位
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
}
