import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from '../base.service';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { OptionsCode } from '../interface/base';
import { F01010Service } from './f01010.service';

@Component({
  selector: 'app-f01010',
  templateUrl: './f01010.component.html',
  styleUrls: ['./f01010.component.css', '../../assets/css/f01.css']
})
export class F01010Component implements OnInit {

  constructor(
    private f01010Service: F01010Service,
    private router: Router,
    public dialog: MatDialog
  ) { }
  @ViewChild('absBox') absBox: ElementRef// 抓取table id
  cusinfoDataSource = [];
  readonly pageSize = 50;
  pageIndex = 1;
  total: number;
  fds: string = "";
  empNo: string; // 當前員編
  newData = [];                       // 處理排序後的清單
  //ngModel區
  swcApplno: string;
  swcNationalId: string;
  swcCustId: string;
  agentEmpNo: string;
  swcCollStatus: string;              // 貸後管理狀態
  swcCollFlag: string;                // 貸後管理註記
  swcRiskLevel: string;               // 本次客戶風險等級CRL
  swcInputType: string;               // 進件類別
  swcCusFlag: string;                 // 客戶身分名單註記

  //下拉選單區
  caseTypeCode: OptionsCode[] = [];
  agentEmpNoCode: OptionsCode[] = [];
  bwMgrStatusCode: OptionsCode[] = [];// 貸後管理狀態
  bwMgrMarkCode: OptionsCode[] = [];  // 貸後管理註記
  bwRiskCode: OptionsCode[] = [];     // 本次客戶風險等級CRL
  bwInputTypeCode: OptionsCode[] = [];// 進件類別
  ynCode: OptionsCode[] = [];         // 客戶身分名單註記

  // 計算剩餘table資料長度
  get tableHeight(): string {
    if (this.absBox) {
      return (this.absBox.nativeElement.offsetHeight - 130) + 'px';
    }
  }

  ngOnInit(): void {
    this.empNo = BaseService.userId;
    // 查詢案件分類
    this.f01010Service.getSysTypeCode('BW_CASE_TYPE').subscribe(data => {
      this.caseTypeCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.caseTypeCode.push({ value: codeNo, viewValue: desc })
      }
    });

    // 代理人
    let jsonObject: any = {};
    jsonObject['swcL3EmpNo'] = this.empNo;

    this.f01010Service.getEmpNo(jsonObject).subscribe(data => {
      this.agentEmpNoCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody) {
        const empNo = jsonObj['empNo'];
        const empName = jsonObj['empName'];
        this.agentEmpNoCode.push({ value: empNo, viewValue: empName })
      }
    });

    // 貸後管理狀態
    this.f01010Service.getSysTypeCode('BW_MGR_STATUS').subscribe(data => {
      this.bwMgrStatusCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeNo + '-' + jsonObj.codeDesc;
        this.bwMgrStatusCode.push({ value: codeNo, viewValue: desc })
      }
    });

    // 貸後管理註記
    this.f01010Service.getSysTypeCode('BW_MGR_MARK').subscribe(data => {
      this.bwMgrMarkCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.bwMgrMarkCode.push({ value: codeNo, viewValue: desc })
      }
    });

    // 本次客戶風險等級CRL
    this.f01010Service.getSysTypeCode('BW_RISK').subscribe(data => {
      this.bwRiskCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.bwRiskCode.push({ value: codeNo, viewValue: desc })
      }
    });

    // 進件類別
    this.f01010Service.getSysTypeCode('BW_INPUT_TYPE').subscribe(data => {
      this.bwInputTypeCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.bwInputTypeCode.push({ value: codeNo, viewValue: desc })
      }
    });

    // 客戶身分名單註記
    this.f01010Service.getSysTypeCode('YN').subscribe(data => {
      this.ynCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.ynCode.push({ value: codeNo, viewValue: desc })
      }
    });

    this.agentEmpNo = '';
    this.swcApplno = '';
    this.swcNationalId = '';
    this.swcCustId = '';
    this.swcCollStatus = '';
    this.swcRiskLevel = '';
    this.swcCollFlag = '';
    this.swcInputType = '';
    this.swcCusFlag = '';
  }
  ngAfterViewInit() {
    this.getCaseList();
  }

  // 代入條件查詢
  select() {
    if (this.agentEmpNo != '') {
      this.empNo = this.agentEmpNo;
    } else {
      this.empNo = BaseService.userId;
    }
    this.changePage();
    this.getCaseList();
  }

  getCaseList() {
    let jsonObject: any = {};
    jsonObject['page'] = this.pageIndex;
    jsonObject['per_page'] = this.pageSize;
    jsonObject['swcL3EmpNo'] = this.empNo;
    jsonObject['swcNationalId'] = this.swcNationalId;
    jsonObject['swcCustId'] = this.swcCustId;
    jsonObject['swcApplno'] = this.swcApplno;
    jsonObject['swcCustId'] = this.swcCustId;
    jsonObject['swcCollStatus'] = this.swcCollStatus;
    jsonObject['swcCollFlag'] = this.swcCollFlag;
    jsonObject['swcRiskLevel'] = this.swcRiskLevel;
    jsonObject['swcInputType'] = this.swcInputType;
    jsonObject['swcCusFlag'] = this.swcCusFlag;
    this.f01010Service.getCaseList(jsonObject).subscribe(data => {
      if (data.rspBody.size > 0) {
        this.total = data.rspBody.size;
        this.cusinfoDataSource = data.rspBody.items;
        this.newData = this.f01010Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
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

  // 排序
  sortChange(e: string) {
    this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
      (a, b) => a.swcApplno.localeCompare(b.swcApplno)) : this.cusinfoDataSource.sort((a, b) => b.swcApplno.localeCompare(a.swcApplno))
    this.newData = this.f01010Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
  }

  // 參數
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      this.pageIndex = pageIndex;
      this.newData = this.f01010Service.getTableDate(this.pageIndex, this.pageSize, this.cusinfoDataSource);
      // this.getCaseList();
      const matTable = document.getElementById('matTable');
      matTable.scrollIntoView();
    }
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

    this.f01010Service.getLockCase(jsonObject).subscribe(data => {
      // if (data.rspBody != null) {
      //   this.fds = data.rspBody[0].fds
      // }
      if (data.rspMsg == '案件鎖定成功') {
        sessionStorage.setItem('applno', swcApplno);
        sessionStorage.setItem('nationalId', swcNationalId);
        sessionStorage.setItem('search', 'N');
        sessionStorage.setItem('fds', this.fds);
        sessionStorage.setItem('queryDate', '');
        // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
        sessionStorage.setItem('page', '10');
        sessionStorage.setItem('custId', swcCustId);
        this.router.navigate(['./F01010/F01010SCN1']);
      }
      else {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
      }
    });
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

  // 將貸後管理狀態轉成中文
  getOptionStatus(codeVal: string): string {
    for (const data of this.bwMgrStatusCode) {
      if (data.value == codeVal && codeVal != '') {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
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

    this.f01010Service.saveCaseMemo(jsonObject).subscribe(data => {
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

  // 清除資料
  clear() {
    this.agentEmpNo = '';
    this.swcApplno = '';
    this.swcNationalId = '';
    this.swcCustId = '';
    this.swcCollStatus = '';
    this.swcCollFlag = '';
    this.swcRiskLevel = '';
    this.swcCustId = '';
    this.swcInputType = '';
    this.swcCusFlag = '';
    this.empNo = BaseService.userId;
    this.getCaseList();
  }
}
