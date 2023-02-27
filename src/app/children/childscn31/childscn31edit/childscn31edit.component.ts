import { of } from 'rxjs';
import { logging } from 'protractor';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Childscn31Service } from '../childscn31.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';

@Component({
  selector: 'app-childscn31edit',
  templateUrl: './childscn31edit.component.html',
  styleUrls: ['./childscn31edit.component.css', '../../../../assets/css/child.css']
})
export class Childscn31editComponent implements OnInit {

  integrate: any[] = [];
  Newintegrate: any[] = [];
  AddData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private childscn31Service: Childscn31Service,
    public dialog: MatDialog,) { }
  k = 0;
  money = 0;//拆分金額
  total = 0;//總金額
  jsonObject1: any = {};
  seveData: any[] = [];
  merg = 0; //預留註記金額

  ngOnInit(): void {
    this.searchTable();

  }

  searchTable()//查詢
  {
    this.Newintegrate = [];
    let url = "f01/childscn31action2";
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.APPLNO;
    jsonObject['bankCode'] = this.data.BANK_CODE;
    this.childscn31Service.postJson(url, jsonObject).subscribe(data => {
      this.integrate = data.rspBody;

      for (var i of this.integrate) {
        this.k = this.k + 1;
        this.AddData = {
          rid: this.k, APPLNO: i.applno, BANK_CODE: i.bankCode, MERG_DEBT_PROD: i.mergDebtProd,
          ACCOUNT_CODE: i.accountCode, ACCOUNT_CODE2: i.accountCode2, CUST_ID: i.custId
          , PURPOSE_CODE: i.purposeCode
          , MERG_DEBT_AMT: this.data_number1(i.mergDebtAmt+""), MERG_DEBT_AMT_DETAIL: this.data_number1(i.mergDebtAmtDetail+""),
          MERG_DEBT_FLAG:parseInt(this.Cut(i.mergDebtFlag+""))>0?this.data_number1(i.mergDebtFlag+""):i.mergDebtFlag , STRGY: i.strgy, GUID: i.guid
        }
        this.Newintegrate.push(this.AddData)

      }
    })
  }
  DelOne(i: string, guid: string)//刪除
  {
    var r =-1;
    if (this.Newintegrate.length > 1)
     {
      for (var o of this.Newintegrate)
      { r = r+1;
        if (o.rid == i) {
          this.Newintegrate.splice(r, 1)

        }
      }

      if (guid != "" && guid != null) {
        let url = "f01/childscn31action3";
        let jsonObject: any = {};
        jsonObject['guid'] = guid;
        this.childscn31Service.postJson(url, jsonObject).subscribe(data => {
          if(data.rspCode=='0000')
          {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: "刪除成功" }
            });
          }
        })
      }
    }
    else {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "至少要保留一筆!" }
      });
      return
    }

  }
  store(w:string)//存檔
  {
    let url = "f01/childscn31action4";
    this.total = 0;
    this.money = 0;
    this.merg = 0;
    if(w!='N')
    {
      for (let t of this.Newintegrate) {
        this.total = this.Cut(t.MERG_DEBT_AMT+"") == null ? 0 : parseInt(this.Cut(t.MERG_DEBT_AMT+""));
        if(t.MERG_DEBT_AMT_DETAIL=='')
        {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "拆分金額不能為空!" }
          });
          return
        }
        else
        {

          if(isNaN(parseInt(t.MERG_DEBT_AMT_DETAIL)))
          {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: "請輸入數字!" }
            });
            return
          }
          else if(parseInt(t.MERG_DEBT_AMT_DETAIL)<=0)
          {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: "拆分金額請大於0!" }
            });
            return
          }


          this.money = this.money + parseInt(this.Cut(t.MERG_DEBT_AMT_DETAIL+""));

          this.merg = this.merg + parseInt(this.Cut(t.MERG_DEBT_FLAG+""));


        }

      }

      if (this.total >= this.money)
       {
        if(this.total == this.merg)
        {
          for (let p of this.Newintegrate)
          {
            let jsonObject: any = {};
            jsonObject['mergDebtAmtDetail'] = this.Cut(p.MERG_DEBT_AMT_DETAIL+"");
            jsonObject['mergDebtFlag'] = p.MERG_DEBT_FLAG;
            this.seveData.push(jsonObject)
          }

          this.jsonObject1['applno'] =this.data.APPLNO ;
          this.jsonObject1['bankCode'] =this.data.BANK_CODE;
          this.jsonObject1['mergDebtProd'] =this.data.MERG_DEBT_PROD;
          this.jsonObject1['accountCode'] =this.data.ACCOUNT_CODE;
          this.jsonObject1['accountCode2'] =this.data.ACCOUNT_CODE2;
          this.jsonObject1['purposeCode'] = this.data.PURPOSE_CODE;
           this.jsonObject1['custId'] =this.data.CUST_ID;
          this.jsonObject1['mergDebtAmt'] =this.Cut(this.data.MERG_DEBT_AMT+"");
          this.jsonObject1['mergDebtAmtDetail'] = this.data.MERG_DEBT_AMT_DETAIL;
          this.jsonObject1['mergDebtFlag'] =this.Cut(this.data.MERG_DEBT_FLAG+"");
          this.jsonObject1['strgy'] = this.data.STRGY;
          this.jsonObject1['dataList'] = this.seveData
        }
        else
        {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "預留註記加總要等於"+this.data_number1(this.total+"")}
          });
          return
        }

      }
      else
      {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "拆分金額總額不可大於"+this.data_number1(this.total+"")}
        });
        return
      }

    }
    else
    {
      let jsonObject: any = {};
      jsonObject['mergDebtAmtDetail'] =this.Cut(this.data.MERG_DEBT_AMT+"");
      jsonObject['mergDebtFlag'] = '';
      this.seveData.push(jsonObject)
      this.jsonObject1['mergDebtFlag'] = '';
      this.jsonObject1['applno'] =this.data.APPLNO ;
      this.jsonObject1['bankCode'] =this.data.BANK_CODE;
      this.jsonObject1['mergDebtProd'] =this.data.MERG_DEBT_PROD;
      this.jsonObject1['custId'] =this.data.CUST_ID;
      this.jsonObject1['accountCode'] =this.data.ACCOUNT_CODE;
      this.jsonObject1['accountCode2'] =this.data.ACCOUNT_CODE2;
      this.jsonObject1['purposeCode'] = this.data.PURPOSE_CODE;
      this.jsonObject1['mergDebtAmt'] = this.Cut(this.data.MERG_DEBT_AMT+"");
      // this.jsonObject1['mergDebtAmtDetail'] =0;
      // this.jsonObject1['mergDebtFlag'] =this.data.MERG_DEBT_FLAG;
      this.jsonObject1['strgy'] = this.data.STRGY;
      // this.seveData.push(jsonObject)

      this.jsonObject1['dataList'] = this.seveData;

    }

    this.childscn31Service.postJson(url,this.jsonObject1).subscribe(data => {
      if(data.rspCode=='0000')
      {
        this.dialog.closeAll()
        this.jsonObject1 = {};
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "儲存成功" }
        });
      }

    })
    this.jsonObject1 = {};
    this.seveData =[]
  }
  AddOne()//新增一筆
  {
    if(this.Newintegrate.length<16)
    {
      this.k = this.k + 1;
      this.AddData = {
        rid: this.k, APPLNO: this.data.APPLNO, BANK_CODE: this.data.BANK_CODE, MERG_DEBT_PROD: this.data.MERG_DEBT_PROD,
        ACCOUNT_CODE: this.data.ACCOUNT_CODE, ACCOUNT_CODE2: this.data.ACCOUNT_CODE2, CUST_ID: this.data.CUST_ID
        , PURPOSE_CODE: this.data.PURPOSE_CODE
        , MERG_DEBT_AMT: this.data.MERG_DEBT_AMT, MERG_DEBT_AMT_DETAIL: "", MERG_DEBT_FLAG: "", STRGY: this.data.STRGY, GUID: ""
      }
      this.Newintegrate.push(this.AddData)
    }
    else
    {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "最多只能拆分15筆" }
      });
      return;
    }

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
  Cut(s: string)//處理千分位
  {
    if (s != null) {
      s = s.replace(/,/g, "")
    }

    return s
  }

  closure()//關閉
  {
    this.dialog.closeAll()
  }
}
