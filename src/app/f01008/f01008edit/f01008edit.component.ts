import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F01008Service } from '../f01008.service';
@Component({
  selector: 'app-f01008edit',
  templateUrl: './f01008edit.component.html',
  styleUrls: ['./f01008edit.component.css', '../../../assets/css/f03.css']
})
//Jay 審核資料編輯
export class F01008editComponent implements OnInit {

  constructor(private f01008Service: F01008Service,
    public datepipe: DatePipe,
    public dialog: MatDialog) { }

  @Input() data: any;

  //欄位驗證
  formControl = new FormControl('', [
    Validators.required
  ]);

  //取得欄位驗證訊息
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' : '';
  }
  CALLOUT_SETTIME: Date;//確認時間
  CALLOUT_DATE: Date; //設定下次照會時間
  CON_TEL_Selected: string;//電話種類
  CON_TARGET_Selected: string;//對象種類
  CON_MEMO_Selected: string;//註記種類
  speakingContent: string;//話述內容
  speakingAbbreviation: string;//話術名稱
  CON_TYPE_Code: OptionsCode[] = null//聯絡方式下拉選單
  TEL_CONDITION_Code: OptionsCode[] = null;//電話狀況下拉選單
  TEL_CHECK_Code: OptionsCode[] = null;//電話種類下拉選單
  HOURS_Code: OptionsCode[] = null;//時下拉選單
  MINUTES_Code: OptionsCode[] = null;//分下拉選單
  applno: string;
  empNo: string;

  block: boolean = false;

  ngOnInit(): void {
    this.HOURS_Code = this.f01008Service.getHOURS();//時下拉選單
    this.MINUTES_Code = this.f01008Service.getMINUTES();//分下拉選單
    this.CON_TYPE_Code = this.f01008Service.getCON_TYPE();//聯絡方式下拉選單
    this.TEL_CONDITION_Code = this.f01008Service.getTEL_CONDITION();//電話狀況下拉選單
  }
  save()//修改
  {
    if (this.data.CALLOUT_DATE == null || this.data.CALLOUT_DATE == "") {
      this.data.HOURS = ""
      this.data.MINUTES = ""
    } else {
      if (this.data.HOURS == "" || this.data.HOURS == null) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請輸入時間欄位" }
        });
        return;
      }
      if (this.data.MINUTES == "" || this.data.MINUTES == null) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請輸入時間欄位" }
        });
        return;
      }
       //判斷日期時間是否在現在以前
       var date = this.datepipe.transform(this.data.CALLOUT_DATE, 'yyyy-MM-dd ') + this.data.HOURS + ':' + this.data.MINUTES + ":00";
       var newDate = date.replace(/-/g, '/'); // 變成"2012/01/01 12:30:10";
       var keyDate = new Date(newDate)
       if (keyDate.getTime() < Date.now()) {
         const confirmDialogRef = this.dialog.open(ConfirmComponent, {
           data: { msgStr: "請輸入正確日期時間" }
         });
         return;
       }
    }

    // if (this.datepipe.transform(this.data.CALLOUT_DATE, 'yyyyMMdd') == this.datepipe.transform(new Date(), 'yyyyMMdd')) {
    //   if (parseInt(this.data.HOURS) <= parseInt(this.datepipe.transform(new Date(), 'HH'))) {
    //     this.dialog.open(ConfirmComponent, {
    //       data: { msgStr: '請輸入正確日期時間' }
    //     });
    //     return;
    //   }
    //   else {
    //     if (parseInt(this.data.MINUTES) <= parseInt(this.datepipe.transform(new Date(), 'mm')))
    //      {
    //       this.dialog.open(ConfirmComponent, {
    //         data: { msgStr: '請輸入正確日期時間' }
    //       });
    //       return;
    //     }
    //   }
    // }


    let jsonObject: any = {};
    let msgStr: string = "";
    let url = 'f01/f01008scn2action2';
    jsonObject['rowID'] = this.data.ID;
    jsonObject['applno'] = this.data.applno;
    jsonObject['conType'] = this.data.CON_TYPE;
    jsonObject['phone'] = this.data.PHONE;
    jsonObject['telCondition'] = this.data.TEL_CONDITION;
    jsonObject['conMemo'] = this.data.CON_MEMO;
    jsonObject['date'] = this.datepipe.transform(this.data.CALLOUT_DATE, 'yyyyMMdd');
    jsonObject['hour'] = this.data.HOURS;
    jsonObject['min'] = this.data.MINUTES;
    this.block = true;
    this.f01008Service.f01008scn2(jsonObject, url).subscribe(data => {
      msgStr = data.rspMsg;
      this.block = false;
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '編輯成功' && data.rspCode === '0000') {
        this.f01008Service.setJCICSource({ show: false });
        // window.location.reload();
      }
    })
  }
  onNoClick() {
    this.f01008Service.setJCICSource({ show: false });
  }
  disabledDate(time) {
    return time.getTime() < Date.now() - 8.64e7;
  }
}
