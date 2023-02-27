import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F06006Service } from '../f06006.service';

@Component({
  selector: 'app-f06006split',
  templateUrl: './f06006split.component.html',
  styleUrls: ['./f06006split.component.css','../../../assets/css/child.css']
})
export class F06006splitComponent implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<F06006splitComponent>,
    public f06006Service: F06006Service,
    private dialog: MatDialog,
  ) { }

  total = 1;
  pageSize = 50;
  pageIndex = 1;
  splitData=[];
  newData:any;

  searchDisabled = true;
  lineBankCode: string = '824';

  ngOnInit(): void {
    this.select();
  }

  //查詢
  select() {
    let jsonObject: any = {};
    let baseUrl = 'f06/f06006action5';
    // let baseUrl = 'f06/f06004action9';
    jsonObject['guid'] = this.data.guid;
    this.f06006Service.getData(baseUrl,jsonObject).subscribe(data=>{
      data.rspBody.SETTLE_AMT = this.f06006Service.toCurrency(data.rspBody.SETTLE_AMT.toString());
      this.splitData.push(data.rspBody);
      if (this.splitData[0].BANK_CODE.substring(0, 3) == this.lineBankCode) {
        this.searchDisabled = false;
      }
    })
  }
  //新增
  add(data: any)
  {
    this.newData = [];
    // for(var i  of  this.splitData)
    // {
    //   this.newData = {GUID:'',FRST_CRTN_GUID:i.FRST_CRTN_GUID,MERG_DEBT_PROD:i.MERG_DEBT_PROD,BANK_CODE:i.BANK_CODE,BANK_NAME:i.BANK_NAME,SETTLE_AMT:'',ACCOUNT_NO:'',SETTLE_CARD_NO:'',ACCOUNT_NM:'',BRANCH_CD:i.BRANCH_CD,TRANS_MEMO:''};
    // }
    this.newData = JSON.parse(JSON.stringify(data));
    this.splitData.push(this.newData);
  }

  //儲存
  save()
  {
    let jsonObject: any = {};
    let debtArray=[];
    let baseUrl = 'f06/f06006action6';
    jsonObject['applno'] = this.data.applno;
    for (let i = 0; i < this.splitData.length; i++) {
      debtArray.push({
        guid: i == 0 ? this.data.guid : '',
        oriGuid : this.data.oriGuid,
        mergdebtprod:this.splitData[i].MERG_DEBT_PROD,
        bankCode: this.splitData[i].BANK_CODE,
        bankName: this.splitData[i].BANK_NAME,
        settleAmt: this.splitData[i].SETTLE_AMT != 0 ? Number(this.f06006Service.toNumber(this.splitData[i].SETTLE_AMT)) : this.splitData[i].SETTLE_AMT,
        accountNo: this.splitData[i].ACCOUNT_NO,
        settleCardNo: this.splitData[i].SETTLE_CARD_NO,
        accountNm: this.splitData[i].ACCOUNT_NM,
        branchCd: this.splitData[i].BRANCH_CD,
        transMemo: this.splitData[i].TRANS_MEMO,
        mergDebtAmt: this.data.mergDebtAmt,
        isSelected: this.data.isSelected
      })
    }
    jsonObject['debtBankDetailList'] = debtArray;
    this.f06006Service.saveData(baseUrl, jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '儲存成功!' }
        });
        this.close();
      }
    });
  }
  //離開
  close()
  {
    this.dialogRef.close();
  }
  //刪除
  del(data: any)
  {
    // console.log("22222")
    // console.log(this.splitData)

    this.splitData.splice(this.splitData.indexOf(data), 1);
  }

  getStyle(value: string) {
    value = value != null ? value.replace(',', '') : value;
    return {
      'text-align': this.f06006Service.isNumber(value) ? 'right' : 'left'
    }
  }

  //判斷數字
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
}
