import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { F06002Service } from '../../f06002.service';

@Component({
  selector: 'app-f06002page2step1',
  templateUrl: './f06002page2step1.component.html',
  styleUrls: ['./f06002page2step1.component.css'],
})

export class F06002page2step1Component implements OnInit {
  radioGroupOne = false
  radioGroupTwo = false
  strgy: string;
  applno: string;
  readonly ifidStep1Data: string = "MMBKELNA043001"; //步驟1(取資料)電文名稱
  readonly ifidStep1Next: string = "MMBKELNA045001"; //步驟1(下一步)電文名稱
  aplyIntRt: number;
  sgmtIntRt: number;
  mergDebitAmt: string;
  lnLmtAmt: string;
  sumAmt: string;
  aplyIntRt_1: number;
  sgmtIntRt_1: number;
  lnLmtAmt_1: string;
  strgyCode: any[] = this.f06002Service.strgyCode;
  // 階段
  sgmtIntRtCnt: number;
  sgmtIntRtCntChange: string;
  sgmtIntRtCnt_1: number;
  sgmtIntRtCntChange_1: string;
  hidden: boolean = false;//如果sgmIntRtCnt == 0就返回true
  hidden_1: boolean = false;//如果sgmIntRtCnt == 0就返回true
  strgyCheck: string;
  constructor(
    public dialog: MatDialog,
    private f06002Service: F06002Service
  ) {

  }

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.f06002Service.getCreditmainInfo(jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        this.strgy = data.rspBody.strgy;
        this.strgyCheck = data.rspBody.strgy;
        if (this.strgy == '01') {
          this.radioGroupOne = false;
          this.radioGroupTwo = true;
        } else if (this.strgy == '03') {
          this.radioGroupOne = true;
          this.radioGroupTwo = false;
        } else if (this.strgy == '01,03') {
          this.radioGroupOne = false;
          this.radioGroupTwo = false;
        }
      }
      this.getStep1Data();
      this.strgy = null;
    });
  }

  selectStep(value: string) {
    this.strgy = value;
    sessionStorage.setItem('strgy', this.strgy);
  }

  getStep1Data() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['ifId'] = this.ifidStep1Data;
    this.f06002Service.stepHandle(jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        if (this.strgyCheck === '03') {
          this.sgmtIntRtCnt = data.rspBody.debtConsolidation.sgmtIntRtCnt;
          this.sgmtIntRtCntChange = this.f06002Service.changeToCN(this.sgmtIntRtCnt);
          if (this.sgmtIntRtCnt == 0) { this.hidden = true; }
          this.aplyIntRt = data.rspBody.debtConsolidation.aplyIntRt;
          this.sgmtIntRt = data.rspBody.debtConsolidation.sgmtIntRt;
          this.mergDebitAmt = this.toCurrency(data.rspBody.debtConsolidation.mergDebitAmt.toString());
          this.lnLmtAmt = this.toCurrency(data.rspBody.debtConsolidation.lnLmtAmt.toString());
          this.sumAmt = this.toCurrency((data.rspBody.debtConsolidation.mergDebitAmt + data.rspBody.debtConsolidation.lnLmtAmt).toString());
        } else if (this.strgyCheck === '01') {
          this.sgmtIntRtCnt_1 = data.rspBody.sgmtIntRtCnt;
          this.sgmtIntRtCntChange_1 = this.f06002Service.changeToCN(this.sgmtIntRtCnt_1);
          if (this.sgmtIntRtCnt_1 == 0) { this.hidden_1 = true; }
          this.aplyIntRt_1 = data.rspBody.aplyIntRt;
          this.sgmtIntRt_1 = data.rspBody.sgmtIntRt;
          this.lnLmtAmt_1 = this.toCurrency(data.rspBody.lnLmtAmt.toString());
        } else if (this.strgyCheck === '01,03') {
          this.sgmtIntRtCnt = data.rspBody.debtConsolidation.sgmtIntRtCnt;
          this.sgmtIntRtCntChange = this.f06002Service.changeToCN(this.sgmtIntRtCnt);
          if (this.sgmtIntRtCnt == 0) { this.hidden = true; }
          this.aplyIntRt = data.rspBody.debtConsolidation.aplyIntRt;
          this.sgmtIntRt = data.rspBody.debtConsolidation.sgmtIntRt;
          this.mergDebitAmt = this.toCurrency(data.rspBody.debtConsolidation.mergDebitAmt.toString());
          this.lnLmtAmt = this.toCurrency(data.rspBody.debtConsolidation.lnLmtAmt.toString());
          this.sumAmt = this.toCurrency((data.rspBody.debtConsolidation.mergDebitAmt + data.rspBody.debtConsolidation.lnLmtAmt).toString());
          this.sgmtIntRtCnt_1 = data.rspBody.sgmtIntRtCnt;
          this.sgmtIntRtCntChange_1 = this.f06002Service.changeToCN(this.sgmtIntRtCnt_1);
          if (this.sgmtIntRtCnt_1 == 0) { this.hidden_1 = true; }
          this.aplyIntRt_1 = data.rspBody.aplyIntRt;
          this.sgmtIntRt_1 = data.rspBody.sgmtIntRt;
          this.lnLmtAmt_1 = this.toCurrency(data.rspBody.lnLmtAmt.toString());
        }
      }
    });
  }

  //+逗號
  toCurrency(data: string) {
    return data != null ? data.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : data;
  }

  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\d]/g, '') : data;
  }

}
