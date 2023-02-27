import { formatDate } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from '../base.service';
import { Childscn19Component } from '../children/childscn19/childscn19.component';
import { Childscn30Component } from '../children/childscn30/childscn30.component';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { OptionsCode } from '../interface/base';
import { F01014Service } from './f01014.service';
interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f01014',
  templateUrl: './f01014.component.html',
  styleUrls: ['./f01014.component.css', '../../assets/css/f01.css']
})
export class F01014Component implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private f01014Service: F01014Service,
    public dialog: MatDialog) { }


  total: number;
  @ViewChild('absBox') absBox: ElementRef             // 抓取table id
  empNo: string;      // 當前員編
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
  x: string;
  sort: string;
  productList: sysCode[] = [];//產品名稱陣列
  product_NAME: string = '';//產品名稱
  i = 0;
  swcC3Flag:string='' //C3憑證
  swcC3FlagList:OptionsCode[]=[ ////C3憑證
    {value: '', viewValue: '請選擇'},
    {value: 'Y', viewValue: '是'},
    {value: 'N', viewValue: '否'},];
  // 計算剩餘table資料長度
  get tableHeight(): string {
    if (this.absBox) {
      return (this.absBox.nativeElement.offsetHeight - 190) + 'px';
    }
  }
  ngOnInit(): void {
    this.empNo = BaseService.userId;
    // 查詢案件分類
    this.f01014Service.getSysTypeCode('CASE_TYPE').subscribe(data => {
      this.caseTypeCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.caseTypeCode.push({ value: codeNo, viewValue: desc })
      }
    });
    // 查詢代理人
    let jsonObject: any = {};
    jsonObject['empNo'] = this.empNo;

    this.f01014Service.getEmpNo(jsonObject).subscribe(data => {
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

  ngAfterViewInit(): void {
    this.getCaseList();
  }

  // 查詢案件清單
  getCaseList() {
    let jsonObject: any = {};
    jsonObject['page'] = this.pageIndex;
    jsonObject['per_page'] = this.pageSize;
    jsonObject['empNo'] = this.empNo;
    jsonObject['stepName'] = 'swcS1EmpNo';
    jsonObject['opid'] = '2640';
    jsonObject['swcNationalId'] = this.swcNationalId;
    jsonObject['swcApplno'] = this.swcApplno;
    jsonObject['swcCustId'] = this.swcCustId;
    jsonObject['caseType'] = this.caseType;
    jsonObject['prodCode'] = this.product_NAME;//產品名稱
    jsonObject['swcC3Flag'] = this.swcC3Flag;//C3憑證
    this.f01014Service.getCaseList(jsonObject).subscribe(data => {
      if (this.i == 0) {
        this.productList = [];
        this.productList.push({ value: '', viewValue: '請選擇' })
        for (const jsonObj of data.rspBody.prodCodeAndName) {
          const codeNo = jsonObj['PROD_CODE'];
          const desc = jsonObj['PROD_NAME'];
          this.productList.push({ value: codeNo, viewValue: desc })
        }
        this.i = 1;
      }
      if (data.rspBody.size > 0) {
        this.total = data.rspBody.size != '0' ? data.rspBody.size : '0';
        this.cusinfoDataSource = data.rspBody.items;
        this.newData = this.f01014Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
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
    jsonObject['caseType'] = 'S1';
    if (swcNationalId == BaseService.empId) {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "案件身分證不可與登入者身分證相同!" }
      });
      return;
    }

    this.f01014Service.getLockCase(jsonObject).subscribe(data => {
      if (data.rspBody != null) {
        this.fds = data.rspBody[0].fds
      }
      if (data.rspMsg == '案件鎖定成功') {
        sessionStorage.setItem('applno', swcApplno);

        sessionStorage.setItem('nationalId', swcNationalId);
        sessionStorage.setItem('search', 'N');
        sessionStorage.setItem('fds', this.fds);
        sessionStorage.setItem('queryDate', '');
        //主管 L0 授信複核 L1 授信作業 L2 徵信作業 L3 文審作業 L4 總經理 S1 風管處 S2
        sessionStorage.setItem('level', 'S1');//總經理
        // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管  12產生合約前覆核 13風管處處長 14總經理 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
        sessionStorage.setItem('page', '14');//總經理
        sessionStorage.setItem('stepName', 'xxtS1');
        sessionStorage.setItem('custId', swcCustId);
        this.router.navigate(['./F01014/F01014SCN1']);
      }
      else {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
      }
    });
  }

  changePage() {
    this.pageIndex = 1;
    this.total = 1;
  }

  // 儲存案件註記
  saveCaseMemo(swcApplno: string, swcCaseMemo: string) {
    let msg = '';
    let jsonObject: any = {};
    jsonObject['swcApplno'] = swcApplno;
    jsonObject['swcCaseMemo'] = swcCaseMemo;

    this.f01014Service.saveCaseMemo(jsonObject).subscribe(data => {
      msg = data.rspMsg;
    });
    setTimeout(() => {
      const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msg } });
      if (msg != null && msg == 'success') { this.getCaseList }
    }, 1000);
    setTimeout(() => {
      this.dialog.closeAll();
    }, 2500)
  }

  // 參數
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      this.pageIndex = pageIndex;
      this.newData = this.f01014Service.getTableDate(pageIndex, this.pageSize, this.cusinfoDataSource);
      // this.getCaseList();
      const matTable = document.getElementById('matTable');
      matTable.scrollIntoView();
    }
  }

  // 打開通知彈窗
  openNotifyMsg(swcApplno: string) {
    const dialogRef = this.dialog.open(Childscn30Component, {
      panelClass: 'mat-dialog-transparent',
      height: '90%',
      width: '90%',
      data: {
        swcApplno: swcApplno,
        // flag: 'Y'
      }
    });
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
  // 將案件類型轉成中文
  getOptionCaseType(codeVal: string): string {
    for (const data of this.caseTypeCode) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }

  // 排序
  sortChange(e: string, param: string) {
    this.sort = '';
    switch (param) {
      case "swcApplyNum":
        this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
          (a, b) => a.swcApplyNum.localeCompare(b.swcApplyNum)) : this.cusinfoDataSource.sort((a, b) => b.swcApplyNum.localeCompare(a.swcApplyNum))
        this.newData = this.f01014Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
        break;
      case "F_StartTime":
        this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
          (a, b) => a.F_StartTime.localeCompare(b.F_StartTime)) : this.cusinfoDataSource.sort((a, b) => b.F_StartTime.localeCompare(a.F_StartTime))
        this.newData = this.f01014Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
        break;
      case "swcCustTag":
        this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
          (a, b) => a.swcCustTag.localeCompare(b.swcCustTag)) : this.cusinfoDataSource.sort((a, b) => b.swcCustTag.localeCompare(a.swcCustTag))
        this.newData = this.f01014Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
        break;
      case "swcApplno":
        this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
          (a, b) => a.swcApplno.localeCompare(b.swcApplno)) : this.cusinfoDataSource.sort((a, b) => b.swcApplno.localeCompare(a.swcApplno))
        this.newData = this.f01014Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
        break;
      case "swcRiskGrade":
        this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
          (a, b) => a.swcRiskGrade.localeCompare(b.swcRiskGrade)) : this.cusinfoDataSource.sort((a, b) => b.swcRiskGrade.localeCompare(a.swcRiskGrade))
        this.newData = this.f01014Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
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
    this.i = 0;
    this.swcC3Flag='';
  }
  // 將產品類型轉成中文
  product(codeVal: string): string {
    for (const data of this.productList) {
      if (data.value == codeVal) {
        return data.value + data.viewValue;
      }
    }
    return codeVal;
  }
}
