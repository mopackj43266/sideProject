import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { DeleteConfirmComponent } from 'src/app/common-lib/delete-confirm/delete-confirm.component';
import { F01003Scn1Service } from 'src/app/f01003/f01003scn1/f01003scn1.service';
import { dssDebt } from 'src/app/interface/base';
import { Childscn31Service } from './childscn31.service';
import { Childscn31editComponent } from './childscn31edit/childscn31edit.component';

// Jay 可債整明細異動
@Component({
  selector: 'app-childscn31',
  templateUrl: './childscn31.component.html',
  styleUrls: ['./childscn31.component.css', '../../../assets/css/child.css']
})
export class Childscn31Component implements OnInit {

  integrate: Data[] = [];//資料table
  applno: string;//案件編號
  AddData: any;
  Newintegrate: any[] = [];
  seveData: any[] = [];
  k = 0;
  compensationData = [];
  page: string         //頁面
  pag: boolean;
  cuid: string;

  dssDebtOld: dssDebt[] = [];

  constructor(public dialogRef: MatDialogRef<Childscn31Component>,
    public dialog: MatDialog,
    private childscn31Service: Childscn31Service,
    private f01003Scn1Service: F01003Scn1Service
  ) {

  }

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
    this.page = sessionStorage.getItem("page");
    this.cuid = sessionStorage.getItem('nationalId');
    this.searchTable()
    this.select()
    if (this.page != '3') {
      this.pag = true;
    }
    else {
      this.pag = false;
    }
  }

  //刪除
  delTable(guid: String) {
    let url = "f01/childscn31action3";
    let jsonObject: any = {};
    jsonObject['guid'] = guid;
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: { msgStr: "" }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result.value == 'confirm') {
        this.childscn31Service.postJson(url, jsonObject).subscribe(data => {
          if (data.rspCode == '0000') {
            this.searchTable()
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: "刪除成功" }
            });
          }

        })
      }

    })

  }
  editTable() //修改
  {
    this.seveData = [];
    let url = "f01/childscn31action4";
    let jsonObject: any = {};
    console.log(this.Newintegrate)
    for (let p of this.Newintegrate) {
      if (parseInt(this.Cut(p.MERG_DEBT_AMT_DETAIL + "")) > parseInt(this.Cut(p.MERG_DEBT_AMT + ""))) {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "金額不能大於" + p.MERG_DEBT_AMT }
        });
        return
      }
      if (parseInt(this.Cut(p.MERG_DEBT_AMT_DETAIL + "")) > 0) {
        if(parseInt(this.Cut(p.MERG_DEBT_AMT_DETAIL + ""))>=parseInt(p.PD_MIN_LMT_AMT))
        {
          let jsonObject1: any = {};
          jsonObject1['mergDebtAmtDetail'] = this.Cut(p.MERG_DEBT_AMT_DETAIL + "");
          jsonObject1['guid'] = p.GUID;
          this.seveData.push(jsonObject1)
        }
        else
        {
          this.dialog.open(ConfirmComponent, {
            data: { msgStr: "金額不能小於" + p.PD_MIN_LMT_AMT }
          });
          return
        }

      }
      else {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "金額不能為0" }
        });
        return
      }

    }
    jsonObject['dataList'] = this.seveData;
    this.childscn31Service.postJson(url, jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "儲存成功" }
        });
        this.searchTable();
      }
    })
  }

  searchTable()//查詢
  {
    let k = ''
    if (this.page == '2') {
      k = '2520'
    }
    this.Newintegrate = [];
    this.AddData = {}
    let url = "f01/childscn31";
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['opId'] = k;
    this.childscn31Service.postJson(url, jsonObject).subscribe(data => {
      if (data.rspBody.length > 0) {
        this.integrate = data.rspBody;

        if (sessionStorage.getItem('debtFirst') == 'true') {
          for (let index = 0; index < this.integrate.length; index++) {
            this.dssDebtOld.push({
              guid: this.integrate[index].GUID,
              bankCode: this.integrate[index].BANK_CODE,
              accountCode: this.integrate[index].ACCOUNT_CODE,
              accountCode2: this.integrate[index].ACCOUNT_CODE2,
              purposeCode: this.integrate[index].PURPOSE_CODE,
              mergDebtAmt: this.integrate[index].MERG_DEBT_AMT,
              mergDebtAmtDetail: this.integrate[index].MERG_DEBT_AMT_DETAIL,
              mergDebtFlag: this.integrate[index].MERG_DEBT_FLAG,
              mergDebtProd: this.integrate[index].MERG_DEBT_PROD,
            });
          }
          this.f01003Scn1Service.setDebtSource({
            dssMergDebtOld: this.dssDebtOld
          });
          sessionStorage.setItem('debtFirst', 'false');
        }

        for (var i of this.integrate) {
          this.k = this.k + 1;
          this.AddData = {
            rid: this.k, GUID: i.GUID, APPLNO: i.APPLNO, BANK_CODE: i.BANK_CODE, BANK_NAME: i.BANK_NAME,MERG_DEBT_PROD: i.MERG_DEBT_PROD, ACCOUNT_CODE: i.ACCOUNT_CODE, ACCOUNT_CODE2: i.ACCOUNT_CODE2, PURPOSE_CODE: i.PURPOSE_CODE
            , MERG_DEBT_AMT: this.process(i.MERG_DEBT_AMT + ""), MERG_DEBT_AMT_DETAIL: this.process(i.MERG_DEBT_AMT_DETAIL + ""), MERG_DEBT_FLAG: this.process(i.MERG_DEBT_FLAG + ""), CUST_ID: i.CUST_ID, STRGY: i.STRGY,PD_MIN_LMT_AMT:i.PD_MIN_LMT_AMT
          }
          this.Newintegrate.push(this.AddData)
        }

      }


    })

  }
  process(s: string)//千分位
  {
    if (s != null) {
      s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return s
  }
  Cut(s: string)//處理千分位
  {
    if (s != null) {
      s = s.replace(/,/g, "")
    }

    return s
  }
  limit(x: string, id: string) {
    x = x.replace(/\D/g, '')
    if (x.length > 0) {
      x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    for (const item of this.Newintegrate) {
      if (item.GUID == id) {
        item.MERG_DEBT_AMT_DETAIL = x;
      }
    }
  }
  //查詢
  select() {
    let jsonObject: any = {};
    let baseUrl = 'f01/childscn31action5';
    jsonObject['applno'] = this.applno;
    jsonObject['custId'] = this.cuid;
    this.childscn31Service.postJson(baseUrl, jsonObject).subscribe(data => {
      this.compensationData = data.rspBody;
    })
  }
}
