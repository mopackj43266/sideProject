import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Childscn1Service } from 'src/app/children/childscn1/childscn1.service';
import { Childscn24Component } from 'src/app/children/childscn24/childscn24.component';
import { Childscn26Component } from 'src/app/children/childscn26/childscn26.component';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01004Scn1Service } from './f01004scn1.service';
import { history, interestPeriod } from './../../interface/base';
import { Childscn19Component } from 'src/app/children/childscn19/childscn19.component';
import { Childscn27Component } from 'src/app/children/childscn27/childscn27.component';
import { Childscn28Component } from 'src/app/children/childscn28/childscn28.component';

@Component({
  selector: 'app-f01004scn1',
  templateUrl: './f01004scn1.component.html',
  styleUrls: ['./f01004scn1.component.css', '../../../assets/css/f01.css']
})
export class F01004scn1Component implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private f01004Scn1Service: F01004Scn1Service,
    private childscn1Service: Childscn1Service,
  ) {
    this.JCICSource$ = this.f01004Scn1Service.HISTORYSource$.subscribe((data) => {
      this.historyData = data;
    });
  }

  private creditLevel: string = 'APPLCreditL1';
  private applno: string;
  private search: string;
  private cuid: string;
  fds: string;
  private winClose: string = '';
  private page: string;//判斷哪一頁進入用

  level: string;

  changeValue: boolean = true;
  block: boolean = false;

  //歷史資料 20211222
  history: history[] = [];
  JCICSource$: Subscription;
  historyData: any;

  approveAmt: string;

  stepName: string;

  //20220418 分期方案
  approvedDebtStrgy: string; //選擇方案
  strgy1CashAprvAmt: string; //方案一現金核准
  aprvInstCashAmt: string; //方案二現金核准
  aprvDebtAmt: string; //方案二債整核准
  strgy2AprvAmt: string; //方案二總額

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.cuid = sessionStorage.getItem('nationalId');
    this.fds = sessionStorage.getItem('fds');
    this.level = sessionStorage.getItem('level');
    this.stepName = sessionStorage.getItem('stepName');
    this.page = sessionStorage.getItem('page');
  }

  ngAfterViewInit() {
    let element: HTMLElement = document.getElementById('firstBtn') as HTMLElement;
    element.click();
  }

  ngOnDestroy(): void {
    this.f01004Scn1Service.clearSession();
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
        jsonObject['level'] = 'L0';

        this.approveAmt = this.childscn1Service.toNumber(this.childscn1Service.getResultApproveAmt());

        //20220418 分期方案
        this.approvedDebtStrgy = this.childscn1Service.getApprovedDebtStrgy();
        this.strgy1CashAprvAmt = this.childscn1Service.toNumber(this.childscn1Service.getStrgy1CashAprvAmt()); //方案一現金核准
        this.aprvInstCashAmt = this.childscn1Service.toNumber(this.childscn1Service.getAprvInstCashAmt()); //方案二現金核准
        this.aprvDebtAmt = this.childscn1Service.toNumber(this.childscn1Service.getAprvDebtAmt()); //方案二債整核准
        this.strgy2AprvAmt = this.childscn1Service.toNumber(this.childscn1Service.getStrgy2AprvAmt()); //方案二總額

        let jsoncreditResult: any = {};
        jsoncreditResult['lowestPayRate'] = this.childscn1Service.getResultLowestPayRate();
        jsoncreditResult['caPmcus'] = this.childscn1Service.getCaPmcus();
        jsoncreditResult['caRisk'] = this.childscn1Service.getCaRisk();
        jsoncreditResult['creditResult'] = this.childscn1Service.getCreditResult();
        jsoncreditResult['addSignature'] = this.childscn1Service.getAddSignature();

        if (this.childscn1Service.getProdCodeAndName().includes('0201001')) {
          jsoncreditResult['approvedDebtStrgy'] = this.approvedDebtStrgy;
          jsoncreditResult['strgy1CashAprvAmt'] = this.strgy1CashAprvAmt;
          jsoncreditResult['aprvInstCashAmt'] = this.aprvInstCashAmt;
          jsoncreditResult['aprvDebtAmt'] = this.aprvDebtAmt;
          jsoncreditResult['strgy2AprvAmt'] = this.strgy2AprvAmt;
        } else {
          jsoncreditResult['approveAmt'] = this.approveAmt;
        }

        jsonObject['creditResult'] = jsoncreditResult;

        let jsonElApplicationInfo: any = {};
        jsonElApplicationInfo['caApplicationAmount'] = this.childscn1Service.toNumber(this.childscn1Service.getCaApplicationAmount());
        jsonObject['elApplicationInfo'] = jsonElApplicationInfo;

        let creditInterestPeriodArray: interestPeriod[] = [];
        //多階利率存放陣列
        for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource1().length; index++) {
          creditInterestPeriodArray.push(
            {
              id: this.childscn1Service.getCreditInterestPeriodSource1()[index].id,
              period: this.childscn1Service.getCreditInterestPeriodSource1()[index].period,
              periodType: this.childscn1Service.getCreditInterestPeriodSource1()[index].periodType,
              interestType: this.childscn1Service.getCreditInterestPeriodSource1()[index].interestType,
              interestCode: '1',
              approveInterest: this.childscn1Service.getCreditInterestPeriodSource1()[index].approveInterest,
              interest: this.childscn1Service.getCreditInterestPeriodSource1()[index].interest,
              interestBase: this.childscn1Service.getCreditInterestPeriodSource1()[index].interestBase,
            }
          )
        }
        jsonObject['creditInterestPeriodArray'] = creditInterestPeriodArray;

        let creditInterestPeriodTwoArray: interestPeriod[] = [];
        if (this.childscn1Service.getProdCodeAndName().includes('0201001')) {
          // 當有方案二多階利率時
          for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource2().length; index++) {
            creditInterestPeriodTwoArray.push(
              {
                id: this.childscn1Service.getCreditInterestPeriodSource2()[index].id,
                period: this.childscn1Service.getCreditInterestPeriodSource2()[index].period,
                periodType: this.childscn1Service.getCreditInterestPeriodSource2()[index].periodType,
                interestType: this.childscn1Service.getCreditInterestPeriodSource2()[index].interestType,
                interestCode: '1',
                approveInterest: this.childscn1Service.getCreditInterestPeriodSource2()[index].approveInterest,
                interest: this.childscn1Service.getCreditInterestPeriodSource2()[index].interest,
                interestBase: this.childscn1Service.getCreditInterestPeriodSource2()[index].interestBase,
              }
            )
          }
          jsonObject['creditInterestPeriodTwoArray'] = creditInterestPeriodTwoArray;
        }

        if (url == 'f01/childscn0action1') {
          this.result(baseUrl, jsonObject);
        } else {
          if (this.childscn1Service.getCreditResult() == 'A') {
            this.result(baseUrl, jsonObject);
          } else {
            if (this.childscn1Service.getAddSignature() == 'S1' || this.childscn1Service.getAddSignature() == 'S2') {
              const childernDialogRef = this.dialog.open(ConfirmComponent, {
                data: { msgStr: '審核結果婉拒無法加簽!' }
              });
              return;
            }
            this.result(baseUrl, jsonObject);
          }
        }
      }
    });
  }

  // 退件
  sendBack() {
    const dialogRef = this.dialog.open(Childscn24Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '50%',
      data: {
        applno: this.applno,
        level: sessionStorage.getItem('level'),
        stepName: sessionStorage.getItem('stepName'),
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.router.navigate(['./F01004']);
      }
    });
  }

  saveResult(url: string, json: JSON): string {
    return this.f01004Scn1Service.saveOrEditMsgJson(url, json);
  }

  result(baseUrl: string, jsonObject: JSON) {
    this.history = [];
    this.setHistory();
    const content = [];
    for (let index = 0; index < this.history.length; index++) {
      if (!(this.history[index].value == null || this.history[index].value == '' || this.history[index].value == 'null')) {
        content.push(
          {
            applno: this.applno,
            tableName: this.history[index].tableName,
            columnName: this.history[index].valueInfo,
            originalValue: this.history[index].originalValue,
            currentValue: this.history[index].value,
            transAPname: "主管案件完成",
          }
        )
      }
    }
    jsonObject['content'] = content;

    this.f01004Scn1Service.setHistorySource({
      addSignature: this.childscn1Service.getAddSignature()
    })

    this.block = true;
    this.f01004Scn1Service.send(baseUrl, jsonObject).subscribe(data => {
      let childernDialogRef: any;
      if (data.rspMsg != null && data.rspMsg != '') {
        childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
      }
      if (data.rspMsg.includes('處理案件異常') || baseUrl == 'f01/childscn0action1') { }
      else if (data.rspMsg.includes('該案客戶已取消')) {
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['./F01004']);
        }, 1500);
      }
      else {
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['./F01004']);
        }, 1500);
      }
      this.block = false;
    });
  }

  //判斷是否需要顯示案件完成列
  changeRoute(route: boolean) {
    this.changeValue = route;
  }

  //取Page
  getPage() {
    return this.page;
  }

  //設定歷史資料紀錄參數 20211222
  setHistory() {
    this.history = [];
    this.history.push({ value: this.childscn1Service.getAddSignature(), tableName: 'EL_CREDITMAIN', valueInfo: 'ADD_SIGNATURE', originalValue: this.historyData.addSignature });//加簽
  }

  scrollToTop(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  //補件
  reScan() {
    const dialogRef = this.dialog.open(Childscn19Component, {
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

  //簡訊
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

  //Mail
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
}
