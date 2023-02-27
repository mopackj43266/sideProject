import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { Childscn8Service } from '../childscn8.service';

//Nick  徵信照會 刪除
@Component({
  selector: 'app-childscn8delete',
  templateUrl: './childscn8delete.component.html',
  styleUrls: ['./childscn8delete.component.css', '.../../../assets/css/f03.css']
})
export class Childscn8deleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childscn8deleteComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public childscn8Service: Childscn8Service
  ) { }

  CON_TEL_Code: OptionsCode[] = []; //電話種類下拉選單
  CON_TEL_Selected: string;//電話種類
  CON_TARGET_Code: OptionsCode[] = [];//對象種類下拉選單
  CON_TARGET_Selected: string;//對象種類
  CON_MEMO_Code: OptionsCode[] = [];//註記種類下拉選單
  CON_MEMO_Selected: string;//註記種類
  CALLOUT_SETTIME:Date;//確認時間
  CALLOUT_DATE:Date;//確認時間



  //欄位驗證
  formControl = new FormControl('', [
    Validators.required
  ]);

  //取得欄位驗證訊息
  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  ngOnInit(): void {
  }


  // //刪除
  // async deleteAction(ID: string) {
  //   let msg = '';
  //   let codeStr: string = "";
  //   const url = 'f01/childscn8action3';
  //   await this.childscn8Service.DeleteCALLOUT(url, ID).subscribe(data => {
  //     msg = data.rspMsg;
  //     codeStr = data.rspCode;
  //   });
  //   setTimeout(() => {
  //     const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msg } });
  //     if (msg === '刪除成功' && codeStr === '0000') { this.dialogRef.close({ event: 'success' }); }
  //   }, 1500);
  // }

  //刪除
  async deleteAction(ID: string) {
    let msgStr: string = "";
    let codeStr: string = "";
    const baseUrl = 'f01/childscn8action3';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['rowID'] = this.data.ID;
    await this.childscn8Service.postJsonObject_CALLOUT(baseUrl, jsonObject).subscribe(data => {
      codeStr = data.rspCode;
      msgStr = data.rspMsg;
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '刪除成功' && codeStr === '0000') { this.dialogRef.close({ event: 'success' }); }
    });
  }

  //取消
  onNoClick(): void {
    this.dialogRef.close();
  }

}
