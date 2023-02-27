import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NzBreakpointService } from 'ng-zorro-antd/core/services';
import { Subscription, VirtualTimeScheduler } from 'rxjs';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F06004Service } from 'src/app/f06004/f06004.service';
import { F06002Service } from '../../f06002.service';

interface checkBox {
  bnkNm: string;
  sltdYn: boolean;
  lnAmt: string;
  debtBnkId: string;
  bnkCd: string;
  dsbsYn: string;
}
@Component({
  selector: 'app-f06002page2step3',
  templateUrl: './f06002page2step3.component.html',
  styleUrls: ['./f06002page2step3.component.css']
})
export class F06002page2step3Component implements OnInit {

  constructor(
    private f06002Service: F06002Service,
    public dialog: MatDialog,
    public f06004Service: F06004Service,
    private F06002Service: F06002Service
  ) {
    this.addreset$ = this.f06002Service.addreset$.subscribe((data) => {
      this.getData()
    });
  }

  applno: string;
  applicationDebtStrgy: string;
  readonly ifidStep3_1Data: string = "MMBKELNA043001"; //步驟3(取資料)電文名稱(現金)
  readonly ifidStep3_2Data: string = "MMBKELNA045002"; //步驟3(取資料)電文名稱(債整)
  readonly ifidStep3_2Next: string = "MMBKELNA043006"; //步驟3(下一步)電文名稱
  mmbkeln043006Data = [];
  hidden: boolean;
  hiddenApplyInfo: boolean = false;
  rpayBnkCd: string = '824'; //linebank銀行代號
  rpayAcctNbrForStep3: string; //還款帳號
  rpayAcctNbrForStep3Code: any[] = []; //還款帳號下拉
  rcaInfoListCnt: string;
  prodNameForStep3: string;//產品名稱
  loanForStep3: string;//合約條款版控
  lnPrdForStep3: string;//貸款期限
  mergDebitAmtForStep3: number = 0;//債整貸款金額
  mergDebitAmtForStep3str: string;//債整貸款金額 畫面用
  tryCalculateForStep3: string;//每月還款金額試算
  //=============================================
  lnLmtAmtForStep3: number;//現金核准額度
  lnLmtAmtForStep3str: string;//現金核准額度 畫面用
  custLnAmtForStep3: number;//現金申請額度
  custLnAmtForStep3str: string;//現金申請額度 畫面用
  chkArray: checkBox[] = [];
  prdcMinValForStep3: number;//現金貸款期限最小值
  prdcMaxValForStep3: number;//現金貸款期限最大值
  periodValueForStep3: number;//現金貸款期限
  custLnAmtcheck: boolean = true; //現金申請額度 是否啟用
  periodCodeForStep3 = [];//現金貸款期限下拉
  intrtForStep3: number;//現金利率
  bcnListCode: any[] = []; //銀行下拉
  bcnValueForStep3: string = ''; //銀行名
  bbCListCode: any[] = []; //分行別下拉
  bbcValueForStep3: string = ''; //分行別值
  disabled: boolean = true;
  acctOriginNbrForStep3: string = '';//原始撥款帳號
  acctNbrForStep3: string = '';//撥款帳號
  acctNbrForStep3Code: any[] = []; //撥款帳號下拉
  checkAccountCode: any[] = [];//撥款帳號確認
  accountNameForStep3: string;//撥款帳號戶名
  acctNbrForStep3bool: boolean = true;//撥款帳號 下拉選單/手填切換
  // 關係人
  rcaInfo = [];
  lnRltdPrsnTpCdForStep3: string = ''; //同一關係人關係
  lnAppRltdPrsnNmForStep3: string = ''; //同一關係人姓名
  natlIdForStep3: string = ''; //同一關係人身分證號
  jobTitlNmForStep3: string = ''; //同一關係人公司名稱
  taxIdForStep3: string = ''; //同一關係人公司統一編號
  rmkContForStep3: string = ''; //同一關係人公司備註
  checkOptionsForStep3 = this.f06002Service.checkOptionsForStep3;
  listBoolean: boolean;
  relCode = this.f06002Service.relCode;
  memberType: string;//客戶等級
  addreset$: Subscription;
  newAccNbr: string;
  lineId: boolean;
  block: boolean = false;
  checkRca: boolean = true;
  rcaCount = {
    '02': 1,
    '03': 2,
    '04': 2,
    '05': 100,
    '06': 100,
    '07': 100,
    '08': 1,
    '09': 1
  };

