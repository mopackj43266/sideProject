import { Component, Input, OnInit } from '@angular/core';
import { F01008scn4Service } from '../f01008scn4.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table'
import { FormGroup, FormBuilder } from '@angular/forms';
import { formatDate } from '@angular/common';

//Nick
@Component({
  selector: 'app-f01008scn4page1',
  templateUrl: './f01008scn4page1.component.html',
  styleUrls: ['./f01008scn4page1.component.css', '.../../../assets/css/child.css']
})
export class F01008scn4page1Component implements OnInit {
  @Input()closeButton: boolean=false;
  constructor(
    private f01008scn4Service: F01008scn4Service,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) { }
  private applno: string;
  private search: string;
  fmData_M = new MatTableDataSource<any>();//DBR收支表資料 徵信

  EL_DSS3_UNDW_LIST = new MatTableDataSource<any>();//徵審代碼
  EL_DSS3_UNDW_LIST1 = new MatTableDataSource<any>();//徵審代碼-信用異常資訊
  EL_DSS3_UNDW_LIST2 = new MatTableDataSource<any>();//徵審代碼-整體往來
  EL_DSS3_UNDW_LIST3 = new MatTableDataSource<any>();//徵審代碼-信用卡往來
  EL_DSS3_UNDW_LIST4 = new MatTableDataSource<any>();//徵審代碼-授信往來
  EL_DSS3_UNDW_LIST5 = new MatTableDataSource<any>();//徵審代碼-其他
  ngOnChanges(){
    return this.closeButton

  }
  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.getDBR_DTI_M();
    this.getDSS3();
  }

  QUERY_DATE = "";
  SYSFLOWCD = "";
  RESLTCD = "";

  getSearch(): string {
    return this.search;

  }

  //去除符號中文
  data_number1(x: string) {
    if (x != null) {
      x = x.replace(/[^\d]/g, '');
      x = parseInt(x.toString()).toString() == 'NaN' ? '' : parseInt(x.toString()).toString();//去掉數字前面的0
      x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return x
  }
  //去除符號中文 可負號
  data_number2(x: string) {
    this.toINT(x);
    if (x != null) {
      if (x.indexOf('-') == 0 && x.length > 1) {
        x = x.replace(/[^\d]/g, '');
        x = parseInt(x.toString()).toString() == 'NaN' ? '' : parseInt(x.toString()).toString();//去掉數字前面的0
        x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        x = '-' + x;
      } else {
        x = x.replace(/[^\d-]/g, '');
        x = parseInt(x.toString()).toString() == 'NaN' ? '' : parseInt(x.toString()).toString();//去掉數字前面的0
        x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
    return x
  }

   //去除符號中文 可負號.
   data_number3(x: string) {
    this.toINT(x);
    if (x != null) {
      if (x.indexOf('-') == 0 && x.length > 1) {
        x = x.replace(/[^\d.]/g, '');
        x = parseInt(x.toString()).toString() == 'NaN' ? '' : parseInt(x.toString()).toString();//去掉數字前面的0
        x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        x = '-' + x;
      } else {
        x = x.replace(/[^\d-.]/g, '');
        x = parseInt(x.toString()).toString() == 'NaN' ? '' : parseInt(x.toString()).toString();//去掉數字前面的0
        x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
    return x
  }

  //去除符號/中文 可負號 儲存用
  save_data_number(x: string) {
    //不可空白null 自動補0
    if (x == null || x == "") {
      return '0'
    }
    x = x.replace(/[^\d]/g, '');
    return x
  }

  //去除符號/中文 可負號 儲存用
  save_data_number2(x: string) {
    //不可空白null 自動補0
    if (x == null || x == "") {
      return '0'
    }
    x = x.replace(/[^\d-]/g, '');
    return x
  }

  //去掉小數
  toINT(x: string) {
    if (x != null) {
      x = x.toString().split('.')[0];
    }
    return x
  }

  //取DBR收支表資料 產生合約前回查 _M前端欄位改取_B
  getDBR_DTI_M() {

    const url = 'f01/childscn10action6';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    // 測試用
    // jsonObject['applno'] = '20211215A000077';
    this.f01008scn4Service.postJson(url, jsonObject).subscribe(data => {
      if (data.rspBody.length > 0) {
        this.fmData_M.data = data.rspBody
        this.fmData_M.data[0].unsdebt_AMT_501EX = this.toINT(this.fmData_M.data[0].unsdebt_AMT_501EX);
        this.fmData_M.data[0].unsdebt_AMT_504EX = this.toINT(this.fmData_M.data[0].unsdebt_AMT_504EX);
        this.fmData_M.data[0].unsdebt_AMTNEW_505EX = this.toINT(this.fmData_M.data[0].unsdebt_AMTNEW_505EX);
        this.fmData_M.data[0].unsdebt_AMTNEW_029EX = this.toINT(this.fmData_M.data[0].unsdebt_AMTNEW_029EX);
        this.fmData_M.data[0].unsdebt_824_RLLIMIT = this.toINT(this.fmData_M.data[0].unsdebt_824_RLLIMIT);
        this.fmData_M.data[0].unsdebt_824_RLBAL = this.toINT(this.fmData_M.data[0].unsdebt_824_RLBAL);
        this.fmData_M.data[0].unsdebt_824_ILBAL = this.toINT(this.fmData_M.data[0].unsdebt_824_ILBAL);
        this.fmData_M.data[0].unsdebt_824_CCRBAL = this.toINT(this.fmData_M.data[0].unsdebt_824_CCRBAL);
        this.fmData_M.data[0].unsdebt_NONJCIC = this.toINT(this.fmData_M.data[0].unsdebt_NONJCIC);
        this.fmData_M.data[0].unsdebt_PAYAMT_029EX = this.toINT(this.fmData_M.data[0].unsdebt_PAYAMT_029EX);

        this.fmData_M.data[0].unsdebt_AMT_501EX_B = this.toINT(this.fmData_M.data[0].unsdebt_AMT_501EX_B == null ? this.fmData_M.data[0].unsdebt_AMT_501EX : this.fmData_M.data[0].unsdebt_AMT_501EX_B);
        this.fmData_M.data[0].unsdebt_AMT_504EX_B = this.toINT(this.fmData_M.data[0].unsdebt_AMT_504EX_B == null ? this.fmData_M.data[0].unsdebt_AMT_504EX : this.fmData_M.data[0].unsdebt_AMT_504EX_B);
        this.fmData_M.data[0].unsdebt_AMTNEW_505EX_B = this.toINT(this.fmData_M.data[0].unsdebt_AMTNEW_505EX_B == null ? this.fmData_M.data[0].unsdebt_AMTNEW_505EX : this.fmData_M.data[0].unsdebt_AMTNEW_505EX_B);
        this.fmData_M.data[0].unsdebt_AMTNEW_029EX_B = this.toINT(this.fmData_M.data[0].unsdebt_AMTNEW_029EX_B == null ? this.fmData_M.data[0].unsdebt_AMTNEW_029EX : this.fmData_M.data[0].unsdebt_AMTNEW_029EX_B);
        this.fmData_M.data[0].unsdebt_824_RLLIMIT_B = this.toINT(this.fmData_M.data[0].unsdebt_824_RLLIMIT_B == null ? this.fmData_M.data[0].unsdebt_824_RLLIMIT : this.fmData_M.data[0].unsdebt_824_RLLIMIT_B);
        this.fmData_M.data[0].unsdebt_824_RLBAL_B = this.toINT(this.fmData_M.data[0].unsdebt_824_RLBAL_B == null ? this.fmData_M.data[0].unsdebt_824_RLBAL : this.fmData_M.data[0].unsdebt_824_RLBAL_B);
        this.fmData_M.data[0].unsdebt_824_ILBAL_B = this.toINT(this.fmData_M.data[0].unsdebt_824_ILBAL_B == null ? this.fmData_M.data[0].unsdebt_824_ILBAL : this.fmData_M.data[0].unsdebt_824_ILBAL_B);
        this.fmData_M.data[0].unsdebt_824_CCRBAL_B = this.toINT(this.fmData_M.data[0].unsdebt_824_CCRBAL_B == null ? this.fmData_M.data[0].unsdebt_824_CCRBAL : this.fmData_M.data[0].unsdebt_824_CCRBAL_B);
        this.fmData_M.data[0].unsdebt_NONJCIC_B = this.toINT(this.fmData_M.data[0].unsdebt_NONJCIC_B == null ? this.fmData_M.data[0].unsdebt_NONJCIC : this.fmData_M.data[0].unsdebt_NONJCIC_B);
        this.fmData_M.data[0].unsdebt_PAYAMT_029EX_B = this.toINT(this.fmData_M.data[0].unsdebt_PAYAMT_029EX_B == null ? this.fmData_M.data[0].unsdebt_PAYAMT_029EX : this.fmData_M.data[0].unsdebt_PAYAMT_029EX_B);

        this.fmData_M.data[0].unsdebt_AMT_501EX_B = this.data_number2(this.fmData_M.data[0].unsdebt_AMT_501EX_B);
        this.fmData_M.data[0].unsdebt_AMT_504EX_B = this.data_number2(this.fmData_M.data[0].unsdebt_AMT_504EX_B);
        this.fmData_M.data[0].unsdebt_AMTNEW_505EX_B = this.data_number2(this.fmData_M.data[0].unsdebt_AMTNEW_505EX_B);
        this.fmData_M.data[0].unsdebt_AMTNEW_029EX_B = this.data_number2(this.fmData_M.data[0].unsdebt_AMTNEW_029EX_B);
        this.fmData_M.data[0].unsdebt_824_RLLIMIT_B = this.data_number2(this.fmData_M.data[0].unsdebt_824_RLLIMIT_B);
        this.fmData_M.data[0].unsdebt_824_RLBAL_B = this.data_number2(this.fmData_M.data[0].unsdebt_824_RLBAL_B);
        this.fmData_M.data[0].unsdebt_824_ILBAL_B = this.data_number2(this.fmData_M.data[0].unsdebt_824_ILBAL_B);
        this.fmData_M.data[0].unsdebt_824_CCRBAL_B = this.data_number2(this.fmData_M.data[0].unsdebt_824_CCRBAL_B);
        this.fmData_M.data[0].unsdebt_NONJCIC_B = this.data_number2(this.fmData_M.data[0].unsdebt_NONJCIC_B);
        this.fmData_M.data[0].unsdebt_PAYAMT_029EX_B = this.data_number2(this.fmData_M.data[0].unsdebt_PAYAMT_029EX_B);


        //以下 資料加千分位
        this.fmData_M.data[0].unsdebt_AMT_501EX = this.data_number2(this.fmData_M.data[0].unsdebt_AMT_501EX);
        this.fmData_M.data[0].unsdebt_AMT_504EX = this.data_number2(this.fmData_M.data[0].unsdebt_AMT_504EX);
        this.fmData_M.data[0].unsdebt_AMTNEW_505EX = this.data_number2(this.fmData_M.data[0].unsdebt_AMTNEW_505EX);
        this.fmData_M.data[0].unsdebt_AMTNEW_029EX = this.data_number2(this.fmData_M.data[0].unsdebt_AMTNEW_029EX);
        this.fmData_M.data[0].unsdebt_824_RLLIMIT = this.data_number2(this.fmData_M.data[0].unsdebt_824_RLLIMIT);
        this.fmData_M.data[0].unsdebt_824_RLBAL = this.data_number2(this.fmData_M.data[0].unsdebt_824_RLBAL);
        this.fmData_M.data[0].unsdebt_824_ILBAL = this.data_number2(this.fmData_M.data[0].unsdebt_824_ILBAL);
        this.fmData_M.data[0].unsdebt_824_CCRBAL = this.data_number2(this.fmData_M.data[0].unsdebt_824_CCRBAL);
        this.fmData_M.data[0].unsdebt_NONJCIC = this.data_number2(this.fmData_M.data[0].unsdebt_NONJCIC);
        this.fmData_M.data[0].unsdebt_PAYAMT_029EX = this.data_number2(this.fmData_M.data[0].unsdebt_PAYAMT_029EX);


        this.fmData_M.data[0].unsdebt_SUM_0 = this.data_number3(this.fmData_M.data[0].unsdebt_SUM_0);
        this.fmData_M.data[0].unsdebt_SUM_0CK = this.data_number3(this.fmData_M.data[0].unsdebt_SUM_0CK);
        this.fmData_M.data[0].unsdebt_SUM_0CK_B = this.data_number2(this.fmData_M.data[0].unsdebt_SUM_0CK_B);
        this.fmData_M.data[0].annual_INCOME = this.data_number3(this.fmData_M.data[0].annual_INCOME);
        this.fmData_M.data[0].income = this.data_number3(this.fmData_M.data[0].income);
        this.fmData_M.data[0].approve_AMT = this.data_number3(this.fmData_M.data[0].approve_AMT);
        this.fmData_M.data[0].dbr_0 = this.data_number3(this.fmData_M.data[0].dbr_0);
        this.fmData_M.data[0].dbr_0CK = this.data_number3(this.fmData_M.data[0].dbr_0CK);
        this.fmData_M.data[0].dbr_2 = this.data_number3(this.fmData_M.data[0].dbr_2);
        this.fmData_M.data[0].dbr_2CK = this.data_number3(this.fmData_M.data[0].dbr_2CK);


      }

    });
  }

  //儲存 DBR收支表資料 產生合約前回查
  save_M() {
    if (this.fmData_M.data.length < 1) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '查無資料' }
      });
      return;
    }
    let msg = "";
    const url = 'f01/childscn10action7';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    //測試用
    // jsonObject['applno'] = '20211215A000077';

    jsonObject['unsdebtAmt501Ex'] = this.save_data_number(this.fmData_M.data[0].unsdebt_AMT_501EX_B);
    jsonObject['unsdebtAmt504Ex'] = this.save_data_number(this.fmData_M.data[0].unsdebt_AMT_504EX_B);
    jsonObject['unsdebtAmtnew505Ex'] = this.save_data_number(this.fmData_M.data[0].unsdebt_AMTNEW_505EX_B);
    jsonObject['unsdebtAmtnew029Ex'] = this.save_data_number(this.fmData_M.data[0].unsdebt_AMTNEW_029EX_B);
    jsonObject['unsdebt824Rllimit'] = this.save_data_number(this.fmData_M.data[0].unsdebt_824_RLLIMIT_B);
    jsonObject['unsdebt824Rlbal'] = this.save_data_number(this.fmData_M.data[0].unsdebt_824_RLBAL_B);
    jsonObject['unsdebt824Ilbal'] = this.save_data_number(this.fmData_M.data[0].unsdebt_824_ILBAL_B);
    jsonObject['unsdebt824Ccrbal'] = this.save_data_number(this.fmData_M.data[0].unsdebt_824_CCRBAL_B);
    jsonObject['unsdebtNonjcic'] = this.save_data_number2(this.fmData_M.data[0].unsdebt_NONJCIC_B);
    jsonObject['unsdebtPayamt029Ex'] = this.save_data_number(this.fmData_M.data[0].unsdebt_PAYAMT_029EX_B);

    this.f01008scn4Service.postJson(url, jsonObject).subscribe(data => {
      msg = data.rspMsg == "success" ? "儲存成功!" : "儲存失敗";
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msg }
      });
    });
  }

  //取決策1Table
  getDSS3() {
    const url = 'f01/f01008scn4';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    //測試用
    // jsonObject['applno'] = '20211116A000003';
    this.f01008scn4Service.postJson(url, jsonObject).subscribe(data => {
      if (data.rspMsg != "select fail" && data.rspBody.elDss3List != null) {
        //系統決策
        this.QUERY_DATE = formatDate(data.rspBody.elDss3List.queryDate, 'yyyy/MM/dd HH:mm:ss ', 'zh-Hant-TW', '+0800').toString();//DSS交易日期時間
        this.SYSFLOWCD = data.rspBody.elDss3List.sysflowcd;//系統流程
        this.RESLTCD = data.rspBody.elDss3List.resltcd;//決策結果
      }
      //徵審代碼
      this.EL_DSS3_UNDW_LIST.data = data.rspBody.elDss3UndwLists;
      if (data.rspMsg != "select fail" && data.rspBody.elDss3UndwLists.length > 0) {
        this.EL_DSS3_UNDW_LIST1.data = this.EL_DSS3_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '1');//1	信用異常資訊
        this.EL_DSS3_UNDW_LIST2.data = this.EL_DSS3_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '2');//2	整體往來
        this.EL_DSS3_UNDW_LIST3.data = this.EL_DSS3_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '3');//3	信用卡往來
        this.EL_DSS3_UNDW_LIST4.data = this.EL_DSS3_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '4');//4	授信往來
        this.EL_DSS3_UNDW_LIST5.data = this.EL_DSS3_UNDW_LIST.data.filter(c => c.UP_REASON_CODE == '9');//9	其他
      }
    });
  }




}
