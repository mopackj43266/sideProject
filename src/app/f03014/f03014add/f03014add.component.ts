import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { F03014Service } from '../f03014.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { FormControl, Validators } from '@angular/forms';


interface sysCode {
  value: string;
  viewValue: string;
}

//Jay 客戶身份名單註記 新增

@Component({
  selector: 'app-f03014add',
  templateUrl: './f03014add.component.html',
  styleUrls: ['./f03014add.component.css', '../../../assets/css/f03.css']
})

export class F03014addComponent implements OnInit {
  usingType: sysCode[] = [];
  usingValue: string;//使用中
  currentTimeValue: string;//異動時間
  custNid: string;//身分證字號
  custName: string;//客戶姓名
  content1: string;//簡述一
  content2: string;//簡述二
  remark: string;//備註資訊

  Efficient: string;//生效
  Invalidation: string;//失效
  daytest: string;//三個月後的日期
  jsonObject: any = {};
  Custlist: any = [];
  constructor(private pipe: DatePipe,
    private f03014Service: F03014Service,
    public dialogRef: MatDialogRef<F03014addComponent>,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.usingType.push({ value: '1', viewValue: 'Y' });
    this.usingType.push({ value: '2', viewValue: 'N' });
    this.currentTimeValue = this.pipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')//抓取現在時間
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  //欄位驗證
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :'';
  }

  InvalidationMax()//抓3個月間隔方法
  {
    var a = new Date(this.Efficient);
    var k = 90 * 24 * 60 * 60 * 1000;
    var j = a.setDate(a.getDate());
    this.daytest = this.pipe.transform(new Date(j + k), 'yyyy-MM-dd')//三個月後的失效日期
  }
  seve()//存檔
  {
    if (this.custNid == '' || this.custName == '' || this.content1 == '' ||
      this.Efficient == '' || this.Invalidation == '' || this.usingValue == '') {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請勿填空" }
      });
    }
    else {
      let msgStr: string = "";
      const url = 'f03/f03014action02';
      this.jsonObject['custNid'] = this.custNid;
      this.jsonObject['custName'] = this.custName;
      this.jsonObject['content1'] = this.content1;
      this.jsonObject['content2'] = this.content2;
      this.jsonObject['remark'] = this.remark;
      this.jsonObject['effectiveDate'] = this.Efficient;
      this.jsonObject['expirationDate'] = this.Invalidation;
      this.jsonObject['useFlag'] = this.usingValue;
      this.f03014Service.Add(url, this.jsonObject).subscribe(data => {
        msgStr = data.rspMsg;
        if (data.rspCode == '0000' && data.rspMsg == '成功')
        {
          // const childernDialogRef = this.dialog.open(ConfirmComponent, {
          //   data: { msgStr: msgStr }
          // });
          if (data.rspMsg === '成功')
           { this.dialogRef.close({ event: this.custNid }); }

        }
        else
        {
          this.dialog.open(ConfirmComponent, {
            data: { msgStr }
          });
        }

      })

    }

  }
  onNoClick()//取消
  {
    this.dialogRef.close({ event: null });
  }

}
