import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Childbwscn2Service } from '../childbwscn2.service';
import { MatTableDataSource } from '@angular/material/table';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n'
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { BaseService } from 'src/app/base.service';
import { DatePipe } from '@angular/common';

//Nick 決策結果
interface sysCode {
  value: string;
  viewValue: string;
  level?: string;
}
@Component({
  selector: 'app-childbwscn2page1',
  templateUrl: './childbwscn2page1.component.html',
  styleUrls: ['./childbwscn2page1.component.css', '../../../../assets/css/child.css']
})
export class childbwscn2page1Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    public Childbwscn2Service: Childbwscn2Service,
    private nzI18nService: NzI18nService,
    private pipe: DatePipe,
    public dialog: MatDialog,) {
    this.nzI18nService.setLocale(zh_TW)
  }

  private applno: string;
  private page: string;
  //覆審:L4 覆審主管:L3
  private creditlevel = ""; //儲存層級
  //覆審資訊
  bwCreditAuditinfoList: Data[] = [];
  bwCreditMainList: Data[] = [];
  add_bwCreditMainList: any;
  add_bwCreditAuditinfoList: any;
  cuCName: string;
  custId: string;
  nationalId: string;
  userId: string;
  creditaction: string = ""; //審核註記
  total = 1;
  i = 0;
  pageIndex = 1;
  pageSize = 50;
  creditmemoSource: Data[] = [];
  search: string;
  size = 0//此層級是否有資料
  mark: string;
  //審核結果
  BW_creditResult: string
  reason_CODE: sysCode[] = [];//本次執行原因陣列
  reasoncode: string = '';//本次執行原因
  reason_DETAIL: sysCode[] = [];//本次執行原因細項陣列
  reasondetail: string = '';//本次執行原因細項
  limitList: sysCode[] = [];//額度號陣列
  limit: string = '';//額度
  preempt: string;//預佔額度
  //審核結果選項
  ThisTime: string;//本次查詢時間
  // BW_creditResult_Code: OptionsCode[] = [{ value: 'FRZ', viewValue: 'FRZ-凍結額度' }, { value: 'DWN', viewValue: 'DWN-預佔降額' }, { value: 'HLD', viewValue: 'HLD-觀察' }
  //   , { value: 'NEX', viewValue: 'NEX-進入展期' }, { value: 'N00', viewValue: 'N00-正常' }, { value: '000', viewValue: '000-正常結清' }, { value: 'XXX', viewValue: 'XXX-非貸後管理範圍' }];
  BW_creditResult_Code: OptionsCode[] = [{ value: 'FRZ', viewValue: 'FRZ-凍結額度' }, { value: 'DWN', viewValue: 'DWN-預佔降額' }, { value: 'HLD', viewValue: 'HLD-觀察' }
    , { value: 'N00', viewValue: 'N00-正常' }, { value: '000', viewValue: '000-正常結清' }, { value: 'XXX', viewValue: 'XXX-非貸後管理範圍' }];

  ynCode: OptionsCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' }];


  //策略1
  EL_DSS4_UNDW_LIST = new MatTableDataSource<any>();//徵審代碼
  EL_DSS4_UNDW_LIST1 = new MatTableDataSource<any>();//徵審代碼-信用異常資訊
  EL_DSS4_UNDW_LIST2 = new MatTableDataSource<any>();//徵審代碼-整體往來
  EL_DSS4_UNDW_LIST3 = new MatTableDataSource<any>();//徵審代碼-信用卡往來
  EL_DSS4_UNDW_LIST4 = new MatTableDataSource<any>();//徵審代碼-授信往來
  EL_DSS4_UNDW_LIST5 = new MatTableDataSource<any>();//徵審代碼-其他
  BW_DSS4_CFC_LIMIT = new MatTableDataSource<any>();//額度策略


  dss1Form1: FormGroup = this.fb.group({
    //系統決策
    RVPRCSCD: ['', []],//系統流程
    RVSTATCD: ['', []],//貸後管理狀態(策略調整後)
    RVSTATCD_ORGINAL: ['', []],//貸後管理狀態(策略調整前)

    //案件資訊
    RVCOLLFLAG: ['', []],//貸後管理註記
    JCICDATADT: ['', []],//貸後JCIC時間
    RVCRL: ['', []],//客戶風險等級CRL
    DEFTSTAT_INLB: ['', []],//行內消金最嚴重狀態
    DEFTSTAT_INJCIC: ['', []],//行外JCIC最嚴重狀態
    RV_NEXTDT: ['', []],//下次審查日期
    RV_NEXTDT_JCICREFRESHDAYS: ['', []],//下次審查日JCIC新鮮期天數
    RV_NEXTDT_QRYITEM: ['', []],//下次審查日發查範圍
    RV_MINPAYRT: ['', []],//每月最低還款比例
    RV_DISB_BTCR_YN: ['', []],//結帳日至還款日間可否動撥
    RV_RL_DISB_THRHLD: ['', []],//循環信貸動撥金額門檻

    //貸後-風險模型資訊
    RISKMDGRAD_DIFF: ['', []],//與上次等級差距(策略調整後)
    RV_RISKMDSUB: ['', []],//子模型
    RV_RISKMDSCORE: ['', []],//分數
    RV_RISKMDGRADE: ['', []],//等級
    RV_RISKMDGRADE_ADJ: ['', []],//等級(策略調整後)
    RV_RISKMDGRADE_GP: ['', []],//分群
    RV_RISKMDGRADE_GP_ADJ: ['', []],//分群(策略調整後)

    // JCIC註記
    BAM011_PASSDUE_CNT: ['', []],//BAM011最新延遲筆數統計
    BAM070_PASSDUE_CNT: ['', []],//BAM070現金卡日報逾期筆數統計
    LB_REVLN_USAGERT: ['', []],//本行循環信貸目前動用率
    JAS002_Y: ['', []],//信用異常註記JAS002
    VAM108_FY: ['', []],//受監護輔助宣告註記
    VAM106_ABNRMAL: ['', []],//信用異常註記VAM106
    VAM107_ABNRMAL: ['', []],//信用異常註記VAM107
    VAM108_ABNRMAL: ['', []],//信用異常註記VAM108
    BAM305_PASSDUEAMT: ['', []],//保證債務逾期金額
    BAM306_PASSDUEAMT: ['', []],//保證債務逾期金額
    BAM307_PASSDUEAMT: ['', []],//保證債務逾期金額
    UNSDEBT_AMT_501EX: ['', []],//無擔保負債(不含本行)_BAM501月報
    UNSDEBT_AMT_504EX: ['', []],//無擔保負債(不含本行)_BAM504扣除鑑價值
    UNSDEBT_AMTNEW_505EX: ['', []],//無擔保負債(不含本行)_BAM505新增核准額度
    UNSDEBT_AMTNEW_029EX: ['', []],//無擔保負債(不含本行)_BAM029新增核准額度
    UNSDEBT_824_RLLIMIT: ['', []],//本行無擔保負債_循環信貸額度
    UNSDEBT_824_ILBAL: ['', []],//本行無擔保負債_分期信貸放款餘額
    UNSDEBT_824_CCRBAL: ['', []],//本行無擔保負債_信用卡循環預借未到期 (預留)
    UNSDEBT_PAYAMT_029EX: ['', []],//(減項) 無擔保負債(不含本行)_BAM029清償金額
    DBR: ['', []],//無擔保倍數


  });



  ngOnInit(): void {
    this.getDSS11();
    this.applno = sessionStorage.getItem('applno');
    this.nationalId = sessionStorage.getItem('nationalId');
    this.userId = BaseService.userId;
    this.custId = sessionStorage.getItem('custId');
    this.search = sessionStorage.getItem('search');
    this.page = sessionStorage.getItem('page');
    this.creditlevel = this.page == "9" ? "L4" : this.creditlevel;
    this.creditlevel = this.page == "10" ? "L3" : this.creditlevel;
    this.getCreditMainList();
  }
  //取決策1Table
  getDSS11() {
    this.applno = sessionStorage.getItem('applno');
    const url = 'f01/childBwScn2action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.Childbwscn2Service.getDate_Json(url, jsonObject).subscribe(data => {

      if (data.rspBody.bwDss4List != null && data.rspBody.bwDss4List.length > 0) {

        this.ThisTime = data.rspBody.QUERY_DATE//貸後JCIC時間

        //系統決策
        this.dss1Form1.patchValue({ RVPRCSCD: data.rspBody.bwDss4List[0].rvprcscd })//系統流程
        this.dss1Form1.patchValue({ RVSTATCD: data.rspBody.bwDss4List[0].rvstatcd })//貸後管理狀態(策略調整後)
        this.dss1Form1.patchValue({ RVSTATCD_ORGINAL: data.rspBody.bwDss4List[0].rvstatcdOrginal })//貸後管理狀態(策略調整前)
        //案件資訊
        this.dss1Form1.patchValue({ RVCOLLFLAG: data.rspBody.bwDss4List[0].rvcollflag })//貸後管理註記
        let strjcicdatadt = ''
        if (data.rspBody.bwDss4List[0].jcicdatadt != null && data.rspBody.bwDss4List[0].jcicdatadt.length == 14) {
          strjcicdatadt = data.rspBody.bwDss4List[0].jcicdatadt.substring(0, 4) + '-' + data.rspBody.bwDss4List[0].jcicdatadt.substring(4, 6) + '-'
            + data.rspBody.bwDss4List[0].jcicdatadt.substring(6, 8) + ' ' + data.rspBody.bwDss4List[0].jcicdatadt.substring(8, 10) +
            ':' + data.rspBody.bwDss4List[0].jcicdatadt.substring(10, 12) + ':' + data.rspBody.bwDss4List[0].jcicdatadt.substring(12, 14);
        }
        this.dss1Form1.patchValue({ JCICDATADT: strjcicdatadt })//貸後JCIC時間
        this.dss1Form1.patchValue({ RVCRL: data.rspBody.bwDss4List[0].rvcrl })//客戶風險等級CRL
        this.dss1Form1.patchValue({ DEFTSTAT_INLB: data.rspBody.bwDss4List[0].deftstatInlb })//行內消金最嚴重狀態
        this.dss1Form1.patchValue({ DEFTSTAT_INJCIC: data.rspBody.bwDss4List[0].deftstatInjcic })//行外JCIC最嚴重狀態
        this.dss1Form1.patchValue({ RV_NEXTDT: data.rspBody.bwDss4List[0].rvNextdt })//下次審查日期
        this.dss1Form1.patchValue({ RV_NEXTDT_JCICREFRESHDAYS: data.rspBody.bwDss4List[0].rvNextdtJcicrefreshdays })//下次審查日JCIC新鮮期天數
        this.dss1Form1.patchValue({ RV_NEXTDT_QRYITEM: data.rspBody.bwDss4List[0].rvNextdtQryitem })//下次審查日發查範圍
        this.dss1Form1.patchValue({ RV_MINPAYRT: data.rspBody.bwDss4List[0].rvMinpayrt })//每月最低還款比例
        this.dss1Form1.patchValue({ RV_DISB_BTCR_YN: data.rspBody.bwDss4List[0].rvDisbBtcrYn })//結帳日至還款日間可否動撥
        this.dss1Form1.patchValue({ RV_RL_DISB_THRHLD: this.toCurrency(data.rspBody.bwDss4List[0].rvRlDisbThrhld) })//循環信貸動撥金額門檻
        //貸後-風險模型資訊
        this.dss1Form1.patchValue({ RISKMDGRAD_DIFF: data.rspBody.bwDss4List[0].riskmdgradDiff })//與上次等級差距(策略調整後)
        this.dss1Form1.patchValue({ RV_RISKMDSUB: data.rspBody.bwDss4List[0].rvRiskmdsub })//子模型
        this.dss1Form1.patchValue({ RV_RISKMDSCORE: data.rspBody.bwDss4List[0].rvRiskmdscore })//分數
        this.dss1Form1.patchValue({ RV_RISKMDGRADE: data.rspBody.bwDss4List[0].rvRiskmdgrade })//等級
        this.dss1Form1.patchValue({ RV_RISKMDGRADE_ADJ: data.rspBody.bwDss4List[0].rvRiskmdgradeAdj })//等級(策略調整後)
        this.dss1Form1.patchValue({ RV_RISKMDGRADE_GP: data.rspBody.bwDss4List[0].rvRiskmdgradeGp })//分群
        this.dss1Form1.patchValue({ RV_RISKMDGRADE_GP_ADJ: data.rspBody.bwDss4List[0].rvRiskmdgradeGpAdj })//分群(策略調整後)
        //JCIC註記
        this.dss1Form1.patchValue({ BAM011_PASSDUE_CNT: data.rspBody.bwDss4List[0].bam011PassdueCnt })//BAM011最新延遲筆數統計
        this.dss1Form1.patchValue({ BAM070_PASSDUE_CNT: data.rspBody.bwDss4List[0].bam070PassdueCnt })//BAM070現金卡日報逾期筆數統計
        this.dss1Form1.patchValue({ LB_REVLN_USAGERT: data.rspBody.bwDss4List[0].lbRevlnUsagert })//本行循環信貸目前動用率
        this.dss1Form1.patchValue({ JAS002_Y: data.rspBody.bwDss4List[0].jas002Y })//信用異常註記JAS002
        this.dss1Form1.patchValue({ VAM108_FY: data.rspBody.bwDss4List[0].vam108Fy })//受監護輔助宣告註記
        this.dss1Form1.patchValue({ VAM106_ABNRMAL: data.rspBody.bwDss4List[0].vam106Abnrmal })//信用異常註記VAM106
        this.dss1Form1.patchValue({ VAM107_ABNRMAL: data.rspBody.bwDss4List[0].vam107Abnrmal })//信用異常註記VAM107
        this.dss1Form1.patchValue({ VAM108_ABNRMAL: data.rspBody.bwDss4List[0].vam108Abnrmal })//信用異常註記VAM108
        this.dss1Form1.patchValue({ BAM305_PASSDUEAMT: this.toCurrency(data.rspBody.bwDss4List[0].bam305Passdueamt) })//保證債務逾期金額
        this.dss1Form1.patchValue({ BAM306_PASSDUEAMT: this.toCurrency(data.rspBody.bwDss4List[0].bam306Passdueamt) })//保證債務逾期金額
        this.dss1Form1.patchValue({ BAM307_PASSDUEAMT: this.toCurrency(data.rspBody.bwDss4List[0].bam307Passdueamt) })//保證債務逾期金額
        this.dss1Form1.patchValue({ UNSDEBT_AMT_501EX: this.toCurrency(data.rspBody.bwDss4List[0].unsdebtAmt501ex) })//無擔保負債(不含本行)_BAM501月報
        this.dss1Form1.patchValue({ UNSDEBT_AMT_504EX: data.rspBody.bwDss4List[0].unsdebtAmt504ex })//無擔保負債(不含本行)_BAM504扣除鑑價值
        this.dss1Form1.patchValue({ UNSDEBT_AMTNEW_505EX: this.toCurrency(data.rspBody.bwDss4List[0].unsdebtAmtnew505ex) })//無擔保負債(不含本行)_BAM505新增核准額度
        this.dss1Form1.patchValue({ UNSDEBT_AMTNEW_029EX: this.toCurrency(data.rspBody.bwDss4List[0].unsdebtAmtnew029ex) })//無擔保負債(不含本行)_BAM029新增核准額度
        this.dss1Form1.patchValue({ UNSDEBT_824_RLLIMIT: this.toCurrency(data.rspBody.bwDss4List[0].unsdebt824Rllimit) })//本行無擔保負債_循環信貸額度
        this.dss1Form1.patchValue({ UNSDEBT_824_ILBAL: this.toCurrency(data.rspBody.bwDss4List[0].unsdebt824Ilbal) })//本行無擔保負債_分期信貸放款餘額
        this.dss1Form1.patchValue({ UNSDEBT_824_CCRBAL: data.rspBody.bwDss4List[0].unsdebt824Ccrbal })//本行無擔保負債_信用卡循環預借未到期 (預留
        this.dss1Form1.patchValue({ UNSDEBT_PAYAMT_029EX: this.toCurrency(data.rspBody.bwDss4List[0].unsdebtPayamt029ex) })//(減項) 無擔保負債(不含本行)_BAM029清償金額
        this.dss1Form1.patchValue({ DBR: data.rspBody.bwDss4List[0].dbr })//無擔保倍數

      }

      this.EL_DSS4_UNDW_LIST.data = data.rspBody.bwDss4UndwList;//徵審代碼
      if (data.rspBody.bwDss4UndwList != null && data.rspBody.bwDss4UndwList.length > 0) {
        this.EL_DSS4_UNDW_LIST1.data = this.EL_DSS4_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '1');//1	信用異常資訊
        this.EL_DSS4_UNDW_LIST2.data = this.EL_DSS4_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '2');//2	整體往來
        this.EL_DSS4_UNDW_LIST3.data = this.EL_DSS4_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '3');//3	信用卡往來
        this.EL_DSS4_UNDW_LIST4.data = this.EL_DSS4_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '4');//4	授信往來
        this.EL_DSS4_UNDW_LIST5.data = this.EL_DSS4_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '9');//9	其他
      }
      if (data.rspBody.bwDss4CfcLimit != null) {
        this.BW_DSS4_CFC_LIMIT.data = data.rspBody.bwDss4CfcLimit;//試算額度策略
      }

    });
  }
  //查詢 上方主資料
  getCreditMainList() {
    const url = 'f01/childbwscn1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.Childbwscn2Service.getDate_Json(url, jsonObject).subscribe(data => {
      this.bwCreditMainList = data.rspBody.bwCreditMainList;
      if (this.bwCreditMainList.length < 1) {
        this.add_bwCreditMainList = {
          applno: this.applno,//案件編號
          nationalId: '',//身分證字號
          custId: '',//客戶ID
          cuCname: '',//姓名
          abnormalFlag: '', //符合貸後異常名單
          custContent:''//客戶身分名單註記
        }
        this.bwCreditMainList.push(this.add_bwCreditMainList);
      }
      this.limitList.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.limitList) {
        const value = jsonObj['limitNo'];
        const viewValue = jsonObj['limitNo'];
        const level = jsonObj['levelNo'];
        this.limitList.push({ value: value, viewValue: viewValue, level: level })
      }
      this.reason_CODE = [];
      this.reason_CODE.push({ value: '', viewValue: '請選擇' })
      this.reason_DETAIL = [];
      this.reason_DETAIL.push({ value: '', viewValue: '請選擇' })
      for (const json of data.rspBody.bwCreditMainList) {
        if (json.creditResult != null && json.creditResult != '') {
          this.BW_creditResult = json.creditResult;
          this.radio_change();
          this.reasoncode = json.reasonCode;
          if (json.reasonCode != null && json.reasonCode != '') {
            this.reason(json.reasonDetail);
          }
          else {
            this.reasoncode = '';
          }

          if (json.limitNo != "null" && json.limitNo != '' && json.limitNo != null) {
            this.limit = json.limitNo;
          }
          else {
            this.limit = '';
          }
          if (json.reserveLimit != "" && json.reserveLimit != null) {
            this.dealwith(json.reserveLimit + "");
          }

        }
      }
      this.ttemporarilyest();

    })
  }

  creditaction_keyup() {
    sessionStorage.setItem('creditaction', this.creditaction);
  }
  // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管  12產生合約前覆核 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
  getPage() {
    return this.page
  }
  //查詢 審核意見
  getCreditmemo(pageIndex: number, pageSize: number) {
    const url = 'f01/childbwscn1scn1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.Childbwscn2Service.getDate_Json(url, jsonObject).subscribe(data => {
      this.creditmemoSource = data.rspBody.list;
      for (const data of this.creditmemoSource) {
        this.size = (data.CREDITLEVEL != null && data.CREDITLEVEL == this.creditlevel) ? this.size + 1 : this.size;//判斷是否有資料
        if (data.CREDITLEVEL == this.creditlevel && data.CREDITUSER.includes(this.userId)) {
          this.mark = data.CREDITACTION;
        }
      }
      sessionStorage.setItem('size', this.size.toString());
    });
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params
    this.pageSize = pageSize
    this.pageIndex = pageIndex
    this.getCreditmemo(pageIndex, pageSize)
  }
  //儲存
  save() {
    if (this.creditaction == "" || this.creditaction == null) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請輸入審核意見' }
      });
      return;
    }
    let msg = "";
    const url = 'f01/childbwscn1action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['creditaction'] = this.creditaction;
    jsonObject['creditlevel'] = this.creditlevel;
    this.Childbwscn2Service.getDate_Json(url, jsonObject).subscribe(data => {
      msg = data.rspMsg;
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msg }
      });
      this.changePage();
      this.getCreditmemo(this.pageIndex, this.pageSize);
    });
  }
  changePage() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 1;
  }
  //Level轉換中文
  changeLevel(level: string) {
    if (level == 'L4') {
      return "覆審人員"
    } else if (level == 'L3') {
      return "覆審主管"
    }
  }
  //審核結果 資料改變
  radio_change() {

    this.filter();
    this.ttemporarilyest();

    if (this.i > 0) {
      this.reason_DETAIL = [];
      this.reason_DETAIL.push({ value: '', viewValue: '請選擇' })
      this.reasoncode = '';
      this.reasondetail = '';
      this.limit = '';
      this.preempt = "0";
    }


  }
  test() {
  }
  ttemporarilyest()//暫存
  {
    sessionStorage.setItem('BW_creditResult', this.BW_creditResult);
    sessionStorage.setItem('BW_reasonCode', this.reasoncode);
    sessionStorage.setItem('BW_reasondetail', this.reasondetail);
    sessionStorage.setItem('BW_limit', this.limit);
    sessionStorage.setItem('BW_preempt', this.preempt != undefined ? (this.preempt.replace(/,/g, "")) : "0");
    this.i = this.i + 1;
  }


  filter() {
    this.reason_CODE = [];
    this.reason_CODE.push({ value: '', viewValue: '請選擇' })
    const url = 'f01/childbwscn1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.Childbwscn2Service.getDate_Json(url, jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.reasonCode) {
        const value = jsonObj['reasonCode'];
        const viewValue = jsonObj['reasonDesc'];
        switch (this.BW_creditResult) {
          case 'FRZ':
            if (value != 'D' && value != 'E' && value != 'B') {
              this.reason_CODE.push({ value: value, viewValue: viewValue })
            }
            break;
          case 'HLD':
            if (value != 'C' && value != 'E' && value != 'A') {
              this.reason_CODE.push({ value: value, viewValue: viewValue })
            }
            break;
          case 'DWN':
            if (value != 'D' && value != 'C') {
              this.reason_CODE.push({ value: value, viewValue: viewValue })
            }
            break;


        }

      }

    })
  }
  //是否為查詢
  getSearch() {
    return this.search
  }
  reason(i: string)//本次執行原因
  {

    this.reason_DETAIL = [];
    let url = 'f01/childbwscn1action3'
    let jsonObject: any = {};
    jsonObject['reasonCode'] = this.reasoncode;
    this.Childbwscn2Service.getDate_Json(url, jsonObject).subscribe(data => {
      this.reason_DETAIL.push({ value: '', viewValue: '請選擇' })

      for (const jsonObj of data.rspBody) {
        const value = jsonObj['reasonCode'];
        const viewValue = jsonObj['reasonDesc'];
        this.reason_DETAIL.push({ value: value, viewValue: viewValue })
      }

      if (i != null && i != '') {
        this.reasondetail = i;

      }
      this.ttemporarilyest();

    })

  }
  dealwith(x: string)//篩選加千分號
  {
    x = x.replace(/\D/g, '')
    if (x.length > 0) {
      x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    this.preempt = x;
    this.ttemporarilyest();
  }
  Cut(s: string)//處理千分位
  {
    // if (s != null) {
    //   s = s.replace(/,/g, "")
    // }

    return s
  }
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
}
