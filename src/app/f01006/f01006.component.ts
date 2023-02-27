import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ChildrenService } from '../children/children.service';
import { F01006Service } from './f01006.service';
import { F01006restartComponent } from './f01006restart/f01006restart.component';
import zh from '@angular/common/locales/zh';
import { registerLocaleData } from '@angular/common';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

registerLocaleData(zh);


@Component({
  selector: 'app-f01006',
  templateUrl: './f01006.component.html',
  styleUrls: ['./f01006.component.css', '../../assets/css/f01.css']
})
export class F01006Component implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('absBox') absBox: ElementRef             // 抓取table id
  applno: string;                                     // 案件編號
  nationalID: string;                                 // 身分證字號
  custID: string;                                     // 客戶編號
  total: number;
  readonly pageSize = 50;
  pageIndex = 1;
  cusinfoDataSource = [];
  restart$: Subscription;
  x: string

  constructor(
    public dialog: MatDialog,
    private f01006Service: F01006Service,
    public childService: ChildrenService,

  ) {
    this.restart$ = this.f01006Service.restart$.subscribe((data) => {
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
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy() {
    this.restart$.unsubscribe();
  }

  //代入條件查詢
  select() {
    if (this.nationalID == '' && this.applno == '' && this.custID == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "至少輸入一個選項!" }
      });
    } else {
      this.changePage();
      this.getCaseList();

    }
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
    opid: string)
    {
    const dialogRef = this.dialog.open(F01006restartComponent, {
      minHeight: '30%',
      width: '150%',
      panelClass: 'mat-dialog-transparent',
      data: {

        applno: applno,
        nationalId: nationalId,
        custId: custId,
        name: name,
        limit: limit,
        periods: periods,
        rates: rates,
        opid: opid
      }
    });
    sessionStorage.setItem('applno', applno);
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
    jsonObject['page'] = this.pageIndex;
    jsonObject['per_page'] = this.pageSize;
    jsonObject['applno'] = this.applno;
    jsonObject['nationalID'] = this.nationalID;
    jsonObject['custID'] = this.custID;
    this.f01006Service.getCaseList(jsonObject).subscribe(data => {
      if (data.rspBody.size > 0) {
        this.total = data.rspBody.size;
        this.cusinfoDataSource = data.rspBody.items;
        sessionStorage.setItem('search', 'N');
      }
      else {
        this.cusinfoDataSource = null;
        this.total = 0;
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        })
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

  // 排序
  sortChange(e: string) {
    this.cusinfoDataSource = e === 'ascend' ? this.cusinfoDataSource.sort(
      (a, b) => a.APPLNO.localeCompare(b.APPLNO)) : this.cusinfoDataSource.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO))
  }

  // 清除資料
  clear() {
    this.applno = '';
    this.nationalID = '';
    this.custID = '';
    this.cusinfoDataSource = [];
    this.total = 0;
  }
}
