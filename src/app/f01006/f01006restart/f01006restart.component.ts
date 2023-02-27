import { Component, Inject, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F01006Service } from '../f01006.service';
import { F01006Component } from '../f01006.component';
import { Data, Router } from '@angular/router';
import { BaseService } from 'src/app/base.service';
import { MatTableDataSource } from '@angular/material/table';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Childscn14Service } from 'src/app/children/childscn14/childscn14.service';


@Component({
  selector: 'app-f01006restart',
  templateUrl: './f01006restart.component.html',
  styleUrls: ['./f01006restart.component.css', '../../../assets/css/f01.css']
})
export class F01006restartComponent implements OnInit {
  reasonCode: OptionsCode[] = []; //申覆原因下拉
  reason: string;                 //申覆原因
  content: string;                //申覆說明
  empNo: string = BaseService.userId;
  interestData = [];
  seq: string;
  mark: string;
  userId: string;
  period: string;
  periodType: string;
  interestType: string;
  interestBase: string;
  interest: string;
  approveInterest: string;
  baseRate: string
  periodCodeCase1: OptionsCode[] = [];
  periodCodeCase2: OptionsCode[] = [];
  //Creditmemo
  creditmemoSource: Data[] = [];
  periodTypeCode: OptionsCode[] = [];//期別下拉選單
  interestTypeCode: OptionsCode[] = [];//利率型態下拉選單
  interestCode: OptionsCode[] = [];//基準利率型態下拉選單
  dss2Form1S1: FormGroup = this.fb.group({
    //系統決策
    SYSFLOWCD: ['', []],//系統流程
    RESLTCD: ['', []],//決策結果
    //20220620 期數下拉選單及暫存
    //案件資訊
    CALV: ['', []],//案件等級
    GOODBEHAV_MORT: ['', []],//往來優質特徵註記(房貸)
    GOODBEHAV_CC: ['', []],//往來優質特徵註記(信用卡)
    OCUPATN_CUST_STGP1: ['', []],//策略客群1(客戶填寫)
    OCUPATN_CUST_STGP2: ['', []],//策略客群2(客戶填寫)
    OCUPATN_CUST_GP: ['', []],//行職業代碼分群(客戶填寫)
    OCUPATN_CUST_STGP1_PM: ['', []],//策略客群1(客戶填寫) (PM分群)
    OCUPATN_CUST_STGP2_PM: ['', []],//策略客群2(客戶填寫) (PM分群)
    OCUPATN_CUST_GP_PM: ['', []],//行職業代碼分群(客戶填寫) (PM分群)
    CUST_TAG: ['', []],//客群標籤
    CUST_TAG_DESC: ['', []],//客群標籤說明

    //策略模板資訊
    STRGY_MDUL: ['', []],//試算授信策略模板分類
    STRGY_MDUL_ATVDT: ['', []],//授信策略模板生效日期時間
    STRGY_RATE_ATVDT: ['', []],//利率模板生效日期時間

    //授信及產品條件
    //1.2.3共用
    STRGY_PRDCD: ['', []],//產品名稱
    STRGY_APRFRJ: ['', []],//試算授信策略_准駁
    STRGY_PERIOD_MIN: ['', []],//期數最小值
    STRGY_PERIOD_MAX: ['', []],//期數最大值
    //期數=STRGY_PERIOD_MIN ~ STRGY_PERIOD_MAX
    STRGY_LIMIT_REVING: ['', []],//循環信貸額度
    STRGY_LIMIT_INST: ['', []],//分期信貸金額
    STRGY_LIMIT_CASH: ['', []],//分期信貸-現金額度
    STRGY_LIMIT_MERG: ['', []],//分期信貸-債整額度(他行)
    STRGY_MINPAYRT: ['', []],//每月最低還款比例(僅限循環信貸)
    STRGY_DISB_BTCR_YN: ['', []],//結帳日至還款日間客戶可申請動撥Y
    STRGY_RL_DISB_THRHLD: ['', []],//循環信貸簡易檢核動撥金額門檻
    STRGY_ORIGINFEE: ['', []],//開辦費(首次簽約用)
    STRGY_LOANEXTFEE: ['', []],//帳戶管理費(續約用)

    //額度限額資訊 3種方案相同
    LIMIT_DBR: ['', []],//限額_DBR
    LIMIT_PRDMUE: ['', []],//限額_產品MUE
    LIMIT_LAW32: ['', []],//限額_本行利害關係人(銀行法第32條)
    LIMIT_LAW33_UNS: ['', []],//限額_同一自然人無擔保授信限額(銀行法第33條)
    LIMIT_PROD_MAX: ['', []],//限額_產品/專案額度上限
    LIMIT_PROD_MIN: ['', []],//限額_產品/專案額度下限
    LIMIT_CUSTAPPLY: ['', []],//限額_客戶申請金額
    LIMIT_DTI: ['', []],//限額_月付收支比
    LIMIT_NIDMUE: ['', []],//限額_歸戶MUE
    LIMIT_MERGEAMT: ['', []],//限額_債整額度
    STRGY_NIDMUEX: ['', []],//試算授信策略_歸戶MUE倍數
    STRGY_NIDMUECAP: ['', []],//試算授信策略_歸戶MUECAP
    STRGY_PRDMUEX: ['', []],//試算授信策略_產品MUE倍數
    STRGY_PRDMUEXCAP: ['', []],//試算授信策略_產品MUECAP
    STRGY_DBRX: ['', []],//試算授信策略_DBR限額倍數
    STRGY_DTIX: ['', []],//試算授信策略_DTI參數

    //風險
    RISKMDSUB_A1: ['', []],//風險模型子模型代碼
    RISKMDGRADE_A1_ADJ: ['', []],//風險模型等級(策略調整後)
    RISKMDGRADE_A1_GP_ADJ: ['', []],//風險模型等級分群(策略調整後)

    STRGY_LIMIT_MERG_LB: ['', []],//試算分期信貸-債整額度(僅本行)
  });

