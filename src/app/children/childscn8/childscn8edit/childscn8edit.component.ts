import { Component, Inject, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn8Service } from '../childscn8.service';
import { DatePipe } from '@angular/common'
import { OptionsCode } from 'src/app/interface/base';
import { F01002Scn1Service } from 'src/app/f01002/f01002scn1/f01002scn1.service';
import { Router } from '@angular/router';

//Nick  徵信照會 編輯
@Component({
  selector: 'app-childscn8edit',
  templateUrl: './childscn8edit.component.html',
  styleUrls: ['./childscn8edit.component.css', '../../../../assets/css/f03.css']
})
export class Childscn8editComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childscn8editComponent>,
    public dialog: MatDialog,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    public childscn8Service: Childscn8Service,
    public datepipe: DatePipe,
    private f01002scn1Service: F01002Scn1Service,
    private router: Router,
  ) { }

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
  CON_TYPE_Code: OptionsCode[] = null//聯絡方式下拉選單
  TEL_CONDITION_Code: OptionsCode[] = null;//電話狀況下拉選單
  TEL_CHECK_Code: OptionsCode[] = null;//電話種類下拉選單
  HOURS_Code: OptionsCode[] = null;//時下拉選單
  MINUTES_Code: OptionsCode[] = null;//分下拉選單
  CALLOUT_YN_Code: OptionsCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' },];//照會完成下拉選單

  submit() {
  }

  ngOnInit(): void {
    this.HOURS_Code = this.childscn8Service.getHOURS();//時下拉選單
    this.MINUTES_Code = this.childscn8Service.getMINUTES();//分下拉選單
    this.CON_TYPE_Code = this.childscn8Service.getCON_TYPE();//聯絡方式下拉選單
    this.TEL_CONDITION_Code = this.childscn8Service.getTEL_CONDITION();//電話狀況下拉選單
    this.TEL_CHECK_Code = this.childscn8Service.getTEL_CHECK();//電話種類下拉選單
  }

  //儲存
  async save() {
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
    let PhoneData = this.data.PHONE.toString();
    PhoneData = PhoneData != null ? PhoneData.replace(/[^\d]/g, '') : PhoneData;
    if (PhoneData.length != this.data.PHONE.toString().length) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '手機/市話只能輸入數字' }
      });
      return;
    }
    let msgStr: string = "";
    let codeStr: string = "";
    const baseUrl = 'f01/childscn8action2';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['conType'] = this.data.CON_TYPE;
    jsonObject['phone'] = this.data.PHONE;
    jsonObject['telCondition'] = this.data.TEL_CONDITION;
    jsonObject['telCheck'] = this.data.TEL_CHECK;
    jsonObject['conMemo'] = this.data.CON_MEMO;
    jsonObject['date'] = this.datepipe.transform(this.data.CALLOUT_DATE, 'yyyyMMdd');
    jsonObject['hour'] = this.data.HOURS;
    jsonObject['min'] = this.data.MINUTES;
    jsonObject['rowID'] = this.data.ID;
    jsonObject['empNo'] = this.data.CALLOUT_EMPNO;
    jsonObject['calloutYn'] = this.data.CALLOUT_YN;
    await this.childscn8Service.postJsonObject_CALLOUT(baseUrl, jsonObject).subscribe(data => {
      codeStr = data.rspCode;
      msgStr = data.rspMsg;
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '編輯成功' && codeStr === '0000') {
        // this.dialogRef.close({ event: 'success' });
        this.f01002scn1Service.setJCICSource({ show: false });
        // window.location.reload();
        // this.router.navigate(['./F01002/F01002SCN1'], { skipLocationChange: true });
      }
    });
  }

  //取消
  onNoClick(): void {
    // this.dialogRef.close();
    this.f01002scn1Service.setJCICSource({ show: false });
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請輸入數字!' }
      });
      return false;
    }
    return true;
  }
}
