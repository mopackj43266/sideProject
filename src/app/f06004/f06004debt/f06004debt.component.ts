import { Sort } from '@angular/material/sort';
import { OptionsCode } from 'src/app/interface/base';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F06004Service } from '../f06004.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';

interface debtSaveData {
  guid?: string,
  oriGuid?: string,
  bankCode?: string,
  bankName?: string,
  settleAmt: number,
  accountNo?: string,
  settleCardNo: string,
  accountNm: string,
  branchCd: string,
  transMemo: string,
  mergDebtAmt: number,
  isSelected: string,
  sort: string
}

interface acctNbrData {
  acctNbr: string
}

@Component({
  selector: 'app-f06004debt',
  templateUrl: './f06004debt.component.html',
  styleUrls: ['./f06004debt.component.css', '../../../assets/css/child.css']
})
export class F06004debtComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public f06004Service: F06004Service,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<F06004debtComponent>,
  ) { }

  branchCdCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }];
  debtData = [];
  pageSize = 50;
  pageIndex = 1;
  total = 0;

  settleAmt: number;
  accountNo: string;
  settleCardNo: string;
  accountNm: string;
  branchCd: string;
  transMemo: string;

  // 20220516 取金額 By Omar
  searchDisabled = true;
  lineBankCode: string = '824';
  acctNbrList: acctNbrData[] = [];

  branchNm: string = '';
  oldData = [];
  totalAmtFor824: number;
  // totalAmtOther: number;

  isUnsLoan: boolean = false;

  ngOnInit(): void {
    //判斷產品別
    if (this.data.mergDebtProd == 'UnsLoan') {
      this.isUnsLoan = true;
    }
    let jsonObject: any = {};
    let baseUrl = 'f06/f06004action9';
    jsonObject['guid'] = this.data.guid;
    jsonObject['applno'] = this.data.applno;
    jsonObject['custId'] = this.data.custId;
    this.f06004Service.getData(baseUrl, jsonObject).subscribe(data => {
      data.rspBody.queryMap.SETTLE_AMT = data.rspBody.queryMap.SETTLE_AMT ? this.f06004Service.toCurrency(data.rspBody.queryMap.SETTLE_AMT.toString()) : '';
      this.debtData.push(data.rspBody.queryMap);
      if (this.debtData[0].BANK_CODE == this.lineBankCode) {
        this.oldData = this.debtData;
        this.searchDisabled = false;
        this.totalAmtFor824 = Number(data.rspBody.queryMap.MERG_DEBT_AMT);
        this.getBankBranchCode(this.debtData[0].BANK_CODE.toString());
        // if (data.rspBody.roList) {
        //   this.debtData[0].TITLE = "結清金額：$" + this.f06004Service.toCurrency(data.rspBody.roList[0].totRpayAmt.toString());
        //   this.debtData[0].DETAIL =
        //     "本金：" + ((data.rspBody.roList[0].rpayPrcaAmt != null && data.rspBody.roList[0].rpayPrcaAmt != '') || data.rspBody.roList[0].rpayPrcaAmt == 0 ? "$" + this.f06004Service.toCurrency(data.rspBody.roList[0].rpayPrcaAmt.toString()) : "N/A") +
        //     " 利息：" + ((data.rspBody.roList[0].nrmlIntAmt != null && data.rspBody.roList[0].nrmlIntAmt != '') || data.rspBody.roList[0].nrmlIntAmt == 0 ? "$" + this.f06004Service.toCurrency(data.rspBody.roList[0].nrmlIntAmt.toString()) : "N/A") +
        //     " 逾期利息：" + ((data.rspBody.roList[0].odueIntAmt != null && data.rspBody.roList[0].odueIntAmt != '') || data.rspBody.roList[0].odueIntAmt == 0 ? "$" + this.f06004Service.toCurrency(data.rspBody.roList[0].odueIntAmt.toString()) : "N/A") +
        //     " 提前償還違約金：" + ((data.rspBody.roList[0].erlyTmntFeeAmt != null && data.rspBody.roList[0].erlyTmntFeeAmt != '') || data.rspBody.roList[0].erlyTmntFeeAmt == 0 ? "$" + this.f06004Service.toCurrency(data.rspBody.roList[0].erlyTmntFeeAmt.toString()) : "N/A")

        // }
      } else {
        this.getBankBranchCode(this.debtData[0].BANK_CODE.toString());
        // this.totalAmtOther = Number(this.f06004Service.toNumber(data.rspBody.SETTLE_AMT));
      }
    })
  }

  getBankBranchCode(code: string) {
    let jsonObject: any = {};
    let baseUrl = 'f06/f06002action10';
    jsonObject['bnkCd'] = code;
    this.f06004Service.getData(baseUrl, jsonObject).subscribe(data => {
      if (this.searchDisabled) {
        for (let i = 0; i < data.rspBody.length; i++) {
          this.branchCdCode.push(
            {
              value: data.rspBody[i].branchCd,
              viewValue: data.rspBody[i].branchCd + '-' + data.rspBody[i].branchNm
            }
          );
        }
      } else {
        this.debtData[0].BRANCH_CD = data.rspBody[0].branchCd + '-' + data.rspBody[0].branchNm;
      }
    });
  }

  save() {
    // if (this.f06004Service.checkAcc(this.debtData)) {
    let jsonObject: any = {};
    let debtArray: debtSaveData[] = [];
    let baseUrl = 'f06/f06004action4';
    let checkAccNo = [];

    let checkBlank = [];
    let settleAmtFor824: number = 0;
    // let settleAmtOther: number = 0;

    let checkSpecWord: string[] = [];
    let checkMemoFor824: string[] = [];

    jsonObject['applno'] = this.data.applno;
    jsonObject['mergDebtProd'] = this.data.mergDebtProd;
    for (let i = 0; i < this.debtData.length; i++) {
      debtArray.push({
        guid: i == 0 ? this.data.guid : '',
        // guid: this.searchDisabled ? (i == 0 ? this.data.guid : '') : '',
        oriGuid: this.data.oriGuid,
        bankCode: this.debtData[i].BANK_CODE,
        bankName: this.debtData[i].BANK_NAME,
        settleAmt: this.debtData[i].SETTLE_AMT != 0 ? Number(this.f06004Service.toNumber(this.debtData[i].SETTLE_AMT)) : this.debtData[i].SETTLE_AMT,
        accountNo: this.debtData[i].ACCOUNT_NO,
        settleCardNo: this.debtData[i].SETTLE_CARD_NO,
        accountNm: this.debtData[i].ACCOUNT_NM,
        branchCd: this.searchDisabled ? this.debtData[i].BRANCH_CD : this.debtData[i].BRANCH_CD.split('-')[0],
        transMemo: this.debtData[i].TRANS_MEMO,
        mergDebtAmt: this.data.mergDebtAmt,
        isSelected: this.data.isSelected,
        sort: this.debtData[0].SORT
      })
      checkBlank.push(this.f06004Service.toNumber(this.debtData[i].SETTLE_AMT));
      if (this.debtData[i].ACCOUNT_NO != '' && this.debtData[i].ACCOUNT_NO != null) {
        checkAccNo.push(this.debtData[i].ACCOUNT_NO);
      }
      if (this.debtData[i].SETTLE_CARD_NO != '' && this.debtData[i].SETTLE_CARD_NO != null) {
        checkAccNo.push(this.debtData[i].SETTLE_CARD_NO);
      }
      if (this.debtData[i].TRANS_MEMO != null && this.debtData[i].TRANS_MEMO != '') {
        checkSpecWord.push(this.debtData[i].TRANS_MEMO);
        checkMemoFor824.push(this.debtData[i].TRANS_MEMO)
      }
      checkSpecWord.push(this.debtData[i].ACCOUNT_NM);
    }

    if (!this.searchDisabled) {
      for (let i = 0; i < debtArray.length; i++) {
        settleAmtFor824 = settleAmtFor824 + debtArray[i].settleAmt;
      }
      if (settleAmtFor824 > this.totalAmtFor824) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '債整結清拆分金額不可超過債整總額!' }
        });
        return;
      }
      for (let i = 0; i < checkMemoFor824.length; i++) {
        if (this.f06004Service.checkSpecialWord(checkMemoFor824[i])) {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: '匯款附言僅允許輸入全型中英文數字與白名單全形符號!' }
          });
          return;
        }
      }
    }
    // else {
    //   for (let i = 0; i < debtArray.length; i++) {
    //     settleAmtOther = settleAmtOther + debtArray[i].settleAmt;
    //   }
    //   if (settleAmtOther > this.totalAmtOther) {
    //     const childernDialogRef = this.dialog.open(ConfirmComponent, {
    //       data: { msgStr: '債整結清拆分金額不可超過'+ this.f06004Service.toCurrency(this.totalAmtOther.toString()) +'!' }
    //     });
    //     return;
    //   }
    // }

    if (!this.f06004Service.checkOnlyNumber(checkAccNo)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '帳號請輸入數字!' }
      });
      return;
    }

    if (this.searchDisabled) {
      for (let i = 0; i < checkSpecWord.length; i++) {
        if (this.f06004Service.checkSpecialWord(checkSpecWord[i])) {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: '匯款戶名、匯款附言僅允許輸入全型中英文數字與白名單全形符號!' }
          });
          return;
        }
      }
    }

    if (this.searchDisabled ? this.f06004Service.checkBlank(checkBlank) : true) {
      jsonObject['debtBankDetailList'] = debtArray;
      this.f06004Service.saveData(baseUrl, jsonObject).subscribe(data => {
        if (data.rspMsg == null) {
          if (data.rspCode == '0000') {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: '儲存成功!' }
            });
            this.close();
          }
        } else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: data.rspMsg }
          });
        }
      });
    } else {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '結清金額未填寫或為0!' }
      });
    }
    // } else {
    //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
    //     data: { msgStr: '匯款帳號重複!' }
    //   });
    // }
  }

  add(data: any) {
    let newData = JSON.parse(JSON.stringify(data));
    this.debtData.push(newData);
  }

  remove(data: any) {
    const index: number = this.debtData.indexOf(data);
    this.debtData.splice(index, 1);
  }

  close() {
    this.dialogRef.close();
  }

  getStyle(value: string) {
    value = value != null ? value.replace(',', '') : value;
    return {
      'text-align': this.f06004Service.isNumber(value) ? 'right' : 'left'
    }
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請輸入數字!' }
      });
      return false;
    }
    return true;
  }

  //查詢本行還款金額-20220516 by Omar
  searchAmt() {
    let jsonObject: any = {};
    let baseUrl = 'f06/f06004action10';
    jsonObject['applno'] = this.data.applno;
    jsonObject['custId'] = this.data.custId;
    this.f06004Service.getData(baseUrl, jsonObject).subscribe(data => {
      if (data.rspBody != null) {
        this.debtData = [];
        for (let i = 0; i < data.rspBody.roList.length; i++) {
          this.debtData.push({
            MERG_DEBT_PROD: this.oldData[0].MERG_DEBT_PROD,
            BANK_CODE: this.oldData[0].BANK_CODE,
            BANK_NAME: this.oldData[0].BANK_NAME,
            SETTLE_AMT: this.f06004Service.toCurrency(data.rspBody.roList[i].totRpayAmt.toString()),
            ACCOUNT_NO: data.rspBody.roList[i].acctNbr.toString(),
            SETTLE_CARD_NO: '',
            ACCOUNT_NM: data.rspBody.roList[i].custNm,
            BRANCH_CD: data.rspBody.bankBranchCodeList[0].branchCd + '-' + data.rspBody.bankBranchCodeList[0].branchNm,
            TITLE: "結清金額：$" + this.f06004Service.toCurrency(data.rspBody.roList[i].totRpayAmt.toString()),
            DETAIL:
              "本金：" + ((data.rspBody.roList[i].rpayPrcaAmt != null && data.rspBody.roList[i].rpayPrcaAmt != '') || data.rspBody.roList[i].rpayPrcaAmt == 0 ? "$" + this.f06004Service.toCurrency(data.rspBody.roList[i].rpayPrcaAmt.toString()) : "N/A") +
              " 利息：" + ((data.rspBody.roList[i].nrmlIntAmt != null && data.rspBody.roList[i].nrmlIntAmt != '') || data.rspBody.roList[i].nrmlIntAmt == 0 ? "$" + this.f06004Service.toCurrency(data.rspBody.roList[i].nrmlIntAmt.toString()) : "N/A") +
              " 逾期利息：" + ((data.rspBody.roList[i].odueIntAmt != null && data.rspBody.roList[i].odueIntAmt != '') || data.rspBody.roList[i].odueIntAmt == 0 ? "$" + this.f06004Service.toCurrency(data.rspBody.roList[i].odueIntAmt.toString()) : "N/A") +
              " 提前償還違約金：" + ((data.rspBody.roList[i].erlyTmntFeeAmt != null && data.rspBody.roList[i].erlyTmntFeeAmt != '') || data.rspBody.roList[i].erlyTmntFeeAmt == 0 ? "$" + this.f06004Service.toCurrency(data.rspBody.roList[i].erlyTmntFeeAmt.toString()) : "N/A")
          });
        }
      } else {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
      }
    });
  }

  //去除符號/中英文
  toNumber2(data: string) {
    return data != null ? data.toString().replace(/[^\d]/g, '') : data;
  }

  settleCardCheck(value: string) {
    return value == 'CreditCard' ? true : false;
  }

}
