import { Component, OnInit } from '@angular/core';
import { F06002Service } from '../f06002.service';
import { F06004Service } from '../../f06004/f06004.service';
@Component({
  selector: 'app-f06002page3',
  templateUrl: './f06002page3.component.html',
  styleUrls: ['./f06002page3.component.css']
})
export class F06002page3Component implements OnInit {
  test=[1,2,3,4,5,6,7,8,9,10,11,12]
  strgy: string //方案
  pageSize = 50;
  pageIndex = 1;
  total = 0;
  applno: string //案編
  cuCname: string //姓名
  custId: string //客戶ID
  nationalId: string //身分證字號
  prodName: string //申請產品
  aprvDebtAmt: string //BT核准額度
  dsbsacctnbr: string //撥款帳號
  rpayacctnbr: string //還款帳號
  aprvInstCashAmt: string //現金撥款核准額度
  ajstlnamt: string //現金撥款申請額度
  period: string //期數
  monthLowAmt: string //每月還款金額
  debtData = []; //代償明細
  settleAmt: number=0//結清金額加總
  checkOptionsForStep3 = this.f06002Service.checkOptionsForStep3;
  additionalInfoData = []; //利率異動通知
  oanotiyn: string//Line訊息通知
  pushnotiyn: string//推播
  emalnotiyn: string//email
  applicationDebtStrgy: string //方案
  settleDate: string//結清日
  newSettleDate: string//新結清日
  branchName: string //撥款銀行分行
  bankName: string//撥款銀行
  rpaybankName: string //還款銀行
  //關係人
  relCode: any = this.f06002Service.relCode;//關係人代碼
  rcaData = [] //關係人資料
  constructor(
    private f06002Service: F06002Service,
    public f06004Service: F06004Service,
  ) { }

  ngOnInit(): void {
for(var data of this.test){
  var total = 0
  total=total+data
}
console.log(total)
    this.applno = sessionStorage.getItem('applno')
    this.strgy = sessionStorage.getItem('strgy')
    console.log(this.strgy)
    this.getData()
    this.getStep3Data()
  }
  getData() {
    let jsonObject: any = {};
    let baseUrl = 'f06/f06004action2';
    jsonObject['applno'] = this.applno;
    this.f06004Service.getData(baseUrl, jsonObject).subscribe(data => {
      console.log(data)
      this.prodName = data.rspBody.applictionInfo[0].PROD_CODE + data.rspBody.applictionInfo[0].PROD_NAME;
      this.aprvDebtAmt = data.rspBody.applictionInfo[0].APRV_DEBT_AMT ? this.f06004Service.toCurrency(data.rspBody.applictionInfo[0].APRV_DEBT_AMT.toString()) : '';
      this.dsbsacctnbr = data.rspBody.applictionInfo[0].DSBSACCTNBR ? data.rspBody.applictionInfo[0].DSBSACCTNBR : '';
      this.rpayacctnbr = data.rspBody.applictionInfo[0].RPAYACCTNBR ? data.rspBody.applictionInfo[0].RPAYACCTNBR : '';
      this.aprvInstCashAmt = data.rspBody.applictionInfo[0].APRV_INST_CASH_AMT != null ? this.f06004Service.toCurrency(data.rspBody.applictionInfo[0].APRV_INST_CASH_AMT.toString()) : '0';
      this.ajstlnamt = data.rspBody.applictionInfo[0].AJSTLNAMT != null ? this.f06004Service.toCurrency(data.rspBody.applictionInfo[0].AJSTLNAMT.toString()) : '0'
      this.period = data.rspBody.applictionInfo[0].PERIOD ? data.rspBody.applictionInfo[0].PERIOD.toString() : '';
      this.monthLowAmt = data.rspBody.monthLowAmt != null ? this.f06004Service.toCurrency(data.rspBody.monthLowAmt.toString()) : '';
      this.custId = data.rspBody.applictionInfo[0].CUST_ID ? data.rspBody.applictionInfo[0].CUST_ID : '';
      this.nationalId = data.rspBody.applictionInfo[0].NATIONAL_ID ? data.rspBody.applictionInfo[0].NATIONAL_ID : '';
      this.cuCname = data.rspBody.applictionInfo[0].CU_CNAME ? data.rspBody.applictionInfo[0].CU_CNAME : '';
      if(data.rspBody.debtBankDetail!=null){
      }
      this.debtData = data.rspBody.debtBankDetail;
      for (var data of data.rspBody.debtBankDetail) {
        this.settleAmt =this.settleAmt+data.SETTLE_AMT
    }
        
    }
    )
  }
  getStep3Data() {
    let jsonObject: any = {};
    let baseUrl = 'f06/f06004action12';
    jsonObject['applno'] = this.applno;
    this.f06004Service.getData(baseUrl, jsonObject).subscribe(data => {
      console.log(data)
      this.bankName = data.rspBody.bankName
      this.branchName = data.rspBody.branchName
      this.rpaybankName = data.rspBody.rpaybankName
      this.rcaData = data.rspBody.rcaData
      this.additionalInfoData = data.rspBody.additionalInfoData[0]
      this.settleDate = data.rspBody.additionalInfoData[0].settleDate
      if (this.settleDate) {
        const year = this.settleDate.substring(0, 4)
        const month = this.settleDate.substring(4, 6)
        const day = this.settleDate.substring(6, 8)
        this.newSettleDate = (year + '-' + month + '-' + day)
      }
      this.applicationDebtStrgy = data.rspBody.additionalInfoData[0].applicationDebtStrgy
      this.oanotiyn = data.rspBody.additionalInfoData[0].oanotiyn
      this.pushnotiyn = data.rspBody.additionalInfoData[0].pushnotiyn
      this.emalnotiyn = data.rspBody.additionalInfoData[0].emalnotiyn
  
    })
  }
  //關係人代碼轉換
  relationChange(value: string) {
    for (let item of this.relCode) {
      if (value == item.value) {

        return item.viewValue
      }
    }
  }
  //核准方案轉換中文
  strgyChange(value: string) {
    if (value == '01') {
      return '新貸'
    } else {
      if (Number(this.ajstlnamt) > 0) {
        return '轉貸+新貸'
      } else {
        return '轉貸'
      }
    }
  }
}
