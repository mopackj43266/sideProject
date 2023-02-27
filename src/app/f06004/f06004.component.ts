import { F06004editComponent } from './f06004edit/f06004edit.component';
import { F06004Service } from './f06004.service';
import { OptionsCode } from 'src/app/interface/base';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzTableComponent, NzTableQueryParams } from 'ng-zorro-antd/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-f06004',
  templateUrl: './f06004.component.html',
  styleUrls: ['./f06004.component.css', '../../assets/css/f02.css']
})
export class F06004Component implements OnInit {

  constructor(
    private f06004Service: F06004Service,
    private dialog: MatDialog,
    private pipe: DatePipe
  ) { }

  applno: string = '';
  nationalId: string = '';
  custId: string = '';
  cuCname: string = '';
  b1EmpNo: string = '';
  b1EmpNoCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }];
  settleDate: string = '';
  applyendTime: [Date, Date];
  proofDocumentTime: [Date, Date];
  signUpTime: [Date, Date];
  prodCode: string = '';
  prodCodeCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }];
  prjCode: string = '';
  prjCodeCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }];
  marketingCode: string = '';

  resultData = [];
  showData: any[] = [];
  pageSize = 50;
  pageIndex = 1;
  total = 0;
  sortValue: string = '';

  disabled = false;

  @ViewChild('scrollToTop', { static: false }) nzTableComponent?: NzTableComponent<any[]>;

  ngOnInit(): void {
    let jsonObject: any = {};
    const baseUrl = "f06/f06004";
    this.f06004Service.getData(baseUrl, jsonObject).subscribe(data => {
      //客服人員下拉
      for (const jsonObj of data.rspBody.b1EmpNoList) {
        this.b1EmpNoCode.push({
          value: jsonObj['empNo'],
          viewValue: jsonObj['empNo'] + ":" + jsonObj['empName']
        });
      }
      //產品名稱下拉
      for (const jsonObj of data.rspBody.prodNameList) {
        this.prodCodeCode.push({
          value: jsonObj['prodCode'],
          viewValue: jsonObj['prodCode'] + ":" + jsonObj['prodName']
        });
      }
    });
    this.select();
  }

  select(pageIndex?: number, close?: boolean) {
    // if (this.check()) {
      let jsonObject: any = {};
      let baseUrl = 'f06/f06004action1';
      jsonObject['applno'] = this.applno;
      jsonObject['nationalId'] = this.nationalId;
      jsonObject['custId'] = this.custId;
      jsonObject['cuCname'] = this.cuCname;
      jsonObject['b1EmpNo'] = this.b1EmpNo;
      if (this.settleDate != null && this.settleDate != '') {
        jsonObject['settleDate'] = this.pipe.transform(new Date(this.settleDate), 'yyyyMMdd')
      }
      jsonObject['prodCode'] = this.prodCode;
      jsonObject['prjCode'] = this.prjCode;
      jsonObject['marketingCode'] = this.marketingCode;
      if (this.applyendTime != null) {
        jsonObject['applyEndTimeStart'] = this.pipe.transform(new Date(this.applyendTime[0]), 'yyyyMMdd');
        jsonObject['applyEndTimeEnd'] = this.pipe.transform(new Date(this.applyendTime[1]), 'yyyyMMdd');
      }
      if (this.proofDocumentTime != null) {
        jsonObject['proofDocumentTimeStart'] = this.pipe.transform(new Date(this.proofDocumentTime[0]), 'yyyyMMdd');
        jsonObject['proofDocumentTimeEnd'] = this.pipe.transform(new Date(this.proofDocumentTime[1]), 'yyyyMMdd');
      }
      if (this.signUpTime != null) {
        jsonObject['signUpTimeStart'] = this.pipe.transform(new Date(this.signUpTime[0]), 'yyyyMMdd');
        jsonObject['signUpTimeEnd'] = this.pipe.transform(new Date(this.signUpTime[1]), 'yyyyMMdd');
      }

      this.f06004Service.getData(baseUrl, jsonObject).subscribe(data => {
        if (data.rspBody.length == 0) {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "查無資料" }
          })
          this.resultData = [];
          this.showData = [];
          this.total = 0;
        } else {
          this.resultData = data.rspBody;
          if (close) {
            if (!(this.sortValue == '')) {
              this.resultData = this.sortValue === 'ascend' ? this.resultData.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
              : this.resultData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO))
            } else {
              this.resultData = this.resultData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
            }
            this.showData = this.f06004Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
          } else {
            this.sortValue == '';
            this.pageIndex = 1;
            this.resultData = this.resultData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
            this.showData = this.f06004Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
          }
          this.total = this.resultData.length;
        }
      })
    // } else {
    //   this.dialog.open(ConfirmComponent, {
    //     data: { msgStr: "請至少選擇一項條件" }
    //   });
    // }
  }

  check(): boolean {
    if (this.applno == '' && this.nationalId == '' && this.custId == '' && this.cuCname == ''
      && this.b1EmpNo == '' && this.settleDate == '' && this.applyendTime == null
      && this.proofDocumentTime == null && this.signUpTime == null && this.prodCode == ''
      && this.prjCode == '' && this.marketingCode == '') {
      this.total = 0;
      return false
    } else {
      return true;
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
      this.scrollToIndex(1);
      const { pageIndex } = params;
      this.pageIndex = pageIndex;
      this.showData = this.f06004Service.getTableDate(pageIndex, this.pageSize, this.resultData);
  }

  sortChange(e: string, param: string) {
    this.sortValue = e;
    switch (param) {
      case "APPLNO":
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
          : this.resultData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
        this.showData = this.f06004Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
    }
  }

  detail(applno: string, nationalId: string, custId: string, cuCname: string) {
    this.disabled = true;
    let jsonObject: any = {};
    let baseUrl = 'f06/f06004action8';
    jsonObject['applno'] = applno;
    this.f06004Service.getData(baseUrl, jsonObject).subscribe(data => {
      if (data.rspBody == '取件成功') {
        const dialogRef = this.dialog.open(F06004editComponent, {
          panelClass: 'mat-dialog-transparent',
          height: '90%',
          width: '90%',
          data: {
            applno: applno,
            nationalId: nationalId,
            custId: custId,
            cuCname: cuCname
          }
        })
        dialogRef.afterClosed().subscribe(result => {
          this.select(this.pageIndex, true);
          this.disabled = false;
        })
      } else {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
        childernDialogRef.afterClosed().subscribe(result => {
          this.disabled = false;
        })
      }
    });
  }

  dateNull(t: [Date, Date], name: string) {
    if (t.length < 1) {
      switch (name) {
        case 'applyendTime':
          this.applyendTime = null;
          break;
        case 'proofDocumentTime':
          this.proofDocumentTime = null;
          break;
        case 'signUpTime':
          this.signUpTime = null;
          break;
      }
    }
  }

  clear() {
    this.applno = '';
    this.nationalId = '';
    this.custId = '';
    this.cuCname = '';
    this.b1EmpNo = '';
    this.settleDate = '';
    this.applyendTime = null;
    this.proofDocumentTime = null;
    this.signUpTime = null;
    this.prodCode = '';
    this.prjCode = '';
    this.marketingCode = '';
    this.resultData = [];
    this.showData = [];
    this.total = 0;
    this.pageIndex = 1;
    this.sortValue = '';
  }

  //to top
  scrollToIndex(index: number): void {
    this.nzTableComponent?.cdkVirtualScrollViewport?.scrollToIndex(index);
  }
}