  dss2Form1S2: FormGroup = this.fb.group({
    //系統決策
    SYSFLOWCD: ['', []],//系統流程
    RESLTCD: ['', []],//決策結果

    //案件資訊
    CALV: ['', []],//案件等級
    GOODBEHAV_MORT: ['', []],//往來優質特徵註記(房貸)
    GOODBEHAV_CC: ['', []],//往來優質特徵註記(信用卡)
    OCUPATN_CUST_STGP1: ['', []],//策略客群1(客戶填寫)
    OCUPATN_CUST_STGP2: ['', []],//策略客群2(客戶填寫)
    OCUPATN_CUST_GP: ['', []],//行職業代碼分群(客戶填寫)
    OCUPATN_CUST_STGP1_PM: ['', []],//策略客群1(客戶填寫) (PM分群)
    OCUPATN_CUST_STGP2_PM: ['', []],//策略客群2(客戶填寫) (PM分群)
    OCUPATN_CUST_GP_PM: ['', []],//行職業代碼分群(客戶填寫) (PM分群)
    CUST_TAG: ['', []],//客群標籤
    CUST_TAG_DESC: ['', []],//客群標籤說明

    //策略模板資訊
    STRGY_MDUL: ['', []],//試算授信策略模板分類
    STRGY_MDUL_ATVDT: ['', []],//授信策略模板生效日期時間
    STRGY_RATE_ATVDT: ['', []],//利率模板生效日期時間

    //授信及產品條件
    //1.2.3共用
    STRGY_PRDCD: ['', []],//產品名稱
    STRGY_APRFRJ: ['', []],//試算授信策略_准駁
    STRGY_PERIOD_MIN: ['', []],//期數最小值
    STRGY_PERIOD_MAX: ['', []],//期數最大值
    //期數=STRGY_PERIOD_MIN ~ STRGY_PERIOD_MAX
    STRGY_LIMIT_REVING: ['', []],//循環信貸額度
    STRGY_LIMIT_INST: ['', []],//分期信貸金額
    STRGY_LIMIT_CASH: ['', []],//分期信貸-現金額度
    STRGY_LIMIT_MERG: ['', []],//分期信貸-債整額度(他行)
    STRGY_MINPAYRT: ['', []],//每月最低還款比例(僅限循環信貸)
    STRGY_DISB_BTCR_YN: ['', []],//結帳日至還款日間客戶可申請動撥Y
    STRGY_RL_DISB_THRHLD: ['', []],//循環信貸簡易檢核動撥金額門檻
    STRGY_ORIGINFEE: ['', []],//開辦費(首次簽約用)
    STRGY_LOANEXTFEE: ['', []],//帳戶管理費(續約用)

    //額度限額資訊 3種方案相同
    LIMIT_DBR: ['', []],//限額_DBR
    LIMIT_PRDMUE: ['', []],//限額_產品MUE
    LIMIT_LAW32: ['', []],//限額_本行利害關係人(銀行法第32條)
    LIMIT_LAW33_UNS: ['', []],//限額_同一自然人無擔保授信限額(銀行法第33條)
    LIMIT_PROD_MAX: ['', []],//限額_產品/專案額度上限
    LIMIT_PROD_MIN: ['', []],//限額_產品/專案額度下限
    LIMIT_CUSTAPPLY: ['', []],//限額_客戶申請金額
    LIMIT_DTI: ['', []],//限額_月付收支比
    LIMIT_NIDMUE: ['', []],//限額_歸戶MUE
    LIMIT_MERGEAMT: ['', []],//限額_債整額度
    STRGY_NIDMUEX: ['', []],//試算授信策略_歸戶MUE倍數
    STRGY_NIDMUECAP: ['', []],//試算授信策略_歸戶MUECAP
    STRGY_PRDMUEX: ['', []],//試算授信策略_產品MUE倍數
    STRGY_PRDMUEXCAP: ['', []],//試算授信策略_產品MUECAP
    STRGY_DBRX: ['', []],//試算授信策略_DBR限額倍數
    STRGY_DTIX: ['', []],//試算授信策略_DTI參數

    //風險
    RISKMDSUB_A1: ['', []],//風險模型子模型代碼
    RISKMDGRADE_A1_ADJ: ['', []],//風險模型等級(策略調整後)
    RISKMDGRADE_A1_GP_ADJ: ['', []],//風險模型等級分群(策略調整後)

    //20220608新增
    STRGY_LIMIT_MERG_LB: ['', []],//試算分期信貸-債整額度(僅本行)

    STRGY_LIMIT_MERG_CM: ['', []],//分期信貸-債整額度(他行)----creditmain
    STRGY_LIMIT_MERG_LB_CM: ['', []]//試算分期信貸-債整額度(僅本行)----creditmain
  });
  EL_DSS2_STRGY_SRATE1 = new MatTableDataSource<any>();//試算利率(多階)
  EL_DSS2_STRGY_MERG1 = new MatTableDataSource<any>();//試算授信策略_債整明細
  EL_DSS2_STRGY_SRATE2 = new MatTableDataSource<any>();//試算利率(多階) 方案二
  CreditInterestPeriodSource = [];
  //20220607 分期方案二
  CreditInterestPeriodTwoSource = [];
  search: string;
  //DSS2st Strgy
  strgyAprfrj: string;                          //授信策略准駁結果
  strgyLimitReving: string;                     //授信策略循環信貸額度
  strgyMinpayrt: string;                        //授信策略每月最低還款比率
  //DSS1st
  sysflowcdOne: string;                         //系統流程
  resltcdOne: string;                           //決策結果
  calvOne: string;                              //案件等級
  ocupatnCustGpOne: string;                     //行職業代碼分群代碼/中文
  ocupatnCustStgp1One: string;                  //策略客群1代碼/中文
  ocupatnCustStgp2One: string;                  //策略客群2代碼/中文
  goodbehavMortOne: string;                     //往來優質特徵註記(房貸)代碼/中文
  goodbehavCcOne: string;                       //往來優質特徵註記(信用卡)代碼/中文
  riskmdscoreA0: string;                        //風險模型分數
  riskmdgradeA0Adj: string;                     //風險模型等級(策略調整後)

