import { toNumber } from 'ng-zorro-antd/core/util';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Childscn1Service } from 'src/app/children/childscn1/childscn1.service';
import { Childscn22Component } from 'src/app/children/childscn22/childscn22.component';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01003Scn1Service } from './f01003scn1.service';
import { Childscn24Component } from 'src/app/children/childscn24/childscn24.component';
import { Childscn26Component } from 'src/app/children/childscn26/childscn26.component';
import { dssDebt, history, interestPeriod, strgyRepayrate } from './../../interface/base';
import { F01002Scn1Service } from 'src/app/f01002/f01002scn1/f01002scn1.service';
import { Subscription } from 'rxjs';
import { Childscn19Component } from 'src/app/children/childscn19/childscn19.component';
import { Childscn27Component } from 'src/app/children/childscn27/childscn27.component';
import { Childscn28Component } from 'src/app/children/childscn28/childscn28.component';
import { Childscn20Component } from 'src/app/children/childscn20/childscn20.component';

@Component({
  selector: 'app-f01003scn1',
  templateUrl: './f01003scn1.component.html',
  styleUrls: ['./f01003scn1.component.css', '../../../assets/css/f01.css']
})
export class F01003scn1Component implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private f01003Scn1Service: F01003Scn1Service,
    private f01002Scn1Service: F01002Scn1Service,
    private childscn1Service: Childscn1Service
  ) {
    this.JCICSource$ = this.f01003Scn1Service.HISTORYSource$.subscribe((data) => {
      this.historyData = data;
    });
    this.f01003Scn1Service.DebtSource$.subscribe((data) => {
      this.debtSource = data;
    });
  }

  private creditLevel: string = 'APPLCreditL2';
  public applno: string;
  private search: string;
  private cuid: string;
  fds: string;
  private winClose: string = '';
  private page: string;

  level: string;
  approveInterest: string;

  changeValue: boolean = true;
  block: boolean = false;

  //???????????? 20211222
  history: history[] = [];
  JCICSource$: Subscription;
  historyData: any;

  debtSource: dssDebt[] = [];

  approveAmt: string;

  //20220418 ????????????
  approvedDebtStrgy: string; //????????????
  strgy1CashAprvAmt: string; //?????????????????????
  aprvInstCashAmt: string; //?????????????????????
  aprvDebtAmt: string; //?????????????????????
  strgy2AprvAmt: string; //???????????????

  strgyPeriodMax1: number; //???????????????
  strgyPeriodMin1: number; //???????????????
  strgyOriginfee1: number; //?????????(???????????????)
  strgyPeriodMax2: number; //???????????????
  strgyPeriodMin2: number; //???????????????
  strgyOriginfee2: number; //?????????(???????????????)

  strgyLoanextfee: number; //?????????

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.cuid = sessionStorage.getItem('nationalId');
    this.fds = sessionStorage.getItem('fds');
    this.level = sessionStorage.getItem('level');
    this.page = sessionStorage.getItem('page');

    sessionStorage.setItem('debtFirst', 'true');
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    this.f01003Scn1Service.clearSession();
  }

  getSearch(): string {
    return this.search;
  }

  getWinClose(): String {
    return this.winClose;
  }

  getLevel(): string {
    return this.creditLevel;
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
        this.f01002Scn1Service.setCREDITSource({ key: true });
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
            const baseUrl = url;
            let jsonObject: any = {};
            jsonObject['applno'] = this.applno;
            jsonObject['level'] = 'L2';

            jsonObject['debtSource'] = this.debtSource;

            this.approveAmt = this.childscn1Service.toNumber(this.childscn1Service.getResultApproveAmt());

            //20220418 ????????????
            this.approvedDebtStrgy = this.childscn1Service.getApprovedDebtStrgy();
            this.strgy1CashAprvAmt = this.childscn1Service.toNumber(this.childscn1Service.getStrgy1CashAprvAmt()); //?????????????????????
            this.aprvInstCashAmt = this.childscn1Service.toNumber(this.childscn1Service.getAprvInstCashAmt()); //?????????????????????
            this.aprvDebtAmt = this.childscn1Service.toNumber(this.childscn1Service.getAprvDebtAmt()); //?????????????????????
            this.strgy2AprvAmt = this.childscn1Service.toNumber(this.childscn1Service.getStrgy2AprvAmt()); //???????????????

            let jsoncreditResult: any = {};
            jsoncreditResult['lowestPayRate'] = this.childscn1Service.getResultLowestPayRate();
            jsoncreditResult['caPmcus'] = this.childscn1Service.getCaPmcus();
            jsoncreditResult['caRisk'] = this.childscn1Service.getCaRisk();
            jsoncreditResult['creditResult'] = this.childscn1Service.getCreditResult();
            jsoncreditResult['addSignature'] = this.childscn1Service.getAddSignature();
            jsoncreditResult['setL1empno'] = this.childscn1Service.gettitleName();
            //20220620 ?????????
            this.strgyPeriodMax1 = this.childscn1Service.getStrgyPeriodMax1() == '' ? null : Number(this.childscn1Service.getStrgyPeriodMax1());
            this.strgyPeriodMin1 = this.childscn1Service.getStrgyPeriodMin1() == '' ? null : Number(this.childscn1Service.getStrgyPeriodMin1());
            this.strgyOriginfee1 = this.childscn1Service.getStrgyOriginfee1() == '' ? null : Number(this.childscn1Service.toNumber(this.childscn1Service.getStrgyOriginfee1()));
            this.strgyPeriodMax2 = this.childscn1Service.getStrgyPeriodMax2() == '' ? null : Number(this.childscn1Service.getStrgyPeriodMax2());
            this.strgyPeriodMin2 = this.childscn1Service.getStrgyPeriodMin2() == '' ? null : Number(this.childscn1Service.getStrgyPeriodMin2());
            this.strgyOriginfee2 = this.childscn1Service.getStrgyOriginfee2() == '' ? null : Number(this.childscn1Service.toNumber(this.childscn1Service.getStrgyOriginfee2()));
            this.strgyLoanextfee = this.childscn1Service.getStrgyLoanextfee() == '' ? null : Number(this.childscn1Service.toNumber(this.childscn1Service.getStrgyLoanextfee()));

            //20220609 ????????????????????????
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

            //20211229????????????????????????
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
                  interestBase: this.childscn1Service.getCreditInterestPeriodSource1()[index].interestBase,
                }
              )
            }

            let creditInterestPeriodTwoArray: interestPeriod[] = [];

            // ??????????????????????????????
            if (this.childscn1Service.getCreditInterestPeriodSource2().length > 0) {
              if (this.childscn1Service.getCreditInterestPeriodSource2()[0].period) {
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
              }
            }

            jsonObject['creditInterestPeriodTwoArray'] = creditInterestPeriodTwoArray;

            let jsonElApplicationInfo: any = {};
            jsonElApplicationInfo['caApplicationAmount'] = this.childscn1Service.toNumber(this.childscn1Service.getCaApplicationAmount());

            // jsonObject['elCreditInterestPeriod'] = jsonCreditInterestPeriod;
            jsonObject['creditInterestPeriodArray'] = creditInterestPeriodArray;
            jsonObject['elApplicationInfo'] = jsonElApplicationInfo;

            //20220526 ??????insert ??????????????????, 20220620??????
            jsoncreditResult['approveAmt'] = this.approveAmt;

            jsoncreditResult['strgy1AprvPrdMax'] = this.strgyPeriodMax1;
            jsoncreditResult['strgy1AprvPrdMin'] = this.strgyPeriodMin1;
            jsoncreditResult['strgy1AprvOriginfee'] = this.strgyOriginfee1;
            jsoncreditResult['strgy2AprvPrdMax'] = this.strgyPeriodMax2;
            jsoncreditResult['strgy2AprvPrdMin'] = this.strgyPeriodMin2;
            jsoncreditResult['strgy2AprvOriginfee'] = this.strgyOriginfee2;
            jsoncreditResult['strgy1AprvLoanextfee'] = this.strgyLoanextfee;

            jsoncreditResult['approvedDebtStrgy'] = this.approvedDebtStrgy;
            jsoncreditResult['strgy1CashAprvAmt'] = this.strgy1CashAprvAmt;
            jsoncreditResult['aprvInstCashAmt'] = this.aprvInstCashAmt;
            jsoncreditResult['aprvDebtAmt'] = this.aprvDebtAmt;
            jsoncreditResult['strgy2AprvAmt'] = this.strgy2AprvAmt;

            jsonObject['creditResult'] = jsoncreditResult;

            if (url == 'f01/childscn0action1') {
              this.result(baseUrl, jsonObject, result);
            } else {
              if (this.approvedDebtStrgy.includes('01')) {
                if (this.strgyPeriodMax1 != null && this.strgyPeriodMin1 != null && this.strgyOriginfee1 != null) {
                } else {
                  const childernDialogRef = this.dialog.open(ConfirmComponent, {
                    data: { msgStr: '???????????????????????????????????????!' }
                  });
                  return;
                }
              }

              if (this.childscn1Service.getProdCodeAndName().includes('0201001')) {
                if (this.approvedDebtStrgy.includes('03')) {
                  if (this.strgyPeriodMax2 != null && this.strgyPeriodMin2 != null && this.strgyOriginfee2 != null) {
                  } else {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '???????????????????????????????????????!' }
                    });
                    return;
                  }
                }
              } else {
                jsoncreditResult['approveAmt'] = this.approveAmt;
                if (this.strgyLoanextfee != null && this.strgyOriginfee1 != null) {
                } else {
                  const childernDialogRef = this.dialog.open(ConfirmComponent, {
                    data: { msgStr: '???????????????????????????????????????!' }
                  });
                  return;
                }
                if (this.strgyLoanextfee > 1000 || this.strgyOriginfee1 > 1000) {
                  const childernDialogRef = this.dialog.open(ConfirmComponent, {
                    data: { msgStr: '???????????????????????????????????????1000!' }
                  });
                  return;
                }
              }

              if (!(this.childscn1Service.getCreditResult() == 'A' || this.childscn1Service.getCreditResult() == 'D')) {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '?????????????????????!' }
                });
              } else {
                if (this.childscn1Service.getCreditResult() == 'A') {

                  if (this.applno.includes('B')) {
                    //20220713 ????????????????????????
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

                  if (!this.childscn1Service.getProdCodeAndName().includes('0201001')) {
                    if (this.approveAmt == '' || this.approveAmt == null) {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '???????????????????????????' }
                      });
                      return;
                    }
                    // else {
                    //   if (this.cashCheckOne() != '') {
                    //     const childernDialogRef = this.dialog.open(ConfirmComponent, {
                    //       data: { msgStr: this.cashCheckOne() }
                    //     });
                    //     return;
                    //   }
                    // }
                  } else {
                    if (this.approvedDebtStrgy == '' || this.approvedDebtStrgy == null) {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '?????????????????????' }
                      });
                      return;
                    } else {
                      if (this.approvedDebtStrgy == '01') {
                        if (this.strgy1CashAprvAmt == '' || this.strgy1CashAprvAmt == null) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '?????????????????????' }
                          });
                          return;
                        } else if (Number(this.strgy1CashAprvAmt) > Number(this.childscn1Service.getStrgyLimitCash1())) {
                          this.childscn1Service.setStrgy1CashAprvAmt(this.childscn1Service.toCurrency(this.childscn1Service.getStrgyLimitCash1()));
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '?????????????????????????????????DSS2????????????-????????????!' }
                          });
                          return;
                        } else if (Number(this.strgy1CashAprvAmt) == 0) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '??????????????????????????????0!' }
                          });
                          return;
                        } else if (this.cashCheck(Number(this.strgy1CashAprvAmt), '1') != '') {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: this.cashCheck(Number(this.strgy1CashAprvAmt), '1') }
                          });
                          return;
                        }
                      } else if (this.approvedDebtStrgy == '03') {
                        if (this.aprvInstCashAmt == '' || this.aprvInstCashAmt == null) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '?????????????????????' }
                          });
                          return;
                        } else if (Number(this.aprvInstCashAmt) > Number(this.childscn1Service.getStrgyLimitCash2())) {
                          this.childscn1Service.setAprvInstCashAmt(this.childscn1Service.toCurrency(this.childscn1Service.getStrgyLimitCash2()));
                          this.childscn1Service.setStrgy2AprvAmt(
                            this.childscn1Service.toCurrency(
                              (Number(this.childscn1Service.toNumber(this.childscn1Service.getStrgyLimitCash2())) +
                                Number(this.childscn1Service.toNumber(this.childscn1Service.getAprvDebtAmt()))).toString()
                            )
                          )
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '?????????????????????????????????DSS2????????????-????????????!' }
                          });
                          return;
                        } else if ((Number(this.childscn1Service.getAmt()) + Number(this.childscn1Service.getAmtLb()))
                          > (Number(this.childscn1Service.getDss2StrgyLimitMerg()) + Number(this.childscn1Service.getDss2StrgyLimitMergLb()))) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '???????????????(??????+??????)??????????????????DSS2????????????-????????????(??????+??????)???????????????????????????!' }
                          });
                          // return;
                          // } else if (Number(this.childscn1Service.getAmt()) > Number(this.childscn1Service.getDss2StrgyLimitMerg())) {
                          //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          //     data: { msgStr: '???????????????????????????????????????DSS2????????????-????????????(??????)???????????????????????????!' }
                          //   });
                          //   return;
                          // } else if (Number(this.childscn1Service.getAmtLb()) > Number(this.childscn1Service.getDss2StrgyLimitMergLb())) {
                          //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          //     data: { msgStr: '???????????????????????????????????????DSS2????????????-????????????(??????)???????????????????????????!' }
                          //   });
                          return;
                        } else if ((Number(this.childscn1Service.getAmt()) + Number(this.childscn1Service.getAmtLb())) < 50000) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '???????????????????????????+?????????????????????????????????"50000"???????????????????????????!' }
                          });
                          return;
                        }
                        if (Number(this.aprvInstCashAmt) != 0) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '?????????????????????????????????0!' }
                          });
                          return;
                        }
                      } else {
                        if (this.strgy1CashAprvAmt == '' || this.strgy1CashAprvAmt == null || this.aprvInstCashAmt == '' || this.aprvInstCashAmt == null) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '?????????????????????' }
                          });
                          return;
                        } else if ((Number(this.childscn1Service.getAmt()) + Number(this.childscn1Service.getAmtLb()))
                          > (Number(this.childscn1Service.getDss2StrgyLimitMerg()) + Number(this.childscn1Service.getDss2StrgyLimitMergLb()))) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '???????????????(??????+??????)??????????????????DSS2????????????-????????????(??????+??????)???????????????????????????!' }
                          });
                          // return;
                          // } else if (Number(this.childscn1Service.getAmt()) > Number(this.childscn1Service.getDss2StrgyLimitMerg())) {
                          //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          //     data: { msgStr: '???????????????????????????????????????DSS2????????????-????????????(??????)???????????????????????????!' }
                          //   });
                          //   return;
                          // } else if (Number(this.childscn1Service.getAmtLb()) > Number(this.childscn1Service.getDss2StrgyLimitMergLb())) {
                          //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          //     data: { msgStr: '???????????????????????????????????????DSS2????????????-????????????(??????)???????????????????????????!' }
                          //   });
                          return;
                        } else if ((Number(this.childscn1Service.getAmt()) + Number(this.childscn1Service.getAmtLb())) < 50000) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '???????????????????????????+?????????????????????????????????"50000"???????????????????????????!' }
                          });
                          return;
                        }
                        if (Number(this.strgy1CashAprvAmt) > Number(this.childscn1Service.getStrgyLimitCash1())) {
                          this.childscn1Service.setStrgy1CashAprvAmt(this.childscn1Service.toCurrency(this.childscn1Service.getStrgyLimitCash1()));
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '?????????????????????????????????DSS2????????????-????????????!' }
                          });
                          return;
                        }
                        if (Number(this.strgy1CashAprvAmt) == 0) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '????????????????????????????????????0!' }
                          });
                          return;
                        }
                        if (this.cashCheck(Number(this.strgy1CashAprvAmt), '1') != '') {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: this.cashCheck(Number(this.strgy1CashAprvAmt), '1') }
                          });
                          return;
                        }
                        if (Number(this.aprvInstCashAmt) > Number(this.childscn1Service.getStrgyLimitCash2())) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '?????????????????????????????????DSS2????????????-????????????!' }
                          });
                          return;
                        }
                        if (Number(this.aprvInstCashAmt) == 0) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '????????????????????????????????????0!' }
                          });
                          return;
                        }
                        if (this.cashCheck(Number(this.aprvInstCashAmt), '2') != '') {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: this.cashCheck(Number(this.aprvInstCashAmt), '2') }
                          });
                          return;
                        }
                      }
                    }
                  }
                  if (this.childscn1Service.getResultLowestPayRate() == '' || this.childscn1Service.getResultLowestPayRate() == null) {
                    if (!this.childscn1Service.getProdCodeAndName().includes('0201001')) {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '?????????????????????????????????' }
                      });
                      return;
                    }
                  }
                  if (this.childscn1Service.getCreditInterestPeriodSource1().length == 0) {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '??????????????????????????????' }
                    });
                    return;
                  }
                  if (this.childscn1Service.getCreditInterestPeriodSource1()[0].period != '1') {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '????????????????????????????????????"1"' }
                    });
                    return;
                  }
                  if (this.childscn1Service.getCreditInterestPeriodSource1().length == 1) {
                    if (this.childscn1Service.getCreditInterestPeriodSource1()[0].interestType != '02') {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '?????????????????????????????????????????????????????????!' }
                      });
                      return;
                    }
                  }
                  if (this.childscn1Service.getCreditInterestPeriodSource1().length > 1) {
                    if (!(this.childscn1Service.getCreditInterestPeriodSource1()[0].interestType == '01' && this.childscn1Service.getCreditInterestPeriodSource1()[1].interestType == '02')) {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '??????????????????????????????????????????????????????+?????????!' }
                      });
                      return;
                    }
                  }
                  for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource1().length; index++) {
                    if ((this.childscn1Service.getCreditInterestPeriodSource1()[index].approveInterest == '' || this.childscn1Service.getCreditInterestPeriodSource1()[index].approveInterest == null) && this.childscn1Service.getCreditInterestPeriodSource1()[index].approveInterest != '0') {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '???????????????' + (index + 1) + ',?????????????????????' }
                      });
                      return;
                    } else if ((this.childscn1Service.getCreditInterestPeriodSource1()[index].interest == '' || this.childscn1Service.getCreditInterestPeriodSource1()[index].interest == null) && this.childscn1Service.getCreditInterestPeriodSource1()[index].interest != '0') {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '???????????????' + (index + 1) + ',???????????????' }
                      });
                      return;
                    } else if (this.childscn1Service.getCreditInterestPeriodSource1()[index].interestType == '' || this.childscn1Service.getCreditInterestPeriodSource1()[index].interestType == null) {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '???????????????' + (index + 1) + ',?????????????????????' }
                      });
                      return;
                    } else if (this.childscn1Service.getCreditInterestPeriodSource1()[index].period == '' || this.childscn1Service.getCreditInterestPeriodSource1()[index].period == null) {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '???????????????' + (index + 1) + ',???????????????' }
                      });
                      return;
                    } else if (this.childscn1Service.getCreditInterestPeriodSource1()[index].periodType == '' || this.childscn1Service.getCreditInterestPeriodSource1()[index].periodType == null) {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '???????????????' + (index + 1) + ',???????????????' }
                      });
                      return;
                    } else if (this.childscn1Service.getCreditInterestPeriodSource1()[index - 1]) {
                      if (Number(this.childscn1Service.getCreditInterestPeriodSource1()[index].period) <= Number(this.childscn1Service.getCreditInterestPeriodSource1()[index - 1].period)
                        || Number(this.childscn1Service.getCreditInterestPeriodSource1()[index].period) > Number(this.childscn1Service.getStrgyPeriodMax1())) {
                        const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          data: { msgStr: '???????????????' + (index + 1) + ',???????????????????????????????????????' + Number(this.childscn1Service.getStrgyPeriodMax1()) }
                        });
                        return;
                      }
                    }
                  }

                  if (this.childscn1Service.getProdCodeAndName().includes('0201001') && this.approvedDebtStrgy.includes('03')) {
                    if (this.childscn1Service.getCreditInterestPeriodSource2().length == 0) {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '??????????????????????????????' }
                      });
                      return;
                    }
                    if (this.childscn1Service.getCreditInterestPeriodSource2()[0].period != '1') {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '????????????????????????????????????"1"' }
                      });
                      return;
                    }
                    if (this.childscn1Service.getCreditInterestPeriodSource2().length == 1) {
                      if (this.childscn1Service.getCreditInterestPeriodSource2()[0].interestType != '02') {
                        const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          data: { msgStr: '?????????????????????????????????????????????????????????!' }
                        });
                        return;
                      }
                    }
                    if (this.childscn1Service.getCreditInterestPeriodSource2().length > 1) {
                      if (!(this.childscn1Service.getCreditInterestPeriodSource2()[0].interestType == '01' && this.childscn1Service.getCreditInterestPeriodSource2()[1].interestType == '02')) {
                        const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          data: { msgStr: '??????????????????????????????????????????????????????+?????????!' }
                        });
                        return;
                      }
                    }
                    //?????????
                    if (this.childscn1Service.getCreditInterestPeriodSource2()[0].period) {
                      for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource2().length; index++) {
                        if ((this.childscn1Service.getCreditInterestPeriodSource2()[index].approveInterest == '' || this.childscn1Service.getCreditInterestPeriodSource2()[index].approveInterest == null) && this.childscn1Service.getCreditInterestPeriodSource2()[index].approveInterest != '0') {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '???????????????' + (index + 1) + ',?????????????????????' }
                          });
                          return;
                        } else if ((this.childscn1Service.getCreditInterestPeriodSource2()[index].interest == '' || this.childscn1Service.getCreditInterestPeriodSource2()[index].interest == null) && this.childscn1Service.getCreditInterestPeriodSource2()[index].interest != '0') {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '???????????????' + (index + 1) + ',???????????????' }
                          });
                          return;
                        } else if (this.childscn1Service.getCreditInterestPeriodSource2()[index].interestType == '' || this.childscn1Service.getCreditInterestPeriodSource2()[index].interestType == null) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '???????????????' + (index + 1) + ',?????????????????????' }
                          });
                          return;
                        } else if (this.childscn1Service.getCreditInterestPeriodSource2()[index].period == '' || this.childscn1Service.getCreditInterestPeriodSource2()[index].period == null) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '???????????????' + (index + 1) + ',???????????????' }
                          });
                          return;
                        } else if (this.childscn1Service.getCreditInterestPeriodSource2()[index].periodType == '' || this.childscn1Service.getCreditInterestPeriodSource2()[index].periodType == null) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '???????????????' + (index + 1) + ',???????????????' }
                          });
                          return;
                        } else if (this.childscn1Service.getCreditInterestPeriodSource2()[index - 1]) {
                          if (Number(this.childscn1Service.getCreditInterestPeriodSource2()[index].period) <= Number(this.childscn1Service.getCreditInterestPeriodSource2()[index - 1].period)
                            || Number(this.childscn1Service.getCreditInterestPeriodSource2()[index].period) > Number(this.childscn1Service.getStrgyPeriodMax2())) {
                            const childernDialogRef = this.dialog.open(ConfirmComponent, {
                              data: { msgStr: '???????????????' + (index + 1) + ',???????????????????????????????????????' + Number(this.childscn1Service.getStrgyPeriodMax2()) }
                            });
                            return;
                          }
                        }
                      }
                    }
                  }
                  this.result(baseUrl, jsonObject, result);
                } else {
                  if (this.childscn1Service.getAddSignature() == 'S1' || this.childscn1Service.getAddSignature() == 'S2') {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '??????????????????????????????!' }
                    });
                    return;
                  }
                  this.result(baseUrl, jsonObject, result);
                }
                // this.result(baseUrl, jsonObject, result, count);
              }
            }
          });
        }
      }
    });
  }

  result(baseUrl: string, jsonObject: JSON, result: string) {
    this.history = [];
    this.setHistory();
    const content = [];
    for (let index = 0; index < this.history.length; index++) {
      // if (!(this.history[index].value == null || this.history[index].value == '' || this.history[index].value == 'null')) {
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
      // }
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

    let newHistorySrOne: strgyRepayrate[] = [];
    for (let index = 0; index < this.childscn1Service.getElCreditRepayrateOne().length; index++) {
      newHistorySrOne.push(
        {
          activePeriod: this.childscn1Service.getElCreditRepayrateOne()[index].activePeriod,
          earlyRepayRt: this.childscn1Service.getElCreditRepayrateOne()[index].earlyRepayRt
        }
      );
    }

    let newHistorySrTwo: strgyRepayrate[] = [];
    if (this.childscn1Service.getElCreditRepayrateTwo().length > 0) {
      if (this.childscn1Service.getElCreditRepayrateTwo()[0].activePeriod) {
        for (let index = 0; index < this.childscn1Service.getElCreditRepayrateTwo().length; index++) {
          newHistorySrTwo.push(
            {
              activePeriod: this.childscn1Service.getElCreditRepayrateTwo()[index].activePeriod,
              earlyRepayRt: this.childscn1Service.getElCreditRepayrateTwo()[index].earlyRepayRt
            }
          );
        }
      }
    }

    this.f01003Scn1Service.setHistorySource({
      creditResult: this.childscn1Service.getCreditResult(),
      lowestPayRate: this.childscn1Service.getResultLowestPayRate(),
      approveAmt: this.childscn1Service.toNumber(this.childscn1Service.getResultApproveAmt()),
      caApplicationAmount: this.childscn1Service.toNumber(this.childscn1Service.getCaApplicationAmount()),
      caPmcus: this.childscn1Service.getCaPmcus(),
      caRisk: this.childscn1Service.getCaRisk(),
      CreditInterestPeriodSource: newHistory,
      addSignature: this.childscn1Service.getAddSignature(),
      CreditInterestPeriodTwoSource: newHistoryTwo,
      elCreditRepayrateOne: newHistorySrOne,
      elCreditRepayrateTwo: newHistorySrTwo
    })

    this.childscn1Service.setOriStrgyOriginfee1(this.strgyOriginfee1 == null ? '' : this.strgyOriginfee1.toString());
    this.childscn1Service.setOriStrgyOriginfee2(this.strgyOriginfee2 == null ? '' : this.strgyOriginfee2.toString());
    this.childscn1Service.setOriStrgyLoanextfee(this.strgyLoanextfee == null ? '' : this.strgyLoanextfee.toString());

    this.childscn1Service.setOriStrgyPeriodMax1(this.strgyPeriodMax1 == null ? '' : this.strgyPeriodMax1.toString());
    this.childscn1Service.setOriStrgyPeriodMin1(this.strgyPeriodMin1 == null ? '' : this.strgyPeriodMin1.toString());
    this.childscn1Service.setOriStrgyPeriodMax2(this.strgyPeriodMax2 == null ? '' : this.strgyPeriodMax2.toString());
    this.childscn1Service.setOriStrgyPeriodMin2(this.strgyPeriodMin2 == null ? '' : this.strgyPeriodMin2.toString());
    this.childscn1Service.setOriStrgy1CashAprvAmt(this.strgy1CashAprvAmt);
    this.childscn1Service.setOriAprvInstCashAmt(this.aprvInstCashAmt);
    this.childscn1Service.setOriApprovedDebtStrgy(this.approvedDebtStrgy);

    this.block = true;
    this.f01003Scn1Service.send(baseUrl, jsonObject).subscribe(data => {
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
      if (data.rspMsg.includes('??????????????????') || baseUrl == 'f01/childscn0action1') { }
      else if (data.rspMsg.includes('?????????????????????')) {
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['./F01003']);
        }, 1500);
      }
      else {
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        // this.saveMemo();
        setTimeout(() => {
          this.router.navigate(['./F01003']);
        }, 1500);
      }
      this.block = false;
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
        this.router.navigate(['./F01003']);
      }
    });
  }
  // //??????
  // public async saveMemo(): Promise<void> {
  //   // this.removeSession();
  //   let msgStr: string = "";
  //   const baseUrl = 'f01/childscn1action1';
  //   let jsonObject: any = {};
  //   jsonObject['applno'] = this.applno;
  //   jsonObject['creditaction'] = this.mark;
  //   jsonObject['creditlevel'] = sessionStorage.getItem('stepName').split('t')[1];
  //   msgStr = await this.childscn1Service.saveCreditmemo(baseUrl, jsonObject);
  // }

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
    if (this.childscn1Service.getCreditInterestPeriodSource1().length > 0) {
      for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource1().length; index++) {
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].period, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'PERIOD', originalValue: this.historyData.CreditInterestPeriodSource[index].period }); //??????????????????
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].periodType, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'PERIOD_TYPE', originalValue: this.historyData.CreditInterestPeriodSource[index].periodType }); //??????
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].interestType, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST_TYPE', originalValue: this.historyData.CreditInterestPeriodSource[index].interestType }); //????????????
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].approveInterest, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'APPROVE_INTEREST', originalValue: this.historyData.CreditInterestPeriodSource[index].approveInterest }); //????????????
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].interest, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST', originalValue: this.historyData.CreditInterestPeriodSource[index].interest }); //????????????
        this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource1()[index].interestBase, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST_BASE', originalValue: this.historyData.CreditInterestPeriodSource[index].interestBase }); //???????????????,??????,????????????
      }
    }

    if (this.applno.includes('B')) {
      if (this.childscn1Service.getCreditInterestPeriodSource2().length > 0) {
        if (this.childscn1Service.getCreditInterestPeriodSource2().length == this.historyData.CreditInterestPeriodTwoSource.length) {
          for (let index = 0; index < this.childscn1Service.getCreditInterestPeriodSource2().length; index++) {
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].period, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'PERIOD', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].period }); //??????????????????
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].periodType, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'PERIOD_TYPE', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].periodType }); //??????
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].interestType, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST_TYPE', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].interestType }); //????????????
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].approveInterest, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'APPROVE_INTEREST', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].approveInterest }); //????????????
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].interest, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].interest }); //????????????
            this.history.push({ value: this.childscn1Service.getCreditInterestPeriodSource2()[index].interestBase, tableName: 'EL_CREDIT_INTEREST_PERIOD', valueInfo: 'INTEREST_BASE', originalValue: this.historyData.CreditInterestPeriodTwoSource[index].interestBase }); //???????????????,??????,????????????
          }
        }
      }
    }

    if (this.childscn1Service.getElCreditRepayrateOne().length > 0) {
      for (let index = 0; index < this.childscn1Service.getElCreditRepayrateOne().length; index++) {
        this.history.push({ value: this.childscn1Service.getElCreditRepayrateOne()[index].activePeriod, tableName: 'EL_CREDIT_REPAYRATE', valueInfo: 'ACTIVE_PERIOD', originalValue: this.historyData.elCreditRepayrateOne[index].activePeriod });
        this.history.push({ value: this.childscn1Service.getElCreditRepayrateOne()[index].earlyRepayRt, tableName: 'EL_CREDIT_REPAYRATE', valueInfo: 'EARLY_REPAY_RT', originalValue: this.historyData.elCreditRepayrateOne[index].earlyRepayRt });
      }
    }

    if (this.applno.includes('B')) {
      if (this.childscn1Service.getElCreditRepayrateTwo().length > 0) {
        if (this.childscn1Service.getElCreditRepayrateTwo().length == this.historyData.elCreditRepayrateTwo.length) {
          for (let index = 0; index < this.childscn1Service.getElCreditRepayrateTwo().length; index++) {
            this.history.push({ value: this.childscn1Service.getElCreditRepayrateTwo()[index].activePeriod, tableName: 'EL_CREDIT_REPAYRATE', valueInfo: 'ACTIVE_PERIOD', originalValue: this.historyData.elCreditRepayrateTwo[index].activePeriod });
            this.history.push({ value: this.childscn1Service.getElCreditRepayrateTwo()[index].earlyRepayRt, tableName: 'EL_CREDIT_REPAYRATE', valueInfo: 'EARLY_REPAY_RT', originalValue: this.historyData.elCreditRepayrateTwo[index].earlyRepayRt });
          }
        }
      }
    }

    this.history.push({ value: this.approveAmt, tableName: 'EL_CREDITMAIN', valueInfo: 'APPROVE_AMT', originalValue: this.historyData.approveAmt }); //????????????
    this.history.push({ value: this.childscn1Service.getResultLowestPayRate(), tableName: 'EL_CREDITMAIN', valueInfo: 'LOWEST_PAY_RATE', originalValue: this.historyData.lowestPayRate }); //??????????????????(?????????)
    this.history.push({ value: this.childscn1Service.getCreditResult(), tableName: 'EL_CREDITMAIN', valueInfo: 'CREDIT_RESULT', originalValue: this.historyData.creditResult }); //????????????
    // this.history.push({value:  this.caApplicationAmount, tableName: 'EL_APPLICATION_INFO', valueInfo: 'CA_APPLICATION_AMOUNT'}); //????????????????????????
    this.history.push({ value: this.childscn1Service.getCaPmcus(), tableName: 'EL_CREDITMAIN', valueInfo: 'CA_PMCUS', originalValue: this.historyData.caPmcus }); //????????????-PM????????????
    this.history.push({ value: this.childscn1Service.getCaRisk(), tableName: 'EL_CREDITMAIN', valueInfo: 'CA_RISK', originalValue: this.historyData.caRisk }); //????????????-????????????
    this.history.push({ value: this.childscn1Service.getAddSignature(), tableName: 'EL_CREDITMAIN', valueInfo: 'ADD_SIGNATURE', originalValue: this.historyData.addSignature });//??????

    if (this.childscn1Service.getProdCodeAndName().includes('0201001')) {
      this.history.push({ value: this.strgyOriginfee1 == null ? '' : this.strgyOriginfee1.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'STRGY1_APRV_ORIGINFEE', originalValue: this.childscn1Service.getOriStrgyOriginfee1() });
      this.history.push({ value: this.strgyOriginfee2 == null ? '' : this.strgyOriginfee2.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'STRGY2_APRV_ORIGINFEE', originalValue: this.childscn1Service.getOriStrgyOriginfee2() });

      this.history.push({ value: this.strgyPeriodMax1 == null ? '' : this.strgyPeriodMax1.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'STRGY1_APRV_PRD_MAX', originalValue: this.childscn1Service.getOriStrgyPeriodMax1() });
      this.history.push({ value: this.strgyPeriodMin1 == null ? '' : this.strgyPeriodMin1.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'STRGY1_APRV_PRD_MIN', originalValue: this.childscn1Service.getOriStrgyPeriodMin1() });
      this.history.push({ value: this.strgyPeriodMax2 == null ? '' : this.strgyPeriodMax2.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'STRGY2_APRV_PRD_MAX', originalValue: this.childscn1Service.getOriStrgyPeriodMax2() });
      this.history.push({ value: this.strgyPeriodMin2 == null ? '' : this.strgyPeriodMin2.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'STRGY2_APRV_PRD_MIN', originalValue: this.childscn1Service.getOriStrgyPeriodMin2() });
      this.history.push({ value: this.strgy1CashAprvAmt == null ? '' : this.strgy1CashAprvAmt.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'STRGY_1_CASH_APRV_AMT', originalValue: this.childscn1Service.getOriStrgy1CashAprvAmt() });
      this.history.push({ value: this.aprvInstCashAmt == null ? '' : this.aprvInstCashAmt.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'APRV_INST_CASH_AMT', originalValue: this.childscn1Service.getOriAprvInstCashAmt() });
      this.history.push({ value: this.approvedDebtStrgy == null ? '' : this.approvedDebtStrgy.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'APPROVED_DEBT_STRGY', originalValue: this.childscn1Service.getOriApprovedDebtStrgy() });
    } else {
      this.history.push({ value: this.strgyOriginfee1 == null ? '' : this.strgyOriginfee1.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'STRGY1_APRV_ORIGINFEE', originalValue: this.childscn1Service.getOriStrgyOriginfee1() });
      this.history.push({ value: this.strgyLoanextfee == null ? '' : this.strgyLoanextfee.toString(), tableName: 'EL_CREDITMAIN', valueInfo: 'STRGY1_APRV_LOANEXTFEE', originalValue: this.childscn1Service.getStrgyLoanextfee() });
    }
  }

  scrollToTop(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  //??????
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

  //??????
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
  blockList() {
    const dialogRef = this.dialog.open(Childscn20Component, {
      panelClass: 'mat-dialog-transparent',
      data: {
        applno: this.applno,
        cuid: this.cuid
      }
    });
  }

  //??????????????????
  cashCheck(cash: number, strgy: string): string {
    let checkString: string = '';
    if ((cash / 100).toString().includes('.')) {
      return (strgy == '1' ? '?????????' : '?????????') + '?????????????????????100?????????';
    }
    if (cash > (strgy == '1' ? this.childscn1Service.getLimitDbr1() : this.childscn1Service.getLimitDbr2())) {
      return (strgy == '1' ? '?????????' : '?????????') + '??????????????????????????????_DBR';
    }
    if (!((strgy == '1' ? this.childscn1Service.getLimitProdMin1() : this.childscn1Service.getLimitProdMin2()) <= cash && cash <= (strgy == '1' ? this.childscn1Service.getLimitProdMax1() : (this.childscn1Service.getLimitProdMax2() - Number(this.aprvDebtAmt))))) {
      return (strgy == '1' ? '?????????' : '?????????') + '????????????????????????_??????/???????????????????????????';
    }
    if (cash > (strgy == '1' ? this.childscn1Service.getLimitNidmue1() : this.childscn1Service.getLimitNidmue2())) {
      return (strgy == '1' ? '?????????' : '?????????') + '??????????????????????????????_??????MUE';
    }
    if (cash > (strgy == '1' ? this.childscn1Service.getLimitLaw33Uns1() : this.childscn1Service.getLimitLaw33Uns2())) {
      return (strgy == '1' ? '?????????' : '?????????') + '??????????????????????????????_????????????????????????????????????(????????????33???)';
    }
    if (this.childscn1Service.getLimitLaw321() != '' && strgy == '1') {
      if (cash > Number(this.childscn1Service.getLimitLaw321())) {
        return '???????????????????????????????????????_?????????????????????(????????????32???)';
      }
    }
    if (this.childscn1Service.getLimitLaw322() != '' && strgy == '2') {
      if (cash > Number(this.childscn1Service.getLimitLaw322())) {
        return '???????????????????????????????????????_?????????????????????(????????????32???)';
      }
    }
    if ((strgy == '1' ? this.strgyPeriodMax1 : this.strgyPeriodMax2) > 84) {
      return (strgy == '1' ? '?????????' : '?????????') + '???????????????????????????84???';
    }
    if ((strgy == '1' ? this.strgyPeriodMin1 : this.strgyPeriodMin2) < 12) {
      return (strgy == '1' ? '?????????' : '?????????') + '???????????????????????????12???';
    }
    if ((strgy == '1' ? this.strgyPeriodMin1 : this.strgyPeriodMin2) > (strgy == '1' ? this.strgyPeriodMax1 : this.strgyPeriodMax2)) {
      return (strgy == '1' ? '?????????' : '?????????') + '????????????????????????????????????';
    }
    // if ((strgy == '1' ? this.strgyOriginfee1 : this.strgyOriginfee2) > 1000) {
    //   return (strgy == '1' ? '?????????' : '?????????') + '?????????????????????1000';
    // }
    return checkString;
  }

  //?????????
  cashCheckOne(): string {
    let checkString: string = '';
    if (this.strgyPeriodMax1 > 84) {
      return '????????????????????????????????????84???';
    }
    if (this.strgyPeriodMin1 < 12) {
      return '????????????????????????????????????12???';
    }
    if (this.strgyPeriodMin1 > this.strgyPeriodMax1) {
      return '?????????????????????????????????????????????';
    }
    return checkString;
  }

  //????????????????????????
  checkStrgyRepayrate(array: strgyRepayrate[], strgy: string): string {
    for (let i = 0; i < array.length; i++) {
      if (array[0].activePeriod != '1') {
        return (strgy == '1' ? '?????????' : '?????????') + '??????????????????????????????????????????1!'
      }
      if (i > 0) {
        if (Number(array[i].activePeriod) <= Number(array[i - 1].activePeriod) ||
          Number(array[i].activePeriod) > (strgy == '1' ? Number(this.childscn1Service.getStrgyPeriodMax1()) : Number(this.childscn1Service.getStrgyPeriodMax2()))) {
          return (strgy == '1' ? '?????????' : '?????????') + '????????????????????????????????????????????????????????????' +
            (strgy == '1' ? Number(this.childscn1Service.getStrgyPeriodMax1()) : Number(this.childscn1Service.getStrgyPeriodMax2())) + '!'
        }
      }
      if (i != array.length - 1) {
        if (!(0 <= Number(array[i].earlyRepayRt) && Number(array[i].earlyRepayRt) <= 5)) {
          return (strgy == '1' ? '?????????' : '?????????') + '??????????????????????????????????????????%!'
        }
      } else {
        if (Number(array[i].earlyRepayRt) != 0) {
          return (strgy == '1' ? '?????????' : '?????????') + '????????????????????????????????????????????????%!'
        }
      }
    }
    return '';
  }
}
