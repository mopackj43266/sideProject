import { BaseService } from 'src/app/base.service';
import { OptionsCode, history, interestPeriod, strgyRepayrate } from './../../interface/base';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Childscn1Service } from './childscn1.service';
import { Data, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import * as L from 'leaflet';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { F01002Scn1Service } from 'src/app/f01002/f01002scn1/f01002scn1.service';
import { Subscription } from 'rxjs';
import { F01003Scn1Service } from 'src/app/f01003/f01003scn1/f01003scn1.service';
import { F01004Scn1Service } from 'src/app/f01004/f01004scn1/f01004scn1.service';
import { F01007scn1Service } from 'src/app/f01007/f01007scn1/f01007scn1.service';
import { F01001Scn1Service } from 'src/app/f01001/f01001scn1/f01001scn1.service';
import { F01014Scn1Service } from 'src/app/f01014/f01014scn1/f01014scn1.service';
import { F01013Scn1Service } from 'src/app/f01013/f01013scn1/f01013scn1.service';
import { F01017scn1Service } from 'src/app/f01017/f01017scn1/f01017scn1.service';
import { F01018scn1Service } from 'src/app/f01018/f01018scn1/f01018scn1.service';
import { Childscn10Service } from '../childscn10/childscn10.service';
//原因碼框架
interface CREDIT_View {
  key: string;
  upCreditCode: string//上層原因碼
  upCreditCodeList: OptionsCode[];//上層原因碼下拉選單
  reasonCode: string;//原因碼
  creditCodeList: OptionsCode[];//原因碼下拉選單
  resonContent: string;//徵審註記
}

interface reCREDIT_View {
  upCreditCode?: string//上層原因碼
  reasonCode: string;//原因碼
  resonContent: string;//徵審註記
}

//Nick 	徵審代碼/dss1/dss2
@Component({
  selector: 'app-childscn1',
  templateUrl: './childscn1.component.html',
  styleUrls: ['./childscn1.component.css', '../../../assets/css/child.css']
})
export class Childscn1Component implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    public childscn1Service: Childscn1Service,
    public dialog: MatDialog,
    private pipe: DatePipe,
    private f01002scn1Service: F01002Scn1Service,
    private f01003scn1Service: F01003Scn1Service,
    private f01004scn1Service: F01004Scn1Service,
    private f01007scn1Service: F01007scn1Service,
    private f01001Scn1Service: F01001Scn1Service,
    private f01013Scn1Service: F01013Scn1Service,
    private f01014Scn1Service: F01014Scn1Service,
    private f01017Scn1Service: F01017scn1Service,
    private f01018Scn1Service: F01018scn1Service,
    private childscn10Service: Childscn10Service,
    private router: Router,
  ) {//訂閱 案件完成/暫存時 新增資料
    this.CREDITSource$ = this.f01002scn1Service.CREDITSource$.subscribe((data) => {
      if (data.key) {
        this.saveCREDIT_Data();
      }
    });
  }

  CREDITSource$: Subscription;

  mark: string;
  search: string;
  userId: string;
  level: string;

  //申請資訊
  applno: string;                               //案編
  cuCName: string;                              //姓名
  nationalId: string;                           //身分證
  custContent: string;                          //客戶註記名單
  page: string         //頁面
  //客戶身分名單註記(待確認)
  prodCode: string = '';                             //申請產品
  applicationAmount: string;                    //申請金額
  purposeCode: string;                           //貸款用途
  //專案名稱(待確認)
  //行銷代碼(待確認)

  //Channel資訊
  cuGps1: string;                               //GPS1
  cuGps2: string;                               //GPS2
  cuIpAddr1: string;                            //ADDR1
  cuIpAddr2: string;                            //ADDR2
  cuDeviceName1: string;                        //申請時手機型號
  cuDeviceName2: string;                        //上傳時手機型號
  cuDeviceId1: string;                          //申請時Device
  cuDeviceId2: string;                          //上傳時Device

  //AML/FDS/CSS/RPM
  aml: string;                                  //AML代碼
  amlDesc: string;                              //AML說明 MappingCode => AML_RISK
  amlDate: string;                              //AML查詢日期

  fds: string;                                  //FDS代碼
  fdsDesc: string;                              //FDS說明 MappingCode => FDS_RISK
  fdsDate: string;                              //FDS查詢日期

  lineScore: number;                             //CSS分數
  cssScore: string;                             //CSS分數
  cssGrade: string;                             //CSS等級
  cssDate: string;                              //CSS查詢日期
  topFeat1: string;                              //Top_Feat_1
  topFeat2: string;                              //Top_Feat_2
  botFeat1: string;                              //Bot_Feat_1
  botFeat2: string;                              //Bot_Feat_2

  isRpm: string;                                //RPM是否為利關人
  rpmTypeDescribe: string;                      //RPM關係類型描述
  rpmDate: string;                              //RPM查詢日期
  rpmId: string;                                //RMP關係人ID

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

  //DSS2st Strgy
  strgyAprfrj: string;                          //授信策略准駁結果
  strgyLimitReving: string;                     //授信策略循環信貸額度
  strgyMinpayrt: string;                        //授信策略每月最低還款比率

  //選擇加簽20220118
  addSignature: OptionsCode[] = [
    { value: '', viewValue: '' },
    { value: 'L0', viewValue: '部主管' },
    { value: 'S2', viewValue: '風管處處長' },
    { value: 'S1', viewValue: '總經理' },
    // { value: 'R0', viewValue: '利率加簽-PM' },
    // { value: 'R1', viewValue: '利率加簽-覆核&PM' },
    // { value: 'R2', viewValue: '利率加簽-部長&PM' },
    // { value: 'R3', viewValue: '利率加簽-部長&PM&風險處長' },
  ];

  s4AddSignature: OptionsCode[] = [
    { value: '', viewValue: '' },
    { value: 'S2', viewValue: '風管處處長' },
    { value: 'S3', viewValue: '產品處處長' },
  ];

  creditResultCode: OptionsCode[] = [];//核決結果下拉選單
  resultProdCode: string;
  resultPrjCode: string;

  periodTypeCode: OptionsCode[] = [];//期別下拉選單
  interestTypeCode: OptionsCode[] = [];//利率型態下拉選單
  interestCode: OptionsCode[] = [];//基準利率型態下拉選單

  CreditInterestPeriodSource: interestPeriod[] = [];
  //20220607 分期方案二
  CreditInterestPeriodTwoSource: interestPeriod[] = [];

  //歷史紀錄
  historySource: Data[] = [];
  historySource2: Data[] = [];
  historyCreditPayrate1: Data[] = [];
  historyCreditPayrate2: Data[] = [];

  //Creditmemo
  creditmemoSource: Data[] = [];
  total = 1;
  pageIndex = 1;
  pageSize = 50;

  //徵審代碼Table
  EL_DSS1_UNDW_LIST = new MatTableDataSource<any>();//dss1徵審代碼
  EL_DSS1_UNDW_LIST1 = new MatTableDataSource<any>();//dss1徵審代碼-信用異常資訊
  EL_DSS1_UNDW_LIST2 = new MatTableDataSource<any>();//dss1徵審代碼-整體往來
  EL_DSS1_UNDW_LIST3 = new MatTableDataSource<any>();//dss1徵審代碼-信用卡往來
  EL_DSS1_UNDW_LIST4 = new MatTableDataSource<any>();//dss1徵審代碼-授信往來
  EL_DSS1_UNDW_LIST5 = new MatTableDataSource<any>();//dss1徵審代碼-其他
  EL_DSS2_UNDW_LIST = new MatTableDataSource<any>();//dss2徵審代碼
  EL_DSS2_UNDW_LIST1 = new MatTableDataSource<any>();//dss2徵審代碼-信用異常資訊
  EL_DSS2_UNDW_LIST2 = new MatTableDataSource<any>();//dss2徵審代碼-整體往來
  EL_DSS2_UNDW_LIST3 = new MatTableDataSource<any>();//dss2徵審代碼-信用卡往來
  EL_DSS2_UNDW_LIST4 = new MatTableDataSource<any>();//dss2徵審代碼-授信往來
  EL_DSS2_UNDW_LIST5 = new MatTableDataSource<any>();//dss2徵審代碼-其他
  EL_DSS2_CFC_LIMIT1 = new MatTableDataSource<any>();//試算額度策略
  EL_DSS2_STRGY_SRATE1 = new MatTableDataSource<any>();//試算利率(多階) 方案一
  EL_DSS2_STRGY_SRATE2 = new MatTableDataSource<any>();//試算利率(多階) 方案二
  EL_DSS2_STRGY_MERG1 = new MatTableDataSource<any>();//試算授信策略_債整明細(方案一)
  EL_DSS2_STRGY_MERG2 = new MatTableDataSource<any>();//試算授信策略_債整明細(方案二)

  //新增選擇推關人員下拉
  title: string = '';
  titleList: OptionsCode[] = [];//推關人員下拉選單
  titleName = '';

  //徵審代碼
  CREDIT_View_List: CREDIT_View[] = [];
  CREDIT_View_List1: CREDIT_View[] = [];
  CREDIT_View_List2: CREDIT_View[] = [];
  CREDIT_View_List3: CREDIT_View[] = [];
  CREDIT_View_List4: CREDIT_View[] = [];
  reCREDIT_View_List: reCREDIT_View[] = [];
  CREDITrowId: string;

  //AML
  //主要收入來源list
  MAIN_INCOME_LIST: OptionsCode[] = [{ value: '1', viewValue: '薪資/執業收入' }, { value: '2', viewValue: '自營業務收入' }, { value: '3', viewValue: '投資及交易所得' }
    , { value: '4', viewValue: '租賃所得' }, { value: '5', viewValue: '贈與/繼承' }, { value: '6', viewValue: '退休金/保險給付' }, { value: '7', viewValue: '獎助學金/比賽或中獎獎金' }
    , { value: '8', viewValue: '親友/家人給與' }];
  //主要收入來源
  MAIN_INCOME: string = "";

  //本次來往目的list
  PURPOSEOTHER_MESSAGE2_LIST: OptionsCode[] = [{ value: '1', viewValue: '支付教育費用' }, { value: '2', viewValue: '房屋修繕' }, { value: '3', viewValue: '購車' }
    , { value: '4', viewValue: '投資' }, { value: 'Z', viewValue: '其他' }];
  //本次來往目的
  PURPOSEOTHER_MESSAGE2: string = "";

  //客戶近半年無交易(排除付息交易)list
  NON_TRADEOTHER_MESSAGE3_LIST: OptionsCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' }, { value: 'Z', viewValue: '其他' }];
  //客戶近半年無交易(排除付息交易)
  NON_TRADEOTHER_MESSAGE3: string = "";

  //客戶近年交易金額與身分或行職業顯不相當list
  TRADE_NON_CCOTHER_MESSAGE4_LIST: OptionsCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' }, { value: 'Z', viewValue: '其他' }];
  //客戶近年交易金額與身分或行職業顯不相當
  TRADE_NON_CCOTHER_MESSAGE4: string = "";

  //客戶近半年交易是否與首次(活期)開戶目的不相稱list
  TRADE_NON_PURPOSEOTHER_MESSAGE5_LIST: OptionsCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' }, { value: 'Z', viewValue: '其他' }];
  //客戶近半年交易是否與首次(活期)開戶目的不相稱
  TRADE_NON_PURPOSEOTHER_MESSAGE5: string = "";

  otherMessage2: string = "";
  otherMessage3: string = "";
  otherMessage4: string = "";
  otherMessage5: string = "";

  dss1Form1: FormGroup = this.fb.group({
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

    //風險
    RISKMDSUB_A0: ['', []],//風險模型子模型代碼
    RISKMDGRADE_A0_ADJ: ['', []],//風險模型等級(策略調整後)
    RISKMDGRADE_A0_GP_ADJ: ['', []],//風險模型等級分群(策略調整後)

  });

  dss2Form1S1: FormGroup = this.fb.group({
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

  //地圖參數
  map: any;
  distance: any;

  //20220418 分期核准額度方案
  approvedDebtStrgyCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }, { value: '01', viewValue: '方案一' }, { value: '03', viewValue: '方案二' }, { value: '01,03', viewValue: '方案一,方案二' }];
  dss2ChanceCode: OptionsCode[] = [{ value: '1', viewValue: '方案一' }, { value: '2', viewValue: '方案二' }];
  dss2Chance: string = '1';

  //20220608 債整明細Data
  elDss2MergDebtDetailStrgyOne: any[] = [];
  elDss2MergDebtDetailStrgyTwo: any[] = [];

  //20220609 綁約期違約金
  elDss2StrgyRepayrateOne: any[] = [];
  elDss2StrgyRepayrateTwo: any[] = [];
  elCreditRepayrateOne: strgyRepayrate[] = [];
  elCreditRepayrateTwo: strgyRepayrate[] = [];

  elDss1StrgyMergList: any[] = [];
  elDss2StrgyMergListOne: any[] = [];
  elDss2StrgyMergListTwo: any[] = [];
  //20220620 期數下拉選單及暫存
  periodCodeCase1: OptionsCode[] = [];
  periodCodeCase2: OptionsCode[] = [];

  checkStrgy2: boolean = false;

  official: string = 'N';//判斷官署資料決策

  //頁面離開時觸發
  ngOnDestroy() {
    this.CREDITSource$.unsubscribe();
    // this.childscn1Service.removeSession(
    //   sessionStorage.getItem('count') ? Number(sessionStorage.getItem('count')) : 0,
    //   sessionStorage.getItem('count2') ? Number(sessionStorage.getItem('count2')) : 0,
    //   sessionStorage.getItem('srCount1') ? Number(sessionStorage.getItem('srCount1')) : 0,
    //   sessionStorage.getItem('srCount2') ? Number(sessionStorage.getItem('srCount2')) : 0
    // );
  }

  ngOnInit(): void {
    if (!sessionStorage.getItem('applno')) {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "案件編號遺失，請重新選擇案件!" }
      });
      this.router.navigate(['./' + this.router.url.split('/')[1]]);
    } else {
      if (sessionStorage.getItem('applno') == '' || sessionStorage.getItem('applno') == null) {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "案件編號遺失，請重新選擇案件!" }
        });
        this.router.navigate(['./' + this.router.url.split('/')[1]]);
      }
    }

    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.userId = BaseService.userId;
    this.page = sessionStorage.getItem("page");
    this.level = sessionStorage.getItem('stepName') != null ? sessionStorage.getItem('stepName').split('t')[1] : "";

    //先建立徵審代碼框架
    for (let i = 0; i < 9; i++) {
      var Add_CREDIT_View: CREDIT_View = {
        key: (i + 1).toString(),
        upCreditCode: null,
        reasonCode: null,
        resonContent: null,
        upCreditCodeList: [{ value: "", viewValue: "" }],
        creditCodeList: [{ value: "", viewValue: "" }]
      };
      this.CREDIT_View_List1.push(Add_CREDIT_View);
      if (i < 3) {
        this.CREDIT_View_List2.push(Add_CREDIT_View);
      }
      else if (i < 6) {
        this.CREDIT_View_List3.push(Add_CREDIT_View);
      }
      else {
        this.CREDIT_View_List4.push(Add_CREDIT_View);
      }
    }

    this.childscn1Service.getSysTypeCode('CREDIT_RESULT')//核決結果下拉選單
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          if (this.level == 'L4') {
            if (codeNo == 'W') {
              this.creditResultCode.push({ value: codeNo, viewValue: desc });
            }
          } else if (this.level == 'L3') {
            if (codeNo == 'C' || codeNo == 'D') {
              this.creditResultCode.push({ value: codeNo, viewValue: desc });
            }
          } else {
            if (codeNo == 'A' || codeNo == 'D') {
              this.creditResultCode.push({ value: codeNo, viewValue: desc });
            }
          }
        }
      });

    this.childscn1Service.getSysTypeCode('PERIOD_TYPE')//期別下拉選單
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          if (desc == '月') {
            this.periodTypeCode.push({ value: codeNo, viewValue: desc })
          }
        }
        // this.periodType = '1';
      });

    this.childscn1Service.getSysTypeCode('INTEREST_TYPE')//利率型態下拉選單
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.interestTypeCode.push({ value: codeNo, viewValue: desc })
        }
      });

    this.childscn1Service.getSysTypeCode('INTEREST_CODE')//基準利率型態下拉選單
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.interestCode.push({ value: codeNo, viewValue: desc })
        }
      });

    const baseUrl = 'f01/childscn1'
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['stepName'] = this.getStepName();
    this.childscn1Service.getImfornation(baseUrl, jsonObject).subscribe(async data => {
      if (data.rspBody.fieldExist) {
        this.addSignature.push({ value: 'R0', viewValue: '利率加簽-PM' });
        this.addSignature.push({ value: 'R1', viewValue: '利率加簽-覆核&PM' });
        this.addSignature.push({ value: 'R2', viewValue: '利率加簽-部長&PM' });
        this.addSignature.push({ value: 'R3', viewValue: '利率加簽-部長&PM&風險處長' });
      }
      this.childscn1Service.clear();
      this.checkStrgy2 = data.rspBody.checkStrgy2;
      //CreditAuditinfo
      if (data.rspBody.CreditAuditinfoList.length > 0) {
        this.cuCName = data.rspBody.CreditAuditinfoList[0].cuCname;
        this.childscn1Service.setCustId(data.rspBody.CreditAuditinfoList[0].custId);
        this.nationalId = data.rspBody.CreditAuditinfoList[0].nationalId;
        this.childscn1Service.setProdCodeAndName(data.rspBody.CreditAuditinfoList[0].prodCode);
        this.applicationAmount = data.rspBody.CreditAuditinfoList[0].applicationAmount == null ? '' : this.toCurrency(data.rspBody.CreditAuditinfoList[0].applicationAmount.toString());
        this.childscn1Service.setCaApplicationAmount(data.rspBody.CreditAuditinfoList[0].applicationAmount == null ? '' : this.toCurrency(data.rspBody.CreditAuditinfoList[0].applicationAmount.toString()));
        if (data.rspBody.CreditAuditinfoList[0].caApplicationAmount != 0 && data.rspBody.CreditAuditinfoList[0].caApplicationAmount != '' && data.rspBody.CreditAuditinfoList[0].caApplicationAmount != null) {
          this.childscn1Service.setCaApplicationAmount(this.toCurrency(data.rspBody.CreditAuditinfoList[0].caApplicationAmount.toString()));
        }
        this.purposeCode = data.rspBody.CreditAuditinfoList[0].purposeCode;
        this.custContent = data.rspBody.CreditAuditinfoList[0].custContent;
      }

      //AML
      if (data.rspBody.amlList.length > 0) {
        this.aml = data.rspBody.amlList[0].AML;
        this.amlDesc = data.rspBody.amlList[0].CODE_DESC;
        this.amlDate = data.rspBody.amlList[0].AML_DATE;
      }

      //FDS
      if (data.rspBody.fdsList.length > 0) {
        this.fds = data.rspBody.fdsList[0].FDS;
        this.fdsDesc = data.rspBody.fdsList[0].CODE_DESC;
        this.fdsDate = data.rspBody.fdsList[0].FDS_DATE;
      }

      //CSS
      if (data.rspBody.cssList.length > 0) {
        this.lineScore = data.rspBody.cssList[0].lineScore;
        this.cssScore = data.rspBody.cssList[0].cssScore;
        this.cssGrade = data.rspBody.cssList[0].cssGrade;
        this.topFeat1 = data.rspBody.cssList[0].topFeat1;
        this.topFeat2 = data.rspBody.cssList[0].topFeat2;
        this.botFeat1 = data.rspBody.cssList[0].botFeat1;
        this.botFeat2 = data.rspBody.cssList[0].botFeat2;

        this.cssDate = this.pipe.transform(new Date(data.rspBody.cssList[0].cssDate), 'yyyy-MM-dd HH:mm:ss');
      }

      //RPM
      if (data.rspBody.rpmList.length > 0) {
        this.isRpm = data.rspBody.rpmList[0].isRpm;
        this.rpmTypeDescribe = data.rspBody.rpmList[0].rpmTypeDescribe;
        this.rpmDate = this.pipe.transform(new Date(data.rspBody.rpmList[0].rpmDate), 'yyyy-MM-dd HH:mm:ss');
        this.rpmId = data.rspBody.rpmList[0].rpmId;
      }

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

      //DSS2Strgy
      // if (data.rspBody.dss2StrgyList.length > 0) {
      //   this.strgyAprfrj = data.rspBody.dss2StrgyList[0].strgyAprfrj;
      //   this.strgyLimitReving = data.rspBody.dss2StrgyList[0].strgyLimitReving;
      //   this.strgyMinpayrt = data.rspBody.dss2StrgyList[0].strgyMinpayrt;
      // }

      //result
      if (data.rspBody.resultList.length > 0) {
        this.official = data.rspBody.resultList[0].c3Flag == 'Y' ? data.rspBody.resultList[0].c3Flag : 'N';
        this.resultProdCode = data.rspBody.resultList[0].prodCode;
        this.resultPrjCode = data.rspBody.resultList[0].prjCode;
        this.childscn1Service.setCreditResult(data.rspBody.resultList[0].creditResult != null && data.rspBody.resultList[0].creditResult != '' ? data.rspBody.resultList[0].creditResult : '');
        this.childscn1Service.setResultApproveAmt(data.rspBody.resultList[0].approveAmt != null ? this.toCurrency(data.rspBody.resultList[0].approveAmt.toString()) : '');
        this.childscn1Service.setResultLowestPayRate(data.rspBody.resultList[0].lowestPayRate != null ? data.rspBody.resultList[0].lowestPayRate.toString() : '');
        this.childscn1Service.setCaPmcus(data.rspBody.resultList[0].caPmcus != null ? data.rspBody.resultList[0].caPmcus : '');
        this.childscn1Service.setCaRisk(data.rspBody.resultList[0].caRisk != null ? data.rspBody.resultList[0].caRisk : '');
        this.childscn1Service.setAddSignature(data.rspBody.resultList[0].addSignature != null ? data.rspBody.resultList[0].addSignature : '');
        this.childscn1Service.setS4AddSignature(data.rspBody.resultList[0].s4AddSignature != null ? data.rspBody.resultList[0].s4AddSignature : '');

        if (this.page == '2') {
          this.childscn1Service.settitleName(data.rspBody.resultList[0].setL2empno != null ? data.rspBody.resultList[0].setL2empno : '')
        }
        else {
          this.childscn1Service.settitleName(data.rspBody.resultList[0].setL1empno != null ? data.rspBody.resultList[0].setL1empno : '')
        }

        //20220418 新增分期債整欄位
        this.childscn1Service.setApprovedDebtStrgy(data.rspBody.resultList[0].approvedDebtStrgy != null ? data.rspBody.resultList[0].approvedDebtStrgy : '');
        this.childscn1Service.setStrgy1CashAprvAmt(data.rspBody.resultList[0].strgy1CashAprvAmt != null ? this.toCurrency(this.toNumber(data.rspBody.resultList[0].strgy1CashAprvAmt.toString())) : '');
        this.childscn1Service.setAprvInstCashAmt(data.rspBody.resultList[0].aprvInstCashAmt != null ? this.toCurrency(this.toNumber(data.rspBody.resultList[0].aprvInstCashAmt.toString())) : '');

        this.childscn1Service.setAprvDebtAmt("0");

        if (data.rspBody.amt) {
          this.childscn1Service.setAprvDebtAmt(this.toCurrency((Number(this.childscn1Service.getAprvDebtAmt()) + Number(data.rspBody.amt)).toString()));
        }
        if (data.rspBody.amtLb) {
          this.childscn1Service.setAprvDebtAmt(this.toCurrency((Number(this.toNumber(this.childscn1Service.getAprvDebtAmt())) + Number(data.rspBody.amtLb)).toString()));
        }
        this.childscn1Service.setStrgy2AprvAmt(this.toCurrency(this.childscn1Service.getAprvDebtAmt()));
        if (this.childscn1Service.getAprvInstCashAmt() != '') {
          this.childscn1Service.setStrgy2AprvAmt(this.toCurrency(((this.childscn1Service.getStrgy2AprvAmt() != null && this.childscn1Service.getStrgy2AprvAmt() != ''
            ? Number(this.toNumber(this.childscn1Service.getStrgy2AprvAmt())) : 0) + Number(this.toNumber(this.childscn1Service.getAprvInstCashAmt()))).toString()));
        }

        //20220613 creditmain期數 開辦費 管理費
        this.childscn1Service.setStrgyPeriodMin1(data.rspBody.resultList[0].strgy1AprvPrdMin != null ? data.rspBody.resultList[0].strgy1AprvPrdMin.toString() : '');
        this.childscn1Service.setStrgyPeriodMax1(data.rspBody.resultList[0].strgy1AprvPrdMax != null ? data.rspBody.resultList[0].strgy1AprvPrdMax.toString() : '');
        this.childscn1Service.setStrgyPeriodMin2(data.rspBody.resultList[0].strgy2AprvPrdMin != null ? data.rspBody.resultList[0].strgy2AprvPrdMin.toString() : '');
        this.childscn1Service.setStrgyPeriodMax2(data.rspBody.resultList[0].strgy2AprvPrdMax != null ? data.rspBody.resultList[0].strgy2AprvPrdMax.toString() : '');
        this.childscn1Service.setStrgyOriginfee1(data.rspBody.resultList[0].strgy1AprvOriginfee != null ? this.toCurrency(data.rspBody.resultList[0].strgy1AprvOriginfee.toString()) : '');
        this.childscn1Service.setStrgyOriginfee2(data.rspBody.resultList[0].strgy2AprvOriginfee != null ? this.toCurrency(data.rspBody.resultList[0].strgy2AprvOriginfee.toString()) : '');
        this.childscn1Service.setStrgyLoanextfee(data.rspBody.resultList[0].strgy1AprvLoanextfee != null ? this.toCurrency(data.rspBody.resultList[0].strgy1AprvLoanextfee.toString()) : '');

        //20220715 資料異動 開辦費 帳管費
        this.childscn1Service.setOriStrgyOriginfee1(this.toNumber(this.childscn1Service.getStrgyOriginfee1()));
        this.childscn1Service.setOriStrgyOriginfee2(this.toNumber(this.childscn1Service.getStrgyOriginfee2()));
        this.childscn1Service.setOriStrgyLoanextfee(this.toNumber(this.childscn1Service.getStrgyLoanextfee()));

        this.childscn1Service.setOriStrgyPeriodMax1(this.childscn1Service.getStrgyPeriodMax1());
        this.childscn1Service.setOriStrgyPeriodMin1(this.childscn1Service.getStrgyPeriodMin1());
        this.childscn1Service.setOriStrgyPeriodMax2(this.childscn1Service.getStrgyPeriodMax2());
        this.childscn1Service.setOriStrgyPeriodMin2(this.childscn1Service.getStrgyPeriodMin2());
        this.childscn1Service.setOriStrgy1CashAprvAmt(this.toNumber(this.childscn1Service.getStrgy1CashAprvAmt()));
        this.childscn1Service.setOriAprvInstCashAmt(this.toNumber(this.childscn1Service.getAprvInstCashAmt()));
        this.childscn1Service.setOriApprovedDebtStrgy(this.childscn1Service.getApprovedDebtStrgy());

        this.getDSS21(this.childscn1Service.getStrgyPeriodMax1(), this.childscn1Service.getStrgyPeriodMin1());
        this.getDSS22(data.rspBody.amt ? data.rspBody.amt : '0', data.rspBody.amtLb ? data.rspBody.amtLb : '0', this.childscn1Service.getStrgyPeriodMax2(), this.childscn1Service.getStrgyPeriodMin2());
      }

      let erroeStr: string = '';

      //creditInterestPeriod
      if (data.rspBody.creditInterestPeriodList1.length > 0) {
        this.CreditInterestPeriodSource = data.rspBody.creditInterestPeriodList1;
        for (let index = 0; index < this.CreditInterestPeriodSource.length; index++) {
          if (this.CreditInterestPeriodSource[index].interestType == '02') {
            if (this.getSearch() != 'Y') {
              if (!(await this.childscn1Service.getInterestBase('f01/childscn1action2', jsonObject)).includes('找不到')) {
                this.CreditInterestPeriodSource[index].interestBase = await this.childscn1Service.getInterestBase('f01/childscn1action2', jsonObject);
              } else {
                erroeStr = '加減碼查無利率，請通知相關人員!'
                this.CreditInterestPeriodSource[index].interestType = '';
                this.CreditInterestPeriodSource[index].interestBase = '0';
              }
            }
          } else {
            this.CreditInterestPeriodSource[index].interestBase = '0';
          }
          this.CreditInterestPeriodSource[index].periodType = this.CreditInterestPeriodSource[index].periodType != null && this.CreditInterestPeriodSource[index].periodType != '' ? this.CreditInterestPeriodSource[index].periodType : '1';
          this.CreditInterestPeriodSource[index].approveInterest = (((Number(this.CreditInterestPeriodSource[index].interestBase) * 1000) + (Number(this.CreditInterestPeriodSource[index].interest) * 1000)) / 1000).toString();
        }
        this.childscn1Service.setCreditInterestPeriodSource1(this.CreditInterestPeriodSource);
        if (erroeStr != '') {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: erroeStr }
          });
        }
      }

      //20220607 方案二多階利率
      if (!this.applno.includes('A')) {
        //creditInterestPeriod
        if (data.rspBody.creditInterestPeriodList2.length > 0) {
          this.CreditInterestPeriodTwoSource = data.rspBody.creditInterestPeriodList2;
          for (let index = 0; index < this.CreditInterestPeriodTwoSource.length; index++) {
            if (this.CreditInterestPeriodTwoSource[index].interestType == '02') {
              if (this.getSearch() != 'Y') {
                if (!(await this.childscn1Service.getInterestBase('f01/childscn1action2', jsonObject)).includes('找不到')) {
                  this.CreditInterestPeriodTwoSource[index].interestBase = await this.childscn1Service.getInterestBase('f01/childscn1action2', jsonObject);
                } else {
                  erroeStr = '加減碼查無利率，請通知相關人員!'
                  this.CreditInterestPeriodTwoSource[index].interestType = '';
                  this.CreditInterestPeriodTwoSource[index].interestBase = '0';
                }
              }
            } else {
              this.CreditInterestPeriodTwoSource[index].interestBase = '0';
            }
            this.CreditInterestPeriodTwoSource[index].periodType = this.CreditInterestPeriodTwoSource[index].periodType != null && this.CreditInterestPeriodTwoSource[index].periodType != '' ? this.CreditInterestPeriodTwoSource[index].periodType : '1';
            this.CreditInterestPeriodTwoSource[index].approveInterest = (((Number(this.CreditInterestPeriodTwoSource[index].interestBase) * 1000) + (Number(this.CreditInterestPeriodTwoSource[index].interest) * 1000)) / 1000).toString();
          }
          this.childscn1Service.setCreditInterestPeriodSource2(this.CreditInterestPeriodTwoSource);

          if (erroeStr != '') {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: erroeStr }
            });
          }
        }
      }

      //CustomerInfo Channel資訊
      if (data.rspBody.customerInfoList.length > 0) {
        this.cuGps1 = data.rspBody.customerInfoList[0].cuGps1 && data.rspBody.customerInfoList[0].cuGps1.includes(',') ? data.rspBody.customerInfoList[0].cuGps1 : '0,0';
        this.cuGps2 = data.rspBody.customerInfoList[0].cuGps2 && data.rspBody.customerInfoList[0].cuGps2.includes(',') ? data.rspBody.customerInfoList[0].cuGps2 : '0,0';
        this.cuIpAddr1 = data.rspBody.customerInfoList[0].cuIpAddr1 ? data.rspBody.customerInfoList[0].cuIpAddr1 : '';
        this.cuIpAddr2 = data.rspBody.customerInfoList[0].cuIpAddr2 ? data.rspBody.customerInfoList[0].cuIpAddr2 : '';
        this.cuDeviceName1 = data.rspBody.customerInfoList[0].cuDeviceName1 ? data.rspBody.customerInfoList[0].cuDeviceName1 : '';
        this.cuDeviceName2 = data.rspBody.customerInfoList[0].cuDeviceName2 ? data.rspBody.customerInfoList[0].cuDeviceName2 : '';
        this.cuDeviceId1 = data.rspBody.customerInfoList[0].cuDeviceId1 ? data.rspBody.customerInfoList[0].cuDeviceId1 : '';
        this.cuDeviceId2 = data.rspBody.customerInfoList[0].cuDeviceId2 ? data.rspBody.customerInfoList[0].cuDeviceId2 : '';

        //map
        // this.map = L.map('map', { center: [25.0249211, 121.5075035], zoom: 12 });//指定欲繪製地圖在id為map的元素中，中心座標為[25.0249211,121.5075035]，縮放程度為16
        //生成地圖S
        this.map = L.map('map').setView([Number(this.cuGps1.split(',')[0]), Number(this.cuGps1.split(',')[1])], 12);
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          // attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        tiles.addTo(this.map);

        //標點
        const marker1 = L
          .marker([Number(this.cuGps1.split(',')[0]), Number(this.cuGps1.split(',')[1])], { title: '' })
          .addTo(this.map).openPopup();//開啟彈出視窗

        const marker2 = L.marker([Number(this.cuGps2.split(',')[0]), Number(this.cuGps2.split(',')[1])], { title: '' })
          .addTo(this.map).openPopup();//開啟彈出視窗

        this.map.invalidateSize(true);

        //計算兩點座標距離
        var markerFrom = L.circleMarker([Number(this.cuGps1.split(',')[0]), Number(this.cuGps1.split(',')[1])], { color: "#F00", radius: 10 });
        var markerTo = L.circleMarker([Number(this.cuGps2.split(',')[0]), Number(this.cuGps2.split(',')[1])], { color: "#4AFF00", radius: 10 });
        var from = markerFrom.getLatLng();
        var to = markerTo.getLatLng();
        this.distance = (from.distanceTo(to)).toFixed(0) / 1000;

        //取兩點座標中心
        var corner1 = L.latLng(Number(this.cuGps1.split(',')[0]), Number(this.cuGps1.split(',')[1])),
          corner2 = L.latLng(Number(this.cuGps2.split(',')[0]), Number(this.cuGps2.split(',')[1])),
          bounds = L.latLngBounds(corner1, corner2);
        this.map.fitBounds(bounds);
      }

      //20220715搬家 債整明細及綁約期違約金
      this.elDss2MergDebtDetailStrgyOne = data.rspBody.elDss2MergDebtDetailStrgyOne;
      this.elDss2StrgyRepayrateOne = data.rspBody.elDss2StrgyRepayrateOne;
      this.elCreditRepayrateOne = data.rspBody.elCreditRepayrateOne;
      this.childscn1Service.setElCreditRepayrateOne(this.elCreditRepayrateOne);

      if (this.getProdCode()) {
        this.elDss2MergDebtDetailStrgyTwo = data.rspBody.elDss2MergDebtDetailStrgyTwo;
        this.elDss2StrgyRepayrateTwo = data.rspBody.elDss2StrgyRepayrateTwo;
        this.elCreditRepayrateTwo = data.rspBody.elCreditRepayrateTwo;
        this.childscn1Service.setElCreditRepayrateTwo(this.elCreditRepayrateTwo);
      }

      //DSS債整明細 20220610
      this.elDss1StrgyMergList = data.rspBody.elDss1StrgyMergList;
      // this.elDss2StrgyMergListOne = data.rspBody.elDss2StrgyMergListOne;
      // if (this.applno.includes('B')) {
      //   this.elDss2StrgyMergListTwo = data.rspBody.elDss2StrgyMergListTwo;
      // }

      this.historySource = JSON.parse(JSON.stringify(this.CreditInterestPeriodSource));
      this.historySource2 = JSON.parse(JSON.stringify(this.CreditInterestPeriodTwoSource));
      this.historyCreditPayrate1 = JSON.parse(JSON.stringify(this.elCreditRepayrateOne));
      this.historyCreditPayrate2 = JSON.parse(JSON.stringify(this.elCreditRepayrateTwo));

      //依照人員層級存資料異動 20211230
      if (this.level == 'L4') {
        this.f01001Scn1Service.setHistorySource({
          creditResult: this.childscn1Service.getCreditResult()
        })
      } else if (this.level == 'L3') {
        this.f01002scn1Service.setHistorySource({
          creditResult: this.childscn1Service.getCreditResult(),
          lowestPayRate: this.childscn1Service.getResultLowestPayRate(),
          approveAmt: this.toNumber(this.childscn1Service.getResultApproveAmt()),
          caApplicationAmount: this.toNumber(this.childscn1Service.getCaApplicationAmount()),
          caPmcus: this.childscn1Service.getCaPmcus(),
          caRisk: this.childscn1Service.getCaRisk(),
          CreditInterestPeriodSource: this.historySource,
          CreditInterestPeriodTwoSource: this.historySource2
        })
      } else if (this.level == 'L2') {
        this.f01003scn1Service.setHistorySource({
          creditResult: this.childscn1Service.getCreditResult(),
          lowestPayRate: this.childscn1Service.getResultLowestPayRate(),
          approveAmt: this.toNumber(this.childscn1Service.getResultApproveAmt()),
          caPmcus: this.childscn1Service.getCaPmcus(),
          caRisk: this.childscn1Service.getCaRisk(),
          CreditInterestPeriodSource: this.historySource,
          CreditInterestPeriodTwoSource: this.historySource2,
          addSignature: this.childscn1Service.getAddSignature(),
          elCreditRepayrateOne: this.historyCreditPayrate1,
          elCreditRepayrateTwo: this.historyCreditPayrate2
        })
      } else if (this.level == 'L1') {
        this.f01007scn1Service.setHistorySource({
          creditResult: this.childscn1Service.getCreditResult(),
          addSignature: this.childscn1Service.getAddSignature()
        })
      } else if (this.level == 'S2') {
        this.f01013Scn1Service.setHistorySource({
          creditResult: this.childscn1Service.getCreditResult(),
          addSignature: this.childscn1Service.getAddSignature()
        })
      } else if (this.level == 'S1') {
        this.f01014Scn1Service.setHistorySource({
          creditResult: this.childscn1Service.getCreditResult(),
          addSignature: this.childscn1Service.getAddSignature()
        })
      } else if (this.level == 'S4') {
        this.f01017Scn1Service.setHistorySource({
          creditResult: this.childscn1Service.getCreditResult(),
          addSignature: this.childscn1Service.getAddSignature(),
          CreditInterestPeriodSource: this.historySource,
          CreditInterestPeriodTwoSource: this.historySource2,
        })
      } else if (this.level == 'S3') {
        this.f01018Scn1Service.setHistorySource({
          creditResult: this.childscn1Service.getCreditResult(),
          addSignature: this.childscn1Service.getAddSignature()
        })
      } else if (this.level == 'L0') {
        this.f01004scn1Service.setHistorySource({
          creditResult: this.childscn1Service.getCreditResult(),
          addSignature: this.childscn1Service.getAddSignature()
        })
      }

      //20220526 新增FormGroup初始disable disabled開 disable()關
      if (this.getPage() == '3' && this.getProdCode()) {
        this.dss2Form1S1.controls['STRGY_PERIOD_MIN'].disabled;
        this.dss2Form1S1.controls['STRGY_PERIOD_MAX'].disabled;
        this.dss2Form1S2.controls['STRGY_PERIOD_MIN'].disabled;
        this.dss2Form1S2.controls['STRGY_PERIOD_MAX'].disabled;
        this.dss2Form1S2.controls['STRGY_ORIGINFEE'].disabled;
      } else {
        this.dss2Form1S1.controls['STRGY_PERIOD_MIN'].disable();
        this.dss2Form1S1.controls['STRGY_PERIOD_MAX'].disable();
        this.dss2Form1S2.controls['STRGY_ORIGINFEE'].disable();
        this.dss2Form1S2.controls['STRGY_PERIOD_MIN'].disable();
        this.dss2Form1S2.controls['STRGY_PERIOD_MAX'].disable();
      }

      if (this.getPage() == '3') {
        this.dss2Form1S1.controls['STRGY_ORIGINFEE'].disabled;
      } else {
        this.dss2Form1S1.controls['STRGY_ORIGINFEE'].disable();
      }

      if (this.getPage() == '3' && !this.getProdCode()) {
        this.dss2Form1S1.controls['STRGY_LOANEXTFEE'].disabled;
      } else {
        this.dss2Form1S1.controls['STRGY_LOANEXTFEE'].disable();
      }
    })

    this.getCreditmemo(this.pageIndex, this.pageSize);
    this.getDSS11();
    this.getADR_CODE();
    this.getCREDIT_Data();
    this.getSUPPLY_AML();

    this.defineName(this.page)
    this.titleList.push({ value: '', viewValue: '' })
    if (this.page == '2') {
      this.gettitle('L2')
    }
    else if (this.page == '3') {
      this.gettitle('L1')
    }


  }

  ngAfterViewInit(): void {
  }

  getLevel() {
    return this.level;
  }

  getStepName() {
    return sessionStorage.getItem('stepName');
  }

  getSearch() {
    return this.search;
  }

  getCreditmemo(pageIndex: number, pageSize: number) {
    const baseUrl = 'f01/childscn1scn1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.childscn1Service.getImfornation(baseUrl, jsonObject).subscribe(data => {
      this.total = data.rspBody.size;
      this.creditmemoSource = data.rspBody.list;
      for (let index = 0; index < this.creditmemoSource.length; index++) {
        if (this.creditmemoSource[index].CREDITLEVEL == sessionStorage.getItem('stepName').split('t')[1] && this.creditmemoSource[index].CREDITUSER.includes(this.userId)) {
          this.mark = this.creditmemoSource[index].CREDITACTION;
        }
      }
    })
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getCreditmemo(pageIndex, pageSize);
  }

  changePage() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 1;
  }

  //儲存
  public async save(): Promise<void> {
    let msgStr: string = "";
    const baseUrl = 'f01/childscn1action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['creditaction'] = this.mark;
    jsonObject['creditlevel'] = sessionStorage.getItem('stepName').split('t')[1];
    msgStr = await this.childscn1Service.saveCreditmemo(baseUrl, jsonObject);
    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });
    this.changePage();
    this.getCreditmemo(this.pageIndex, this.pageSize);
    // this.insertHistory(this.mark);
  }

  formatDate(date: string) {
    return date.split("T")[0] + " " + date.split("T")[1].split(".")[0];
  }

  async changeInterest(value: any, caseType: string, index?: string) {
    if (value.interestType == '02') {
      value.interestValue = '1';
      let jsonObject: any = {};
      jsonObject['applno'] = this.applno;
      const baseUrl = 'f01/childscn1action2';
      if ((await this.childscn1Service.getInterestBase(baseUrl, jsonObject)).includes('找不到')) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '加減碼查無利率，請通知相關人員!' }
        });
        value.interestType = '';
        value.interestBase = '';
        value.approveInterest = Number(value.interest);
      } else {
        value.interestBase = await this.childscn1Service.getInterestBase(baseUrl, jsonObject);
        value.approveInterest = (Number(value.interestBase) * 1000 + Number(value.interest) * 1000) / 1000;
      }

      if (Number(value.approveInterest) > 16) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '利率不得超過16%!' }
        });
        childernDialogRef.afterClosed().subscribe(result => {
          if (result.event == 'success') {
            value.interest = '';
            value.approveInterest = value.interestBase;
          }
        });
      }
    } else {
      value.interestValue = '';
      value.interestBase = ''
      value.approveInterest = value.interest;
    }

    if (caseType == '1') {
      this.CreditInterestPeriodSource[Number(index)] = value;
      this.childscn1Service.setCreditInterestPeriodSource1(this.CreditInterestPeriodSource);
    } else {
      this.CreditInterestPeriodTwoSource[Number(index)] = value;
      this.childscn1Service.setCreditInterestPeriodSource2(this.CreditInterestPeriodTwoSource);
    }
  }

  // changeInterestValue() {
  //   let msgStr: string = "";
  //   if (this.interestType != "02") {
  //     msgStr = '利率型態請選擇加減碼';
  //     const childernDialogRef = this.dialog.open(ConfirmComponent, {
  //       data: { msgStr: msgStr }
  //     });
  // childernDialogRef.afterClosed().subscribe(result => {
  //   this.interestValue = '';
  // });
  //   }
  // }

  caluclate(value: any, caseType: string, index?: string) {
    if (isNaN(value.interest)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '利率請輸入數字!' }
      });
      childernDialogRef.afterClosed().subscribe(result => {
        if (result.event == 'success') {
          value.interest = '';
          if (value.interestBase == '') {
            value.approveInterest = value.interest;
          } else {
            value.approveInterest = value.interestBase;
          }
          if (caseType == '1') {
            this.CreditInterestPeriodSource[Number(index)] = value;
            this.childscn1Service.setCreditInterestPeriodSource1(this.CreditInterestPeriodSource);
          } else {
            this.CreditInterestPeriodTwoSource[Number(index)] = value;
            this.childscn1Service.setCreditInterestPeriodSource2(this.CreditInterestPeriodTwoSource);
          }
        }
      });
      return;
    }

    if (value.interest.includes(".")) {
      if (value.interest.split(".")[1].length > 2) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '利率請輸入至小數點第二位!' }
        });
        childernDialogRef.afterClosed().subscribe(result => {
          if (result.event == 'success') {
            value.interest = '';
            if (value.interestBase == '') {
              value.approveInterest = value.interest;
            } else {
              value.approveInterest = value.interestBase;
            }
            if (caseType == '1') {
              this.CreditInterestPeriodSource[Number(index)] = value;
              this.childscn1Service.setCreditInterestPeriodSource1(this.CreditInterestPeriodSource);
            } else {
              this.CreditInterestPeriodTwoSource[Number(index)] = value;
              this.childscn1Service.setCreditInterestPeriodSource2(this.CreditInterestPeriodTwoSource);
            }
          }
        });
        return;
      }
    }

    if (value.interestBase == '') {
      value.approveInterest = Number(value.interest);
    } else {
      value.approveInterest = (Number(value.interestBase) * 1000 + Number(value.interest) * 1000) / 1000;
    }

    if (value.approveInterest.toString().includes(".")) {
      if (Number(value.approveInterest > 16)) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '利率不得超過16%!' }
        });
        childernDialogRef.afterClosed().subscribe(result => {
          if (result.event == 'success') {
            value.interest = '';
            if (value.interestBase == '') {
              value.approveInterest = value.interest;
            } else {
              value.approveInterest = value.interestBase;
            }
            if (caseType == '1') {
              this.CreditInterestPeriodSource[Number(index)] = value;
              this.childscn1Service.setCreditInterestPeriodSource1(this.CreditInterestPeriodSource);
            } else {
              this.CreditInterestPeriodTwoSource[Number(index)] = value;
              this.childscn1Service.setCreditInterestPeriodSource2(this.CreditInterestPeriodTwoSource);
            }
          }
        });
        return;
      }
    }

    if (Number(value.approveInterest > 16)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '利率不得超過16%!' }
      });
      childernDialogRef.afterClosed().subscribe(result => {
        if (result.event == 'success') {
          value.interest = '';
          if (value.interestBase == '') {
            value.approveInterest = value.interest;
          } else {
            value.approveInterest = value.interestBase;
          }
          if (caseType == '1') {
            this.CreditInterestPeriodSource[Number(index)] = value;
            this.childscn1Service.setCreditInterestPeriodSource1(this.CreditInterestPeriodSource);
          } else {
            this.CreditInterestPeriodTwoSource[Number(index)] = value;
            this.childscn1Service.setCreditInterestPeriodSource2(this.CreditInterestPeriodTwoSource);
          }
        }
      });
      return;
    }
    if (caseType == '1') {
      this.CreditInterestPeriodSource[Number(index)] = value;
      this.childscn1Service.setCreditInterestPeriodSource1(this.CreditInterestPeriodSource);
    } else {
      this.CreditInterestPeriodTwoSource[Number(index)] = value;
      this.childscn1Service.setCreditInterestPeriodSource2(this.CreditInterestPeriodTwoSource);
    }
  }

  change(value: any, valueName: string, index: string, strgy?: string) {
    switch (valueName) {
      case 'caApplicationAmount':
        this.childscn1Service.setCaApplicationAmount(value);
        break;
      case 'strgy1CashAprvAmt':
        this.childscn1Service.setStrgy1CashAprvAmt(value);
        break;
      case 'aprvInstCashAmt':
        this.childscn1Service.setAprvInstCashAmt(value);
        break;
      case 'period':
        strgy == "1" ? this.CreditInterestPeriodSource[Number(index)].period = value
          : this.CreditInterestPeriodTwoSource[Number(index)].period = value;
        strgy == "1" ? this.childscn1Service.setCreditInterestPeriodSource1(this.CreditInterestPeriodSource)
          : this.childscn1Service.setCreditInterestPeriodSource2(this.CreditInterestPeriodTwoSource);
        break;
      case 'periodType':
        strgy == "1" ? this.CreditInterestPeriodSource[Number(index)].periodType = value
          : this.CreditInterestPeriodTwoSource[Number(index)].periodType = value;
        strgy == "1" ? this.childscn1Service.setCreditInterestPeriodSource1(this.CreditInterestPeriodSource)
          : this.childscn1Service.setCreditInterestPeriodSource2(this.CreditInterestPeriodTwoSource);
        break;
    }

    if (valueName == 'resultLowestPayRate') {
      if (value.includes(".")) {
        if (value.split(".")[1].length > 4) {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: '利率請輸入至小數點第四位!' }
          });
          this.childscn1Service.setResultLowestPayRate("0");
        }
      }
    }
    if (index != '') {
      sessionStorage.setItem(valueName + index, value);
    } else {
      sessionStorage.setItem(valueName, value);
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

  //取決策1Table
  getDSS11() {
    const url = 'f01/childscn10action';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['strgy'] = "1";
    //測試用
    // jsonObject['applno'] = '20211129A000005';
    // jsonObject['applno'] = '20211126A000001';
    this.childscn1Service.getDate_Json(url, jsonObject).subscribe(data => {

      if (data.rspBody.DSS1.length > 0) {
        //系統決策
        this.dss1Form1.patchValue({ SYSFLOWCD: data.rspBody.DSS1[0].SYSFLOWCD })//系統流程
        this.dss1Form1.patchValue({ RESLTCD: data.rspBody.DSS1[0].RESLTCD })//決策結果

        //案件資訊
        this.dss1Form1.patchValue({ CALV: data.rspBody.DSS1[0].CALV })//案件等級
        this.dss1Form1.patchValue({ GOODBEHAV_MORT: data.rspBody.DSS1[0].GOODBEHAV_MORT })//往來優質特徵註記(房貸)
        this.dss1Form1.patchValue({ GOODBEHAV_CC: data.rspBody.DSS1[0].GOODBEHAV_CC })//往來優質特徵註記(信用卡)
        this.dss1Form1.patchValue({ OCUPATN_CUST_STGP1: data.rspBody.DSS1[0].OCUPATN_CUST_STGP1 })//策略客群1(客戶填寫)
        this.dss1Form1.patchValue({ OCUPATN_CUST_STGP2: data.rspBody.DSS1[0].OCUPATN_CUST_STGP2 })//策略客群2(客戶填寫)
        this.dss1Form1.patchValue({ OCUPATN_CUST_GP: data.rspBody.DSS1[0].OCUPATN_CUST_GP })//行職業代碼分群(客戶填寫)
        this.dss1Form1.patchValue({ OCUPATN_CUST_STGP1_PM: data.rspBody.DSS1[0].OCUPATN_CUST_STGP1_PM })//策略客群1(客戶填寫) (PM分群)
        this.dss1Form1.patchValue({ OCUPATN_CUST_STGP2_PM: data.rspBody.DSS1[0].OCUPATN_CUST_STGP2_PM })//策略客群2(客戶填寫) (PM分群)
        this.dss1Form1.patchValue({ OCUPATN_CUST_GP_PM: data.rspBody.DSS1[0].OCUPATN_CUST_GP_PM })//行職業代碼分群(客戶填寫) (PM分群)
        this.dss1Form1.patchValue({ CUST_TAG: data.rspBody.DSS1[0].CUST_TAG })//客群標籤
        this.dss1Form1.patchValue({ CUST_TAG_DESC: data.rspBody.DSS1[0].CUST_TAG_DESC })//客群標籤說明

        //風險 後期新增三欄位
        this.dss1Form1.patchValue({ RISKMDSUB_A0: data.rspBody.DSS1[0].RISKMDSUB_A0 })//風險模型子模型代碼
        this.dss1Form1.patchValue({ RISKMDGRADE_A0_ADJ: data.rspBody.DSS1[0].RISKMDGRADE_A0_ADJ })//風險模型等級(策略調整後)
        this.dss1Form1.patchValue({ RISKMDGRADE_A0_GP_ADJ: data.rspBody.DSS1[0].RISKMDGRADE_A0_GP_ADJ })//風險模型等級分群(策略調整後)


      }
      this.EL_DSS1_UNDW_LIST.data = data.rspBody.DSS1UNDWLIST;//徵審代碼
      if (data.rspBody.DSS1UNDWLIST.length > 0) {
        this.EL_DSS1_UNDW_LIST1.data = this.EL_DSS1_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '1');//1	信用異常資訊
        this.EL_DSS1_UNDW_LIST2.data = this.EL_DSS1_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '2');//2	整體往來
        this.EL_DSS1_UNDW_LIST3.data = this.EL_DSS1_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '3');//3	信用卡往來
        this.EL_DSS1_UNDW_LIST4.data = this.EL_DSS1_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '4');//4	授信往來
        this.EL_DSS1_UNDW_LIST5.data = this.EL_DSS1_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '9');//9	其他
      }
    });
  }

  //取決策1Table
  getDSS21(max: string, min: string) {
    const url = 'f01/childscn10action3';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['strgy'] = '1';
    //測試用
    // jsonObject['applno'] = '20211116A000003';
    // jsonObject['applno'] = '20211126A000001';
    this.childscn1Service.getDate_Json(url, jsonObject).subscribe(async data => {
      if (data.rspBody.DSS2.length > 0) {
        //系統決策
        this.dss2Form1S1.patchValue({ SYSFLOWCD: data.rspBody.DSS2[0].SYSFLOWCD })//系統流程
        this.dss2Form1S1.patchValue({ RESLTCD: data.rspBody.DSS2[0].RESLTCD })//決策結果

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

        //策略模板資訊
        this.dss2Form1S1.patchValue({ STRGY_MDUL: data.rspBody.DSS2[0].STRGY_MDUL })//試算授信策略模板分類
        this.dss2Form1S1.patchValue({ STRGY_MDUL_ATVDT: data.rspBody.DSS2[0].STRGY_MDUL_ATVDT })//授信策略模板生效日期時間
        this.dss2Form1S1.patchValue({ STRGY_RATE_ATVDT: data.rspBody.DSS2[0].STRGY_RATE_ATVDT })//利率模板生效日期時間

        //風險
        this.dss2Form1S1.patchValue({ RISKMDSUB_A1: data.rspBody.DSS2[0].RISKMDSUB_A1 })//風險模型子模型代碼
        this.dss2Form1S1.patchValue({ RISKMDGRADE_A1_ADJ: data.rspBody.DSS2[0].RISKMDGRADE_A1_ADJ })//風險模型等級(策略調整後)
        this.dss2Form1S1.patchValue({ RISKMDGRADE_A1_GP_ADJ: data.rspBody.DSS2[0].RISKMDGRADE_A1_GP_ADJ })//風險模型等級分群(策略調整後)

      }
      if (data.rspBody.DSS2STRGY.length > 0) {
        //授信及產品條件
        //1.2.3共用
        this.dss2Form1S1.patchValue({ STRGY_PRDCD: data.rspBody.DSS2STRGY[0].STRGY_PRDCD })//產品名稱
        this.dss2Form1S1.patchValue({ STRGY_APRFRJ: data.rspBody.DSS2STRGY[0].STRGY_APRFRJ })//試算授信策略_准駁
        this.dss2Form1S1.patchValue({ STRGY_PERIOD_MIN: data.rspBody.DSS2STRGY[0].STRGY_PERIOD_MIN })//期數最小值
        this.dss2Form1S1.patchValue({ STRGY_PERIOD_MAX: data.rspBody.DSS2STRGY[0].STRGY_PERIOD_MAX })//期數最大值
        //期數=STRGY_PERIOD_MIN ~ STRGY_PERIOD_MAX
        this.dss2Form1S1.patchValue({ STRGY_LIMIT_REVING: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_REVING) })//循環信貸額度
        this.dss2Form1S1.patchValue({ STRGY_LIMIT_INST: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_INST) })//分期信貸金額
        this.dss2Form1S1.patchValue({ STRGY_LIMIT_CASH: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_CASH) })//分期信貸-現金額度

        this.childscn1Service.setStrgyLimitCash1(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_CASH != null ? Number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_CASH).toString() : '0');

        // this.dss2Form1S1.patchValue({ STRGY_LIMIT_MERG: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_MERG) })//分期信貸-債整額度
        this.dss2Form1S1.patchValue({ STRGY_LIMIT_MERG: null })//分期信貸-債整額度(方案一為空)
        this.dss2Form1S1.patchValue({ STRGY_MINPAYRT: data.rspBody.DSS2STRGY[0].STRGY_MINPAYRT })//每月最低還款比例(僅限循環信貸)
        this.dss2Form1S1.patchValue({ STRGY_DISB_BTCR_YN: data.rspBody.DSS2STRGY[0].STRGY_DISB_BTCR_YN })//結帳日至還款日間客戶可申請動撥Y
        this.dss2Form1S1.patchValue({ STRGY_RL_DISB_THRHLD: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_RL_DISB_THRHLD) })//循環信貸簡易檢核動撥金額門檻
        this.dss2Form1S1.patchValue({ STRGY_ORIGINFEE: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_ORIGINFEE) })//開辦費(首次簽約用)
        this.dss2Form1S1.patchValue({ STRGY_LOANEXTFEE: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LOANEXTFEE) })//帳戶管理費(續約用)

        //額度限額資訊 3種方案相同
        this.dss2Form1S1.patchValue({ LIMIT_DBR: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_DBR) })//限額_DBR
        this.dss2Form1S1.patchValue({ LIMIT_PRDMUE: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_PRDMUE) })//限額_產品MUE
        this.dss2Form1S1.patchValue({ LIMIT_LAW32: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_LAW32) })//限額_本行利害關係人(銀行法第32條)
        this.dss2Form1S1.patchValue({ LIMIT_LAW33_UNS: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_LAW33_UNS) })//限額_同一自然人無擔保授信限額(銀行法第33條)
        this.dss2Form1S1.patchValue({ LIMIT_PROD_MAX: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MAX) })//限額_產品/專案額度上限
        this.dss2Form1S1.patchValue({ LIMIT_PROD_MIN: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MIN) })//限額_產品/專案額度下限
        this.dss2Form1S1.patchValue({ LIMIT_CUSTAPPLY: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_CUSTAPPLY) })//限額_客戶申請金額
        this.dss2Form1S1.patchValue({ LIMIT_DTI: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_DTI) })//限額_月付收支比
        this.dss2Form1S1.patchValue({ LIMIT_NIDMUE: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_NIDMUE) })//限額_歸戶MUE
        this.dss2Form1S1.patchValue({ LIMIT_MERGEAMT: this.data_number(data.rspBody.DSS2STRGY[0].LIMIT_MERGEAMT) })//限額_債整額度
        this.dss2Form1S1.patchValue({ STRGY_NIDMUEX: data.rspBody.DSS2STRGY[0].STRGY_NIDMUEX })//試算授信策略_歸戶MUE倍數
        this.dss2Form1S1.patchValue({ STRGY_NIDMUECAP: data.rspBody.DSS2STRGY[0].STRGY_NIDMUECAP })//試算授信策略_歸戶MUECAP
        this.dss2Form1S1.patchValue({ STRGY_PRDMUEX: data.rspBody.DSS2STRGY[0].STRGY_PRDMUEX })//試算授信策略_產品MUE倍數
        this.dss2Form1S1.patchValue({ STRGY_PRDMUEXCAP: data.rspBody.DSS2STRGY[0].STRGY_PRDMUEXCAP })//試算授信策略_產品MUECAP
        this.dss2Form1S1.patchValue({ STRGY_DBRX: data.rspBody.DSS2STRGY[0].STRGY_DBRX })//試算授信策略_DBR限額倍數
        this.dss2Form1S1.patchValue({ STRGY_DTIX: data.rspBody.DSS2STRGY[0].STRGY_DTIX })//試算授信策略_DTI參數 注意名稱差異

        this.dss2Form1S1.patchValue({ STRGY_LIMIT_MERG_LB: null })

        this.periodCodeCase1 = this.childscn1Service.periodCalculate(84, 12);
        if (max != null && max != '' && min != null && min != '') {
          this.childscn1Service.setStrgyPeriodMax1(max.toString());
          this.childscn1Service.setStrgyPeriodMin1(min.toString());
        }

        //20220525 為了現金方案檢核新增session
        if (this.getPage() == '3') {
          this.childscn1Service.setLimitDbr1(data.rspBody.DSS2STRGY[0].LIMIT_DBR ? Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_DBR.toString())) : 0); //限額_DBR
          this.childscn1Service.setLimitProdMax1(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MAX ? Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MAX.toString())) < 100 ? 100 : Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MAX.toString())) : 0); //限額_產品/專案額度上限
          this.childscn1Service.setLimitProdMin1(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MIN ? Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MIN.toString())) < 100 ? 100 : Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MIN.toString())) : 0); //限額_產品/專案額度下限
          this.childscn1Service.setLimitNidmue1(data.rspBody.DSS2STRGY[0].LIMIT_NIDMUE ? Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_NIDMUE.toString())) : 0); //限額_歸戶MUE
          this.childscn1Service.setLimitLaw33Uns1(data.rspBody.DSS2STRGY[0].LIMIT_LAW33_UNS ? Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_LAW33_UNS.toString())) : 0); //限額_同一自然人無擔保授信限額(銀行法第33條)
          if (this.isRpm == 'Y' || this.isRpm == 'B') {
            this.childscn1Service.setLimitLaw321(data.rspBody.DSS2STRGY[0].LIMIT_LAW32 ? this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_LAW32.toString()) : '0'); //限額_本行利害關係人(銀行法第32條)
          }
        }
      }
      this.EL_DSS2_UNDW_LIST.data = data.rspBody.DSS2UNDWLIST;//徵審代碼
      if (data.rspBody.DSS2UNDWLIST.length > 0) {
        this.EL_DSS2_UNDW_LIST1.data = this.EL_DSS2_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '1');//1	信用異常資訊
        this.EL_DSS2_UNDW_LIST2.data = this.EL_DSS2_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '2');//2	整體往來
        this.EL_DSS2_UNDW_LIST3.data = this.EL_DSS2_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '3');//3	信用卡往來
        this.EL_DSS2_UNDW_LIST4.data = this.EL_DSS2_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '4');//4	授信往來
        this.EL_DSS2_UNDW_LIST5.data = this.EL_DSS2_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '9');//9	其他
      }
      this.EL_DSS2_CFC_LIMIT1.data = data.rspBody.DSS2CFCLIMIT;//試算額度策略
      for (const data of this.EL_DSS2_CFC_LIMIT1.data) {
        //日期轉換
        if (!isNaN(Number(data.CFC_LIMIT_START_DATE)) && String(data.CFC_LIMIT_START_DATE).length == 8) {
          data.CFC_LIMIT_START_DATE = data.CFC_LIMIT_START_DATE.substring(0, 4) + '-' + data.CFC_LIMIT_START_DATE.substring(4, 6) + '-' + data.CFC_LIMIT_START_DATE.substring(6, 8);
        }
        if (!isNaN(Number(data.CFC_LIMIT_END_DATE)) && String(data.CFC_LIMIT_END_DATE).length == 8) {
          data.CFC_LIMIT_END_DATE = data.CFC_LIMIT_END_DATE.substring(0, 4) + '-' + data.CFC_LIMIT_END_DATE.substring(4, 6) + '-' + data.CFC_LIMIT_END_DATE.substring(6, 8);
        }
        if (data.CFC_LIMIT_DT_REF == '1') { data.CFC_LIMIT_DT_REF += ' : 使用【額度起日】及【額度迄日】欄位'; }
        if (data.CFC_LIMIT_DT_REF == '2') { data.CFC_LIMIT_DT_REF += ' : 使用【期限月數】'; }
      }
      this.EL_DSS2_STRGY_SRATE1.data = data.rspBody.DSS2STRGYSRATE;//試算利率(多階)
      this.EL_DSS2_STRGY_MERG1.data = data.rspBody.DSS2STRGYMERG;//試算授信策略_債整明細
    });
  }

  //新增審核註記歷史資料
  insertHistory(value: string): any {
    const baseUrl = 'f01/childscn2action2';
    const content = []
    let msg = '';
    let jsonObject: any = {};
    content.push(
      {
        applno: this.applno,
        tableName: 'EL_CREDITMEMO',
        columnName: '審核意見',
        currentValue: value,
        transAPname: '審核資料',
      }
    )
    jsonObject['content'] = content;
    this.childscn1Service.insertHistory(baseUrl, jsonObject).subscribe(data => {

    });
  }

  //取得徵審代碼  上層原因碼
  getADR_CODE() {
    const url = 'f01/childscn1action3';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childscn1Service.getDate_Json(url, jsonObject).subscribe(data => {
      if (data.rspCode == "0000") {
        for (const row of this.CREDIT_View_List1) {
          for (const jsonObj of data.rspBody) {
            const codeNo = jsonObj.reasonCode;
            const desc = jsonObj.reasonDesc;
            row.upCreditCodeList.push({ value: codeNo, viewValue: desc })
          }
        }
      }
    });
  }

  //取得徵審代碼   UP_CREDIT_CODE=上層原因碼
  getCREDIT(row: CREDIT_View) {
    if (row.upCreditCode == "") {
      row.creditCodeList = [];
      row.reasonCode = "";
    } else {
      const url = 'f01/childscn1action3';
      let jsonObject: any = {};
      jsonObject['applno'] = this.applno;
      jsonObject['reasonCode'] = row.upCreditCode;
      this.childscn1Service.getDate_Json(url, jsonObject).subscribe(data => {
        if (data.rspCode == "0000") {
          row.creditCodeList = [];
          row.creditCodeList.push({ value: "", viewValue: "" })
          let key = false;
          for (const jsonObj of data.rspBody) {
            const codeNo = jsonObj.reasonCode;
            const desc = jsonObj.reasonDesc;
            row.creditCodeList.push({ value: codeNo, viewValue: desc })
            key = codeNo == row.reasonCode ? true : key;
          }
          row.reasonCode = key ? row.reasonCode : null;
        }
      });
    }
  }

  //取已儲存 CREDIT_CODE 資料
  getCREDIT_Data() {
    const url = 'f01/childscn1action5';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childscn1Service.getDate_Json(url, jsonObject).subscribe(data => {
      if (data.rspCode == "0000") {
        for (const row of this.CREDIT_View_List2) {
          for (const dataRow of data.rspBody) {
            if (row.key == dataRow.item) {
              row.upCreditCode = dataRow.upReasonCode != null ? dataRow.upReasonCode : row.upCreditCode;
              if (row.upCreditCode != null) { this.getCREDIT(row) };
              row.reasonCode = dataRow.creditCodes != null ? dataRow.creditCodes : row.reasonCode;
              row.resonContent = dataRow.creditMemo != null ? dataRow.creditMemo : row.resonContent;
              this.CREDITrowId = dataRow.rowId != null ? dataRow.rowId : this.CREDITrowId;
            }
          }
        }
        for (const row of this.CREDIT_View_List3) {
          for (const dataRow of data.rspBody) {
            if (row.key == dataRow.item) {
              row.upCreditCode = dataRow.upReasonCode != null ? dataRow.upReasonCode : row.upCreditCode;
              if (row.upCreditCode != null) { this.getCREDIT(row) };
              row.reasonCode = dataRow.creditCodes != null ? dataRow.creditCodes : row.reasonCode;
              row.resonContent = dataRow.creditMemo != null ? dataRow.creditMemo : row.resonContent;
              this.CREDITrowId = dataRow.rowId != null ? dataRow.rowId : this.CREDITrowId;
            }
          }
        }
        for (const row of this.CREDIT_View_List4) {
          for (const dataRow of data.rspBody) {
            if (row.key == dataRow.item) {
              row.upCreditCode = dataRow.upReasonCode != null ? dataRow.upReasonCode : row.upCreditCode;
              if (row.upCreditCode != null) { this.getCREDIT(row) };
              row.reasonCode = dataRow.creditCodes != null ? dataRow.creditCodes : row.reasonCode;
              row.resonContent = dataRow.creditMemo != null ? dataRow.creditMemo : row.resonContent;
              this.CREDITrowId = dataRow.rowId != null ? dataRow.rowId : this.CREDITrowId;
            }
          }
        }
      }
    });
  }

  //儲存 CREDIT_CODE 資料  由案件完成及暫存使用
  saveCREDIT_Data() {
    const url = 'f01/childscn1action4';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['rowId'] = this.CREDITrowId;
    jsonObject['creditlevel'] = sessionStorage.getItem('stepName').split('t')[1];
    this.reCREDIT_View_List = [];
    this.CREDIT_View_List = [];
    for (const i of this.CREDIT_View_List2) {
      this.CREDIT_View_List.push(i)
    }
    for (const o of this.CREDIT_View_List3) {
      this.CREDIT_View_List.push(o)
    }
    for (const k of this.CREDIT_View_List4) {
      this.CREDIT_View_List.push(k)
    }
    for (const row of this.CREDIT_View_List) {
      this.reCREDIT_View_List.push({
        reasonCode: row.reasonCode == "" ? null : row.reasonCode,
        resonContent: row.resonContent,
        upCreditCode: row.upCreditCode == "" ? null : row.upCreditCode
      })
    }
    jsonObject['result'] = this.reCREDIT_View_List;
    this.childscn1Service.setJsonObject(jsonObject);
  }

  //ReasonCode不可重複
  checkReasonCode(dataRow: CREDIT_View) {
    this.CREDIT_View_List = [];
    for (const i of this.CREDIT_View_List2) {
      this.CREDIT_View_List.push(i)
    }
    for (const o of this.CREDIT_View_List3) {
      this.CREDIT_View_List.push(o)
    }
    for (const k of this.CREDIT_View_List4) {
      this.CREDIT_View_List.push(k)
    }
    for (const row of this.CREDIT_View_List) {
      if (row.key != dataRow.key && row.reasonCode == dataRow.reasonCode) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "徵審代碼不可重複!" }
        });
        dataRow.reasonCode = "";
        return;
      }
    }
  }

  //AML 非選其他時 清空值
  checkRadio() {
    if (this.PURPOSEOTHER_MESSAGE2 != "Z") { this.otherMessage2 = "" };
    if (this.NON_TRADEOTHER_MESSAGE3 != "Z") { this.otherMessage3 = "" };
    if (this.TRADE_NON_CCOTHER_MESSAGE4 != "Z") { this.otherMessage4 = "" };
    if (this.TRADE_NON_PURPOSEOTHER_MESSAGE5 != "Z") { this.otherMessage5 = "" };

    sessionStorage.setItem('MAIN_INCOME', this.MAIN_INCOME);
    sessionStorage.setItem('PURPOSEOTHER_MESSAGE2', this.PURPOSEOTHER_MESSAGE2);
    sessionStorage.setItem('NON_TRADEOTHER_MESSAGE3', this.NON_TRADEOTHER_MESSAGE3);
    sessionStorage.setItem('TRADE_NON_CCOTHER_MESSAGE4', this.TRADE_NON_CCOTHER_MESSAGE4);
    sessionStorage.setItem('TRADE_NON_PURPOSEOTHER_MESSAGE5', this.TRADE_NON_PURPOSEOTHER_MESSAGE5);
    sessionStorage.setItem('otherMessage2', this.otherMessage2);
    sessionStorage.setItem('otherMessage3', this.otherMessage3);
    sessionStorage.setItem('otherMessage4', this.otherMessage4);
    sessionStorage.setItem('otherMessage5', this.otherMessage5);
  }

  // //儲存 SUPPLY_AML
  // saveSUPPLY_AML() {
  //   var save: boolean = true;
  //   if (this.PURPOSEOTHER_MESSAGE2 == "Z" && this.otherMessage2 == "") { save = false };
  //   if (this.NON_TRADEOTHER_MESSAGE3 == "Z" && this.otherMessage3 == "") { save = false };
  //   if (this.TRADE_NON_CCOTHER_MESSAGE4 == "Z" && this.otherMessage4 == "") { save = false };
  //   if (this.TRADE_NON_PURPOSEOTHER_MESSAGE5 == "Z" && this.otherMessage5 == "") { save = false };
  //   if (save) {
  //     const url = 'f01/childscn1action6';
  //     let jsonObject: any = {};
  //     jsonObject['applno'] = this.applno;
  //     jsonObject['mainIncome'] = this.MAIN_INCOME;
  //     jsonObject['purpose'] = this.PURPOSEOTHER_MESSAGE2;
  //     jsonObject['otherMessage2'] = this.otherMessage2;
  //     jsonObject['nonTrade'] = this.NON_TRADEOTHER_MESSAGE3;
  //     jsonObject['otherMessage3'] = this.otherMessage3;
  //     jsonObject['tradeNonCc'] = this.TRADE_NON_CCOTHER_MESSAGE4;
  //     jsonObject['otherMessage4'] = this.otherMessage4;
  //     jsonObject['tradeNonPurpose'] = this.TRADE_NON_PURPOSEOTHER_MESSAGE5;
  //     jsonObject['otherMessage5'] = this.otherMessage5;
  //     this.childscn1Service.getDate_Json(url, jsonObject).subscribe(data => {
  //     });
  //   } else {
  //     const childernDialogRef = this.dialog.open(ConfirmComponent, {
  //       data: { msgStr: "提供AML資訊點選其他時，輸入框為必填!" }
  //     });
  //   }
  // }

  //取已儲存 CREDIT_CODE 資料
  getSUPPLY_AML() {
    const url = 'f01/childscn1action7';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childscn1Service.getDate_Json(url, jsonObject).subscribe(data => {
      if (data.rspCode == "0000") {
        this.MAIN_INCOME = data.rspBody.mainIncome != null ? data.rspBody.mainIncome : this.MAIN_INCOME;
        this.PURPOSEOTHER_MESSAGE2 = data.rspBody.purpose != null ? data.rspBody.purpose : this.PURPOSEOTHER_MESSAGE2;
        this.NON_TRADEOTHER_MESSAGE3 = data.rspBody.nonTrade != null ? data.rspBody.nonTrade : this.NON_TRADEOTHER_MESSAGE3;
        this.TRADE_NON_CCOTHER_MESSAGE4 = data.rspBody.TradeNonCc != null ? data.rspBody.TradeNonCc : this.TRADE_NON_CCOTHER_MESSAGE4;
        this.TRADE_NON_PURPOSEOTHER_MESSAGE5 = data.rspBody.TradeNonPurpose != null ? data.rspBody.TradeNonPurpose : this.TRADE_NON_PURPOSEOTHER_MESSAGE5;

        this.otherMessage2 = data.rspBody.otherMessage2 != null ? data.rspBody.otherMessage2 : this.otherMessage2;
        this.otherMessage3 = data.rspBody.OtherMessage3 != null ? data.rspBody.OtherMessage3 : this.otherMessage3;
        this.otherMessage4 = data.rspBody.OtherMessage4 != null ? data.rspBody.OtherMessage4 : this.otherMessage4;
        this.otherMessage5 = data.rspBody.OtherMessage5 != null ? data.rspBody.OtherMessage5 : this.otherMessage5;

        sessionStorage.setItem('MAIN_INCOME', data.rspBody.mainIncome != null ? data.rspBody.mainIncome : '');
        sessionStorage.setItem('PURPOSEOTHER_MESSAGE2', data.rspBody.purpose != null ? data.rspBody.purpose : '');
        sessionStorage.setItem('NON_TRADEOTHER_MESSAGE3', data.rspBody.nonTrade != null ? data.rspBody.nonTrade : '');
        sessionStorage.setItem('TRADE_NON_CCOTHER_MESSAGE4', data.rspBody.TradeNonCc != null ? data.rspBody.TradeNonCc : '');
        sessionStorage.setItem('TRADE_NON_PURPOSEOTHER_MESSAGE5', data.rspBody.TradeNonPurpose != null ? data.rspBody.TradeNonPurpose : '');
        sessionStorage.setItem('otherMessage2', data.rspBody.otherMessage2 != null ? data.rspBody.otherMessage2 : '');
        sessionStorage.setItem('otherMessage3', data.rspBody.OtherMessage3 != null ? data.rspBody.OtherMessage3 : '');
        sessionStorage.setItem('otherMessage4', data.rspBody.OtherMessage4 != null ? data.rspBody.OtherMessage4 : '');
        sessionStorage.setItem('otherMessage5', data.rspBody.OtherMessage5 != null ? data.rspBody.OtherMessage5 : '');
      }
    });
  }

  //判斷頁面是否顯示
  //  // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管  12產生合約前覆核 13風管處處長 14總經理 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
  getPage() {
    return this.page
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

  //取基放利率
  // async getBase(value: string): Promise<void> {
  //   let jsonObject: any = {};
  //   jsonObject['applno'] = this.applno;
  //   if (this.interestType == '02') {
  //     value = await this.childscn1Service.getInterestBase('f01/childscn1action2', jsonObject);
  //   }
  // }

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
    } else if (level == 'S4') {
      return "無擔放款部主管"
    } else if (level == 'S3') {
      return "產品處處長"
    } else if (level == 'S2') {
      return "風管處處長"
    } else if (level == 'S1') {
      return "總經理"
    }
  }

  //20220418 分期型方案一算式
  strgy1Calculate() {
    // if (Number(this.toNumber(this.childscn1Service.getStrgy1CashAprvAmt())) > Number(this.toNumber(this.dss2Form1S1.value.STRGY_LIMIT_INST))) {
    //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
    //     data: { msgStr: "方案一現金核准額度不可大於分期信貸金額或不可為0!" }
    //   });
    //   childernDialogRef.afterClosed().subscribe(result => {
    //     this.childscn1Service.setStrgy1CashAprvAmt(this.toCurrency(this.childscn1Service.getStrgyLimitCash1()));
    //   });
    // }
  }

  //20220418 分期型方案二算式
  strgy2Calculate() {
    // if (Number(this.toNumber(this.childscn1Service.getAprvInstCashAmt())) > Number(this.toNumber(this.dss2Form1S2.value.STRGY_LIMIT_CASH)) && Number(this.toNumber(this.childscn1Service.getAprvInstCashAmt())) != 0) {
    //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
    //     data: { msgStr: "方案二現金核准額度不可大於分期信貸-現金額度!" }
    //   });
    //   childernDialogRef.afterClosed().subscribe(result => {
    //     this.childscn1Service.setAprvInstCashAmt(this.toCurrency(this.childscn1Service.getStrgyLimitCash2()));
    //     this.childscn1Service.setStrgy2AprvAmt(this.toCurrency((Number(this.toNumber(this.childscn1Service.getAprvInstCashAmt())) + Number(this.toNumber(this.childscn1Service.getAprvDebtAmt()))).toString()));
    //   });
    // } else {
    this.childscn1Service.setStrgy2AprvAmt(this.toCurrency((Number(this.toNumber(this.childscn1Service.getAprvInstCashAmt())) + Number(this.toNumber(this.childscn1Service.getAprvDebtAmt()))).toString()));
    // }
  }

  getProdCode(): boolean {
    return this.childscn1Service.getProdCodeAndName().includes('0201001');
  }

  //取決策1Table
  getDSS22(amt: any, amtLb: any, max: string, min: string) {
    const url = 'f01/childscn10action3';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['strgy'] = '2';
    //測試用
    // jsonObject['applno'] = '20211116A000003';
    // jsonObject['applno'] = '20211126A000001';
    this.childscn1Service.getDate_Json(url, jsonObject).subscribe(data => {
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

        this.dss2Form1S2.patchValue({ STRGY_LIMIT_MERG_LB: this.data_number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_MERG_LB) })

        this.dss2Form1S2.patchValue({ STRGY_LIMIT_MERG_CM: this.data_number(amt.toString()) });
        this.dss2Form1S2.patchValue({ STRGY_LIMIT_MERG_LB_CM: this.data_number(amtLb.toString()) });

        this.childscn1Service.setAmt(this.toNumber(amt.toString()));
        this.childscn1Service.setAmtLb(this.toNumber(amtLb.toString()));

        this.childscn1Service.setDss2StrgyLimitMerg(Number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_MERG).toString());
        this.childscn1Service.setDss2StrgyLimitMergLb(Number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_MERG_LB).toString());
        this.childscn1Service.setStrgyLimitCash2(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_CASH != null ? Number(data.rspBody.DSS2STRGY[0].STRGY_LIMIT_CASH).toString() : '0');

        this.periodCodeCase2 = this.childscn1Service.periodCalculate(84, 12);
        if (max != null && max != '' && min != null && min != '') {
          this.childscn1Service.setStrgyPeriodMax2(max.toString());
          this.childscn1Service.setStrgyPeriodMin2(min.toString());
        }

        //20220525 為了現金方案檢核新增session
        if (this.getPage() == '3') {
          this.childscn1Service.setLimitDbr2(data.rspBody.DSS2STRGY[0].LIMIT_DBR ? Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_DBR.toString())) : 0); //限額_DBR
          this.childscn1Service.setLimitProdMax2(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MAX ? Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MAX.toString())) < 100 ? 100 : Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MAX.toString())) : 100); //限額_產品/專案額度上限
          this.childscn1Service.setLimitProdMin2(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MIN ? Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MIN.toString())) < 100 ? 100 : Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_PROD_MIN.toString())) : 100); //限額_產品/專案額度下限
          this.childscn1Service.setLimitNidmue2(data.rspBody.DSS2STRGY[0].LIMIT_NIDMUE ? Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_NIDMUE.toString())) : 0); //限額_歸戶MUE
          this.childscn1Service.setLimitLaw33Uns2(data.rspBody.DSS2STRGY[0].LIMIT_LAW33_UNS ? Number(this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_LAW33_UNS.toString())) : 0); //限額_同一自然人無擔保授信限額(銀行法第33條)
          if (this.isRpm == 'Y' || this.isRpm == 'B') {
            this.childscn1Service.setLimitLaw322(data.rspBody.DSS2STRGY[0].LIMIT_LAW32 ? this.childscn1Service.toNumber(data.rspBody.DSS2STRGY[0].LIMIT_LAW32.toString()) : '0'); //限額_本行利害關係人(銀行法第32條)
          }
        }
      }
      this.EL_DSS2_STRGY_SRATE2.data = data.rspBody.DSS2STRGYSRATE;//試算利率(多階)
      this.EL_DSS2_STRGY_MERG2.data = data.rspBody.DSS2STRGYMERG;//試算授信策略_債整明細
    });
  }

  //20220526 value 金額， type 欄位縮寫 , 20220609新增綁約期違約金
  changeForDss(value: string, type: string, chance: string) {
    if (chance == '1') {
      switch (type) {
        case 'MAX':
          this.childscn1Service.setStrgyPeriodMax1(value);
          break;
        case 'MIN':
          this.childscn1Service.setStrgyPeriodMin1(value);
          break;
        case 'STRGY_ORIGINFEE':
          this.childscn1Service.setStrgyOriginfee1(value);
          break;
        case 'STRGY_LOANEXTFEE':
          this.childscn1Service.setStrgyLoanextfee(value);
          break;
      }
    } else {
      switch (type) {
        case 'MAX':
          this.childscn1Service.setStrgyPeriodMax2(value);
          break;
        case 'MIN':
          this.childscn1Service.setStrgyPeriodMin2(value);
          break;
        case 'STRGY_ORIGINFEE':
          this.childscn1Service.setStrgyOriginfee2(value);
          break;
      }
    }
  }

  //20220609新增綁約期違約金
  changeStrgyRepayrate(data: any, field: string, strgy: string, index: string) {
    switch (field) {
      case 'AP':
        strgy == '1' ? this.elCreditRepayrateOne[Number(index)].activePeriod = data.activePeriod
          : this.elCreditRepayrateTwo[Number(index)].activePeriod = data.activePeriod;
        strgy == '1' ? this.childscn1Service.setElCreditRepayrateOne(this.elCreditRepayrateOne) : this.childscn1Service.setElCreditRepayrateTwo(this.elCreditRepayrateTwo);
        if ((data.activePeriod == '' || data.activePeriod == null) && data.activePeriod != '0') {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "數值不可為空!" }
          });
          childernDialogRef.afterClosed().subscribe(result => {
            data.activePeriod = '0';
            strgy == '1' ? this.elCreditRepayrateOne[Number(index)].activePeriod = data.activePeriod
              : this.elCreditRepayrateTwo[Number(index)].activePeriod = data.activePeriod;
            strgy == '1' ? this.childscn1Service.setElCreditRepayrateOne(this.elCreditRepayrateOne) : this.childscn1Service.setElCreditRepayrateTwo(this.elCreditRepayrateTwo);
          });
        }
        break;
      case 'ER':
        strgy == '1' ? this.elCreditRepayrateOne[Number(index)].earlyRepayRt = data.earlyRepayRt
          : this.elCreditRepayrateTwo[Number(index)].earlyRepayRt = data.earlyRepayRt;
        strgy == '1' ? this.childscn1Service.setElCreditRepayrateOne(this.elCreditRepayrateOne) : this.childscn1Service.setElCreditRepayrateTwo(this.elCreditRepayrateTwo);
        if ((data.earlyRepayRt == '' || data.earlyRepayRt == null) && data.earlyRepayRt != '0') {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "數值不可為空!" }
          });
          childernDialogRef.afterClosed().subscribe(result => {
            data.earlyRepayRt = '0';
            strgy == '1' ? this.elCreditRepayrateOne[Number(index)].earlyRepayRt = data.earlyRepayRt
              : this.elCreditRepayrateTwo[Number(index)].earlyRepayRt = data.earlyRepayRt;
            strgy == '1' ? this.childscn1Service.setElCreditRepayrateOne(this.elCreditRepayrateOne) : this.childscn1Service.setElCreditRepayrateTwo(this.elCreditRepayrateTwo);
          });
        }
        break;
    }
  }
  //下拉選單名稱
  defineName(i: string) {
    switch (i) {
      case '2':
        this.title = '選擇授信人員';
        break;
      case '3':
        this.title = '選擇授信覆核人員'
        break;
    }
  }

  gettitle(i: string) {
    const url = 'f01/childscn1action8';
    let jsonObject: any = {};
    jsonObject['creditlevel'] = i;
    jsonObject['creditaction'] = this.applno.includes('B') == true ? 'B' : 'A';
    this.childscn1Service.getDate_Json(url, jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.UpEmpOption) {
        const codeNo = jsonObj.EMP_NO;
        const desc = jsonObj.EMP_NAME;
        if (codeNo != this.userId) {
          this.titleList.push({ value: codeNo, viewValue: desc })
        }

      }
    })
  }

  getAddName(value: string): string {
    switch (value) {
      case 'L0':
        return '部主管';
      case 'S2':
        return '風管處處長';
      case 'S3':
        return '產品處處長';
      case 'S1':
        return '總經理';
      case 'R0':
        return '申覆-產品流程0';
      case 'R1':
        return '申覆-產品流程1';
      case 'R2':
        return '申覆-產品流程2';
      case 'R3':
        return '申覆-產品流程3';
    }
    return '';
  }
}
