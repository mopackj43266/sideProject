import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Childscn19Component } from 'src/app/children/childscn19/childscn19.component';
import { Childscn20Component } from 'src/app/children/childscn20/childscn20.component';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01001Scn1Service } from './f01001scn1.service';
import { Childscn26Component } from 'src/app/children/childscn26/childscn26.component';
import { Childscn27Component } from './../../children/childscn27/childscn27.component';
import { Childscn28Component } from './../../children/childscn28/childscn28.component';
import { Subscription } from 'rxjs';
import { history } from './../../interface/base';
import { Childscn1Service } from 'src/app/children/childscn1/childscn1.service';
import { Childscn18Component } from 'src/app/children/childscn18/childscn18.component';

@Component({
  selector: 'app-f01001scn1',
  templateUrl: './f01001scn1.component.html',
  styleUrls: ['./f01001scn1.component.css', '../../../assets/css/f01.css']
})
export class F01001scn1Component implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private f01001Scn1Service: F01001Scn1Service,
    private childscn1Service: Childscn1Service,
  ) {
    this.JCICSource$ = this.f01001Scn1Service.HISTORYSource$.subscribe((data) => {
      this.historyData = data;
    });
  }
  ngOnDestroy(): void {
    this.f01001Scn1Service.clearSession();
  }

  private creditLevel: string = 'APPLCreditL4';
  private applno: string;
  private search: string;
  private page: string;
  private cuid: string;
  private routerCase: string;
  fds: string
  private winClose: string = '';

  level: string;

  changeValue: boolean = true;
  block: boolean = false;

  approveAmt: string;

  //歷史資料 20211222
  history: history[] = [];
  JCICSource$: Subscription;
  historyData: any;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.cuid = sessionStorage.getItem('cuid');
    this.fds = sessionStorage.getItem('fds');
    this.level = sessionStorage.getItem('level');
    this.winClose = sessionStorage.getItem('winClose');
    this.page = sessionStorage.getItem('page');
  }

  ngAfterViewInit() {
    // let element: HTMLElement = document.getElementById('firstBtn') as HTMLElement;
    // element.click();
  }

  getApplno(): String {
    return this.applno;
  }

  getSearch(): string {
    return this.search;
  }

  getCuid(): string {
    return this.cuid;
  }

  getLevel(): string {
    return this.creditLevel;
  }

  getPage(): string {
    return this.page;
  }

  reScan() {
    const dialogRef = this.dialog.open(Childscn19Component, {
      panelClass: 'mat-dialog-transparent',
      height: '100%',
      width: '70%',
      data: {
        applno: this.applno,
        cuid: this.cuid,
        checkpoint: "L4"
      }
    });
  }

  reSMS() {
    const dialogRef = this.dialog.open(Childscn27Component, {
      panelClass: 'mat-dialog-transparent',
      height: '100%',
      width: '70%',
      data: {
        applno: this.applno,
        cuid: this.cuid,
        checkpoint: "L3"
      }
    });
  }

  reMail() {
    const dialogRef = this.dialog.open(Childscn28Component, {
      panelClass: 'mat-dialog-transparent',
      height: '100%',
      width: '70%',
      data: {
        applno: this.applno,
        cuid: this.cuid,
        checkpoint: "L3"
      }
    });
  }

  reSearch() {
    const dialogRef = this.dialog.open(Childscn18Component, {
      panelClass: 'mat-dialog-transparent'
    });
  }

  blockList() {
    const dialogRef = this.dialog.open(Childscn20Component, {
      panelClass: 'mat-dialog-transparent',
      data: {
        applno: this.applno,
        cuid: this.cuid
      }
    });
  }

  leave() {
    // this.router.navigate(['./F02002']);
    window.close();
  }

  // finish() {
  //   const baseUrl = 'f01/childscn0';
  //   let msg = '';
  //   let jsonObject: any = {};
  //   jsonObject['applno'] = this.applno;
  //   jsonObject['level'] = 'L4';

  //   this.creditResult = sessionStorage.getItem('creditResult');
  //   if (this.creditResult == '' || this.creditResult == 'null' || this.creditResult == null){
  //     const childernDialogRef = this.dialog.open(ConfirmComponent, {
  //       data: { msgStr: '請填寫核決結果!' }
  //     });
  //   } else {
  //     let json: any = {};
  //     json['creditResult'] = this.creditResult;
  //     jsonObject['creditResult'] = json;
  //     this.f01001Scn1Service.send( baseUrl, jsonObject ).subscribe(data => {
  //       this.router.navigate(['./F01001']);
  //     });
  //     const childernDialogRef = this.dialog.open(ConfirmComponent, {
  //       data: { msgStr: '案件完成' }
  //     });
  //   }
  // }

  getWinClose(): String {
    return this.winClose;
  }

  save(url: string, result: string) {
    const dialogRef = this.dialog.open(Childscn26Component, {
      minHeight: '50%',
      width: '30%',
      data: {
        value: result
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.value == 'confirm') {
        const baseUrl = url;
        let msg = '';
        let jsonObject: any = {};
        jsonObject['applno'] = this.applno;
        jsonObject['level'] = 'L4';
        this.approveAmt = this.childscn1Service.toNumber(this.childscn1Service.getResultApproveAmt());

        let jsonElApplicationInfo: any = {};
        jsonElApplicationInfo['caApplicationAmount'] = this.childscn1Service.toNumber(this.childscn1Service.getCaApplicationAmount());
        jsonObject['elApplicationInfo'] = jsonElApplicationInfo;

        let jsoncreditResult: any = {};
        jsoncreditResult['approveAmt'] = this.approveAmt;
        jsoncreditResult['lowestPayRate'] = this.childscn1Service.getResultLowestPayRate();
        jsoncreditResult['caPmcus'] = this.childscn1Service.getCaPmcus();
        jsoncreditResult['caRisk'] = this.childscn1Service.getCaRisk();
        jsoncreditResult['creditResult'] = this.childscn1Service.getCreditResult();

        jsonObject['creditResult'] = jsoncreditResult;

        if (baseUrl != 'f01/childscn0action1') {
          if (this.childscn1Service.getCreditResult() == '' || this.childscn1Service.getCreditResult() == 'null' || this.childscn1Service.getCreditResult() == null) {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: '請填寫核決結果!' }
            });
            return
          } else {
            this.result(baseUrl, jsonObject, result);
          }
        } else {
          this.result(baseUrl, jsonObject, result);
        }
      }
    });
    // }
  }

  result(baseUrl: string, jsonObject: JSON, result: string) {
    this.history = [];
    //設定歷史資料 20220117
    this.history.push({ value: (this.childscn1Service.getCreditResult() != undefined && this.childscn1Service.getCreditResult() != null) ? this.childscn1Service.getCreditResult() : '', tableName: 'EL_CREDITMAIN', valueInfo: 'CREDIT_RESULT', originalValue: (this.historyData != undefined && this.historyData != null && this.historyData.creditResult != undefined && this.historyData.creditResult != null) ? this.historyData.creditResult : '' }); //核決結果

    const content = []
    for (let index = 0; index < this.history.length; index++) {
      if (!(this.history[index].value == null || this.history[index].value == '' || this.history[index].value == 'null')) {
        content.push(
          {
            applno: this.applno,
            tableName: this.history[index].tableName,
            columnName: this.history[index].valueInfo,
            originalValue: this.history[index].originalValue,
            currentValue: this.history[index].value,
            transAPname: "文審案件完成",
          }
        )
      }
    }
    jsonObject['content'] = content;

    this.block = true;
    this.f01001Scn1Service.send(baseUrl, jsonObject).subscribe(async data => {
      //儲存歷史資料
      // await this.setHistory();
      let childernDialogRef: any;
      if (data.rspMsg != null && data.rspMsg != '') {
        childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
        if (data.rspMsg.includes('處理案件異常') || baseUrl == 'f01/childscn0action1') {
          this.block = false;
        } else {
          setTimeout(() => {
            childernDialogRef.close();
          }, 1000);
          setTimeout(() => {
            this.router.navigate(['./F01001']);
          }, 1500);
        }
      }
      this.block = false;
    });
  }

  //判斷是否需要顯示案件完成列
  changeRoute(route: boolean) {
    this.changeValue = route;
  }

  scrollToTop(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}
