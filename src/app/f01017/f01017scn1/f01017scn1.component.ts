import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Childscn1Service } from 'src/app/children/childscn1/childscn1.service';
import { F01017scn1Service } from './f01017scn1.service';
import { history, strgyRepayrate } from './../../interface/base';
import { Childscn26Component } from 'src/app/children/childscn26/childscn26.component';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn28Component } from 'src/app/children/childscn28/childscn28.component';
import { Childscn27Component } from 'src/app/children/childscn27/childscn27.component';
import { Childscn24Component } from 'src/app/children/childscn24/childscn24.component';
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
  selector: 'app-f01017scn1',
  templateUrl: './f01017scn1.component.html',
  styleUrls: ['./f01017scn1.component.css', '../../../assets/css/f01.css']
})
export class F01017scn1Component implements OnInit {

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private f01017Scn1Service: F01017scn1Service,
    private childscn1Service: Childscn1Service,
  ) {
    this.JCICSource$ = this.f01017Scn1Service.HISTORYSource$.subscribe((data) => {
      this.historyData = data;
    });
  }

  private creditLevel: string = 'APPLCreditS4'; //實際為L0 的 S1案件
  private applno: string;
  private search: string;
  private nationalId: string;
  fds: string;
  private winClose: string = '';
  private page: string;//判斷哪一頁進入用

  level: string;
  approveAmt: string;

  changeValue: boolean = true;
  block: boolean = false;

  //歷史資料 20211222
  history: history[] = [];
  JCICSource$: Subscription;
  historyData: any;

  stepName: string;

  //20220418 分期方案
  approvedDebtStrgy: string; //選擇方案
  strgy1CashAprvAmt: string; //方案一現金核准
  aprvInstCashAmt: string; //方案二現金核准
  aprvDebtAmt: string; //方案二債整核准
  strgy2AprvAmt: string; //方案二總額
  strgyOriginfee1: number; //開辦費(首次簽約用)
  strgyOriginfee2: number; //開辦費(首次簽約用)
  strgyLoanextfee: number; //管理費
  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.nationalId = sessionStorage.getItem('nationalId');
    this.fds = sessionStorage.getItem('fds');
    this.level = sessionStorage.getItem('level');
    this.stepName = sessionStorage.getItem('stepName');
    this.page = sessionStorage.getItem('page');
  }

  ngAfterViewInit() {
    let element: HTMLElement = document.getElementById('firstBtn') as HTMLElement;
    element.click();
  }

  getApplno(): String {
    return this.applno;
  }

  getSearch(): string {
    return this.search;
  }

  getNationalId(): string {
    return this.nationalId;
  }

  getLevel(): string {
    return this.creditLevel;
  }

  getWinClose(): String {
    return this.winClose;
  }
  //取Page
  getPage() {
    return this.page;
  }
  //判斷是否需要顯示案件完成列
  changeRoute(route: boolean) {
    this.changeValue = route;
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
        jsonObject['level'] = 'S4';

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
        jsoncreditResult['s4AddSignature'] = this.childscn1Service.getS4AddSignature();
        this.strgyOriginfee1 = this.childscn1Service.getStrgyOriginfee1() == '' ? null : Number(this.childscn1Service.toNumber(this.childscn1Service.getStrgyOriginfee1()));
        this.strgyOriginfee2 = this.childscn1Service.getStrgyOriginfee2() == '' ? null : Number(this.childscn1Service.toNumber(this.childscn1Service.getStrgyOriginfee2()));
        this.strgyLoanextfee = this.childscn1Service.getStrgyLoanextfee() == '' ? null : Number(this.childscn1Service.toNumber(this.childscn1Service.getStrgyLoanextfee()));
        jsoncreditResult['strgy1AprvLoanextfee'] = this.strgyLoanextfee;
        jsoncreditResult['strgy1AprvOriginfee'] = this.strgyOriginfee1;
        jsoncreditResult['strgy2AprvOriginfee'] = this.strgyOriginfee2;
        //20220609 新增綁約期違約金
        let elCreditRepayrateArray: strgyRepayrate[] = [];
        for (let index = 0; index < this.childscn1Service.getElCreditRepayrateOne().length; index++) {
          elCreditRepayrateArray.push(
            {
              id: this.childscn1Service.getElCreditRepayrateOne()[index].id,
              activePeriod: this.childscn1Service.getElCreditRepayrateOne()[index].activePeriod,
              earlyRepayRt: this.childscn1Service.getElCreditRepayrateOne()[index].earlyRepayRt,
            }
          )
        }

        if (this.childscn1Service.getElCreditRepayrateTwo().length > 0) {
          for (let index = 0; index < this.childscn1Service.getElCreditRepayrateTwo().length; index++) {
            elCreditRepayrateArray.push(
              {
                id: this.childscn1Service.getElCreditRepayrateTwo()[index].id,
                activePeriod: this.childscn1Service.getElCreditRepayrateTwo()[index].activePeriod,
                earlyRepayRt: this.childscn1Service.getElCreditRepayrateTwo()[index].earlyRepayRt,
              }
            )
          }
        }

        jsonObject['elCreditRepayrateArray'] = elCreditRepayrateArray;

        if (this.childscn1Service.getProdCodeAndName().includes('0201001')) {
          jsoncreditResult['approvedDebtStrgy'] = this.approvedDebtStrgy;
          jsoncreditResult['strgy1CashAprvAmt'] = this.strgy1CashAprvAmt;
          jsoncreditResult['aprvInstCashAmt'] = this.aprvInstCashAmt;
          jsoncreditResult['aprvDebtAmt'] = this.aprvDebtAmt;
          jsoncreditResult['strgy2AprvAmt'] = this.strgy2AprvAmt;
        } else {
          jsoncreditResult['approveAmt'] = this.approveAmt;
          if (this.strgyLoanextfee != null && this.strgyOriginfee1 != null) {
          } else {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: '帳戶管理費或開辦費不可為空!' }
            });
            return;
          }
          if (this.strgyLoanextfee > 1000 || this.strgyOriginfee1 > 1000) {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: '帳戶管理費或開辦費不可大於1000!' }
            });
            return;
          }
        }

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

        let jsonElApplicationInfo: any = {};
        jsonElApplicationInfo['caApplicationAmount'] = this.childscn1Service.toNumber(this.childscn1Service.getCaApplicationAmount());

        jsonObject['creditResult'] = jsoncreditResult;
        jsonObject['creditInterestPeriodArray'] = creditInterestPeriodArray;
        jsonObject['elApplicationInfo'] = jsonElApplicationInfo;
        if (url == 'f01/childscn0action1') {
          this.result(baseUrl, jsonObject);
        } else {
          if (this.childscn1Service.getCreditResult() == 'A') {
            if(this.strgyOriginfee1 != null) {
            } else {
              const childernDialogRef = this.dialog.open(ConfirmComponent, {
                data: { msgStr: '方案一開辦費不可為空!' }
              });
              return;
            }
            if (this.childscn1Service.getCreditInterestPeriodSource1().length == 0) {
              const childernDialogRef = this.dialog.open(ConfirmComponent, {
                data: { msgStr: '方案一多階利率無資料' }
              });
              return;
            }
            if (this.childscn1Service.getCreditInterestPeriodSource1()[0].period != '1') {
              const childernDialogRef = this.dialog.open(ConfirmComponent, {
                data: { msgStr: '方案一第一期期數請填寫為"1"' }
              });
              return;
            }
            if (this.childscn1Service.getCreditInterestPeriodSource1().length == 1) {
              if (this.childscn1Service.getCreditInterestPeriodSource1()[0].interestType != '02') {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '方案一當利率為單階時，利率請選擇加減碼!' }
                });
                return;
              }
            }
            if (this.childscn1Service.getCreditInterestPeriodSource1().length > 1) {
              if (!(this.childscn1Service.getCreditInterestPeriodSource1()[0].interestType == '01' && this.childscn1Service.getCreditInterestPeriodSource1()[1].interestType == '02')) {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '方案一當利率為多階時，利率請選擇固定+加減碼!' }
                });
                return;
              }
            }
            for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource1().length; index++) {
              if ((this.childscn1Service.getCreditInterestPeriodSource1()[index].approveInterest == '' || this.childscn1Service.getCreditInterestPeriodSource1()[index].approveInterest == null) && this.childscn1Service.getCreditInterestPeriodSource1()[index].approveInterest != '0') {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '方案一序號' + (index + 1) + ',核准利率未填寫' }
                });
                return;
              } else if ((this.childscn1Service.getCreditInterestPeriodSource1()[index].interest == '' || this.childscn1Service.getCreditInterestPeriodSource1()[index].interest == null) && this.childscn1Service.getCreditInterestPeriodSource1()[index].interest != '0') {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '方案一序號' + (index + 1) + ',利率未填寫' }
                });
                return;
              } else if (this.childscn1Service.getCreditInterestPeriodSource1()[index].interestType == '' || this.childscn1Service.getCreditInterestPeriodSource1()[index].interestType == null) {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '方案一序號' + (index + 1) + ',利率型態未填寫' }
                });
                return;
              } else if (this.childscn1Service.getCreditInterestPeriodSource1()[index].period == '' || this.childscn1Service.getCreditInterestPeriodSource1()[index].period == null) {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '方案一序號' + (index + 1) + ',期數未填寫' }
                });
                return;
              } else if (this.childscn1Service.getCreditInterestPeriodSource1()[index].periodType == '' || this.childscn1Service.getCreditInterestPeriodSource1()[index].periodType == null) {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '方案一序號' + (index + 1) + ',期別未填寫' }
                });
                return;
              } else if (this.childscn1Service.getCreditInterestPeriodSource1()[index - 1]) {
                if (Number(this.childscn1Service.getCreditInterestPeriodSource1()[index].period) <= Number(this.childscn1Service.getCreditInterestPeriodSource1()[index - 1].period)
                  || Number(this.childscn1Service.getCreditInterestPeriodSource1()[index].period) > Number(this.childscn1Service.getStrgyPeriodMax1())) {
                  const childernDialogRef = this.dialog.open(ConfirmComponent, {
                    data: { msgStr: '方案一序號' + (index + 1) + ',期數需比前一期大且不可大於' + Number(this.childscn1Service.getStrgyPeriodMax1()) }
                  });
                  return;
                }
              }
            }

            if (this.childscn1Service.getProdCodeAndName().includes('0201001') && this.approvedDebtStrgy.includes('03')) {
              if(this.strgyOriginfee2 != null) {
              } else {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '方案二開辦費不可為空!' }
                });
                return;
              }
              if (this.childscn1Service.getCreditInterestPeriodSource2().length == 0) {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '方案二多階利率無資料' }
                });
                return;
              }
              if (this.childscn1Service.getCreditInterestPeriodSource2()[0].period != '1') {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '方案二第一期期數請填寫為"1"' }
                });
                return;
              }
              if (this.childscn1Service.getCreditInterestPeriodSource2().length == 1) {
                if (this.childscn1Service.getCreditInterestPeriodSource2()[0].interestType != '02') {
                  const childernDialogRef = this.dialog.open(ConfirmComponent, {
                    data: { msgStr: '方案二當利率為單階時，利率請選擇加減碼!' }
                  });
                  return;
                }
              }
              if (this.childscn1Service.getCreditInterestPeriodSource2().length > 1) {
                if (!(this.childscn1Service.getCreditInterestPeriodSource2()[0].interestType == '01' && this.childscn1Service.getCreditInterestPeriodSource2()[1].interestType == '02')) {
                  const childernDialogRef = this.dialog.open(ConfirmComponent, {
                    data: { msgStr: '方案二當利率為多階時，利率請選擇固定+加減碼!' }
                  });
                  return;
                }
              }
              //方案二
              if (this.childscn1Service.getCreditInterestPeriodSource2()[0].period) {
                for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource2().length; index++) {
                  if ((this.childscn1Service.getCreditInterestPeriodSource2()[index].approveInterest == '' || this.childscn1Service.getCreditInterestPeriodSource2()[index].approveInterest == null) && this.childscn1Service.getCreditInterestPeriodSource2()[index].approveInterest != '0') {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '方案二序號' + (index + 1) + ',核准利率未填寫' }
                    });
                    return;
                  } else if ((this.childscn1Service.getCreditInterestPeriodSource2()[index].interest == '' || this.childscn1Service.getCreditInterestPeriodSource2()[index].interest == null) && this.childscn1Service.getCreditInterestPeriodSource2()[index].interest != '0') {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '方案二序號' + (index + 1) + ',利率未填寫' }
                    });
                    return;
                  } else if (this.childscn1Service.getCreditInterestPeriodSource2()[index].interestType == '' || this.childscn1Service.getCreditInterestPeriodSource2()[index].interestType == null) {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '方案二序號' + (index + 1) + ',利率型態未填寫' }
                    });
                    return;
                  } else if (this.childscn1Service.getCreditInterestPeriodSource2()[index].period == '' || this.childscn1Service.getCreditInterestPeriodSource2()[index].period == null) {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '方案二序號' + (index + 1) + ',期數未填寫' }
                    });
                    return;
                  } else if (this.childscn1Service.getCreditInterestPeriodSource2()[index].periodType == '' || this.childscn1Service.getCreditInterestPeriodSource2()[index].periodType == null) {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '方案二序號' + (index + 1) + ',期別未填寫' }
                    });
                    return;
                  } else if (this.childscn1Service.getCreditInterestPeriodSource2()[index - 1]) {
                    if (Number(this.childscn1Service.getCreditInterestPeriodSource2()[index].period) <= Number(this.childscn1Service.getCreditInterestPeriodSource2()[index - 1].period)
                      || Number(this.childscn1Service.getCreditInterestPeriodSource2()[index].period) > Number(this.childscn1Service.getStrgyPeriodMax2())) {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '方案二序號' + (index + 1) + ',期數需比前一期大且不可大於' + Number(this.childscn1Service.getStrgyPeriodMax2()) }
                      });
                      return;
                    }
                  }
                }
              }
            }

            if (this.applno.includes('B')) {
              //20220713 檢核綁約期違約金
              let checkStrgy1: string = this.checkStrgyRepayrate(this.childscn1Service.getElCreditRepayrateOne(), '1');
              if (checkStrgy1 != '') {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: checkStrgy1 }
                });
                return;
              }

              let checkStrgy2: string = this.checkStrgyRepayrate(this.childscn1Service.getElCreditRepayrateTwo(), '2');
              if (checkStrgy2 != '') {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: checkStrgy2 }
                });
                return;
              }
            }
            console.log(jsonObject)
            this.result(baseUrl, jsonObject);
          } else {
            // TODO
            if (this.childscn1Service.getAddSignature() == 'S1' ||
              this.childscn1Service.getAddSignature() == 'S2' ||
              this.childscn1Service.getAddSignature() == 'R0' ||
              this.childscn1Service.getAddSignature() == 'R1' ||
              this.childscn1Service.getAddSignature() == 'R2' ||
              this.childscn1Service.getAddSignature() == 'R3'
            ) {
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
            transAPname: "無擔放款部主管完成",
          }
        )
      }
    }
    jsonObject['content'] = content;

    let newHistory: interestPeriod[] = [];
    for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource1().length; index++) {
      newHistory.push(
        {
          id: this.childscn1Service.getCreditInterestPeriodSource1()[index].id,
          period: this.childscn1Service.getCreditInterestPeriodSource1()[index].period,
          periodType: this.childscn1Service.getCreditInterestPeriodSource1()[index].periodType,
          interestType: this.childscn1Service.getCreditInterestPeriodSource1()[index].interestType,
          approveInterest: this.childscn1Service.getCreditInterestPeriodSource1()[index].approveInterest,
          interest: this.childscn1Service.getCreditInterestPeriodSource1()[index].interest,
          interestBase: this.childscn1Service.getCreditInterestPeriodSource1()[index].interestBase
        }
      );
    }

    let newHistoryTwo: interestPeriod[] = [];
    if (this.childscn1Service.getCreditInterestPeriodSource2().length > 0) {
      if (this.childscn1Service.getCreditInterestPeriodSource2()[0].period) {
        for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource2().length; index++) {
          newHistoryTwo.push(
            {
              id: this.childscn1Service.getCreditInterestPeriodSource2()[index].id,
              period: this.childscn1Service.getCreditInterestPeriodSource2()[index].period,
              periodType: this.childscn1Service.getCreditInterestPeriodSource2()[index].periodType,
              interestType: this.childscn1Service.getCreditInterestPeriodSource2()[index].interestType,
              approveInterest: this.childscn1Service.getCreditInterestPeriodSource2()[index].approveInterest,
              interest: this.childscn1Service.getCreditInterestPeriodSource2()[index].interest,
              interestBase: this.childscn1Service.getCreditInterestPeriodSource2()[index].interestBase
            }
          );
        }
      }
    }

    this.f01017Scn1Service.setHistorySource({
      addSignature: this.childscn1Service.getAddSignature(),
      CreditInterestPeriodSource: newHistory,
      CreditInterestPeriodTwoSource: newHistoryTwo
    })

    this.block = true;
    this.f01017Scn1Service.send(baseUrl, jsonObject).subscribe(data => {
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
          this.router.navigate(['./F01017']);
        }, 1500);
      } else {
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['./F01017']);
        }, 1500);
      }
      this.block = false;
    });
  }

  //設定歷史資料紀錄參數 20211222
  setHistory() {
    this.history.push({ value: this.childscn1Service.getAddSignature(), tableName: 'EL_CREDITMAIN', valueInfo: 'ADD_SIGNATURE', originalValue: this.historyData.addSignature });//加簽
    if (this.childscn1Service.getCreditInterestPeriodSource1().length > 0) {
      for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource1().length; index++) {
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].period, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'PERIOD', originalValue: this.historyData.CreditInterestPeriodSource[index].period }); //分段起始期數
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].periodType, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'PERIOD_TYPE', originalValue: this.historyData.CreditInterestPeriodSource[index].periodType }); //期別
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].interestType, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST_TYPE', originalValue: this.historyData.CreditInterestPeriodSource[index].interestType }); //利率型態
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].approveInterest, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'APPROVE_INTEREST', originalValue: this.historyData.CreditInterestPeriodSource[index].approveInterest }); //核准利率
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].interest, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST', originalValue: this.historyData.CreditInterestPeriodSource[index].interest }); //固定利率
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].interestBase, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST_BASE', originalValue: this.historyData.CreditInterestPeriodSource[index].interestBase }); //當時的指數,基放,郵儲利率
      }
    }

    if (this.applno.includes('B')) {
      if (this.childscn1Service.getCreditInterestPeriodSource2().length > 0) {
        if (this.childscn1Service.getCreditInterestPeriodSource2().length == this.historyData.CreditInterestPeriodTwoSource.length) {
          for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource2().length; index++) {
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].period, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'PERIOD', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].period }); //分段起始期數
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].periodType, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'PERIOD_TYPE', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].periodType }); //期別
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].interestType, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST_TYPE', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].interestType }); //利率型態
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].approveInterest, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'APPROVE_INTEREST', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].approveInterest }); //核准利率
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].interest, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].interest }); //固定利率
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].interestBase, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST_BASE', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].interestBase }); //當時的指數,基放,郵儲利率
          }
        }
      }
    }
  }

  // 退件
  sendBack() {
    const dialogRef = this.dialog.open(Childscn24Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '50%',
      data: {
        applno: this.applno,
        level: 'S4',
        stepName: sessionStorage.getItem('stepName'),
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.router.navigate(['./F01017']);
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
        cuid: this.nationalId,
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
        cuid: this.nationalId,
        checkpoint: "L3"
      }
    });
  }

  scrollToTop(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  //解約期綁約金檢核
  checkStrgyRepayrate(array: strgyRepayrate[], strgy: string): string {
    for (let i = 0; i < array.length; i++) {
      if (array[0].activePeriod != '1') {
        return (strgy == '1' ? '方案一' : '方案二') + '綁約期違約金第一生效期數請填1!'
      }
      if (i > 0) {
        if (Number(array[i].activePeriod) <= Number(array[i - 1].activePeriod) ||
          Number(array[i].activePeriod) > (strgy == '1' ? Number(this.childscn1Service.getStrgyPeriodMax1()) : Number(this.childscn1Service.getStrgyPeriodMax2()))) {
          return (strgy == '1' ? '方案一' : '方案二') + '綁約期違約金效期數需大於前一期且不可大於' +
            (strgy == '1' ? Number(this.childscn1Service.getStrgyPeriodMax1()) : Number(this.childscn1Service.getStrgyPeriodMax2())) + '!'
        }
      }
      if (i != array.length - 1) {
        if (!(0 <= Number(array[i].earlyRepayRt) && Number(array[i].earlyRepayRt) <= 5)) {
          return (strgy == '1' ? '方案一' : '方案二') + '綁約期違約金比例請輸入０～５%!'
        }
      } else {
        if (Number(array[i].earlyRepayRt) != 0) {
          return (strgy == '1' ? '方案一' : '方案二') + '綁約期違約金比例最後一筆請輸入０%!'
        }
      }
    }
    return '';
  }
}
