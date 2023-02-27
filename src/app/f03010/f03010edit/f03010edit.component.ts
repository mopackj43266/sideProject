import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F03010Service } from '../f03010.service';

//Nick 照會話術編輯
@Component({
  selector: 'app-f03010edit',
  templateUrl: './f03010edit.component.html',
  styleUrls: ['./f03010edit.component.css', '../../../assets/css/f03.css']
})
export class F03010editComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<F03010editComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public f03010Service: F03010Service
  ) { }

  //暫停使用下拉選單
  stopFlagCode: OptionsCode[] = [{ value: 'Y', viewValue: 'Y' }, { value: 'N', viewValue: 'N' }];

  //欄位驗證
  formControl = new FormControl('', [
    Validators.required
  ]);

  //欄位驗證
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填' : '';
  }

  ngOnInit(): void {
  }

  //儲存
  public async save(): Promise<void> {
    //判斷字數
    if (this.data.speakingContent.replace(/[^\x00-\xff]/g, "xx").length > 200) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "話術內容資料長度為100個中文字!" }
      });
    }
    else {
      let msgStr: string = "";
      let baseUrl = 'f03/f03010action2';
      msgStr = await this.f03010Service.saveSpeaking(baseUrl, this.data);
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '儲存成功！') { this.dialogRef.close({ event: 'success' }); }
    }
  }

  //取消
  onNoClick(): void {
    this.dialogRef.close();
  }

}
