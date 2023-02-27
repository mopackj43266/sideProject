import { Component, OnInit,Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F03014Service } from '../f03014.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-f03014edit',
  templateUrl: './f03014edit.component.html',
  styleUrls: ['./f03014edit.component.css','../../../assets/css/f03.css']
})
export class F03014editComponent implements OnInit {
  rid :string =this.data.rid;
  NameValue: string =this.data.CUST_NAME;//客戶名字
  IdentityValue: string =this.data.CUST_NID;//身分字號
  NarrateValue1: string =this.data.CONTENT1;//簡述1
  NarrateValue2: string =this.data.CONTENT2;//簡述2
  remakrValue:string = this.data.REMARK;//備註
  Efficient: string =this.data.EFFECTIVE_DATE==""?null:this.pipe.transform( new Date(this.data.EFFECTIVE_DATE) , 'yyyy-MM-dd' );//生效
  Invalidation: string =this.data.EXPIRATION_DATE==""?null:this.pipe.transform( new Date(this.data.EXPIRATION_DATE) , 'yyyy-MM-dd' );//失效
  usingValue: string= this.data.USE_FLAG;//使用中
  ChangeDateValue:string = this.data.CHANGE_DATE;//變動日期
  usingType:string[]=this.data.usingType;
  daytest:string;//三個月後的日期
  constructor(public dialogRef: MatDialogRef<F03014editComponent>,
   @Inject(MAT_DIALOG_DATA) public data: any,
   private pipe: DatePipe,
   private f03014Service: F03014Service,
   public dialog: MatDialog
   )
   {

   }

  ngOnInit(): void {
  }
  formControl = new FormControl('', [
    Validators.required
  ]);
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :'';
  }

  InvalidationMax()//抓3個月間隔方法
  {
    var a = new Date(this.Efficient);
    var k = 90*24*60*60*1000;
    var j = a.setDate(a.getDate());
    this.daytest = this.pipe.transform( new Date(j+k) ,'yyyy-MM-dd')//三個月後的失效日期
  }
  async seve()//儲存
  {
    if(this.IdentityValue == '' || this.NameValue == '' || this.NarrateValue1 == ''
    || this.Efficient == '' || this.Invalidation == '' || this.usingValue == '')
    {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請勿填空" }});
    }
   else
   {
    let msgStr: string = "";
    let codeStr: string = "";
    let jsonObject: any = {};
    const url = 'f03/f03014action03';
    // let formData = new FormData();
    jsonObject['rowId'] = this.rid != null ? this.rid : '';
    jsonObject['custNid'] = this.IdentityValue != null ? this.IdentityValue : '';
    jsonObject['custName'] = this.NameValue != null ? this.NameValue : '';
    jsonObject['content1'] = this.NarrateValue1 != null ? this.NarrateValue1 : '';
    jsonObject['content2'] = this.NarrateValue2 != null ? this.NarrateValue2 : '';
    jsonObject['remark'] = this.remakrValue != null ? this.remakrValue : '';
    jsonObject['effectiveDate'] = this.Efficient != null ? this.Efficient : '';
    jsonObject['expirationDate'] = this.Invalidation != null ? this.Invalidation : '';
    jsonObject['useFlag'] = this.usingValue != null ? this.usingValue : '';
    await this.f03014Service.seve(url,jsonObject).then((data: any) => {
      codeStr = data.rspCode;
      msgStr = data.rspMsg;
    });

    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });

      if (msgStr === '成功' && codeStr === '0000') { this.dialogRef.close({ event:'success' }); }

   }

  }
  dateNull(t: string,num:string) {
      switch (num) {
        case 'Efficient':
          this.Efficient = null;
          break;
        case 'Invalidation':
          this.Invalidation = null;
          break;
      }
  }
  onNoClick()//取消
  {
    this.dialogRef.close();
  }



}
