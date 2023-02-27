import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { F06002Service } from '../../f06002.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';

interface checkBox {
  bnkNm: string;
  sltdYn: boolean;
  lnAmt: string;
  debtBnkId: string;
  bnkCd: string;
  dsbsYn: string;
}
@Component({
  selector: 'app-f06002page2step2',
  templateUrl: './f06002page2step2.component.html',
  styleUrls: ['./f06002page2step2.component.css']
})
export class F06002page2step2Component implements OnInit {
  applno: string;
  intRt: string;//前三期(利率)
  sgmtIntRt: string;//之後(利率)
  debtConsolidation = [];
  lnLmtAmt: number;//現金核准額度
  lnLmtAmtstr: string;//現金核准額度 畫面顯示用
  lnLmtAmtbool: boolean = false;//控制custLnAmtcheck 是否開起
  custLnAmt: number;//現金申請額度
  custLnAmtbool: boolean = false; //畫面載入計算用
  custLnAmtcheck: boolean = true; //現金申請額度 是否啟用
  custLnAmtstr: string;//現金申請額度 畫面顯示用
  custLnPrd: string;//現金貸款期限
  prdcMinVal: number;//現金貸款期限最小值
  prdcMaxVal: number;//現金貸款期限最大值
  period: number;//幾期
  periodValue: string;//申請期數
  periodCode = [];//申請期數
  readonly ifidStep2Data: string = "MMBKELNA045002"; //步驟2(取資料)電文名稱
  readonly ifidStep2Next: string = "MMBKELNA045003"; //步驟2(下一步)電文名稱
  i: number = 0;
  total: number;
  chkArray: checkBox[] = [];
  dataSource = [];
  newData = [];
  pageIndex = 1;
  debtBnkList = [];
  checkTotal: number = 0;
  checkTotalString: string;//預估總金額
  firstFlag: string;
  aplyintrt: number;
  tryCalculate: string;//預估每月還款金額
  readonly pageSize = 50;
  sgmtIntRtCnt: number;
  sgmtIntRtCntChange: string;
  addreset$: Subscription;
  hidden: boolean = false;//如果sgmIntRtCnt == 0就返回true
  constructor(
    private f06002Service: F06002Service,
    public dialog: MatDialog,
  ) {
    this.addreset$ = this.f06002Service.addreset$.subscribe((data) => {
      this.getData()
    });
  }

