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

  //歷史資料 20211222
  history: history[] = [];
  JCICSource$: Subscription;
  historyData: any;

  debtSource: dssDebt[] = [];

  approveAmt: string;

  //20220418 分期方案
  approvedDebtStrgy: string; //選擇方案
  strgy1CashAprvAmt: string; //方案一現金核准
  aprvInstCashAmt: string; //方案二現金核准
  aprvDebtAmt: string; //方案二債整核准
  strgy2AprvAmt: string; //方案二總額

  strgyPeriodMax1: number; //期數最大值
  strgyPeriodMin1: number; //期數最小值
  strgyOriginfee1: number; //開辦費(首次簽約用)
  strgyPeriodMax2: number; //期數最大值
  strgyPeriodMin2: number; //期數最小值
  strgyOriginfee2: number; //開辦費(首次簽約用)

  strgyLoanextfee: number; //管理費

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
                  data: { msgStr: "請選擇徵審代碼細項!" }
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
            jsoncreditResult['setL1empno'] = this.childscn1Service.gettitleName();
            //20220620 都儲存
            this.strgyPeriodMax1 = this.childscn1Service.getStrgyPeriodMax1() == '' ? null : Number(this.childscn1Service.getStrgyPeriodMax1());
            this.strgyPeriodMin1 = this.childscn1Service.getStrgyPeriodMin1() == '' ? null : Number(this.childscn1Service.getStrgyPeriodMin1());
            this.strgyOriginfee1 = this.childscn1Service.getStrgyOriginfee1() == '' ? null : Number(this.childscn1Service.toNumber(this.childscn1Service.getStrgyOriginfee1()));
            this.strgyPeriodMax2 = this.childscn1Service.getStrgyPeriodMax2() == '' ? null : Number(this.childscn1Service.getStrgyPeriodMax2());
            this.strgyPeriodMin2 = this.childscn1Service.getStrgyPeriodMin2() == '' ? null : Number(this.childscn1Service.getStrgyPeriodMin2());
            this.strgyOriginfee2 = this.childscn1Service.getStrgyOriginfee2() == '' ? null : Number(this.childscn1Service.toNumber(this.childscn1Service.getStrgyOriginfee2()));
            this.strgyLoanextfee = this.childscn1Service.getStrgyLoanextfee() == '' ? null : Number(this.childscn1Service.toNumber(this.childscn1Service.getStrgyLoanextfee()));

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

            //20211229新增多階利率陣列
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

            // 當有方案二多階利率時
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

            //20220526 新增insert 期數跟開辦費, 20220620修正
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
                    data: { msgStr: '方案一期數或開辦費不可為空!' }
                  });
                  return;
                }
              }

              if (this.childscn1Service.getProdCodeAndName().includes('0201001')) {
                if (this.approvedDebtStrgy.includes('03')) {
                  if (this.strgyPeriodMax2 != null && this.strgyPeriodMin2 != null && this.strgyOriginfee2 != null) {
                  } else {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '方案二期數或開辦費不可為空!' }
                    });
                    return;
                  }
                }
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

              if (!(this.childscn1Service.getCreditResult() == 'A' || this.childscn1Service.getCreditResult() == 'D')) {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: '請填寫核決結果!' }
                });
              } else {
                if (this.childscn1Service.getCreditResult() == 'A') {

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

                  if (!this.childscn1Service.getProdCodeAndName().includes('0201001')) {
                    if (this.approveAmt == '' || this.approveAmt == null) {
                      const childernDialogRef = this.dialog.open(ConfirmComponent, {
                        data: { msgStr: '循環信貸額度未填寫' }
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
                        data: { msgStr: '核准方案未選擇' }
                      });
                      return;
                    } else {
                      if (this.approvedDebtStrgy == '01') {
                        if (this.strgy1CashAprvAmt == '' || this.strgy1CashAprvAmt == null) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '現金核准未填寫' }
                          });
                          return;
                        } else if (Number(this.strgy1CashAprvAmt) > Number(this.childscn1Service.getStrgyLimitCash1())) {
                          this.childscn1Service.setStrgy1CashAprvAmt(this.childscn1Service.toCurrency(this.childscn1Service.getStrgyLimitCash1()));
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '方案一現金額度不可大於DSS2分期信貸-現金額度!' }
                          });
                          return;
                        } else if (Number(this.strgy1CashAprvAmt) == 0) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '方案一現金額度不可為0!' }
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
                            data: { msgStr: '現金核准未填寫' }
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
                            data: { msgStr: '方案二現金額度不可大於DSS2分期信貸-現金額度!' }
                          });
                          return;
                        } else if ((Number(this.childscn1Service.getAmt()) + Number(this.childscn1Service.getAmtLb()))
                          > (Number(this.childscn1Service.getDss2StrgyLimitMerg()) + Number(this.childscn1Service.getDss2StrgyLimitMergLb()))) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '方案二債整(本行+他行)額度不可大於DSS2分期信貸-債整額度(本行+他行)，請至代償資訊修改!' }
                          });
                          // return;
                          // } else if (Number(this.childscn1Service.getAmt()) > Number(this.childscn1Service.getDss2StrgyLimitMerg())) {
                          //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          //     data: { msgStr: '方案二債整他行額度不可大於DSS2分期信貸-債整額度(他行)，請至代償資訊修改!' }
                          //   });
                          //   return;
                          // } else if (Number(this.childscn1Service.getAmtLb()) > Number(this.childscn1Service.getDss2StrgyLimitMergLb())) {
                          //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          //     data: { msgStr: '方案二債整本行額度不可大於DSS2分期信貸-債整額度(本行)，請至代償資訊修改!' }
                          //   });
                          return;
                        } else if ((Number(this.childscn1Service.getAmt()) + Number(this.childscn1Service.getAmtLb())) < 50000) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '方案二債整本行額度+債整他行額度需大於等於"50000"，請至代償資訊修改!' }
                          });
                          return;
                        }
                        if (Number(this.aprvInstCashAmt) != 0) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '方案二分期信貸金額需為0!' }
                          });
                          return;
                        }
                      } else {
                        if (this.strgy1CashAprvAmt == '' || this.strgy1CashAprvAmt == null || this.aprvInstCashAmt == '' || this.aprvInstCashAmt == null) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '現金核准未填寫' }
                          });
                          return;
                        } else if ((Number(this.childscn1Service.getAmt()) + Number(this.childscn1Service.getAmtLb()))
                          > (Number(this.childscn1Service.getDss2StrgyLimitMerg()) + Number(this.childscn1Service.getDss2StrgyLimitMergLb()))) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '方案二債整(本行+他行)額度不可大於DSS2分期信貸-債整額度(本行+他行)，請至代償資訊修改!' }
                          });
                          // return;
                          // } else if (Number(this.childscn1Service.getAmt()) > Number(this.childscn1Service.getDss2StrgyLimitMerg())) {
                          //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          //     data: { msgStr: '方案二債整他行額度不可大於DSS2分期信貸-債整額度(他行)，請至代償資訊修改!' }
                          //   });
                          //   return;
                          // } else if (Number(this.childscn1Service.getAmtLb()) > Number(this.childscn1Service.getDss2StrgyLimitMergLb())) {
                          //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
                          //     data: { msgStr: '方案二債整本行額度不可大於DSS2分期信貸-債整額度(本行)，請至代償資訊修改!' }
                          //   });
                          return;
                        } else if ((Number(this.childscn1Service.getAmt()) + Number(this.childscn1Service.getAmtLb())) < 50000) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '方案二債整本行額度+債整他行額度需大於等於"50000"，請至代償資訊修改!' }
                          });
                          return;
                        }
                        if (Number(this.strgy1CashAprvAmt) > Number(this.childscn1Service.getStrgyLimitCash1())) {
                          this.childscn1Service.setStrgy1CashAprvAmt(this.childscn1Service.toCurrency(this.childscn1Service.getStrgyLimitCash1()));
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '方案一現金額度不可大於DSS2分期信貸-現金額度!' }
                          });
                          return;
                        }
                        if (Number(this.strgy1CashAprvAmt) == 0) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '方案一分期信貸金額不可為0!' }
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
                            data: { msgStr: '方案二現金額度不可大於DSS2分期信貸-現金額度!' }
                          });
                          return;
                        }
                        if (Number(this.aprvInstCashAmt) == 0) {
                          const childernDialogRef = this.dialog.open(ConfirmComponent, {
                            data: { msgStr: '方案二分期信貸金額不可為0!' }
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
                        data: { msgStr: '每月最低還款比率未填寫' }
                      });
                      return;
                    }
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
                  this.result(baseUrl, jsonObject, result);
                } else {
                  if (this.childscn1Service.getAddSignature() == 'S1' || this.childscn1Service.getAddSignature() == 'S2') {
                    const childernDialogRef = this.dialog.open(ConfirmComponent, {
                      data: { msgStr: '審核結果婉拒無法加簽!' }
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
          transAPname: "授信案件完成",
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
      //儲存歷史資料
      // if (count > 0) {
      // await this.setHistory(count);
      // }
      let childernDialogRef: any;
      if (data.rspMsg != null && data.rspMsg != '') {
        childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: {
            msgStr:
              data.rspMsg.includes('徵審代碼') && window.location.href.split("/").pop() != "CHILDSCN1" ?
                data.rspMsg + "※請回審核資料修改徵審代碼並儲存※" : data.rspMsg
          }
        });
      }
      if (data.rspMsg.includes('處理案件異常') || baseUrl == 'f01/childscn0action1') { }
      else if (data.rspMsg.includes('該案客戶已取消')) {
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

  // 退件
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
  // //儲存
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

    this.history.push({ value: this.approveAmt, tableName: 'EL_CREDITMAIN', valueInfo: 'APPROVE_AMT', originalValue: this.historyData.approveAmt }); //核准額度
    this.history.push({ value: this.childscn1Service.getResultLowestPayRate(), tableName: 'EL_CREDITMAIN', valueInfo: 'LOWEST_PAY_RATE', originalValue: this.historyData.lowestPayRate }); //最低還款比例(循環型)
    this.history.push({ value: this.childscn1Service.getCreditResult(), tableName: 'EL_CREDITMAIN', valueInfo: 'CREDIT_RESULT', originalValue: this.historyData.creditResult }); //核決結果
    // this.history.push({value:  this.caApplicationAmount, tableName: 'EL_APPLICATION_INFO', valueInfo: 'CA_APPLICATION_AMOUNT'}); //徵信修改申貸金額
    this.history.push({ value: this.childscn1Service.getCaPmcus(), tableName: 'EL_CREDITMAIN', valueInfo: 'CA_PMCUS', originalValue: this.historyData.caPmcus }); //人員記錄-PM策略客群
    this.history.push({ value: this.childscn1Service.getCaRisk(), tableName: 'EL_CREDITMAIN', valueInfo: 'CA_RISK', originalValue: this.historyData.caRisk }); //人員記錄-風險等級
    this.history.push({ value: this.childscn1Service.getAddSignature(), tableName: 'EL_CREDITMAIN', valueInfo: 'ADD_SIGNATURE', originalValue: this.historyData.addSignature });//加簽

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
  blockList() {
    const dialogRef = this.dialog.open(Childscn20Component, {
      panelClass: 'mat-dialog-transparent',
      data: {
        applno: this.applno,
        cuid: this.cuid
      }
    });
  }

  //現金額度檢核
  cashCheck(cash: number, strgy: string): string {
    let checkString: string = '';
    if ((cash / 100).toString().includes('.')) {
      return (strgy == '1' ? '方案一' : '方案二') + '現金額度請填寫100的倍數';
    }
    if (cash > (strgy == '1' ? this.childscn1Service.getLimitDbr1() : this.childscn1Service.getLimitDbr2())) {
      return (strgy == '1' ? '方案一' : '方案二') + '信貸金額不可大於限額_DBR';
    }
    if (!((strgy == '1' ? this.childscn1Service.getLimitProdMin1() : this.childscn1Service.getLimitProdMin2()) <= cash && cash <= (strgy == '1' ? this.childscn1Service.getLimitProdMax1() : (this.childscn1Service.getLimitProdMax2() - Number(this.aprvDebtAmt))))) {
      return (strgy == '1' ? '方案一' : '方案二') + '信貸金額需在限額_產品/專案額度上下限之間';
    }
    if (cash > (strgy == '1' ? this.childscn1Service.getLimitNidmue1() : this.childscn1Service.getLimitNidmue2())) {
      return (strgy == '1' ? '方案一' : '方案二') + '信貸金額不可大於限額_歸戶MUE';
    }
    if (cash > (strgy == '1' ? this.childscn1Service.getLimitLaw33Uns1() : this.childscn1Service.getLimitLaw33Uns2())) {
      return (strgy == '1' ? '方案一' : '方案二') + '核准額度不可大於限額_同一自然人無擔保授信限額(銀行法第33條)';
    }
    if (this.childscn1Service.getLimitLaw321() != '' && strgy == '1') {
      if (cash > Number(this.childscn1Service.getLimitLaw321())) {
        return '方案一信貸金額不可大於限額_本行利害關係人(銀行法第32條)';
      }
    }
    if (this.childscn1Service.getLimitLaw322() != '' && strgy == '2') {
      if (cash > Number(this.childscn1Service.getLimitLaw322())) {
        return '方案二信貸金額不可大於限額_本行利害關係人(銀行法第32條)';
      }
    }
    if ((strgy == '1' ? this.strgyPeriodMax1 : this.strgyPeriodMax2) > 84) {
      return (strgy == '1' ? '方案一' : '方案二') + '期數最大值不可大於84期';
    }
    if ((strgy == '1' ? this.strgyPeriodMin1 : this.strgyPeriodMin2) < 12) {
      return (strgy == '1' ? '方案一' : '方案二') + '期數最小值不可小於12期';
    }
    if ((strgy == '1' ? this.strgyPeriodMin1 : this.strgyPeriodMin2) > (strgy == '1' ? this.strgyPeriodMax1 : this.strgyPeriodMax2)) {
      return (strgy == '1' ? '方案一' : '方案二') + '期數最小值不可大於最大值';
    }
    // if ((strgy == '1' ? this.strgyOriginfee1 : this.strgyOriginfee2) > 1000) {
    //   return (strgy == '1' ? '方案一' : '方案二') + '開辦費不可大於1000';
    // }
    return checkString;
  }

  //循環型
  cashCheckOne(): string {
    let checkString: string = '';
    if (this.strgyPeriodMax1 > 84) {
      return '方案一期數最大值不可大於84期';
    }
    if (this.strgyPeriodMin1 < 12) {
      return '方案一期數最小值不可小於12期';
    }
    if (this.strgyPeriodMin1 > this.strgyPeriodMax1) {
      return '方案一期數最小值不可大於最大值';
    }
    return checkString;
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
