import { Subscription } from 'rxjs';
import { Childscn19Component } from './../../children/childscn19/childscn19.component';
import { Childscn27Component } from './../../children/childscn27/childscn27.component';
import { Childscn28Component } from './../../children/childscn28/childscn28.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Childscn18Component } from 'src/app/children/childscn18/childscn18.component';
import { Router } from '@angular/router';
import { Childscn20Component } from 'src/app/children/childscn20/childscn20.component';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01002Scn1Service } from './f01002scn1.service';
import { Childscn22Component } from 'src/app/children/childscn22/childscn22.component';
import { Childscn24Component } from 'src/app/children/childscn24/childscn24.component';
import { F01001Scn1Service } from 'src/app/f01001/f01001scn1/f01001scn1.service';
import { Childscn1Service } from 'src/app/children/childscn1/childscn1.service';
import { Childscn26Component } from 'src/app/children/childscn26/childscn26.component';
import { history } from './../../interface/base';
interface interestPeriod {
  id?: string,
  period: string,
  periodType: string
  interestType: string
  interestCode?: string
  approveInterest: string
  interest: string
  interestBase: string
}

@Component({
  selector: 'app-f01002scn1',
  templateUrl: './f01002scn1.component.html',
  styleUrls: ['./f01002scn1.component.css', '../../../assets/css/f01.css']
})
export class F01002scn1Component implements OnInit, OnDestroy {
  check: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private f01002scn1Service: F01002Scn1Service,
    private childscn1Service: Childscn1Service,
  ) {
    this.JCICAddSource$ = this.f01002scn1Service.JCICAddSource$.subscribe((data) => {
      this.addData = data;
      this.isShowAdd = data.show;
    });
    this.JCICSource$ = this.f01002scn1Service.JCICSource$.subscribe((data) => {
      this.editData = data;
      this.isShowEdit = data.show;
    });
    this.JCICSource$ = this.f01002scn1Service.JCICItemsSource$.subscribe((data) => {
      this.isShowItems = data.show;
    });
    this.JCICSource$ = this.f01002scn1Service.HISTORYSource$.subscribe((data) => {
      this.historyData = data;
    });
  }

  private creditLevel: string = 'APPLCreditL3';
  public applno: string;
  private search: string;
  private cuid: string;
  fds: string
  private winClose: string = '';
  page: string;//????????????????????????

  addData: any;
  editData: any;
  isShowAdd: boolean;
  isShowEdit: boolean;
  isShowItems: boolean;
  JCICSource$: Subscription;
  JCICAddSource$: Subscription;
  opidPage: number //opid??????
  pageHidden: boolean //????????????
  historyData: any;
  statusCodePage: string
  statusCodeHidden: boolean = false
  statusCodeList = ['V090', 'V091', 'C100', 'R100', 'B100']

  level: string;
  approveAmt: string;

  changeValue: boolean = true;
  block: boolean = false;

  //?????????????????? 20211222
  history: history[] = [];

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.cuid = sessionStorage.getItem('nationalId');
    this.fds = sessionStorage.getItem('fds');
    this.level = sessionStorage.getItem('level');
    this.page = sessionStorage.getItem('page');
    this.winClose = sessionStorage.getItem('winClose');
    this.check = sessionStorage.getItem('check');

    let count: number = 0;
    try {
      let receive = window.opener["filter"];
      if (receive != "") {
        //????????????????????????
        this.applno = receive["applno"];
        sessionStorage.setItem("applno", receive["applno"]);
        this.cuid = receive["nationalId"];
        sessionStorage.setItem("nationalId", receive["nationalId"]);
        this.search = receive["search"];
        sessionStorage.setItem("search", receive["search"]);
        this.winClose = receive["winClose"];
        sessionStorage.setItem("winClose", receive["winClose"]);
        sessionStorage.setItem("custId", receive["custId"]);
        count = count + 1;
      }
    } catch (error) { }

    if (this.applno != null && this.applno != '') {
      this.getCheckOpid();
      count = count + 1;
    }
    if (count == 2) {
      this.getCheckOpid();
    }
  }

  ngAfterViewInit() {
    this.checkStatusCode()

    // let element: HTMLElement = document.getElementById('firstBtn') as HTMLElement;
    // element.click();
  }

  test() {
    this.router.navigate(['./F01002/F01002SCN1/CHILDSCN1']);
  }

  ngOnDestroy() {
    this.JCICSource$.unsubscribe();
    this.JCICAddSource$.unsubscribe();
    this.f01002scn1Service.clearSession();
  }

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

  recalculate() {
    const dialogRef = this.dialog.open(Childscn22Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        applno: this.applno,
        cuid: this.cuid
      }
    });
  }
  // ??????
  sendBack() {
    const dialogRef = this.dialog.open(Childscn24Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        applno: this.applno,
        level: sessionStorage.getItem('level'),
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.router.navigate(['./F01002']);
      }
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

  getSearch(): String {
    return this.search;
  }
  getCheck(): String {
    return this.check;
  }


  getWinClose(): String {
    return this.winClose;
  }

  leave() {
    // this.router.navigate(['./F02002']);
    window.close();
  }

  //Nick ????????????/AML??????
  save(url: string, result: string) {
    if (this.childscn1Service.getCreditResult() == 'C') {
      //AML??????
      var msgSave: boolean = true;
      if (sessionStorage.getItem('PURPOSEOTHER_MESSAGE2') == "Z" && sessionStorage.getItem('otherMessage2') == "") { msgSave = false };
      if (sessionStorage.getItem('NON_TRADEOTHER_MESSAGE3') == "Z" && sessionStorage.getItem('otherMessage3') == "") { msgSave = false };
      if (sessionStorage.getItem('TRADE_NON_CCOTHER_MESSAGE4') == "Z" && sessionStorage.getItem('otherMessage4') == "") { msgSave = false };
      if (sessionStorage.getItem('TRADE_NON_PURPOSEOTHER_MESSAGE5') == "Z" && sessionStorage.getItem('otherMessage5') == "") { msgSave = false };
      if (!msgSave) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "??????AML??????????????????????????????????????????!" }
        });
        return;
      }
      //AML??????
      var save: boolean = true;
      if (sessionStorage.getItem('MAIN_INCOME') == "" && url == "f01/childscn0") { save = false };
      if (sessionStorage.getItem('PURPOSEOTHER_MESSAGE2') == "" && url == "f01/childscn0") { save = false };
      if (sessionStorage.getItem('NON_TRADEOTHER_MESSAGE3') == "" && url == "f01/childscn0") { save = false };
      if (sessionStorage.getItem('TRADE_NON_CCOTHER_MESSAGE4') == "" && url == "f01/childscn0") { save = false };
      if (sessionStorage.getItem('TRADE_NON_PURPOSEOTHER_MESSAGE5') == "" && url == "f01/childscn0") { save = false };
      if ((!save) && sessionStorage.getItem('creditResult') != 'D') {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "???????????????AML???????????????!" }
        });
        return;
      }
    }

    const dialogRef = this.dialog.open(Childscn26Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        value: result
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.value == 'confirm') {
        this.saveSUPPLY_AML();
        this.f01002scn1Service.setCREDITSource({ key: true });
        let checkScn1Url: boolean = false;
        let checkCount = 0;
        if (window.location.href.split("/").pop() == "CHILDSCN1") {
          for (let index = 0; index < this.childscn1Service.getJsonObject().result.length; index++) {
            if (!(this.childscn1Service.getJsonObject().result[index].upCreditCode == null || this.childscn1Service.getJsonObject().result[index].upCreditCode == '')) {
              if (this.childscn1Service.getJsonObject().result[index].reasonCode == null || this.childscn1Service.getJsonObject().result[index].reasonCode == '') {
                this.dialog.open(ConfirmComponent, {
                  data: { msgStr: "???????????????????????????!" }
                });
                return;
              } else {
                checkCount = checkCount + 1;
              }
            } else {
              checkCount = checkCount + 1;
            }
          }
        } else {
          checkScn1Url = true;
        }

        if (checkScn1Url || this.childscn1Service.getJsonObject().result.length == checkCount) {
          this.childscn1Service.getDate_Json('f01/childscn1action4', this.childscn1Service.getJsonObject()).subscribe(data => {
            if (data.rspCode == "0000") {
              const baseUrl = url;
              let jsonObject: any = {};
              jsonObject['applno'] = this.applno;
              jsonObject['level'] = 'L3';

              this.approveAmt = this.childscn1Service.toNumber(this.childscn1Service.getResultApproveAmt());

              let jsoncreditResult: any = {};
              jsoncreditResult['approveAmt'] = this.approveAmt;
              jsoncreditResult['lowestPayRate'] = this.childscn1Service.getResultLowestPayRate();
              jsoncreditResult['caPmcus'] = this.childscn1Service.getCaPmcus();
              jsoncreditResult['caRisk'] = this.childscn1Service.getCaRisk();
              jsoncreditResult['creditResult'] = this.childscn1Service.getCreditResult();
              jsoncreditResult['setL2empno'] = this.childscn1Service.gettitleName();

              // let jsonCreditInterestPeriod: any = {};
              let creditInterestPeriodArray: interestPeriod[] = [];
              //????????????????????????
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
                    interestBase: this.childscn1Service.getCreditInterestPeriodSource1()[index].interestBase
                  }
                )
              }

              let jsonElApplicationInfo: any = {};
              jsonElApplicationInfo['caApplicationAmount'] = this.childscn1Service.toNumber(this.childscn1Service.getCaApplicationAmount());

              jsonObject['creditResult'] = jsoncreditResult;
              // jsonObject['elCreditInterestPeriod'] = jsonCreditInterestPeriod;
              jsonObject['creditInterestPeriodArray'] = creditInterestPeriodArray;
              jsonObject['elApplicationInfo'] = jsonElApplicationInfo;

              if (baseUrl != 'f01/childscn0action1') {
                if (!(this.childscn1Service.getCreditResult() == 'C' || this.childscn1Service.getCreditResult() == 'D')) {
                  const childernDialogRef = this.dialog.open(ConfirmComponent, {
                    data: { msgStr: '?????????????????????!' }
                  });
                  return;
                } else {
                  this.result(baseUrl, jsonObject, result);
                }
              } else {
                this.result(baseUrl, jsonObject, result);
              }
            }
          });
        }
        // setTimeout(() => {
        // this.block = false;
        // }, 2000);
      }
    });
  }

  saveResult(url: string, json: JSON): string {
    return this.f01002scn1Service.saveOrEditMsgJson(url, json);
  }

  result(baseUrl: string, jsonObject: JSON, result: string) {
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
            transAPname: "??????????????????",
          }
        )
      }
    }
    jsonObject['content'] = content;

    this.f01002scn1Service.setHistorySource({
      creditResult: this.childscn1Service.getCreditResult(),
      lowestPayRate: this.childscn1Service.getResultLowestPayRate(),
      approveAmt: this.childscn1Service.toNumber(this.childscn1Service.getResultApproveAmt()),
      caApplicationAmount: this.childscn1Service.toNumber(this.childscn1Service.getCaApplicationAmount()),
      caPmcus: this.childscn1Service.getCaPmcus(),
      caRisk: this.childscn1Service.getCaRisk(),
    })

    this.block = true;
    this.f01002scn1Service.send(baseUrl, jsonObject).subscribe(data => {
      //??????????????????
      // if (count > 0) {
      // await this.setHistory(count);
      // }
      let childernDialogRef: any;
      if (data.rspMsg != null && data.rspMsg != '') {
        childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: {
            msgStr:
              data.rspMsg.includes('????????????') && window.location.href.split("/").pop() != "CHILDSCN1" ?
                data.rspMsg + "???????????????????????????????????????????????????" : data.rspMsg
          }
        });
      }
      if (data.rspMsg.includes('??????????????????') || baseUrl == 'f01/childscn0action1') {

      }
      else if (data.rspMsg.includes('?????????????????????')) {
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['./F01002']);
        }, 1500);
      }
      else {
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        // this.saveMemo();
        setTimeout(() => {
          this.router.navigate(['./F01002']);
        }, 1500);
      }
      this.block = false;
    });
  }

  //???????????????????????????????????????
  changeRoute(route: boolean) {
    this.changeValue = route;
  }

  //???Page
  getPage() {
    return this.page;
  }

  //?????????????????????????????? 20211222
  setHistory() {
    this.history = [];
    this.history.push({ value: this.childscn1Service.toNumber(this.childscn1Service.getResultApproveAmt()), tableName: 'EL_CREDITMAIN', valueInfo: 'APPROVE_AMT', originalValue: this.historyData.approveAmt }); //????????????
    this.history.push({ value: this.childscn1Service.getResultLowestPayRate(), tableName: 'EL_CREDITMAIN', valueInfo: 'LOWEST_PAY_RATE', originalValue: this.historyData.lowestPayRate }); //??????????????????(?????????)
    this.history.push({ value: this.childscn1Service.getCreditResult(), tableName: 'EL_CREDITMAIN', valueInfo: 'CREDIT_RESULT', originalValue: this.historyData.creditResult }); //????????????
    this.history.push({ value: this.childscn1Service.toNumber(this.childscn1Service.getCaApplicationAmount()), tableName: 'EL_APPLICATION_INFO', valueInfo: 'CA_APPLICATION_AMOUNT', originalValue: this.historyData.caApplicationAmount }); //????????????????????????
    this.history.push({ value: this.childscn1Service.getCaPmcus(), tableName: 'EL_CREDITMAIN', valueInfo: 'CA_PMCUS', originalValue: this.historyData.caPmcus }); //????????????-PM????????????
    this.history.push({ value: this.childscn1Service.getCaRisk(), tableName: 'EL_CREDITMAIN', valueInfo: 'CA_RISK', originalValue: this.historyData.caRisk }); //????????????-????????????
  }

  //?????? SUPPLY_AML
  saveSUPPLY_AML() {
    var save: boolean = true;
    if (sessionStorage.getItem('PURPOSEOTHER_MESSAGE2') == "Z" && sessionStorage.getItem('otherMessage2') == "") { save = false };
    if (sessionStorage.getItem('NON_TRADEOTHER_MESSAGE3') == "Z" && sessionStorage.getItem('otherMessage3') == "") { save = false };
    if (sessionStorage.getItem('TRADE_NON_CCOTHER_MESSAGE4') == "Z" && sessionStorage.getItem('otherMessage4') == "") { save = false };
    if (sessionStorage.getItem('TRADE_NON_PURPOSEOTHER_MESSAGE5') == "Z" && sessionStorage.getItem('otherMessage5') == "") { save = false };
    if (save) {
      const url = 'f01/childscn1action6';
      let jsonObject: any = {};
      jsonObject['applno'] = this.applno;
      jsonObject['mainIncome'] = sessionStorage.getItem('MAIN_INCOME');
      jsonObject['purpose'] = sessionStorage.getItem('PURPOSEOTHER_MESSAGE2');
      jsonObject['otherMessage2'] = sessionStorage.getItem('otherMessage2');
      jsonObject['nonTrade'] = sessionStorage.getItem('NON_TRADEOTHER_MESSAGE3');
      jsonObject['otherMessage3'] = sessionStorage.getItem('otherMessage3');
      jsonObject['tradeNonCc'] = sessionStorage.getItem('TRADE_NON_CCOTHER_MESSAGE4');
      jsonObject['otherMessage4'] = sessionStorage.getItem('otherMessage4');
      jsonObject['tradeNonPurpose'] = sessionStorage.getItem('TRADE_NON_PURPOSEOTHER_MESSAGE5');
      jsonObject['otherMessage5'] = sessionStorage.getItem('otherMessage5');
      this.childscn1Service.getDate_Json(url, jsonObject).subscribe(data => {
      });
    } else {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "??????AML??????????????????????????????????????????!" }
      });
    }
  }

  scrollToTop(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  //??????opid
  async getCheckOpid(): Promise<any> {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    await this.f01002scn1Service.getOpid(jsonObject).then((data: any) => {
      if (data.rspCode == '0000') {
        this.opidPage = Number(data.rspBody);
        console.log(this.opidPage)
        if (Number(this.opidPage) > 2900 || Number(this.opidPage) >= 2720) {
          this.pageHidden = true;
        } else {
          this.pageHidden = false;
        }
      }
      return this.opidPage;
    });
  }

  //??????statusCode????????????
  async checkStatusCode(): Promise<any> {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    await this.f01002scn1Service.getStatusCode(jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        this.statusCodePage = data.rspBody;
        for (const items of this.statusCodeList) {
          if (this.statusCodePage == items) {
            this.statusCodeHidden = true;
          }
        }
      }
    });

  }
}
