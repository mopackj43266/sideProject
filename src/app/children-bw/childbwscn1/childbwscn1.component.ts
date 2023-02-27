import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { OptionsCode } from 'src/app/interface/base';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childbwscn1Service } from './childbwscn1.service';
import { Childbwscn1editComponent } from './childbwscn1edit/childbwscn1edit.component';
import { BaseService } from 'src/app/base.service';

//bwCreditMainList 覆審資訊
interface bwCreditMainList_View {
  applno: string//案件編號
  nationalId: string//身分證字號
  custId: string//客戶ID
  cuCname: string//姓名
  abnormalFlag: string//符合貸後異常名單
  //客戶身分名單註記
}
//bwCreditAuditinfoList DSS決策結果
interface bwCreditAuditinfoList_View {
  rvprcscd: string//系統流程
  rvstatcd: string//貸後管理狀態
  rvcollflag: string//貸後管理註記
  rvcrl: string//本次客戶風險等級CRL
  jcicdatadt: string//本次執行審查使用之JCIC資料日期
  rvRiskmdsub: string//風險模型子模型
  rvRiskmdscore: string//分數
  rvRiskmdgrade: string//等級
  rvRiskmdgradeGp: string//等級分群
  rvRiskmdgradeAdj: string//等級(策略調整後)
  rvRiskmdgradeGpAdj: string//等級分群(策略調整後)
}

//Nick 審核資料
@Component({
  selector: 'app-childbwscn1',
  templateUrl: './childbwscn1.component.html',
  styleUrls: ['./childbwscn1.component.css', '../../../assets/css/child.css']
})
export class Childbwscn1Component implements OnInit {

  constructor(
    public dialog: MatDialog,
    public childbwscn1Service: Childbwscn1Service,
  ) { }

  applno: string;
  cuCName: string;
  custId: string;
  nationalId: string;
  mark: string;
  userId: string;
  size = 0//此層級是否有資料
  search: string;
  private page: string;
  //覆審:L4 覆審主管:L3
  private creditlevel = ""; //儲存層級
  creditaction: ""; //審核註記

  ynCode: OptionsCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' }];

  //Creditmemo
  creditmemoSource: Data[] = [];
  bwCreditAuditinfoList: Data[] = [];
  add_bwCreditAuditinfoList: any;
  bwCreditMainList: Data[] = [];
  add_bwCreditMainList: any;
  total = 1;
  pageIndex = 1;
  pageSize = 50;

  //審核結果
  BW_creditResult: string
  //審核結果選項
  BW_creditResult_Code: OptionsCode[] = [{ value: 'FRZ', viewValue: 'FRZ' }, { value: 'DWN', viewValue: 'DWN' }, { value: 'HLD', viewValue: 'HLD' }
    , { value: 'NEX', viewValue: 'NEX' }, { value: 'N00', viewValue: 'N00' }, { value: 'XXX', viewValue: 'XXX' }, { value: '000', viewValue: '000' }];

  ngOnInit(): void {
    this.page = sessionStorage.getItem('page');
    this.applno = sessionStorage.getItem('applno');
    this.nationalId = sessionStorage.getItem('nationalId');
    this.userId = BaseService.userId;
    this.custId = sessionStorage.getItem('swcCustId');
    sessionStorage.setItem('BW_creditResult', "");
    sessionStorage.setItem('size', "0");
    this.search = sessionStorage.getItem('search');
    sessionStorage.setItem('creditaction', "");
    this.creditlevel = this.page == "9" ? "L4" : this.creditlevel;
    this.creditlevel = this.page == "10" ? "L3" : this.creditlevel;
    this.getCreditmemo(this.pageIndex, this.pageSize);
    this.getCreditMainList();
  }

  //查詢 審核意見
  getCreditmemo(pageIndex: number, pageSize: number) {
    const url = 'f01/childbwscn1scn1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.childbwscn1Service.postJson(url, jsonObject).subscribe(data => {
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

  // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管  12產生合約前覆核 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
  getPage() {
    return this.page
  }

  //是否為查詢
  getSearch() {
    return this.search
  }

  //查詢 上方主資料
  getCreditMainList() {
    const url = 'f01/childbwscn1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childbwscn1Service.postJson(url, jsonObject).subscribe(data => {
      this.bwCreditAuditinfoList = data.rspBody.bwCreditAuditinfoList;
      this.bwCreditMainList = data.rspBody.bwCreditMainList;
      if (this.bwCreditAuditinfoList.length < 1) {
        this.add_bwCreditAuditinfoList = {
          rvprcscd: '',//系統流程
          rvstatcd: '',//貸後管理狀態
          rvcollflag: '',//貸後管理註記
          rvcrl: '',//本次客戶風險等級CRL
          jcicdatadt: '',//本次執行審查使用之JCIC資料日期
          rvRiskmdsub: '',//風險模型子模型
          rvRiskmdscore: '',//分數
          rvRiskmdgrade: '',//等級
          rvRiskmdgradeGp: '',//等級分群
          rvRiskmdgradeAdj: '',//等級(策略調整後)
          rvRiskmdgradeGpAdj: ''//等級分群(策略調整後)}]
        }
        this.bwCreditAuditinfoList.push(this.add_bwCreditAuditinfoList);
      }
      if (this.bwCreditMainList.length < 1) {
        this.add_bwCreditMainList = {
          applno: this.applno,//案件編號
          nationalId: '',//身分證字號
          custId: '',//客戶ID
          cuCname: '',//姓名
          abnormalFlag: '' //符合貸後異常名單
          //客戶身分名單註記
        }
        this.bwCreditMainList.push(this.add_bwCreditMainList);
      }
    });
  }

  //儲存
  async save() {
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
    msg = await this.childbwscn1Service.saveCreditmemo(url, jsonObject);
    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msg }
    });
    this.changePage();
    this.getCreditmemo(this.pageIndex, this.pageSize);
  }

  changePage() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 1;
  }

  //審核註記編輯
  startEdit(creditaction: string, rowId: string) {
    const dialogRef = this.dialog.open(Childbwscn1editComponent, {
      minHeight: '70vh',
      width: '50%',
      panelClass: 'mat-dialog-transparent',
      data: {
        creditaction: creditaction,
        applno: this.applno,
        level: this.creditlevel,
        rowId: rowId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCreditmemo(this.pageIndex, this.pageSize);
    });
  }

  //審核結果 資料改變
  radio_change() {
    sessionStorage.setItem('BW_creditResult', this.BW_creditResult);
    // alert(sessionStorage.getItem('BW_creditResult'));
  }

  creditaction_keyup() {
    sessionStorage.setItem('creditaction', this.creditaction);
  }

  //Level轉換中文
  changeLevel(level: string) {
    if (level == 'L4') {
      return "覆審人員"
    } else if (level == 'L3') {
      return "覆審主管"
    }
  }
}