  // 檢核
  getData() {
    // 現金核准額度檢核
    if (this.lnLmtAmt == undefined) {
      this.lnLmtAmt == null;
    }
    if (this.lnLmtAmt == null) {
      sessionStorage.setItem('lnLmtAmt', '');
    } else {
      sessionStorage.setItem('lnLmtAmt', this.lnLmtAmt.toString());
    }
    // 現金申請額度檢核
    if (this.custLnAmt == undefined) {
      this.custLnAmt == null;
    }
    if (this.custLnAmt == null) {
      sessionStorage.setItem('custLnAmt', '');
      sessionStorage.setItem('custLnAmtcheck', this.custLnAmtcheck.toString());
    } else {
      sessionStorage.setItem('custLnAmt', this.custLnAmt.toString());
      sessionStorage.setItem('custLnAmtcheck', this.custLnAmtcheck.toString());
    }
    if (this.periodValue == null) {
      sessionStorage.setItem('periodValue', '');
    } else {
      sessionStorage.setItem('periodValue', this.periodValue.toString());
    }
    sessionStorage.setItem('prdcMinVal', this.prdcMinVal.toString());
    sessionStorage.setItem('prdcMaxVal', this.prdcMaxVal.toString());
    this.nextStep2();
  }
  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.getStep2Data();
    // this.getAplyintrt();
    // this.getAplyintrtData();
  }

  getStep2Data() {
    this.i = 1;
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['ifId'] = this.ifidStep2Data;
    this.f06002Service.stepHandle(jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        this.sgmtIntRtCnt = data.rspBody.sgmtIntRtCnt;
        this.sgmtIntRtCntChange = this.f06002Service.changeToCN(this.sgmtIntRtCnt);
        if (this.sgmtIntRtCnt == 0) { this.hidden = true; }
        this.intRt = data.rspBody.intRt;
        this.sgmtIntRt = data.rspBody.sgmtIntRt;
        this.lnLmtAmt = data.rspBody.lnLmtAmt == null ? 0 : data.rspBody.lnLmtAmt;
        if (this.lnLmtAmt.toString() == '0') { this.lnLmtAmtbool = true; }//現金核准額度為0 現金申請額度不可用
        this.lnLmtAmtstr = this.toCurrency(this.lnLmtAmt.toString());
        this.custLnAmt = data.rspBody.custLnAmt != null ? data.rspBody.custLnAmt : this.lnLmtAmt;
        this.custLnAmtstr = this.toCurrency(this.custLnAmt.toString());
        this.prdcMinVal = data.rspBody.lnPrdList[0].prdcMinVal;
        this.prdcMaxVal = data.rspBody.lnPrdList[0].prdcMaxVal;
        // 預設為授信核可的最大期數
        this.periodValue = data.rspBody.custLnPrd != null ? data.rspBody.custLnPrd : this.prdcMaxVal;
        this.periodValue = this.periodValue.toString();
        this.periodCode = this.f06002Service.periodCalculate(this.prdcMaxVal, this.prdcMinVal);
        if (this.periodCode != null && this.periodCode != []) {
          this.periodCode = this.periodCode.filter(c => c.value != '')
        }
        if (this.chkArray.length > 0) {
          let i: number = 0;
          for (const jsonObj of data.rspBody.debtConsolidation.debtBnkList) {
            const chkValue = jsonObj['bnkNm'];
            const isChk = jsonObj['sltdYn'];
            const lnAmt = jsonObj['lnAmt'];
            const debtBnkId = jsonObj['debtBnkId'];
            const bnkCd = jsonObj['bnkCd'];
            const dsbsYn = jsonObj['dsbsYn'];
            this.chkArray[i] = { bnkNm: chkValue, sltdYn: isChk == 'Y', lnAmt: lnAmt, debtBnkId: debtBnkId, bnkCd: bnkCd, dsbsYn: dsbsYn };
            this.calculate1(isChk == 'Y' ? true : false, lnAmt, 'Y', this.custLnAmt);
            i++;
          }
        } else {
          for (const jsonObj of data.rspBody.debtConsolidation.debtBnkList) {
            const chkValue = jsonObj['bnkNm'];
            const isChk = jsonObj['sltdYn'];
            const lnAmt = jsonObj['lnAmt'];
            const debtBnkId = jsonObj['debtBnkId'];
            const bnkCd = jsonObj['bnkCd'];
            const dsbsYn = jsonObj['dsbsYn'];
            this.chkArray.push({ bnkNm: chkValue, sltdYn: isChk == 'Y', lnAmt: lnAmt, debtBnkId: debtBnkId, bnkCd: bnkCd, dsbsYn: dsbsYn });
            this.calculate1(isChk == 'Y' ? true : false, lnAmt, 'Y', this.custLnAmt);
          }
        }
        this.dataSource = data.rspBody.debtConsolidation.debtBnkList;
      }

      this.getAplyintrtData();
    });
  }

  nextStep2() {
    let jsonObjectdebtConsolidation: any = {};
    let array: any = [];
    for (let index = 0; index < this.chkArray.length; index++) {
      let json: any = {};
      json['bnkNm'] = this.chkArray[index].bnkNm;
      json['sltdYn'] = this.chkArray[index].sltdYn;
      json['lnAmt'] = this.chkArray[index].lnAmt;
      json['debtBnkId'] = this.chkArray[index].debtBnkId;
      json['bnkCd'] = this.chkArray[index].bnkCd;
      array.push(json);
    }
    jsonObjectdebtConsolidation['lnLmtAmt'] = this.custLnAmt;
    jsonObjectdebtConsolidation['lnPrd'] = this.periodValue;
    jsonObjectdebtConsolidation['debtBnkListCnt'] = this.chkArray.length;
    jsonObjectdebtConsolidation['debtBnkList'] = array;
    let jsonObject: any = {};
    jsonObject['debtConsolidation'] = jsonObjectdebtConsolidation;
    jsonObject['applno'] = this.applno;
    jsonObject['ifId'] = this.ifidStep2Next;
    sessionStorage.setItem('jsonObjForStep2', JSON.stringify(jsonObject));
    sessionStorage.setItem('chkArray', JSON.stringify(this.chkArray));
  }

  //+逗號
  toCurrency(data: string) {
    return data != null ? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : data;
  }

  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\d]/g, '') : data;
  }

  // 計算每月還款金額試算(由checkbox處理)
  calculate1(completed: boolean, value: number, flag: string, org: number) {
    let data: number;
    if (!this.custLnAmtbool) {
      this.checkTotal = this.checkTotal + parseInt(org.toString());
      this.checkTotalString = this.toCurrency(this.checkTotal + '');
      this.custLnAmtbool = true;
    }

    if (!isNaN(data = parseInt(value.toString()))) {
      if (completed) {
        this.checkTotal = this.checkTotal + parseInt(value.toString());
        this.checkTotalString = this.toCurrency(this.checkTotal + '');
      } else {
        if (flag != 'Y') {
          this.checkTotal = this.checkTotal - parseInt(this.toNumber(value.toString()));
          this.checkTotalString = this.toCurrency(this.checkTotal + '');
        }
      }
    }
    this.getAplyintrtData();
  }

  // 計算預估總貸款金額試算(由input處理)
  calculate2(b: boolean) {
    if (b) {
      var z = this.custLnAmtstr;
      var x = this.toNumber(z);//去符號
      var y = this.toCurrency(x);//+逗號
      this.custLnAmt = parseInt(x.toString()).toString() == 'NaN' ? 0 : parseInt(x.toString());//去掉數字前面的0
      this.custLnAmtstr = this.custLnAmt == 0 ? '0' : this.toCurrency(this.custLnAmt.toString());
    } else {
      this.custLnAmt = 0;
      this.custLnAmtstr = '0';
    }

    let num = 0;
    for (let i = 0; i < this.chkArray.length; i++) {
      if (this.chkArray[i].sltdYn == true) {
        num = num + parseInt(this.chkArray[i].lnAmt);
      }
      var a = 0;
      a = Number(this.custLnAmt) + num;
      this.checkTotalString = this.toCurrency(a + '')
      this.checkTotal = a;
    }
    this.getAplyintrtData();
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

  // 取利率
  getAplyintrt() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['ifId'] = 'MMBKELNA043001';
    this.f06002Service.stepHandle(jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        this.aplyintrt = data.rspBody.aplyintrt;
        this.aplyintrt = data.rspBody.debtConsolidation.aplyintrt;
      }
    });
  }

  // 取值每月還款金額試算
  getAplyintrtData() {
    const totalApplyAmt = this.toNumber(this.checkTotalString);
    if (this.periodValue == null || this.intRt == null || totalApplyAmt == null) {
      return;
    }
    const monthRate = parseFloat(this.intRt) / (100 * 12);
    return this.tryCalculate = this.toCurrency(Math.round(((parseInt(totalApplyAmt, 10) * monthRate * Math.pow((1 + monthRate), Number(this.periodValue))) / (Math.pow((1 + monthRate), Number(this.periodValue)) - 1))).toString());

  }

  // Y,N,true,false轉換
  changeYN(value: string) {
    if (value === 'Y') {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.addreset$.unsubscribe();
  }


}
