import { Sort } from '@angular/material/sort';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { F01008addComponent } from '../f01008add/f01008add.component'
import { F01008Service } from '../f01008.service';
import { Data, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01008deleteComponent } from '../f01008delete/f01008delete.component'
import { F01008scn2editComponent } from './f01008scn2edit/f01008scn2edit.component';
import { Childscn26Component } from 'src/app/children/childscn26/childscn26.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { OptionsCode } from 'src/app/interface/base';
import { BaseService } from 'src/app/base.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

interface sysCode {
  value: string;
  viewValue: string;
}
//Jay 審核資料
@Component({
  selector: 'app-f01008scn2',
  templateUrl: './f01008scn2.component.html',
  styleUrls: ['./f01008scn2.component.css', '../../../assets/css/child.css']
})



export class F01008scn2Component implements OnInit {

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public f01008Service: F01008Service,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    public pipe: DatePipe,) {
    this.JCICSource$ = this.f01008Service.JCICAddSource$.subscribe((data) => {
      if (!data.show) {
        this.set(); this.showAdd = false;
      }
    });
    this.JCICSource$ = this.f01008Service.JCICSource$.subscribe((data) => {
      if (!data.show) {
        this.set(); this.showEdit = false
      }
    })

  }


  applno: string;
  custId: string;
  cuCName: string;
  nationalId: string;
  prodCode: string;
  applicationAmount: string;
  caApplicationAmount: string;
  purposeCode: string;
  // resultLowestPayRate: number;
  //聯絡資訊
  cuMTel: string;
  cuHTelIno: string;
  cuHTel: string;
  cuCpTelIno: string;
  cuCpTel: string;
  cuMTelOther: string;
  contactOther: string;
  cuCpTelExt: string;
  choose:string = '' ;//選擇人員
  chooseList :sysCode[] = [];//選擇人員陣列
  i: string;
  page = 1;
  pei_page = 50;
  dataSource: Data[] = [];
  tYPE: sysCode[] = [];
  cONDITION: sysCode[] = [];
  search: string;
  ma: string;
  empNo: string;//員編
  macrSource: Data[] = [];
  showAdd: boolean = false;
  showEdit: boolean = false;
  Sendcheck: string;
  jaicSource: Data[] = [];
  block: boolean = false;
  jcicNumb = 0;
  level: string;
  lv: string;
  caRisk: string;//人員記錄-風險等級
  caPmcus: string;//人員記錄-PM策略客群
  sortArry = ['ascend', 'descend']
  quota: string;//額度
  repayment: number;//還款
  aprvDebtAmt: string;//債整核准額度
  strgy2AprvAmt: string;//總核准額度
  aprvInstCashAmt: string;//現金核准額度
  strgy1CashAprvAmt: string;//現金核准額度 = 總核准額度
  strgy1CashAprvAmt1: string;//總核准額度
  approvedDebtStrgy: string = '';//核可債整方案
  CreditInterestPeriodSource: Data[] = [];//多階利率
  strgy1AprvLoanextfee: string = '';//帳戶管理費
  //判斷是否更新表單
  JCICSource$: Subscription;
  approvedDebtStrgyCode: OptionsCode[] = [];//核可債整方案下拉選單
  creditResultCode: OptionsCode[] = [];//核決結果下拉選單
  periodTypeCode: OptionsCode[] = [];//期別下拉選單
  interestTypeCode: OptionsCode[] = [];//利率型態下拉選單
  interestCode: OptionsCode[] = [];//基準利率型態下拉選單
  creditResult: string = '';
  creditResult1: string = '';
  ResultCode: OptionsCode[] = [];//審核結果下拉選單
  resulet: string = '';
  installment: string;//分期期數
  installmentA: string;//分期期數(循環)

  applicationDebtStrgy: string//方案;
  start1: string;//循環
  start2: string;//分期
  STRGY_LIMIT_MERG: string = '';//本行
  STRGY_LIMIT_CASH: string = '';//他行
  //合約資訊
  revwPrdAbdnDsCd: string;
  revwPrdAbdnRegDtm: string;
  ctrtDocVerId: string;
  ajstlnamt: string;
  resultProdCode: string;
  resultPrjCode: string;
  resultApproveAmt: string;
  resultLowestPayRate: number;
  total = 1;
  pageIndex = 1;
  pageSize = 50;
  EL_DSS2_STRGY_SRATE1 = new MatTableDataSource<any>();//試算利率(多階)

  elCreditRepayrates: any[] = []; //20220609 綁約期違約金
  debtBankDetail = [];//20220609 債整明細Data
  EL_DSS2_STRGY_SRATE2 = new MatTableDataSource<any>();//試算利率(多階) 方案二
  EL_DSS2_STRGY_MERG1 = new MatTableDataSource<any>();//試算授信策略_債整明細

  elCreditMain: any;
  additionalInfo: any;
  elApplicationInfo: any;

  ngOnInit(): void {
    this.lv = sessionStorage.getItem('level');
    sessionStorage.setItem('afterResult', '');
    this.applno = sessionStorage.getItem('applno');
    // this.applno = "20211125A00002";
    this.empNo = BaseService.userId;
    this.level = sessionStorage.getItem('stepName').split('t')[1];
    this.set();//初始查詢
    this.getcontract();
    // this.tYPE.push({ value: '1', viewValue: '公司電話' })
    // this.tYPE.push({ value: '2', viewValue: '手機號碼' })
    // this.tYPE.push({ value: '3', viewValue: '住家號碼' })
    // this.tYPE.push({ value: '4', viewValue: '其他' })

    // this.cONDITION.push({ value: '1', viewValue: '本人接' })
    // this.cONDITION.push({ value: '2', viewValue: '他人接' })
    // this.cONDITION.push({ value: '3', viewValue: '無人接' })
    // this.cONDITION.push({ value: '4', viewValue: '其他(備註)' })

    this.search = sessionStorage.getItem('search');

    this.f01008Service.getSysTypeCode('CREDIT_RESULT')//核決結果下拉選單
      .subscribe(data => {
        this.creditResultCode.push({ value: '', viewValue: '請選擇' });
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.creditResultCode.push({ value: codeNo, viewValue: desc });

        }
      });
    this.ResultCode.push({ value: '', viewValue: '請選擇' });
    this.ResultCode.push({ value: 'A', viewValue: '核准' });
    this.ResultCode.push({ value: 'D', viewValue: '婉拒' });
    this.ResultCode.push({ value: 'V', viewValue: '撤銷' });
    this.getSearch();
    this.approvedDebtStrgyCode = [{ value: '', viewValue: '請選擇' }, { value: '01', viewValue: '方案一' }, { value: '03', viewValue: '方案二' }, { value: '01,03', viewValue: '方案一,方案二' }];
    // this.dss2ChanceCode= [{ value: '1', viewValue: '方案一' }, { value: '2', viewValue: '方案二' }];
    const baseUrl = 'f01/childscn1'
    let jsonObject1: any = {};
    jsonObject1['applno'] = this.applno;
    this.f01008Service.f01008scn2(jsonObject1, baseUrl).subscribe(async data => {
      //   let erroeStr: string = '';
      if (data.rspBody.resultList.length > 0) {
        this.creditResult1 = data.rspBody.resultList[0].creditResult != null && data.rspBody.resultList[0].creditResult != '' ? data.rspBody.resultList[0].creditResult : '';

      }
    })
  }
  getcontract()//本次簽約內容
  {
    let jsonObject: any = {};
    let url = 'f01/f01008scn2action6';
    jsonObject['applno'] = this.applno;
    this.f01008Service.getImfornation(url, jsonObject).subscribe(data => {

      // elCreditMain installment
      // additionalInfo
      this.elCreditMain = data.rspBody.elCreditMain;
      this.additionalInfo = data.rspBody.additionalInfo;

      if (this.applno.includes('A')) {
        this.elApplicationInfo = data.rspBody.elApplicationInfo;
        this.start1 = this.elCreditMain.strgy1AprvOriginfee;
        this.strgy1AprvLoanextfee = this.elCreditMain.strgy1AprvLoanextfee;//帳戶管理費(續約用)
        this.resultApproveAmt = this.additionalInfo.ajstlnamt;
        this.installmentA = this.elApplicationInfo.applicationPeriod;
        this.resultLowestPayRate = this.elCreditMain.lowestPayRate;
        this.caPmcus = this.elCreditMain.caPmcus;
        this.caRisk = this.elCreditMain.caRisk;
      } else {
        this.applicationDebtStrgy = this.additionalInfo.applicationDebtStrgy;
        this.strgy1CashAprvAmt = this.additionalInfo.ajstlnamt != null ? this.f01008Service.toCurrency(this.additionalInfo.ajstlnamt.toString()) : '0';
        if (this.applicationDebtStrgy == '01') {
          this.start2 = this.elCreditMain.strgy1AprvOriginfee;
          this.strgy1CashAprvAmt1 = this.strgy1CashAprvAmt;
        } else if (this.applicationDebtStrgy == '03') {
          this.STRGY_LIMIT_CASH = this.data_number(data.rspBody.settelAmtNot824) // 他行
          this.STRGY_LIMIT_MERG = this.data_number(data.rspBody.settelAmt824) // 本行
          this.start2 = this.elCreditMain.strgy2AprvOriginfee;
          this.strgy1CashAprvAmt1 = this.f01008Service.toCurrency((Number(this.f01008Service.toNumber(this.strgy1CashAprvAmt)) + Number(data.rspBody.settelAmtNot824) + Number(data.rspBody.settelAmt824)).toString());
          this.debtBankDetail = data.rspBody.debtBankDetail;
        }
        this.installment = this.additionalInfo.period;
      }

      this.elCreditRepayrates = data.rspBody.elCreditRepayrates;
      this.CreditInterestPeriodSource = data.rspBody.creditInterestPeriod;
    })

  }
  add() //新增
  {
    if (this.showAdd == false) {
      this.showAdd = !this.showAdd;
      this.f01008Service.setJCICAddSource({
        minHeight: '70vh',
        width: '50%',
        show: this.showAdd,
        applno: this.applno,//案件編號
        // CON_TYPE_Code: this.CON_TYPE_Code,//聯絡方式下拉選單
        CON_TYPE: '',//聯絡方式
        // TEL_CONDITION_Code: this.TEL_CONDITION_Code,//電話狀況下拉選單
        TEL_CONDITION: '',//電話狀況
        // TEL_CHECK_Code: this.TEL_CHECK_Code,//電話種類下拉選單
        TEL_CHECK: '',//電話種類
        // HOURS_Code: this.HOURS_Code,//時下拉選單
        HOURS: '',//時種類
        // MINUTES_Code: this.MINUTES_Code,//分下拉選單
        MINUTES: '',//分種類
        PHONE: '',//手機/市話
        CON_MEMO: '',//備註
        CALLOUT_DATE: '',//設定下次照會時間
        CALLOUT_SETTIME: '',//確認時間
        CALLOUT_EMPNO: this.empNo,//徵信員編

      })
    }

  }
  //編輯
  startEdit(ID: string, CON_TYPE: string, CON_MEMO: string, PHONE: string, TEL_CONDITION: string, CALLOUT_SETTIME: string, CALLOUT_DATE: string) {
    if (this.showEdit == false) {
      this.showEdit = !this.showEdit;
      this.f01008Service.setJCICSource({
        minHeight: '70vh',
        width: '50%',
        show: this.showEdit,
        applno: this.applno,//案件編號
        // CON_TYPE_Code: this.CON_TYPE_Code,//聯絡方式下拉選單
        CON_TYPE: CON_TYPE,//聯絡方式
        // TEL_CONDITION_Code: this.TEL_CONDITION_Code,//電話狀況下拉選單
        TEL_CONDITION: TEL_CONDITION,//電話狀況
        // TEL_CHECK_Code: this.TEL_CHECK_Code,//電話種類下拉選單
        // TEL_CHECK: TEL_CHECK,//電話種類
        // HOURS_Code: this.HOURS_Code,//時下拉選單
        HOURS: this.datepipe.transform(CALLOUT_DATE, 'HH'),//時
        // MINUTES_Code: this.MINUTES_Code,//分下拉選單
        MINUTES: this.datepipe.transform(CALLOUT_DATE, 'mm'),//分
        PHONE: PHONE,//手機/市話
        CON_MEMO: CON_MEMO,//備註RF
        CALLOUT_DATE: CALLOUT_DATE,//設定下次照會時間
        ID: ID,//java用row ID
        CALLOUT_SETTIME: CALLOUT_SETTIME,//確認時間
        CALLOUT_EMPNO: this.empNo,//徵信員編
      });
    }
  }

  getSearch(): String {
    return this.search;
  }

  set() //查詢
  {
    let jsonObject: any = {};
    let url = 'f01/f01008scn2';
    jsonObject['applno'] = this.applno;
    jsonObject['page'] = this.page;
    jsonObject['pei_page'] = this.pei_page;
    jsonObject['conType'] = this.applno.includes('B')==true?'B':'A';
    jsonObject['creditlevel'] = 'D1';
    this.f01008Service.getSysTypeCode('PERIOD_TYPE')//期別下拉選單
      .subscribe(data => {
        this.periodTypeCode.push({ value: '', viewValue: '月' })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          if (desc == '月') {
            this.periodTypeCode.push({ value: codeNo, viewValue: desc })
          }
        }
        // this.periodType = '1';
      });
    this.f01008Service.getSysTypeCode('INTEREST_TYPE')//利率型態下拉選單
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.interestTypeCode.push({ value: codeNo, viewValue: desc })
        }
      });
    this.f01008Service.getSysTypeCode('INTEREST_CODE')//基準利率型態下拉選單
      .subscribe(data => {
        let erroeStr: string = '';
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.interestCode.push({ value: codeNo, viewValue: desc })
        }
      });
    this.f01008Service.f01008scn2(jsonObject, url).subscribe(async data => {
      console.log(data)
      if (data.rspBody.list != null) {
        this.dataSource = data.rspBody.list;
      }

      if (data.rspBody.CfmContractRcdList.length > 0) {
        this.revwPrdAbdnDsCd = data.rspBody.CfmContractRcdList[0].revwPrdAbdnDsCd;
        this.revwPrdAbdnRegDtm = data.rspBody.CfmContractRcdList[0].revwPrdAbdnRegDtm;
        this.ctrtDocVerId = data.rspBody.CfmContractRcdList[0].ctrtDocVerId;
      }

      // if (data.rspBody.additionalInfoList.length > 0) {
      //   this.ajstlnamt = data.rspBody.additionalInfoList[0].AJSTLNAMT;
      // }

      this.macrSource = data.rspBody.creditmemoList;
      this.jaicSource = data.rspBody.creditMainList;
      // this.CreditInterestPeriodSource = data.rspBody.creditInterestPeriodList;
      this.chooseList.push({ value: '', viewValue: '請選擇' });
      for(const l of data.rspBody.UpEmpOption)
      {
        if(l.EMP_NO!= BaseService.userId)
        {
          this.chooseList.push({ value: l.EMP_NO, viewValue: l.EMP_NAME })
        }
      }


      for (const j of data.rspBody.creditMainList) {
        sessionStorage.setItem('afterResult', j.afterResult);
        if (j.afterResult != '' && j.afterResult != null) {
          this.resulet = j.afterResult;
        }
        sessionStorage.setItem('choose', j.setD1empno)
        if (j.setD1empno != '' && j.setD1empno != null) {
          this.choose = j.setD1empno;
        }
        // this.quota = j.approveAmt;
        // this.repayment = j.lowestPayRate;
        this.creditResult = j.creditResult;
        // this.caRisk = j.caRisk;
        // this.caPmcus = j.caPmcus;
        // this.approvedDebtStrgy = j.approvedDebtStrgy;
        // this.strgy1CashAprvAmt = j.strgy1CashAprvAmt;
        this.aprvInstCashAmt = j.aprvInstCashAmt;
        // this.aprvDebtAmt = j.aprvDebtAmt;
        // this.strgy2AprvAmt = j.strgy2AprvAmt;
        if (j.researchNum != null) {

          sessionStorage.setItem('jcicNumb', j.researchNum);
        }
        else {
          sessionStorage.setItem('jcicNumb', '0');
        }

      }
      for (const jsonObj of data.rspBody.conType) {
        this.tYPE.push({ value: jsonObj.codeNo, viewValue: jsonObj.codeDesc })
      }
      for (const js of data.rspBody.telCondition) {
        this.cONDITION.push({ value: js.codeNo, viewValue: js.codeDesc })
      }
      for (const ii of data.rspBody.creditmemoList) {
        if (ii.CREDITLEVEL == this.lv && ii.CREDITUSER.includes(this.empNo)) {
          this.ma = ii.CREDITACTION;
        }

      }

      //CreditAuditinfo
      if (data.rspBody.CreditAuditinfoList.length > 0) {
        this.cuCName = data.rspBody.CreditAuditinfoList[0].cuCname;
        this.custId = data.rspBody.CreditAuditinfoList[0].custId;
        this.nationalId = data.rspBody.CreditAuditinfoList[0].nationalId;
        this.prodCode = data.rspBody.CreditAuditinfoList[0].prodCode;
        this.i = this.prodCode.slice(0, 11);
        this.applicationAmount = data.rspBody.CreditAuditinfoList[0].applicationAmount == null ? '' : this.toCurrency(data.rspBody.CreditAuditinfoList[0].applicationAmount.toString());
        this.caApplicationAmount = data.rspBody.CreditAuditinfoList[0].applicationAmount == null ? '' : this.toCurrency(data.rspBody.CreditAuditinfoList[0].applicationAmount.toString());
        this.purposeCode = data.rspBody.CreditAuditinfoList[0].purposeCode;

      }

      // //CustomerInfo
      if (data.rspBody.elCustomerInfoList.length > 0) {
        this.cuMTel = data.rspBody.elCustomerInfoList[0].cuMTel;
        this.cuHTelIno = data.rspBody.elCustomerInfoList[0].cuHTelIno;
        this.cuHTel = data.rspBody.elCustomerInfoList[0].cuHTel;
        this.cuCpTelIno = data.rspBody.elCustomerInfoList[0].cuCpTelIno;
        this.cuCpTel = data.rspBody.elCustomerInfoList[0].cuCpTel;
        this.cuMTelOther = data.rspBody.elCustomerInfoList[0].cuMTelOther;
        this.contactOther = data.rspBody.elCustomerInfoList[0].contactOther;
        this.cuCpTelExt = data.rspBody.elCustomerInfoList[0].cuCpTelExt;
      }
    })

  }

  getOptionDesc(option: sysCode[], codeVal: string): string {
    for (const data of option) {
      if (data.value == codeVal) {
        return data.viewValue;
      }
    }
    return codeVal;
  }
  //刪除
  deleteItem(ID: string, CON_TYPE: string, CON_MEMO: string, PHONE: string, TEL_CONDITION: string, CALLOUT_SETTIME: string, CALLOUT_DATE: string) {
    const dialogRef = this.dialog.open(F01008deleteComponent, {
      minHeight: '70vh',
      width: '70%',
      data: {
        show: this.showEdit,
        applno: this.applno,//案件編號
        CON_TYPE: CON_TYPE,//聯絡方式
        TEL_CONDITION: TEL_CONDITION,//電話狀況
        HOURS: this.datepipe.transform(CALLOUT_DATE, 'HH'),//時
        MINUTES: this.datepipe.transform(CALLOUT_DATE, 'mm'),//分
        PHONE: PHONE,//手機/市話
        CON_MEMO: CON_MEMO,//備註
        CALLOUT_DATE: CALLOUT_DATE,//設定下次照會時間
        ID: ID,//java用row ID
        CALLOUT_SETTIME: CALLOUT_SETTIME,//確認時間
        CALLOUT_EMPNO: this.empNo,//徵信員編
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'success' || result === 1) {
        setTimeout(() => {
          this.set();
          // alert("123")
        }, 500);
      }
    });
  }
  macr()//註記新增
  {
    let jsonObject: any = {};
    let url = 'f01/f01008scn2action4';
    jsonObject['applno'] = this.applno;
    jsonObject['userId'] = this.empNo;
    jsonObject['creditaction'] = this.ma;
    jsonObject['creditlevel'] = this.lv;
    this.block = true;
    this.f01008Service.f01008scn2(jsonObject, url).subscribe(data => {
      if (data.rspCode === '0000' || data.rspMsg === '儲存成功') {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
        this.ma = '';
        this.block = false;
        this.refresh();
      }
    })
  }
  edit(ID: string, CREDITACTION: string)//註記編輯
  {
    const dialogRef = this.dialog.open(F01008scn2editComponent, {
      minHeight: '70vh',
      width: '50%',
      panelClass: 'mat-dialog-transparent',
      data: {
        creditaction: CREDITACTION,
        applno: this.applno,
        empNo: this.empNo,
        rowId: ID
      }
    })
    dialogRef.afterClosed().subscribe(result => {

      if (result.event == 'success' || result == 1) {
        this.set();
      }

    })
  }
  storageSeve()//暫存
  {
    sessionStorage.setItem('choose', this.choose);
    sessionStorage.setItem('afterResult', this.resulet);
  }
  dataSeve(i: string) {
    var researchDate = '';
    researchDate = researchDate = '' ? '' : this.pipe.transform(new Date(i), 'yyyyMMdd');
    sessionStorage.setItem('researchDate', researchDate);


  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
  }
  Serial(e: string)//序號排序
  {
    this.dataSource = e === 'ascend' ? this.dataSource.sort(
      (a, b) => a.CALLOUT_SETTIME.localeCompare(b.CALLOUT_SETTIME)) : this.dataSource.sort((a, b) => b.CALLOUT_SETTIME.localeCompare(a.CALLOUT_SETTIME))
  }

  transDate(value: string): string {
    return this.datepipe.transform(new Date(value), "yyyy-MM-dd ");
  }
  change(value: any, valueName: string, index: string) {
    if (valueName == 'resultLowestPayRate') {
      if (value.includes(".")) {
        if (value.split(".")[1].length > 4) {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: '利率請輸入至小數點第四位!' }
          });
          this.repayment = 0;
        }
      }
    }
    if (index != '') {
      sessionStorage.setItem(valueName + index, value);
    } else {
      sessionStorage.setItem(valueName, value);
    }
  }

  //Level轉換中文
  changeLevel(level: string) {
    if (level == 'L4') {
      return "文審"
    } else if (level == 'L2') {
      return "授信"
    } else if (level == 'L3') {
      return "徵信"
    } else if (level == 'L1') {
      return "授信覆核"
    } else if (level == 'L0') {
      return "主管"
    } else if (level == 'D2') {
      return "產生合約前回查"
    } else if (level == 'D1') {
      return "產生合約前覆核"
    } else if (level == 'S2') {
      return "風管處處長"
    } else if (level == 'S1') {
      return "總經理"
    }
  }
  disabledDate(time) {
    return time.getTime() < Date.now();
  }

  getStyle(value: string) {
    // value = this.toNumber(value);
    value = value != null ? value.replace(',', '') : value;
    return {
      'text-align': this.isNumber(value) ? 'right' : 'left'
    }
  }

  isNumber(value: any) { return /^-?[\d.]+(?:e-?\d+)?$/.test(value); }

  //+逗號
  toCurrency(amount: string) {
    return amount != null ? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\w\s]|_/g, '') : data;
  }
  //去除符號中文+千分位
  data_number(x: string) {
    if (x != null) {
      let xString: string = x.toString();
      if (xString.split('.')[1]) {
        x = xString.split('.')[0].replace(/[^\d]/g, '-').replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + xString.split('.')[1];
      } else {
        x = x.toString();
        x = x.replace(/[^\d]/g, '-');
        x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
    return x
  }
  refresh() {
    this.macrSource = [];
    let jsonObject: any = {};
    let url = 'f01/f01008scn2';
    jsonObject['applno'] = this.applno;
    jsonObject['page'] = this.page;
    jsonObject['pei_page'] = this.pei_page;
    this.f01008Service.f01008scn2(jsonObject, url).subscribe(data => {
      this.macrSource = data.rspBody.creditmemoList;
      for (const ii of data.rspBody.creditmemoList) {
        if (ii.CREDITLEVEL == this.lv && ii.CREDITUSER.includes(this.empNo)) {
          this.ma = ii.CREDITACTION;
        }

      }
    })

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

  // 轉換
  getType(codeVal: string, name: string): string {

    let Nmaelist: OptionsCode[] = [];
    switch (name) {
      case 'periodType':
        Nmaelist = this.periodTypeCode;
        break;
      case 'interestType':
        Nmaelist = this.interestTypeCode;
        break;
    }
    for (const data of Nmaelist) {
      if (data.value == codeVal) {
        return data.viewValue;
      }
    }
    return codeVal;
  }
  replace(i: string) {
    if (parseInt(i) > 0) {
      return i
    } else {
      return 0
    }

  }



}


