import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from '../base.service';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { OptionsCode } from '../interface/base';
import { F01012Service } from './f01012.service'

interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f01012',
  templateUrl: './f01012.component.html',
  styleUrls: ['./f01012.component.css', '../../assets/css/f01.css']
})

// Jay 合約前覆核清單

export class F01012Component implements OnInit {

  constructor(
    private f01012Service: F01012Service,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  total: number;
  @ViewChild('absBox') absBox: ElementRef
  empNo: string;
  swcNationalId: string;                              // 身分證字號
  swcApplno: string;                                  // 案件編號
  swcCustId: string;                                  // 客戶ID
  caseType: string;                                   // 案件分類
  caseTypeCode: OptionsCode[] = [];                   // 案件分類下拉
  agentEmpNo: string;                                 // 代理人
  agentEmpNoCode: OptionsCode[] = [];                 // 代理人下拉
  cusinfoDataSource = [];                             // 案件清單
  newData = [];                                       // 處理排序後的清單
  fds: string = "";                                   // fds
  stepName: string;                                   // 目前關卡名
  readonly pageSize = 50;
  pageIndex = 1;
  sum: string = '0'; //總數
  x: string
  sort: string;
  i = 0;
  productList :sysCode[] = [];//產品名稱陣列
  product_NAME: string = '';//產品名稱
  // 計算剩餘table資料長度
  get tableHeight(): string {
    if (this.absBox) {
      return (this.absBox.nativeElement.offsetHeight - 140) + 'px';
    }
  }
  ngOnInit(): void {
    this.empNo = BaseService.userId;
    this.productList = [];
    //產品名稱
    this.productList.push({ value: '', viewValue: '請選擇' })
    // 代理人
    let jsonObject: any = {};
    jsonObject['swcD1EmpNo'] = this.empNo;

    this.f01012Service.getEmpNo(jsonObject).subscribe(data => {
      this.agentEmpNoCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody) {
        const empNo = jsonObj['empNo'];
        const empName = jsonObj['empName'];
        this.agentEmpNoCode.push({ value: empNo, viewValue: empName })
      }
    });
    this.sort = 'ascend';
    this.agentEmpNo = '';
    this.swcApplno = '';
    this.swcNationalId = '';
    this.swcCustId = '';
    this.caseType = '';
  }
  ngAfterViewInit() {
    this.getCaseList();
  }
  getCaseList() {

    let jsonObject: any = {};
    jsonObject['page'] = this.pageIndex;
    jsonObject['per_page'] = this.pageSize;
    jsonObject['swcD1EmpNo'] = this.empNo;
    jsonObject['swcNationalId'] = this.swcNationalId;
    jsonObject['swcCustId'] = this.swcCustId;
    jsonObject['swcApplno'] = this.swcApplno;
    jsonObject['prodCode'] = this.product_NAME;//產品名稱
    this.f01012Service.getCaseList(jsonObject).subscribe(data => {
      if(this.i==0)
      {
        this.productList = [];
        this.productList.push({ value: '', viewValue: '請選擇' })
        for (const jsonObj of data.rspBody.prodCodeAndName) {
          const codeNo = jsonObj['PROD_CODE'];
          const desc = jsonObj['PROD_NAME'];
          this.productList.push({ value: codeNo, viewValue: desc })
        }
        this.i = 1;
      }

      this.sum = data.rspBody.items.length
      if (data.rspBody.size > 0) {

        this.total = data.rspBody.size;
        this.cusinfoDataSource = data.rspBody.items;
        this.newData = this.f01012Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
        this.stepName = data.rspBody.items[0].F_StepName;
      }
      else {
        this.newData = null;
        this.total = 0;
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        })
      }
    });
  }

  //代入條件查詢
  select() {
    if (this.agentEmpNo != '') {
      this.empNo = this.agentEmpNo;
    } else {
      this.empNo = BaseService.userId;
    }
    this.changePage();
    this.getCaseList();
  }

  // 案件子頁籤
  getLockCase(swcApplno: string, swcNationalId: string, swcCustId: string) {
    let jsonObject: any = {};
    jsonObject['swcApplno'] = swcApplno;

    if (swcNationalId == BaseService.empId) {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "案件身分證不可與登入者身分證相同!" }
      });
      return;
    }

    this.f01012Service.getLockCase(jsonObject).subscribe(data => {
      if (data.rspBody!=null) {
        this.fds = data.rspBody[0].fds
      }
      if (data.rspMsg == '案件鎖定成功') {
        sessionStorage.setItem('applno', swcApplno);
        sessionStorage.setItem('nationalId', swcNationalId);
        sessionStorage.setItem('search', 'N');
        sessionStorage.setItem('fds', this.fds);
        sessionStorage.setItem('queryDate', '');
        sessionStorage.setItem('review', '');
        sessionStorage.setItem('level', 'D1');
        // sessionStorage.setItem('level', '8');//
        // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 12產生合約前複合 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
        sessionStorage.setItem('page', '12');
        sessionStorage.setItem('stepName', this.stepName);
        sessionStorage.setItem('custId', swcCustId);
        this.router.navigate(['./F01012/F01008SCN1']);
      }
      else
      {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
      }
    });
  }

  // 參數
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      this.pageIndex = pageIndex;
      this.newData = this.f01012Service.getTableDate(pageIndex, this.pageSize, this.cusinfoDataSource);
      // this.getCaseList();
      const matTable = document.getElementById('matTable');
      matTable.scrollIntoView();
    }
  }

  changePage() {
    this.pageIndex = 1;
    this.total = 1;
  }

  // 排序
  sortChange(e: string, param: string) {
    this.sort = '';
    switch (param) {
      case "swcApplyNum":
        this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
          (a, b) => a.swcApplyNum.localeCompare(b.swcApplyNum)) : this.cusinfoDataSource.sort((a, b) => b.swcApplyNum.localeCompare(a.swcApplyNum))
        this.newData = this.f01012Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
        break;
      case "F_StartTime":
        this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
          (a, b) => a.F_StartTime.localeCompare(b.F_StartTime)) : this.cusinfoDataSource.sort((a, b) => b.F_StartTime.localeCompare(a.F_StartTime))
        this.newData = this.f01012Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
        break;
      case "swcCustTag":
        this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
          (a, b) => a.swcCustTag.localeCompare(b.swcCustTag)) : this.cusinfoDataSource.sort((a, b) => b.swcCustTag.localeCompare(a.swcCustTag))
        this.newData = this.f01012Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
        break;
      case "swcApplno":
        this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
          (a, b) => a.swcApplno.localeCompare(b.swcApplno)) : this.cusinfoDataSource.sort((a, b) => b.swcApplno.localeCompare(a.swcApplno))
        this.newData = this.f01012Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
        break;
      case "swcRiskGrade":
        this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
          (a, b) => a.swcRiskGrade.localeCompare(b.swcRiskGrade)) : this.cusinfoDataSource.sort((a, b) => b.swcRiskGrade.localeCompare(a.swcRiskGrade))
        this.newData = this.f01012Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
        break;
    }
  }

  // 清除資料
  clear() {
    this.agentEmpNo = '';
    this.swcApplno = '';
    this.swcNationalId = '';
    this.swcCustId = '';
    this.caseType = '';
    this.empNo = BaseService.userId;
    this.getCaseList();
    this.product_NAME = '';
    this.i=0;
  }

  // 千分號標點符號(form顯示用)
  data_number(p: number) {
    this.x = '';
    this.x = (p + "")
    if (this.x != null) {
      this.x = this.x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return this.x
  }
   // 將產品類型轉成中文
   product(codeVal: string): string {
    for (const data of this.productList) {
      if (data.value == codeVal) {
        return data.value+data.viewValue;
      }
    }
    return codeVal;
  }
}