  ngOnInit() {
    sessionStorage.setItem('mergDebitAmtForStep3', '');
    this.applno = sessionStorage.getItem('applno');
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.block = true;
    this.f06002Service.getCreditmainInfo(jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        this.applicationDebtStrgy = data.rspBody.applicationDebtStrgy;
        this.accountNameForStep3 = data.rspBody.cuCname;
        this.memberType = data.rspBody.type;
        sessionStorage.setItem('strgy', this.applicationDebtStrgy);
        this.hidden = this.applicationDebtStrgy == '03' ? false : true;
        this.f06002Service.getLineId(jsonObject).subscribe(data => {
          this.lineId = data.rspBody;
        });
        // 01純現金
        if (this.applicationDebtStrgy === '01') {
          this.rcaInfo = [];
          let jsonObject: any = {};
          jsonObject['applno'] = this.applno;
          jsonObject['ifId'] = this.ifidStep3_1Data;
          this.f06002Service.stepHandle(jsonObject).subscribe(data => {
            if (data.rspCode == '0000') {
              this.lnPrdForStep3 = data.rspBody.lnPrd;
              this.lnLmtAmtForStep3 = data.rspBody.lnLmtAmt == null ? 0 : data.rspBody.lnLmtAmt;//純現金核准額度
              this.lnLmtAmtForStep3str = this.toCurrency(this.lnLmtAmtForStep3.toString());//純現金核准額度 畫面用
              this.custLnAmtForStep3 = this.lnLmtAmtForStep3;//純現金申請額度直接預設為純現金核准額度
              this.custLnAmtForStep3str = this.toCurrency(this.custLnAmtForStep3.toString());//純現金申請額度直接預設為純現金核准額度 畫面用
              this.prdcMinValForStep3 = data.rspBody.lnPrdList[0].prdcMinVal;
              this.prdcMaxValForStep3 = data.rspBody.lnPrdList[0].prdcMaxVal;
              this.periodCodeForStep3 = this.f06002Service.periodCalculate(this.prdcMaxValForStep3, this.prdcMinValForStep3);
              if (this.periodCodeForStep3 != null && this.periodCodeForStep3.length > 0) {
                this.periodCodeForStep3 = this.periodCodeForStep3.filter(c => c.value != '');
              }
              this.periodValueForStep3 = this.prdcMaxValForStep3;// 預設為授信核可的最大期數
              this.intrtForStep3 = data.rspBody.aplyIntRt;//純現金利率(目前只有純現金需要利率)
              if ((this.custLnAmtForStep3 <= this.lnLmtAmtForStep3) && this.lnLmtAmtForStep3 >= 1000000) {
                this.rcaInfo.push({
                  relCode: this.relCode,
                  lnRltdPrsnTpCd: '', // 同一關係人關係
                  lnAppRltdPrsnNm: '', // 同一關係人姓名
                  natlId: null, // 同一關係人身分證號
                  jobTitlNm: '', // 同一關係人公司名稱
                  taxId: null, // 同一關係人公司統一編號
                  rmkCont: '' // 同一關係人公司備註
                });
              }
              this.getAplyintrtData();
            }
          });
          // 03債整
        } else if (this.applicationDebtStrgy === '03') {
          this.rcaInfo = [];
          let jsonObject: any = {};
          jsonObject['applno'] = this.applno;
          jsonObject['ifId'] = this.ifidStep3_2Data;
          this.f06002Service.stepHandle(jsonObject).subscribe(data => {
            if (data.rspCode == '0000') {
              this.custLnAmtForStep3 = data.rspBody.custLnAmt == null ? 0 : data.rspBody.custLnAmt;
              this.custLnAmtForStep3str = this.toCurrency(this.custLnAmtForStep3.toString());//純現金申請額度直接預設為純現金核准額度 畫面用
              if (this.custLnAmtForStep3 == 0) { this.hiddenApplyInfo = true; }
              this.mergDebitAmtForStep3 = data.rspBody.sumAmt == null ? 0 : data.rspBody.sumAmt;
              this.mergDebitAmtForStep3str = this.toCurrency(this.mergDebitAmtForStep3.toString());//純現金申請額度直接預設為純現金核准額度 畫面用
              this.lnPrdForStep3 = data.rspBody.custLnPrd;
              if ((this.mergDebitAmtForStep3 + this.custLnAmtForStep3) >= 1000000) {
                // sessionStorage.setItem('mergDebitAmtForStep3',this.mergDebitAmtForStep3.toString());
                this.rcaInfo.push({
                  relCode: this.relCode,
                  lnRltdPrsnTpCd: '', // 同一關係人關係
                  lnAppRltdPrsnNm: '', // 同一關係人姓名
                  natlId: null, // 同一關係人身分證號
                  jobTitlNm: '', // 同一關係人公司名稱
                  taxId: null, // 同一關係人公司統一編號
                  rmkCont: '' // 同一關係人公司備註
                });
              }
            }
          });
        }
      }
      this.getAccountData(this.memberType);
      this.getBankCode2863(this.memberType);
    });
    this.block = false;
    this.getDsbsbrcdCode();
    sessionStorage.setItem('lnRltdPrsnTpCd', '');
  }

  ngOnDestroy() {
    this.addreset$.unsubscribe();
  }

  nextStep3() {
    this.rcaCount = {
      '02': 1,
      '03': 2,
      '04': 2,
      '05': 100,
      '06': 100,
      '07': 100,
      '08': 1,
      '09': 1
    };
    let jsonObjectRcaInfo: any = {};
    let jsonObjectMmbkeln043006Data: any = {};
    let array: any = [];
    jsonObjectMmbkeln043006Data['rcaInfoListCnt'] = 0;
    if (this.rcaInfo.length != 0)
     {
      for (let item of this.rcaInfo) {
        if (item.lnRltdPrsnTpCd === '' || item.lnRltdPrsnTpCd === '01') {
          continue;
        }
        jsonObjectRcaInfo = {};
        jsonObjectRcaInfo['lnRltdPrsnTpCd'] = item.lnRltdPrsnTpCd;
        jsonObjectRcaInfo['lnAppRltdPrsnNm'] = item.lnAppRltdPrsnNm;
        jsonObjectRcaInfo['natlId'] = item.natlId;
        jsonObjectRcaInfo['jobTitlNm'] = item.jobTitlNm;
        jsonObjectRcaInfo['taxId'] = item.taxId;
        jsonObjectRcaInfo['rmkCont'] = item.rmkCont;
        jsonObjectMmbkeln043006Data['rcaInfoListCnt'] += 1;
        this.rcaCount[item.lnRltdPrsnTpCd] -= 1;
        if (this.rcaCount[item.lnRltdPrsnTpCd] < 0) {
          this.rcaCount = {
            '02': 1,
            '03': 2,
            '04': 2,
            '05': 100,
            '06': 100,
            '07': 100,
            '08': 1,
            '09': 1
          };
          this.f06002Service.setCheckSrp('同一關係人: ' + this.relCode.find(v => v.value == item.lnRltdPrsnTpCd).viewValue + ' 限制數量為 ' + this.rcaCount[item.lnRltdPrsnTpCd] + '筆');
          return;
        }
        array.push(jsonObjectRcaInfo);
      }
      jsonObjectMmbkeln043006Data['rcaInfo'] = array;
    }
    for (let p of this.rcaInfo)
    {
      if (p.lnRltdPrsnTpCd != '') {
        if (jsonObjectMmbkeln043006Data['rcaInfoListCnt'] == 0) {
          // 若沒有填同一關係人，則塞一筆本人資料
          jsonObjectMmbkeln043006Data['rcaInfo'] = [{
            lnRltdPrsnTpCd: '01', // 本人
            lnAppRltdPrsnNm: this.accountNameForStep3, // 同一關係人姓名
            natlId: this.F06002Service.getCustomerId(), // 同一關係人身分證號
            jobTitlNm: '', // 同一關係人公司名稱
            taxId: null, // 同一關係人公司統一編號
            rmkCont: '' // 同一關係人公司備註
          }];
          jsonObjectMmbkeln043006Data['rcaInfoListCnt'] = 1;
          array.push(jsonObjectRcaInfo);
        }
        else {
          // 先檢查是否都有填寫，排除只有一筆且未填寫資料的情況
          if (!this.checkIsFilled()) {
            this.f06002Service.setCheckSrp('同一關係人各欄位均需填寫');
            return;
          }
        }
      }
      else {
        this.f06002Service.setCheckSrp('請選擇關係人');
        return;
      }
    }

    // 如果是純債整不送以下三個欄位
    if(this.custLnAmtForStep3 == 0 && this.applicationDebtStrgy == '03'){
      this.bcnValueForStep3 = '';
      this.bbcValueForStep3 = '';
      this.acctNbrForStep3 = '';
    }
    jsonObjectMmbkeln043006Data['lnAppId'] = this.applno;
    jsonObjectMmbkeln043006Data['dsbsBnkCd'] = this.bcnValueForStep3;
    jsonObjectMmbkeln043006Data['dsbsBrCd'] = this.bbcValueForStep3;
    jsonObjectMmbkeln043006Data['dsbsAcctNbr'] = this.acctNbrForStep3;
    jsonObjectMmbkeln043006Data['rpayBnkCd'] = this.rpayBnkCd;
    jsonObjectMmbkeln043006Data['rpayAcctNbr'] = this.rpayAcctNbrForStep3;
    jsonObjectMmbkeln043006Data['oaNotiYn'] = this.changeYN(this.checkOptionsForStep3[0].checked);
    jsonObjectMmbkeln043006Data['emalNotiYn'] = this.changeYN(this.checkOptionsForStep3[1].checked);
    jsonObjectMmbkeln043006Data['pushNotiYn'] = this.changeYN(this.checkOptionsForStep3[2].checked);
    jsonObjectMmbkeln043006Data['ajstLnAmt'] = this.custLnAmtForStep3;
    jsonObjectMmbkeln043006Data['sltdDebtOptCd'] = this.applicationDebtStrgy;
    // 期數
    if (this.applicationDebtStrgy === '03') {
      jsonObjectMmbkeln043006Data['lnPrd'] = this.lnPrdForStep3;
    } else if ((this.applicationDebtStrgy === '01')) {
      jsonObjectMmbkeln043006Data['lnPrd'] = this.periodValueForStep3;
    }
    let jsonObject: any = {};
    jsonObject['mmbkeln043006Data'] = jsonObjectMmbkeln043006Data;
    jsonObject['ifId'] = this.ifidStep3_2Next;
    jsonObject['lnAppAmt'] = this.lnLmtAmtForStep3;
    sessionStorage.setItem('jsonObjForStep3', JSON.stringify(jsonObject));
  }

  getAccountData(memberTpe: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.f06002Service.getAccount(jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        this.loanForStep3 = data.rspBody.OutboundField.LOAN;
        this.prodNameForStep3 = data.rspBody.OutboundField.PROD_NAME;
        this.listBoolean = data.rspBody.dpstAcctList;
        if (data.rspBody.dpstAcctList) {
          for (let index = 0; index < data.rspBody.dpstAcctList.length; index++) {
            this.acctNbrForStep3Code.push({ value: data.rspBody.dpstAcctList[index].acctNbr, viewValue: data.rspBody.dpstAcctList[index].acctNbr });
            this.rpayAcctNbrForStep3Code.push({ value: data.rspBody.dpstAcctList[index].acctNbr, viewValue: data.rspBody.dpstAcctList[index].acctNbr });
            this.checkAccountCode.push({ value: data.rspBody.dpstAcctList[index].acctNbr, viewValue: data.rspBody.dpstAcctList[index].acctNbr });
          }
        }
        if (memberTpe == '2') {
          this.acctNbrForStep3 = data.rspBody.dpstAcctList[0].acctNbr;
          this.bcnValueForStep3 = '824';
          this.bbcValueForStep3 = '6880';
          this.acctOriginNbrForStep3 = this.acctNbrForStep3;
        }
        this.rpayAcctNbrForStep3 = data.rspBody.dpstAcctList[0].acctNbr;
        this.getDsbsbrcdCode();
      }
    });
  }

  // 取值每月還款金額試算
  getAplyintrtData() {
    var z = this.custLnAmtForStep3str;
    var x = this.toNumber(z);//去符號
    var y = this.toCurrency(x);//+逗號
    this.custLnAmtForStep3 = parseInt(x.toString()).toString() == 'NaN' ? 0 : parseInt(x.toString());//去掉數字前面的0
    this.custLnAmtForStep3str = this.custLnAmtForStep3 == 0 ? '0' : this.toCurrency(this.custLnAmtForStep3.toString());
    if (this.applicationDebtStrgy === '01') {
      this.rcaInfo = [];
      if (((parseInt(x)) <= this.lnLmtAmtForStep3) && parseInt(x) >= 1000000) {
        this.rcaInfo.push({
          relCode: this.relCode,
          lnRltdPrsnTpCd: '', // 同一關係人關係
          lnAppRltdPrsnNm: '', // 同一關係人姓名
          natlId: null, // 同一關係人身分證號
          jobTitlNm: '', // 同一關係人公司名稱
          taxId: null, // 同一關係人公司統一編號
          rmkCont: '' // 同一關係人公司備註
        });
      }
      else {
        this.rcaInfo = [];
      }
    }
    if (this.periodValueForStep3 == null || this.intrtForStep3 == null || this.custLnAmtForStep3 == null) {
      return;
    }
    const monthRate = this.intrtForStep3 / (100 * 12);
    return this.tryCalculateForStep3 = this.toCurrency(Math.round(((this.custLnAmtForStep3 * monthRate * Math.pow((1 + monthRate), this.periodValueForStep3)) / (Math.pow((1 + monthRate), this.periodValueForStep3) - 1))).toString());
  }

  // Y,N,true,false轉換
  changeYN(value: boolean) {
    if (value) {
      return 'Y';
    } else {
      return 'N';
    }
  }

  // 取分行下拉選項
  async getDsbsbrcdCode() {
    let jsonObject: any = {};
    jsonObject['bnkCd'] = this.bcnValueForStep3;
    // this.bbCListCode.push({ value: '', viewValue: '請選擇' })
    // this.bbCListCode.push({ value: '6880', viewValue: '總行' })
    await this.f06002Service.getDsbsbrcdCode(jsonObject).toPromise()
      .then(data => {
        //分行別下拉
        this.bbCListCode = [];
        for (const jsonObj of data.rspBody) {
          const codeNo = jsonObj.branchCd;
          const desc = jsonObj.branchNm;
          this.bbCListCode.push({ value: codeNo, viewValue: desc })
        }
      })
    // this.bbcValueForStep3 = '';
  }

  // 判斷同一關係人關係是否解開下拉選項
  handleRelCode(rcalInfo: any) {
    const relCodeType = this.relCode.find(v => v.value === rcalInfo.lnRltdPrsnTpCd).group;
    if (relCodeType === 'X') {
      rcalInfo.taxId = null;
      rcalInfo.jobTitlNm = '';
      rcalInfo.rmkCont = '';
    } else if (relCodeType === 'B') {
      rcalInfo.natlId = null;
    }
    return relCodeType;
  }

  // 判斷帳號與linebank連動邏輯,若為本行帳號,則銀行代碼為824,分行代碼為6880
  checkAcctNbr() {
    var x: Boolean = false;
    for (const item of this.checkAccountCode) {
      if (item.value == this.acctNbrForStep3) {
        this.bcnValueForStep3 = '824';
        this.getDsbsbrcdCode();
        x = true;
      }
    }
    if (!x) {
      this.bbCListCode = [];
      this.bcnValueForStep3 = '';
      this.bbcValueForStep3 = '';
    }
  }

  // 取電文2863銀行下拉
  getBankCode2863(memberType: string) {
    let jsonObject: any = {};
    this.bcnListCode.push({ value: '', viewValue: '請選擇' });
    if(memberType == '2'){
      this.bcnListCode.push({ value: '824', viewValue: '連線銀行' });
    }
    this.f06002Service.getBankCode(jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        for (const jsonObj of data.rspBody) {
          const codeNo = jsonObj.bnkCd;
          const desc = jsonObj.bnkNm;
          this.bcnListCode.push({ value: codeNo, viewValue: desc });
        }
      }
    });
  }

  // 檢核
  getData() {
    // 現金核准額度檢核
    if (this.lnLmtAmtForStep3 == undefined) {
      this.lnLmtAmtForStep3 == null;
    }
    if (this.lnLmtAmtForStep3 == null) {
      sessionStorage.setItem('lnLmtAmtForStep3', '');
    } else {
      sessionStorage.setItem('lnLmtAmtForStep3', this.lnLmtAmtForStep3.toString());
    }
    // 現金申請額度檢核
    if (this.custLnAmtForStep3 == undefined) {
      this.custLnAmtForStep3 == null;
    }
    if (this.custLnAmtForStep3 == null) {
      sessionStorage.setItem('custLnAmtForStep3', '');
    } else {
      sessionStorage.setItem('custLnAmtForStep3', this.custLnAmtForStep3.toString());
    }
    // 銀行別檢核
    if (this.bcnValueForStep3 == '' || this.bcnValueForStep3 == null || this.bcnValueForStep3 == undefined) {
      sessionStorage.setItem('bcnValueForStep3', '');
    } else {
      sessionStorage.setItem('bcnValueForStep3', this.bcnValueForStep3);
    }
    // 分行別檢核
    if (this.bbcValueForStep3 == '' || this.bbcValueForStep3 == null) {
      sessionStorage.setItem('bbcValueForStep3', '');
    } else {
      sessionStorage.setItem('bbcValueForStep3', this.bbcValueForStep3);
    }
    // 期數(現金)檢核
    if (this.periodValueForStep3 == null) {
      sessionStorage.setItem('periodValueForStep3', '');
    } else {
      sessionStorage.setItem('periodValueForStep3', this.periodValueForStep3.toString());
    }
    // 原撥款帳號
    if (this.acctOriginNbrForStep3 == null || this.acctOriginNbrForStep3 == undefined || this.acctOriginNbrForStep3 == '') {
      sessionStorage.setItem('acctOriginNbrForStep3', '');
    } else {
      sessionStorage.setItem('acctOriginNbrForStep3', this.acctOriginNbrForStep3);
    }
    // 自行輸入撥款帳號
    if (this.acctNbrForStep3 == null || this.acctNbrForStep3 == undefined || this.acctNbrForStep3 == '') {
      sessionStorage.setItem('acctNbrForStep3', '');
    } else {
      sessionStorage.setItem('acctNbrForStep3', this.acctNbrForStep3);
    }
    this.nextStep3();
  }

  // 債整 + 現金disable
  checkCustLnAmtForStep3() {
    if (this.applicationDebtStrgy === '03') {
      return true;
    }
  }

  addAccNbr(acc: string, who: string) {
    if (acc == '' || acc == null) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '自訂帳號不可為空!' }
      });
    } else {
      switch (who) {
        case 'd':
          this.acctNbrForStep3Code.push({ value: acc, viewValue: acc });
          break;
        case 'r':
          this.acctNbrForStep3Code.push({ value: acc, viewValue: acc });
          break;
      }
      this.newAccNbr = '';
    }
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

  addRcal() {
    this.rcaInfo.push({
      relCode: this.relCode,
      lnRltdPrsnTpCd: '', // 同一關係人關係
      lnAppRltdPrsnNm: '', // 同一關係人姓名
      natlId: '', // 同一關係人身分證號
      jobTitlNm: '', // 同一關係人公司名稱
      taxId: '', // 同一關係人公司統一編號
      rmkCont: '' // 同一關係人公司備註
    });
  }

  deleteSrp(index: number) {
    this.rcaInfo.splice(index, 1);
  }

  checkRcalLength() {
    return this.rcaInfo.length > 1 ? true : false;
  }

  toCurrency(data: string) {
    return data != null ? data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : data;
  }

  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\d]/g, '') : data;
  }

  async checkIs824(type: string) {
    if (type === 'checkAcct') {
      await this.getDsbsbrcdCode();
      if (this.bbCListCode.length == 1) {
        if (this.bcnValueForStep3 == '824') {
          this.bbcValueForStep3 = '6880'
          this.acctNbrForStep3 = this.acctOriginNbrForStep3;
        } else {
          this.bbcValueForStep3 = this.bbCListCode[0].value;
        }
      }
    } else if (type === 'checkBank') {
      await this.getDsbsbrcdCode();
      if (this.acctNbrForStep3 == this.acctOriginNbrForStep3) {
        this.bcnValueForStep3 = '824';
        this.bbcValueForStep3 = '6880';
      }
    }
  }

  // 計算預估總貸款金額試算(由input處理)
  calculate2(b: boolean) {
    sessionStorage.setItem('custLnAmtcheck', this.custLnAmtcheck.toString());
    if (b) {
      var z = this.custLnAmtForStep3str;
      var x = this.toNumber(z);//去符號
      var y = this.toCurrency(x);//+逗號
      this.custLnAmtForStep3 = parseInt(x.toString()).toString() == 'NaN' ? 0 : parseInt(x.toString());//去掉數字前面的0
      this.custLnAmtForStep3str = this.custLnAmtForStep3 == 0 ? '0' : this.toCurrency(this.custLnAmtForStep3.toString());
    }
    else {
      this.custLnAmtForStep3 = 0;
      this.custLnAmtForStep3str = '0';
    }
    this.getAplyintrtData();
  }


  checkIsFilled() {
    let isPassed = true;
    for (let item of this.rcaInfo) {
      if (item.lnRltdPrsnTpCd == '08' || item.lnRltdPrsnTpCd == '09') {
        if (item.lnAppRltdPrsnNm == '' || item.taxId == '' || item.taxId == null || item.jobTitlNm == '') {
          isPassed = false;
          break;
        }
      }
      else {
        if (item.lnRltdPrsnTpCd != '' && item.lnRltdPrsnTpCd != '01') {
          if (item.lnAppRltdPrsnNm == '' || item.natlId == '' || item.natlId == null) {
            isPassed = false;
            break;
          }
        }
      }
    }
    return isPassed;
  }

  empty(i: string, k: number) {
    if (i == '' || i == '01') {
      this.rcaInfo[k].lnAppRltdPrsnNm = '';
      this.rcaInfo[k].natlId = '';
      this.rcaInfo[k].lnAppRltdPrsnNm = '';
      this.rcaInfo[k].taxId = '';
      this.rcaInfo[k].jobTitlNm = '';
      this.rcaInfo[k].rmkCont = '';
    }
  }

  checkRcafn() {
    var z = this.custLnAmtForStep3str;
    var x = this.toNumber(z);//去符號
    if (this.applicationDebtStrgy == '01') {
      if (((parseInt(x)) <= this.lnLmtAmtForStep3) && parseInt(x) >= 1000000) {
        this.checkRca = false;
      } else {
        this.checkRca = true;
      }
    } else if (this.applicationDebtStrgy == '03') {
      if (this.mergDebitAmtForStep3 + parseInt(x) >= 1000000) {
        this.checkRca = false;
      } else {
        this.checkRca = true;
      }
    }
    return this.checkRca;
  }
}
