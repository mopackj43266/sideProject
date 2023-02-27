import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { interestPeriod, strgyRepayrate } from 'src/app/interface/base';

@Injectable({
  providedIn: 'root'
})
export class Childscn1Service extends BaseService {
  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getImfornation(baseUrl: string, json: JSON) {
    return this.postJsonObject(baseUrl, json);
  }

  saveCreditmemo(baseUrl: string, json: JSON): any {
    return this.saveOrEditMsgJson(baseUrl, json);
  }

  getDate_Json(baseUrl: string, json: JSON): Observable<any> {
    return this.postJsonObject(baseUrl, json);
  }

  getInterestBase(baseUrl: string, json: JSON): any {
    return this.saveOrEditMsgJson(baseUrl, json);
  }

  insertHistory(baseUrl: string, json: JSON) {
    return this.postJsonObject(baseUrl, json);
  }

  //參數設定-基本資料區
  custId: string = ""; //客戶ID(可共用)
  prodCodeAndName: string = ""; //產品代號及名稱(可共用)
  caApplicationAmount: string = ""; //徵信修改申請金額(可共用)
  creditResult: string = ""; //核決結果(可共用)
  resultApproveAmt: string = ""; //循環信貸額度(可共用)
  resultLowestPayRate: string = ""; //每月最低還款比率(可共用)
  caPmcus: string = "";
  caRisk: string = "";
  addSignature: string = ""; //X
  titleName: string = "";

  //參數設定-債整區
  approvedDebtStrgy: string = ""; //核可方案(可共用)
  strgy1CashAprvAmt: string = ""; //分期信貸金額(方案一)(可共用)
  aprvInstCashAmt: string = ""; //現金核准額度(可共用)
  aprvDebtAmt: string = "0"; //分期型方案二 債整核准額度(for計算 案件完成)
  strgy2AprvAmt: string = ""; //分期信貸金額(方案二)(可共用)

  //參數設定-開辦費、管理費、期數區
  strgyPeriodMin1: string = "";
  strgyPeriodMax1: string = "";
  strgyPeriodMin2: string = "";
  strgyPeriodMax2: string = "";
  strgyOriginfee1: string = "";
  strgyOriginfee2: string = "";
  strgyLoanextfee: string = "";

  creditInterestPeriodSource1: interestPeriod[] = [];
  creditInterestPeriodSource2: interestPeriod[] = [];

  elCreditRepayrateOne: strgyRepayrate[] = [];
  elCreditRepayrateTwo: strgyRepayrate[] = [];

  //參數設定-分期方案檢核區
  limitDbr1: number = 0;
  limitProdMax1: number = 100;
  limitProdMin1: number = 100;
  limitNidmue1: number = 0;
  limitLaw33Uns1: number = 0;
  limitLaw321: string = ""; //需判斷是否空

  limitDbr2: number = 0;
  limitProdMax2: number = 100;
  limitProdMin2: number = 100;
  limitNidmue2: number = 0;
  limitLaw33Uns2: number = 0;
  limitLaw322: string = ""; //需判斷是否空

  //債整金額
  amt: string = "";
  amtLb: string = "";
  dss2StrgyLimitMerg: string = "";
  dss2StrgyLimitMergLb: string = "";
  strgyLimitCash1: string = "";
  strgyLimitCash2: string = "";

  //20220715 舊開辦費
  oriStrgyOriginfee1: string = "";
  oriStrgyOriginfee2: string = "";
  oriStrgyLoanextfee: string = "";

  oriStrgyPeriodMin1: string = "";
  oriStrgyPeriodMax1: string = "";
  oriStrgyPeriodMin2: string = "";
  oriStrgyPeriodMax2: string = "";
  oriStrgy1CashAprvAmt: string = ""; //分期信貸金額(方案一)(可共用)
  oriAprvInstCashAmt: string = ""; //現金核准額度(可共用)
  oriApprovedDebtStrgy: string = ""; //核可方案(可共用)