  //DSS2st
  sysflowcdTwo: string;                         //系統流程
  resltcdTwo: string;                           //決策結果
  calvTwo: string;                              //案件等級
  ocupatnCustGpTwo: string;                     //行職業代碼分群代碼/中文
  ocupatnCustStgp1Two: string;                  //策略客群1代碼/中文
  ocupatnCustStgp2Two: string;                  //策略客群2代碼/中文
  goodbehavMortTwo: string;                     //往來優質特徵註記(房貸)代碼/中文
  goodbehavCcTwo: string;                       //往來優質特徵註記(信用卡)代碼/中文
  riskmdscoreA1: string;                        //風險模型分數
  riskmdgradeA1Adj: string;                     //風險模型等級(策略調整後)
  custTag: string;                              //客群標籤/說明
  total = 1;
  pageIndex = 1;
  pageSize = 50;
  //20220608 債整明細Data
  elDss2MergDebtDetailStrgyOne: any[] = [];
  elDss2MergDebtDetailStrgyTwo: any[] = [];
  //20220418 分期核准額度方案
  strgy1CashAprvAmt: string;
  aprvInstCashAmt: string;
  aprvDebtAmt: string = '0';
  strgy2AprvAmt: string;
  approvedDebtStrgy: string = '';
  approvedDebtStrgyCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }, { value: '01', viewValue: '方案一' }, { value: '03', viewValue: '方案二' }, { value: '01,03', viewValue: '方案一,方案二' }];
  dss2ChanceCode: OptionsCode[] = [{ value: '1', viewValue: '方案一' }, { value: '2', viewValue: '方案二' }];
  dss2Chance: string = '1';
  resultProdCode: string;
  resultPrjCode: string;
  resultApproveAmt: string;
  resultLowestPayRate: number;
  prodCode: string = '';                             //申請產品
  applicationAmount: string;                    //申請金額
  caApplicationAmount: string;
  purposeCode: string;                           //貸款用途
  caPmcus: string;
  caRisk: string
  //20220613 期數開辦費
  strgy1AprvPrdMin: string;
  strgy1AprvPrdMax: string;
  strgy2AprvPrdMin: string;
  strgy2AprvPrdMax: string;
  strgy1AprvOriginfee: string;
  strgy2AprvOriginfee: string;
  strgy1AprvLoanextfee: string;

  //審核結果
  creditResult: string;
  creditResultCode: OptionsCode[] = [];//核決結果下拉選單
  //選擇加簽20220118
  addSignature: OptionsCode[] = [{ value: '', viewValue: '' }, { value: 'L0', viewValue: '部主管' }, { value: 'S2', viewValue: '風管處處長' }, { value: 'S1', viewValue: '總經理' }];
  addSignatureValue: string;
  //20220609 綁約期違約金
  elCreditRepayrateOne: any[] = [];
  elCreditRepayrateTwo: any[] = [];

  elDebtBankDetails = [];
  closeButton: boolean = true;
  closeButton2: boolean = true;
  constructor(
    public dialog: MatDialog,
    private f01006Service: F01006Service,
    public dialogRef: MatDialogRef<F01006restartComponent>,
    private router: Router,
    private fb: FormBuilder,
    private childscn14Service: Childscn14Service,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit(): void {

    this.getDSS2();
    sessionStorage.setItem('level', '6');
    this.search = sessionStorage.getItem('search');
    this.getInterestData();
    this.childscn14Service.setWord('案件申覆');
    // 申覆原因下拉
    let jsonObject: any = {};
    this.f01006Service.getReasonData(jsonObject).subscribe(data => {

      this.reasonCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.items) {
        const codeNo = jsonObj.reasonCode;
        const desc = jsonObj.reasonDesc;
        this.reasonCode.push({ value: codeNo, viewValue: desc })
      }
    });
    this.reason = '';

    this.f01006Service.getSysTypeCode('INTEREST_TYPE')//利率型態下拉選單
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.interestTypeCode.push({ value: codeNo, viewValue: desc })
        }
      });
    this.f01006Service.getSysTypeCode('PERIOD_TYPE')//期別下拉選單
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
    const url = 'f01/childscn1'
    let jsonObject1: any = {};
    jsonObject1['applno'] = this.data.applno;
    this.f01006Service.getImfornation(url, jsonObject1).subscribe(async data => {
      this.getDSS22(data.rspBody.amt, data.rspBody.amtLb);
      let erroeStr: string = '';
      if (data.rspBody.creditInterestPeriodList1.length > 0) {
        this.CreditInterestPeriodSource = data.rspBody.creditInterestPeriodList1;
        for (let index = 0; index < this.CreditInterestPeriodSource.length; index++) {
          if (this.CreditInterestPeriodSource[index].interestType == '02') {
            if (this.getSearch() != 'Y') {
              if (!(await this.f01006Service.getInterestBase('f01/childscn1action2', jsonObject1)).includes('找不到')) {
                this.CreditInterestPeriodSource[index].interestBase = await this.f01006Service.getInterestBase('f01/childscn1action2', jsonObject1);
              } else {
                erroeStr = '加減碼查無利率，請通知相關人員!'
                this.CreditInterestPeriodSource[index].interestType = '';
                this.CreditInterestPeriodSource[index].interestBase = 0;
              }
            }
          } else {
            this.CreditInterestPeriodSource[index].interestBase = '0';
          }

          this.CreditInterestPeriodSource[index].periodType = this.CreditInterestPeriodSource[index].periodType != null && this.CreditInterestPeriodSource[index].periodType != '' ? this.CreditInterestPeriodSource[index].periodType : '1';
          this.CreditInterestPeriodSource[index].approveInterest = (((Number(this.CreditInterestPeriodSource[index].interestBase) * 1000) + (Number(this.CreditInterestPeriodSource[index].interest) * 1000)) / 1000 > 16 ? 16 : ((Number(this.CreditInterestPeriodSource[index].interestBase) * 1000) + (Number(this.CreditInterestPeriodSource[index].interest) * 1000)) / 1000 ).toString();
        }

        if (erroeStr != '') {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: erroeStr }
          });
        }

      }

      if (!this.data.applno.includes('A')) {
        //jay
        //creditInterestPeriod
        if (data.rspBody.creditInterestPeriodList2.length > 0) {
          this.CreditInterestPeriodTwoSource = data.rspBody.creditInterestPeriodList2;
          for (let index = 0; index < this.CreditInterestPeriodTwoSource.length; index++) {
            if (this.CreditInterestPeriodTwoSource[index].interestType == '02') {
              if (this.getSearch() != 'Y') {
                if (!(await this.f01006Service.getInterestBase('f01/childscn1action2', jsonObject1)).includes('找不到')) {
                  this.CreditInterestPeriodTwoSource[index].interestBase = await this.f01006Service.getInterestBase('f01/childscn1action2', jsonObject1);
                } else {
                  erroeStr = '加減碼查無利率，請通知相關人員!'
                  this.CreditInterestPeriodTwoSource[index].interestType = '';
                  this.CreditInterestPeriodTwoSource[index].interestBase = 0;
                }
              }
            } else {
              this.CreditInterestPeriodTwoSource[index].interestBase = '0';
            }

            this.CreditInterestPeriodTwoSource[index].periodType = this.CreditInterestPeriodTwoSource[index].periodType != null && this.CreditInterestPeriodTwoSource[index].periodType != '' ? this.CreditInterestPeriodTwoSource[index].periodType : '1';
            this.CreditInterestPeriodTwoSource[index].approveInterest = (((Number(this.CreditInterestPeriodTwoSource[index].interestBase) * 1000) + (Number(this.CreditInterestPeriodTwoSource[index].interest) * 1000)) / 1000 > 16 ? 16 : ((Number(this.CreditInterestPeriodTwoSource[index].interestBase) * 1000) + (Number(this.CreditInterestPeriodTwoSource[index].interest) * 1000)) / 1000 ).toString();

          }

          if (erroeStr != '') {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: erroeStr }
            });
          }
        }
      }

      // //DSS2Strgy
      // if (data.rspBody.dss2StrgyList.length > 0) {
      //   this.strgyAprfrj = data.rspBody.dss2StrgyList[0].strgyAprfrj;
      //   this.strgyLimitReving = data.rspBody.dss2StrgyList[0].strgyLimitReving;
      //   this.strgyMinpayrt = data.rspBody.dss2StrgyList[0].strgyMinpayrt;
      // }
      //DSS1
      if (data.rspBody.dss1List.length > 0) {
        this.sysflowcdOne = data.rspBody.dss1List[0].sysflowcd;
        this.resltcdOne = data.rspBody.dss1List[0].resltcd;
        this.calvOne = data.rspBody.dss1List[0].calv;
        this.ocupatnCustGpOne = data.rspBody.dss1List[0].ocupatnCustGp;
        this.ocupatnCustStgp1One = data.rspBody.dss1List[0].ocupatnCustStgp1;
        this.ocupatnCustStgp2One = data.rspBody.dss1List[0].ocupatnCustStgp2;
        this.goodbehavMortOne = data.rspBody.dss1List[0].goodbehavMort;
        this.goodbehavCcOne = data.rspBody.dss1List[0].goodbehavCc;
        this.riskmdscoreA0 = data.rspBody.dss1List[0].riskmdscoreA0;
        this.riskmdgradeA0Adj = data.rspBody.dss1List[0].riskmdgradeA0Adj;
      }

      //DSS2
      if (data.rspBody.dss2List.length > 0) {
        this.sysflowcdTwo = data.rspBody.dss2List[0].sysflowcd;
        this.resltcdTwo = data.rspBody.dss2List[0].resltcd;
        this.calvTwo = data.rspBody.dss2List[0].calv;
        this.ocupatnCustGpTwo = data.rspBody.dss2List[0].ocupatnCustGp + data.rspBody.dss2List[0].ocupatnCustGpDesc;
        this.ocupatnCustStgp1Two = data.rspBody.dss2List[0].ocupatnCustStgp1 + data.rspBody.dss2List[0].ocupatnCustStgp1Desc;
        this.ocupatnCustStgp2Two = data.rspBody.dss2List[0].ocupatnCustStgp2;
        this.goodbehavMortTwo = data.rspBody.dss2List[0].goodbehavMort;
        this.goodbehavCcTwo = data.rspBody.dss2List[0].goodbehavCc;
        this.riskmdscoreA1 = data.rspBody.dss2List[0].riskmdscoreA1;
        this.riskmdgradeA1Adj = data.rspBody.dss2List[0].riskmdgradeA1Adj;
        this.custTag = data.rspBody.dss2List[0].custTag + '/' + data.rspBody.dss2List[0].custTagDesc;
      }
      //result
      if (data.rspBody.resultList.length > 0) {
        this.resultProdCode = data.rspBody.resultList[0].prodCode;
        this.resultPrjCode = data.rspBody.resultList[0].prjCode;
        this.creditResult = data.rspBody.resultList[0].creditResult != null && data.rspBody.resultList[0].creditResult != '' ? data.rspBody.resultList[0].creditResult : '';
        this.resultApproveAmt = data.rspBody.resultList[0].approveAmt != null ? this.toCurrency(data.rspBody.resultList[0].approveAmt.toString()) : '';
        this.resultLowestPayRate = data.rspBody.resultList[0].lowestPayRate;
        this.caPmcus = data.rspBody.resultList[0].caPmcus;
        this.caRisk = data.rspBody.resultList[0].caRisk;
        this.addSignatureValue = data.rspBody.resultList[0].addSignature;

        //20220418 新增分期債整欄位
        this.approvedDebtStrgy = data.rspBody.resultList[0].approvedDebtStrgy;
        this.strgy1CashAprvAmt = data.rspBody.resultList[0].strgy1CashAprvAmt != null ? this.toCurrency(data.rspBody.resultList[0].strgy1CashAprvAmt.toString()) : '';
        this.aprvInstCashAmt = data.rspBody.resultList[0].aprvInstCashAmt != null ? this.toCurrency(data.rspBody.resultList[0].aprvInstCashAmt.toString()) : '';
        if (data.rspBody.amt) {
          this.aprvDebtAmt = this.toCurrency((Number(this.aprvDebtAmt) + Number(data.rspBody.amt)).toString());
        }
        if (data.rspBody.amtLb) {
          this.aprvDebtAmt = this.toCurrency((Number(this.toNumber(this.aprvDebtAmt)) + Number(data.rspBody.amtLb)).toString());
        }
        this.strgy2AprvAmt = this.aprvDebtAmt;
        if (this.aprvInstCashAmt != '') {
          this.strgy2AprvAmt = this.toCurrency(((this.strgy2AprvAmt != null && this.strgy2AprvAmt != '' ? Number(this.toNumber(this.strgy2AprvAmt)) : 0) + Number(this.toNumber(this.aprvInstCashAmt))).toString());
        }
      }
      //20220613 creditmain期數 開辦費 管理費
      this.strgy1AprvPrdMin = data.rspBody.resultList[0].strgy1AprvPrdMin;
      this.strgy1AprvPrdMax = data.rspBody.resultList[0].strgy1AprvPrdMax;
      this.strgy2AprvPrdMin = data.rspBody.resultList[0].strgy2AprvPrdMin;
      this.strgy2AprvPrdMax = data.rspBody.resultList[0].strgy2AprvPrdMax;
      this.strgy1AprvOriginfee = data.rspBody.resultList[0].strgy1AprvOriginfee != null ? this.toCurrency(data.rspBody.resultList[0].strgy1AprvOriginfee.toString()) : '';
      this.strgy2AprvOriginfee = data.rspBody.resultList[0].strgy2AprvOriginfee != null ? this.toCurrency(data.rspBody.resultList[0].strgy2AprvOriginfee.toString()) : '';
      this.strgy1AprvLoanextfee = data.rspBody.resultList[0].strgy1AprvLoanextfee != null ? this.toCurrency(data.rspBody.resultList[0].strgy1AprvLoanextfee.toString()) : '';

      this.elDss2MergDebtDetailStrgyOne = data.rspBody.elDss2MergDebtDetailStrgyOne;
      this.elCreditRepayrateOne = data.rspBody.elCreditRepayrateOne;
      this.elDss2MergDebtDetailStrgyTwo = data.rspBody.elDss2MergDebtDetailStrgyTwo;
      this.elCreditRepayrateTwo = data.rspBody.elCreditRepayrateTwo;

      if (data.rspBody.elDebtBankDetails) {
        this.elDebtBankDetails = data.rspBody.elDebtBankDetails;
      }
    })

    this.f01006Service.getSysTypeCode('CREDIT_RESULT')//核決結果下拉選單
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.creditResultCode.push({ value: codeNo, viewValue: desc });

        }
      });



  }

  ngOnDestroy(): void {
    this.childscn14Service.setWord('');
  }


  public async restart(): Promise<void> {
    this.childscn14Service.setWord('');
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['reason'] = this.reason;
    jsonObject['content'] = this.content;
    jsonObject['empno'] = this.empNo;
    jsonObject['opid'] = this.data.opid;

    let msgStr: string = "";
    if (this.reason == null || this.reason == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請填入申覆原因' }
      });
    } else if (this.content == null || this.content == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請填入申覆說明' }
      });
    } else {
      msgStr = await this.f01006Service.addRestart(jsonObject);
      if (msgStr == 'success') {
        msgStr = '儲存成功！'
      } else if (msgStr == '此案件客戶已取消') {
        msgStr = '此案件客戶已取消'
      }
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      setTimeout(() => {
        this.dialog.closeAll();
        // window.location.reload();
        this.f01006Service.restartfn()
        // let currentUrl = this.router.url;
        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        //   this.router.navigate([currentUrl]);
        // });
      }, 2500);
    }
  }
  //取決策1Table
  getDSS2() {
    const url = 'f01/childscn10action3';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['strgy'] = '1';
    this.f01006Service.getDate_Json(url, jsonObject).subscribe(data => {
      if (data.rspBody.DSS2STRGY.length > 0) {
        //授信及產品條件
        //1.2.3共用
        this.dss2Form1S1.patchValue({ STRGY_PRDCD: data.rspBody.DSS2STRGY[0].STRGY_PRDCD })//產品名稱
        this.dss2Form1S1.patchValue({ STRGY_APRFRJ: data.rspBody.DSS2STRGY[0].STRGY_APRFRJ })//試算授信策略_准駁
        this.dss2Form1S1.patchValue({ STRGY_PERIOD_MIN: data.rspBody.DSS2STRGY[0].STRGY_PERIOD_MIN })//期數最小值
        this.dss2Form1S1.patchValue({ STRGY_PERIOD_MAX: data.rspBody.DSS2STRGY[0].STRGY_PERIOD_MAX })//期數最大值
        //案件資訊
        this.dss2Form1S1.patchValue({ CALV: data.rspBody.DSS2[0].CALV })//案件等級
        this.dss2Form1S1.patchValue({ GOODBEHAV_MORT: data.rspBody.DSS2[0].GOODBEHAV_MORT })//往來優質特徵註記(房貸)
        this.dss2Form1S1.patchValue({ GOODBEHAV_CC: data.rspBody.DSS2[0].GOODBEHAV_CC })//往來優質特徵註記(信用卡)
        this.dss2Form1S1.patchValue({ OCUPATN_CUST_STGP1: data.rspBody.DSS2[0].OCUPATN_CUST_STGP1 })//策略客群1(客戶填寫)
        this.dss2Form1S1.patchValue({ OCUPATN_CUST_STGP2: data.rspBody.DSS2[0].OCUPATN_CUST_STGP2 })//策略客群2(客戶填寫)
        this.dss2Form1S1.patchValue({ OCUPATN_CUST_GP: data.rspBody.DSS2[0].OCUPATN_CUST_GP })//行職業代碼分群(客戶填寫)
        this.dss2Form1S1.patchValue({ OCUPATN_CUST_STGP1_PM: data.rspBody.DSS2[0].OCUPATN_CUST_STGP1_PM })//策略客群1(客戶填寫) (PM分群)
        this.dss2Form1S1.patchValue({ OCUPATN_CUST_STGP2_PM: data.rspBody.DSS2[0].OCUPATN_CUST_STGP2_PM })//策略客群2(客戶填寫) (PM分群)
        this.dss2Form1S1.patchValue({ OCUPATN_CUST_GP_PM: data.rspBody.DSS2[0].OCUPATN_CUST_GP_PM })//行職業代碼分群(客戶填寫) (PM分群)
        this.dss2Form1S1.patchValue({ CUST_TAG: data.rspBody.DSS2[0].CUST_TAG })//客群標籤
        this.dss2Form1S1.patchValue({ CUST_TAG_DESC: data.rspBody.DSS2[0].CUST_TAG_DESC })//客群標籤說明
        //期數=STRGY_PERIOD_MIN ~ STRGY_PERIOD_MAX
        this.dss2Form1S1.patchValue({ STRGY_LIMIT_REVING: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_REVING) })//循環信貸額度
        this.dss2Form1S1.patchValue({ STRGY_LIMIT_INST: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_INST) })//分期信貸金額
        this.dss2Form1S1.patchValue({ STRGY_LIMIT_CASH: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_CASH) })//分期信貸-現金額度
        this.dss2Form1S1.patchValue({ STRGY_LIMIT_MERG: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_MERG) })//分期信貸-債整額度
        this.dss2Form1S1.patchValue({ STRGY_MINPAYRT: data.rspBody.DSS2STRGY[0].STRGY_MINPAYRT })//每月最低還款比例(僅限循環信貸)
        this.dss2Form1S1.patchValue({ STRGY_DISB_BTCR_YN: data.rspBody.DSS2STRGY[0].STRGY_DISB_BTCR_YN })//結帳日至還款日間客戶可申請動撥Y
        this.dss2Form1S1.patchValue({ STRGY_RL_DISB_THRHLD: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_RL_DISB_THRHLD) })//循環信貸簡易檢核動撥金額門檻
        this.dss2Form1S1.patchValue({ STRGY_ORIGINFEE: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_ORIGINFEE) })//開辦費(首次簽約用)
        this.dss2Form1S1.patchValue({ STRGY_LOANEXTFEE: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LOANEXTFEE) })//帳戶管理費(續約用)
      }
      this.EL_DSS2_STRGY_SRATE1.data = data.rspBody.DSS2STRGYSRATE;//試算利率(多階)
      this.EL_DSS2_STRGY_MERG1.data = data.rspBody.DSS2STRGYMERG;//試算授信策略_債整明細
    })
  }

  getDSS22(amt: any, amtLb: any) {
    const url = 'f01/childscn10action3';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['strgy'] = '2';
    this.f01006Service.getDate_Json(url, jsonObject).subscribe(data => {
      if (data.rspBody.DSS2.length > 0) {
        //系統決策
        this.dss2Form1S2.patchValue({ SYSFLOWCD: data.rspBody.DSS2[0].SYSFLOWCD })//系統流程
        this.dss2Form1S2.patchValue({ RESLTCD: data.rspBody.DSS2[0].RESLTCD })//決策結果

        //案件資訊
        this.dss2Form1S2.patchValue({ CALV: data.rspBody.DSS2[0].CALV })//案件等級
        this.dss2Form1S2.patchValue({ GOODBEHAV_MORT: data.rspBody.DSS2[0].GOODBEHAV_MORT })//往來優質特徵註記(房貸)
        this.dss2Form1S2.patchValue({ GOODBEHAV_CC: data.rspBody.DSS2[0].GOODBEHAV_CC })//往來優質特徵註記(信用卡)
        this.dss2Form1S2.patchValue({ OCUPATN_CUST_STGP1: data.rspBody.DSS2[0].OCUPATN_CUST_STGP1 })//策略客群1(客戶填寫)
        this.dss2Form1S2.patchValue({ OCUPATN_CUST_STGP2: data.rspBody.DSS2[0].OCUPATN_CUST_STGP2 })//策略客群2(客戶填寫)
        this.dss2Form1S2.patchValue({ OCUPATN_CUST_GP: data.rspBody.DSS2[0].OCUPATN_CUST_GP })//行職業代碼分群(客戶填寫)
        this.dss2Form1S2.patchValue({ OCUPATN_CUST_STGP1_PM: data.rspBody.DSS2[0].OCUPATN_CUST_STGP1_PM })//策略客群1(客戶填寫) (PM分群)
        this.dss2Form1S2.patchValue({ OCUPATN_CUST_STGP2_PM: data.rspBody.DSS2[0].OCUPATN_CUST_STGP2_PM })//策略客群2(客戶填寫) (PM分群)
        this.dss2Form1S2.patchValue({ OCUPATN_CUST_GP_PM: data.rspBody.DSS2[0].OCUPATN_CUST_GP_PM })//行職業代碼分群(客戶填寫) (PM分群)
        this.dss2Form1S2.patchValue({ CUST_TAG: data.rspBody.DSS2[0].CUST_TAG })//客群標籤
        this.dss2Form1S2.patchValue({ CUST_TAG_DESC: data.rspBody.DSS2[0].CUST_TAG_DESC })//客群標籤說明

        //策略模板資訊
        this.dss2Form1S2.patchValue({ STRGY_MDUL: data.rspBody.DSS2[0].STRGY_MDUL })//試算授信策略模板分類
        this.dss2Form1S2.patchValue({ STRGY_MDUL_ATVDT: data.rspBody.DSS2[0].STRGY_MDUL_ATVDT })//授信策略模板生效日期時間
        this.dss2Form1S2.patchValue({ STRGY_RATE_ATVDT: data.rspBody.DSS2[0].STRGY_RATE_ATVDT })//利率模板生效日期時間

        //風險
        this.dss2Form1S2.patchValue({ RISKMDSUB_A1: data.rspBody.DSS2[0].RISKMDSUB_A1 })//風險模型子模型代碼
        this.dss2Form1S2.patchValue({ RISKMDGRADE_A1_ADJ: data.rspBody.DSS2[0].RISKMDGRADE_A1_ADJ })//風險模型等級(策略調整後)
        this.dss2Form1S2.patchValue({ RISKMDGRADE_A1_GP_ADJ: data.rspBody.DSS2[0].RISKMDGRADE_A1_GP_ADJ })//風險模型等級分群(策略調整後)

      }
      if (data.rspBody.DSS2STRGY.length > 0) {
        //授信及產品條件
        //1.2.3共用
        this.dss2Form1S2.patchValue({ STRGY_PRDCD: data.rspBody.DSS2STRGY[0].STRGY_PRDCD })//產品名稱
        this.dss2Form1S2.patchValue({ STRGY_APRFRJ: data.rspBody.DSS2STRGY[0].STRGY_APRFRJ })//試算授信策略_准駁
        this.dss2Form1S2.patchValue({ STRGY_PERIOD_MIN: data.rspBody.DSS2STRGY[0].STRGY_PERIOD_MIN })//期數最小值
        this.dss2Form1S2.patchValue({ STRGY_PERIOD_MAX: data.rspBody.DSS2STRGY[0].STRGY_PERIOD_MAX })//期數最大值
        //期數=STRGY_PERIOD_MIN ~ STRGY_PERIOD_MAX
        this.dss2Form1S2.patchValue({ STRGY_LIMIT_REVING: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_REVING) })//循環信貸額度
        this.dss2Form1S2.patchValue({ STRGY_LIMIT_INST: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_INST) })//分期信貸金額
        this.dss2Form1S2.patchValue({ STRGY_LIMIT_CASH: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_CASH) })//分期信貸-現金額度
        this.dss2Form1S2.patchValue({ STRGY_LIMIT_MERG: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_MERG) })//分期信貸-債整額度
        this.dss2Form1S2.patchValue({ STRGY_MINPAYRT: data.rspBody.DSS2STRGY[0].STRGY_MINPAYRT })//每月最低還款比例(僅限循環信貸)
        this.dss2Form1S2.patchValue({ STRGY_DISB_BTCR_YN: data.rspBody.DSS2STRGY[0].STRGY_DISB_BTCR_YN })//結帳日至還款日間客戶可申請動撥Y
        this.dss2Form1S2.patchValue({ STRGY_RL_DISB_THRHLD: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_RL_DISB_THRHLD) })//循環信貸簡易檢核動撥金額門檻
        this.dss2Form1S2.patchValue({ STRGY_ORIGINFEE: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_ORIGINFEE) })//開辦費(首次簽約用)
        this.dss2Form1S2.patchValue({ STRGY_LOANEXTFEE: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LOANEXTFEE) })//帳戶管理費(續約用)

        //額度限額資訊 3種方案相同
        this.dss2Form1S2.patchValue({ LIMIT_DBR: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_DBR) })//限額_DBR
        this.dss2Form1S2.patchValue({ LIMIT_PRDMUE: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_PRDMUE) })//限額_產品MUE
        this.dss2Form1S2.patchValue({ LIMIT_LAW32: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_LAW32) })//限額_本行利害關係人(銀行法第32條)
        this.dss2Form1S2.patchValue({ LIMIT_LAW33_UNS: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_LAW33_UNS) })//限額_同一自然人無擔保授信限額(銀行法第33條)
        this.dss2Form1S2.patchValue({ LIMIT_PROD_MAX: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MAX) })//限額_產品/專案額度上限
        this.dss2Form1S2.patchValue({ LIMIT_PROD_MIN: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MIN) })//限額_產品/專案額度下限
        this.dss2Form1S2.patchValue({ LIMIT_CUSTAPPLY: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_CUSTAPPLY) })//限額_客戶申請金額
        this.dss2Form1S2.patchValue({ LIMIT_DTI: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_DTI) })//限額_月付收支比
        this.dss2Form1S2.patchValue({ LIMIT_NIDMUE: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_NIDMUE) })//限額_歸戶MUE
        this.dss2Form1S2.patchValue({ LIMIT_MERGEAMT: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_MERGEAMT) })//限額_債整額度
        this.dss2Form1S2.patchValue({ STRGY_NIDMUEX: data.rspBody.DSS2STRGY[0].STRGY_NIDMUEX })//試算授信策略_歸戶MUE倍數
        this.dss2Form1S2.patchValue({ STRGY_NIDMUECAP: data.rspBody.DSS2STRGY[0].STRGY_NIDMUECAP })//試算授信策略_歸戶MUECAP
        this.dss2Form1S2.patchValue({ STRGY_PRDMUEX: data.rspBody.DSS2STRGY[0].STRGY_PRDMUEX })//試算授信策略_產品MUE倍數
        this.dss2Form1S2.patchValue({ STRGY_PRDMUEXCAP: data.rspBody.DSS2STRGY[0].STRGY_PRDMUEXCAP })//試算授信策略_產品MUECAP
        this.dss2Form1S2.patchValue({ STRGY_DBRX: data.rspBody.DSS2STRGY[0].STRGY_DBRX })//試算授信策略_DBR限額倍數
        this.dss2Form1S2.patchValue({ STRGY_DTIX: data.rspBody.DSS2STRGY[0].STRGY_DTIX })//試算授信策略_DTI參數 注意名稱差異

        this.dss2Form1S2.patchValue({ STRGY_LIMIT_MERG_LB: data.rspBody.DSS2STRGY[0].STRGY_LIMIT_MERG_LB })

        this.dss2Form1S2.patchValue({ STRGY_LIMIT_MERG_CM: this.data_number(amt.toString()) });
        this.dss2Form1S2.patchValue({ STRGY_LIMIT_MERG_LB_CM: this.data_number(amtLb.toString()) });
      }
      this.EL_DSS2_STRGY_SRATE2.data = data.rspBody.DSS2STRGYSRATE;//試算利率(多階)

    })
  }

  getInterestData() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    this.f01006Service.getInterestData(jsonObject).subscribe(data => {
      this.interestData = data.rspBody.items;
      // this.seq = this.interestData[0].SEQ;
      // this.period = this.interestData[0].PERIOD;
      // this.periodType = this.interestData[0].PERIOD_TYPE;
      // this.interestType = this.interestData[0].INTEREST_TYPE;
      // this.interestCode = this.interestData[0].INTEREST_CODE;
      // this.interestBase = this.interestData[0].INTEREST_BASE;
      // this.interest = this.interestData[0].INTEREST;
      // this.approveInterest = this.interestData[0].APPROVE_INTEREST;
    });
  }

  getSearch() {
    return this.search;
  }
  cancel(): void {
    this.childscn14Service.setWord('');
    this.dialogRef.close();
  }

  checlNull(value: string) {
    return value != null ? value : 0;
  }

  // test()
  // {
  //   console.log( this.interestTypeCode)
  //   console.log(this.periodTypeCode)

  // }
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
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getCreditmemo(pageIndex, pageSize);
  }
  //+逗號
  toCurrency(amount: string) {
    return amount != null ? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\w\s]|_/g, '') : data;
  }

  getCreditmemo(pageIndex: number, pageSize: number) {
    const baseUrl = 'f01/childscn1scn1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.f01006Service.getImfornation(baseUrl, jsonObject).subscribe(data => {
      this.total = data.rspBody.size;
      this.creditmemoSource = data.rspBody.list;
      for (let index = 0; index < this.creditmemoSource.length; index++) {
        if (this.creditmemoSource[index].CREDITLEVEL == sessionStorage.getItem('stepName').split('t')[1] && this.creditmemoSource[index].CREDITUSER.includes(this.userId)) {
          this.mark = this.creditmemoSource[index].CREDITACTION;
        }
      }
    })
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
}
