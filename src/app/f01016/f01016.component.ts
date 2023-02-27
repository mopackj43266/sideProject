import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { Data, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ChildrenService } from '../children/children.service';
import { F01016Service } from './f01016.service';
import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f01016',
  templateUrl: './f01016.component.html',
  styleUrls: ['./f01016.component.css', '../../assets/css/f01.css']
})
export class F01016Component implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('absBox') absBox: ElementRef             // 抓取table id
  applno: string;                                     // 案件編號
  nationalID: string;                                 // 身分證字號
  custID: string;                                     // 客戶編號
  total: number;
  readonly pageSize = 50;
  pageIndex = 1;
  suiManagerSource = [];
  restart$: Subscription;
  x: string
  reasonCode: sysCode[] = [] //本次執行原因
  reasonDetailCode: sysCode[] = [] //本次執行原因細項
  sort: string;

  constructor(
    public dialog: MatDialog,
    private f01016Service: F01016Service,
    public childService: ChildrenService,
    private router: Router,
  ) {
    this.restart$ = this.f01016Service.restart$.subscribe((data) => {
      this.getCaseList();
    });
  }

  // 計算剩餘table資料長度
  get tableHeight(): string {
    if (this.absBox) {
      return (this.absBox.nativeElement.offsetHeight - 140) + 'px';
    }
  }

  ngOnInit(): void {
    this.applno = '';
    this.nationalID = '';
    this.custID = '';
    this.total = 0;
    this.sort = 'ascend';

  }
  ngAfterViewInit(): void {
    this.getCaseList();
  }

  ngOnDestroy() {
    this.restart$.unsubscribe();
  }
  //代入條件查詢
  select() {
    this.changePage();
    this.getCaseList();
  }

  changePage() {
    this.pageIndex = 1;
    this.total = 1;
  }

  //跳出申請頁面
  getRestartCase(
    applno: string,
    nationalId: string,
    custId: string,
    name: string,
    limit: string,
    periods: string,
    rates: string,
    opid: string) {
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      this.pageIndex = pageIndex;
      this.getCaseList();
    }
  }
  //案件清單
  getCaseList() {
    let jsonObject: any = {};
    // jsonObject['page'] = this.pageIndex;
    // jsonObject['per_page'] = this.pageSize;
    jsonObject['applno'] = this.applno;
    jsonObject['nationalID'] = this.nationalID;
    jsonObject['custID'] = this.custID;

    this.f01016Service.getCaseList(jsonObject).subscribe(data => {
      if (data.rspBody.items.length > 0) {
        this.total = data.rspBody.items.length;
        this.suiManagerSource = data.rspBody.items;
        this.getReason()
        let jsonObject: any = {};
        jsonObject['reasonCode'] = data.rspBody.items.reasonCode
        this.f01016Service.getReturn('f01/f01015action2', jsonObject).subscribe(data => {
          for (const jsonObj of data.rspBody.items) {
            const codeNo = jsonObj.reasonCode;
            const desc = jsonObj.reasonDesc;
            this.reasonDetailCode.push({ value: codeNo, viewValue: desc });
          }
        });
      }
      else {
        this.suiManagerSource = null;
        this.total = 0;
        // const childernDialogRef = this.dialog.open(ConfirmComponent, {
        //   data: { msgStr: "查無資料" }
        // })
      }
    });
  }


  //取本次執行原因下拉
  getReason() {
    let jsonObject: any = {};
    this.reasonCode.push({ value: '', viewValue: '請選擇' })
    this.f01016Service.getReturn('f01/f01015', jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.adrCodelist) {
        const codeNo = jsonObj.reasonCode;
        const desc = jsonObj.reasonDesc;
        this.reasonCode.push({ value: codeNo, viewValue: desc });
      }
    });
  }

  //本次執行原因轉換中文
  changeChinese(codeVal: string) {
    for (const jsonObj of this.reasonCode) {
      if (jsonObj.value == codeVal) {
        return jsonObj.viewValue
      }
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


  // 千分號標點符號(form顯示用)
  data_number(p: number) {
    this.x = '';
    this.x = (p + "")
    if (this.x != null) {
      this.x = this.x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return this.x
  }

  // 排序
  // sortChange(e: string) {
  //   this.suiManagerSource = e === 'ascend' ? this.suiManagerSource.sort(
  //     (a, b) => a.APPLNO.localeCompare(b.APPLNO)) : this.suiManagerSource.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO))
  // }

  // 排序
  sortChange(e: string, param: string) {
    this.sort = '';
    switch (param) {
      case "applno":
        this.suiManagerSource = e === 'ascend' ? this.suiManagerSource.sort(
          (a, b) => a.applno.localeCompare(b.applno)) : this.suiManagerSource.sort((a, b) => b.applno.localeCompare(a.applno))
        break;
      case "reasonCode":
        this.suiManagerSource = e === 'ascend' ? this.suiManagerSource.sort(
          (a, b) => a.reasonCode.localeCompare(b.reasonCode)) : this.suiManagerSource.sort((a, b) => b.reasonCode.localeCompare(a.reasonCode))
        break;
      case "executeType":
        this.suiManagerSource = e === 'ascend' ? this.suiManagerSource.sort(
          (a, b) => a.executeType.localeCompare(b.executeType)) : this.suiManagerSource.sort((a, b) => b.executeType.localeCompare(a.executeType))
        break;
      case "creditTime":
        this.suiManagerSource = e === 'ascend' ? this.suiManagerSource.sort(
          (a, b) => a.creditTime.localeCompare(b.creditTime)) : this.suiManagerSource.sort((a, b) => b.creditTime.localeCompare(a.creditTime))
        break;
      case "creditEmpno":
        this.suiManagerSource = e === 'ascend' ? this.suiManagerSource.sort(
          (a, b) => a.creditEmpno.localeCompare(b.creditEmpno)) : this.suiManagerSource.sort((a, b) => b.creditEmpno.localeCompare(a.creditEmpno))
        break;
      case "customerId":
        this.suiManagerSource = e === 'ascend' ? this.suiManagerSource.sort(
          (a, b) => a.customerId.localeCompare(b.customerId)) : this.suiManagerSource.sort((a, b) => b.customerId.localeCompare(a.customerId))
        break;
      case "nationalId":
        this.suiManagerSource = e === 'ascend' ? this.suiManagerSource.sort(
          (a, b) => a.nationalId.localeCompare(b.nationalId)) : this.suiManagerSource.sort((a, b) => b.nationalId.localeCompare(a.nationalId))
        break;
    }
  }

  // 清除資料
  clear() {
    this.applno = '';
    this.nationalID = '';
    this.custID = '';
    this.suiManagerSource = [];
    this.total = 0;
  }

  toCalloutPage(applno: string, creditEmpno: string, creditTime: string) {
    this.f01016Service.setApplno(applno)
    this.f01016Service.setPage('16')
    this.f01016Service.setEmpno(creditEmpno)
    sessionStorage.setItem('router', '16chk');
    sessionStorage.setItem('applno', applno);
    sessionStorage.setItem('checkTime', creditTime);//本次執行時間
    // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢 16主管凍結
    this.router.navigate(['./F01016/F01016SCN1']);
  }
}