  //20220907 S4加簽
  s4AddSignature: string = "";

  jsonObject: any = null;
  setJsonObject(jsonObject: string) {
    this.jsonObject = jsonObject;
  }
  getJsonObject() {
    return this.jsonObject;
  }
  setCustId(custId: string) {
    this.custId = custId;
  }
  getCustId() {
    return this.custId;
  }
  setProdCodeAndName(prodCodeAndName: string) {
    this.prodCodeAndName = prodCodeAndName;
  }
  getProdCodeAndName() {
    return this.prodCodeAndName;
  }
  setCaApplicationAmount(caApplicationAmount: string) {
    this.caApplicationAmount = caApplicationAmount;
  }
  getCaApplicationAmount() {
    return this.caApplicationAmount;
  }
  setCreditResult(creditResult: string) {
    this.creditResult = creditResult;
  }
  getCreditResult() {
    return this.creditResult;
  }
  setResultApproveAmt(resultApproveAmt: string) {
    this.resultApproveAmt = resultApproveAmt;
  }
  getResultApproveAmt() {
    return this.resultApproveAmt;
  }
  setResultLowestPayRate(resultLowestPayRate: string) {
    this.resultLowestPayRate = resultLowestPayRate;
  }
  getResultLowestPayRate() {
    return this.resultLowestPayRate;
  }
  setCaPmcus(caPmcus: string) {
    this.caPmcus = caPmcus;
  }
  getCaPmcus() {
    return this.caPmcus;
  }
  setCaRisk(caRisk: string) {
    this.caRisk = caRisk;
  }
  getCaRisk() {
    return this.caRisk;
  }
  setAddSignature(addSignature: string) {
    this.addSignature = addSignature;
  }
  getAddSignature() {
    return this.addSignature;
  }
  settitleName(titleName: string) {
    this.titleName = titleName;
  }
  gettitleName() {
    return this.titleName;
  }
  setApprovedDebtStrgy(approvedDebtStrgy: string) {
    this.approvedDebtStrgy = approvedDebtStrgy;
  }
  getApprovedDebtStrgy() {
    return this.approvedDebtStrgy;
  }
  setStrgy1CashAprvAmt(strgy1CashAprvAmt: string) {
    this.strgy1CashAprvAmt = strgy1CashAprvAmt;
  }
  getStrgy1CashAprvAmt() {
    return this.strgy1CashAprvAmt;
  }
  setAprvInstCashAmt(aprvInstCashAmt: string) {
    this.aprvInstCashAmt = aprvInstCashAmt;
  }
  getAprvInstCashAmt() {
    return this.aprvInstCashAmt;
  }
  setAprvDebtAmt(aprvDebtAmt: string) {
    this.aprvDebtAmt = aprvDebtAmt;
  }
  getAprvDebtAmt() {
    return this.aprvDebtAmt;
  }
  setStrgy2AprvAmt(strgy2AprvAmt: string) {
    this.strgy2AprvAmt = strgy2AprvAmt;
  }
  getStrgy2AprvAmt() {
    return this.strgy2AprvAmt;
  }
  setStrgyPeriodMin1(strgyPeriodMin1: string) {
    this.strgyPeriodMin1 = strgyPeriodMin1;
  }
  getStrgyPeriodMin1() {
    return this.strgyPeriodMin1;
  }
  setStrgyPeriodMax1(strgyPeriodMax1: string) {
    this.strgyPeriodMax1 = strgyPeriodMax1;
  }
  getStrgyPeriodMax1() {
    return this.strgyPeriodMax1;
  }
  setStrgyPeriodMin2(strgyPeriodMin2: string) {
    this.strgyPeriodMin2 = strgyPeriodMin2;
  }
  getStrgyPeriodMin2() {
    return this.strgyPeriodMin2;
  }
  setStrgyPeriodMax2(strgyPeriodMax2: string) {
    this.strgyPeriodMax2 = strgyPeriodMax2;
  }
  getStrgyPeriodMax2() {
    return this.strgyPeriodMax2;
  }
  setStrgyOriginfee1(strgyOriginfee1: string) {
    this.strgyOriginfee1 = strgyOriginfee1;
  }
  getStrgyOriginfee1() {
    return this.strgyOriginfee1;
  }
  setStrgyOriginfee2(strgyOriginfee2: string) {
    this.strgyOriginfee2 = strgyOriginfee2;
  }
  getStrgyOriginfee2() {
    return this.strgyOriginfee2;
  }
  setStrgyLoanextfee(strgyLoanextfee: string) {
    this.strgyLoanextfee = strgyLoanextfee;
  }
  getStrgyLoanextfee() {
    return this.strgyLoanextfee;
  }
  setCreditInterestPeriodSource1(CreditInterestPeriodSource1: interestPeriod[]) {
    this.creditInterestPeriodSource1 = CreditInterestPeriodSource1;
  }
  getCreditInterestPeriodSource1() {
    return this.creditInterestPeriodSource1;
  }
  setCreditInterestPeriodSource2(creditInterestPeriodSource2: interestPeriod[]) {
    this.creditInterestPeriodSource2 = creditInterestPeriodSource2;
  }
  getCreditInterestPeriodSource2() {
    return this.creditInterestPeriodSource2;
  }
  setElCreditRepayrateOne(elCreditRepayrateOne: strgyRepayrate[]) {
    this.elCreditRepayrateOne = elCreditRepayrateOne;
  }
  getElCreditRepayrateOne() {
    return this.elCreditRepayrateOne;
  }
  setElCreditRepayrateTwo(elCreditRepayrateTwo: strgyRepayrate[]) {
    this.elCreditRepayrateTwo = elCreditRepayrateTwo;
  }
  getElCreditRepayrateTwo() {
    return this.elCreditRepayrateTwo;
  }
  setLimitDbr1(limitDbr1: number) {
    this.limitDbr1 = limitDbr1;
  }
  getLimitDbr1() {
    return this.limitDbr1;
  }
  setLimitProdMax1(limitProdMax1: number) {
    this.limitProdMax1 = limitProdMax1;
  }
  getLimitProdMax1() {
    return this.limitProdMax1;
  }
  setLimitProdMin1(limitProdMin1: number) {
    this.limitProdMin1 = limitProdMin1;
  }
  getLimitProdMin1() {
    return this.limitProdMin1;
  }
  setLimitNidmue1(limitNidmue1: number) {
    this.limitNidmue1 = limitNidmue1;
  }
  getLimitNidmue1() {
    return this.limitNidmue1;
  }
  setLimitLaw33Uns1(limitLaw33Uns1: number) {
    this.limitLaw33Uns1 = limitLaw33Uns1;
  }
  getLimitLaw33Uns1() {
    return this.limitLaw33Uns1;
  }
  setLimitLaw321(limitLaw321: string) {
    this.limitLaw321 = limitLaw321;
  }
  getLimitLaw321() {
    return this.limitLaw321;
  }
  setLimitDbr2(limitDbr2: number) {
    this.limitDbr2 = limitDbr2;
  }
  getLimitDbr2() {
    return this.limitDbr2;
  }
  setLimitProdMax2(limitProdMax2: number) {
    this.limitProdMax2 = limitProdMax2;
  }
  getLimitProdMax2() {
    return this.limitProdMax2;
  }
  setLimitProdMin2(limitProdMin2: number) {
    this.limitProdMin2 = limitProdMin2;
  }
  getLimitProdMin2() {
    return this.limitProdMin2;
  }
  setLimitNidmue2(limitNidmue2: number) {
    this.limitNidmue2 = limitNidmue2;
  }
  getLimitNidmue2() {
    return this.limitNidmue2;
  }
  setLimitLaw33Uns2(limitLaw33Uns2: number) {
    this.limitLaw33Uns2 = limitLaw33Uns2;
  }
  getLimitLaw33Uns2() {
    return this.limitLaw33Uns2;
  }
  setLimitLaw322(limitLaw322: string) {
    this.limitLaw322 = limitLaw322;
  }
  getLimitLaw322() {
    return this.limitLaw322;
  }
  setAmt(amt: string) {
    this.amt = amt;
  }
  getAmt() {
    return this.amt;
  }
  setAmtLb(amtLb: string) {
    this.amtLb = amtLb;
  }
  getAmtLb() {
    return this.amtLb;
  }
  setDss2StrgyLimitMerg(dss2StrgyLimitMerg: string) {
    this.dss2StrgyLimitMerg = dss2StrgyLimitMerg;
  }
  getDss2StrgyLimitMerg() {
    return this.dss2StrgyLimitMerg;
  }
  setDss2StrgyLimitMergLb(dss2StrgyLimitMergLb: string) {
    this.dss2StrgyLimitMergLb = dss2StrgyLimitMergLb;
  }
  getDss2StrgyLimitMergLb() {
    return this.dss2StrgyLimitMergLb;
  }
  setStrgyLimitCash1(strgyLimitCash1: string) {
    this.strgyLimitCash1 = strgyLimitCash1;
  }
  getStrgyLimitCash1() {
    return this.strgyLimitCash1;
  }
  setStrgyLimitCash2(strgyLimitCash2: string) {
    this.strgyLimitCash2 = strgyLimitCash2;
  }
  getStrgyLimitCash2() {
    return this.strgyLimitCash2;
  }
  setOriStrgyOriginfee1(oriStrgyOriginfee1: string) {
    this.oriStrgyOriginfee1 = oriStrgyOriginfee1;
  }
  getOriStrgyOriginfee1() {
    return this.oriStrgyOriginfee1;
  }
  setOriStrgyOriginfee2(oriStrgyOriginfee2: string) {
    this.oriStrgyOriginfee2 = oriStrgyOriginfee2;
  }
  getOriStrgyOriginfee2() {
    return this.oriStrgyOriginfee2;
  }
  setOriStrgyLoanextfee(oriStrgyLoanextfee: string) {
    this.oriStrgyLoanextfee = oriStrgyLoanextfee;
  }
  getOriStrgyLoanextfee() {
    return this.oriStrgyLoanextfee;
  }
  setOriStrgyPeriodMax1(oriStrgyPeriodMax1: string) {
    this.oriStrgyPeriodMax1 = oriStrgyPeriodMax1;
  }
  getOriStrgyPeriodMax1() {
    return this.oriStrgyPeriodMax1;
  }
  setOriStrgyPeriodMin1(oriStrgyPeriodMin1: string) {
    this.oriStrgyPeriodMin1 = oriStrgyPeriodMin1;
  }
  getOriStrgyPeriodMin1() {
    return this.oriStrgyPeriodMin1;
  }
  setOriStrgyPeriodMax2(oriStrgyPeriodMax2: string) {
    this.oriStrgyPeriodMax2 = oriStrgyPeriodMax2;
  }
  getOriStrgyPeriodMax2() {
    return this.oriStrgyPeriodMax2;
  }
  setOriStrgyPeriodMin2(oriStrgyPeriodMin2: string) {
    this.oriStrgyPeriodMin2 = oriStrgyPeriodMin2;
  }
  getOriStrgyPeriodMin2() {
    return this.oriStrgyPeriodMin2;
  }
  setOriStrgy1CashAprvAmt(oriStrgy1CashAprvAmt: string) {
    this.oriStrgy1CashAprvAmt = oriStrgy1CashAprvAmt;
  }
  getOriStrgy1CashAprvAmt() {
    return this.oriStrgy1CashAprvAmt;
  }
  setOriAprvInstCashAmt(oriAprvInstCashAmt: string) {
    this.oriAprvInstCashAmt = oriAprvInstCashAmt;
  }
  getOriAprvInstCashAmt() {
    return this.oriAprvInstCashAmt;
  }
  setOriApprovedDebtStrgy(oriApprovedDebtStrgy: string) {
    this.oriApprovedDebtStrgy = oriApprovedDebtStrgy;
  }
  getOriApprovedDebtStrgy() {
    return this.oriApprovedDebtStrgy;
  }
  setS4AddSignature(s4AddSignature: string) {
    this.s4AddSignature = s4AddSignature;
  }
  getS4AddSignature() {
    return this.s4AddSignature;
  }

  clear() {
    //參數設定-基本資料區
    this.custId = ""; //客戶ID(可共用)
    this.prodCodeAndName = ""; //產品代號及名稱(可共用)
    this.caApplicationAmount = ""; //徵信修改申請金額(可共用)
    this.creditResult = ""; //核決結果(可共用)
    this.resultApproveAmt = ""; //循環信貸額度(可共用)
    this.resultLowestPayRate = ""; //每月最低還款比率(可共用)
    this.caPmcus = "";
    this.caRisk = "";
    this.addSignature = ""; //X
    this.titleName = "";
    //參數設定-債整區
    this.approvedDebtStrgy = ""; //核可方案(可共用)
    this.strgy1CashAprvAmt = ""; //分期信貸金額(方案一)(可共用)
    this.aprvInstCashAmt = ""; //現金核准額度(可共用)
    this.aprvDebtAmt = "0"; //分期型方案二 債整核准額度(for計算 案件完成)
    this.strgy2AprvAmt = ""; //分期信貸金額(方案二)(可共用)

    //參數設定-開辦費、管理費、期數區
    this.strgyPeriodMin1 = "";
    this.strgyPeriodMax1 = "";
    this.strgyPeriodMin2 = "";
    this.strgyPeriodMax2 = "";
    this.strgyOriginfee1 = "";
    this.strgyOriginfee2 = "";
    this.strgyLoanextfee = "";

    this.creditInterestPeriodSource1 = [];
    this.creditInterestPeriodSource2 = [];

    this.elCreditRepayrateOne = [];
    this.elCreditRepayrateTwo = [];

    //參數設定-分期方案檢核區
    this.limitDbr1 = 0;
    this.limitProdMax1 = 100;
    this.limitProdMin1 = 100;
    this.limitNidmue1 = 0;
    this.limitLaw33Uns1 = 0;
    this.limitLaw321 = ""; //需判斷是否空

    this.limitDbr2 = 0;
    this.limitProdMax2 = 100;
    this.limitProdMin2 = 100;
    this.limitNidmue2 = 0;
    this.limitLaw33Uns2 = 0;
    this.limitLaw322 = ""; //需判斷是否空

    //債整金額
    this.amt = "";
    this.amtLb = "";
    this.dss2StrgyLimitMerg = "";
    this.dss2StrgyLimitMergLb = "";
    this.strgyLimitCash1 = "";
    this.strgyLimitCash2 = "";

    //20220715 舊開辦費
    this.oriStrgyOriginfee1 = "";
    this.oriStrgyOriginfee2 = "";
    this.oriStrgyLoanextfee = "";

    this.oriStrgyPeriodMin1 = "";
    this.oriStrgyPeriodMax1 = "";
    this.oriStrgyPeriodMin2 = "";
    this.oriStrgyPeriodMax2 = "";
    this.oriStrgy1CashAprvAmt = ""; //分期信貸金額(方案一)(可共用)
    this.oriAprvInstCashAmt = ""; //現金核准額度(可共用)
    this.oriApprovedDebtStrgy = ""; //核可方案(可共用)

    this.s4AddSignature = "";
  }
}
