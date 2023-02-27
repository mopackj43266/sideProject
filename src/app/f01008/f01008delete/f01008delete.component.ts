import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F01008Service } from '../f01008.service';
@Component({
  selector: 'app-f01008delete',
  templateUrl: './f01008delete.component.html',
  styleUrls: ['./f01008delete.component.css','../../../assets/css/f01.css']
})
//Jay 審核資料刪除
export class F01008deleteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<F01008deleteComponent>,
  private f01008Service: F01008Service,
  @Inject(MAT_DIALOG_DATA) public data: any,
  public dialog: MatDialog,) { }


  CON_TYPE_Code: OptionsCode[] = null//聯絡方式下拉選單
  TEL_CONDITION_Code: OptionsCode[] = null;//電話狀況下拉選單
  TEL_CHECK_Code: OptionsCode[] = null;//電話種類下拉選單
  HOURS_Code: OptionsCode[] = null;//時下拉選單
  MINUTES_Code: OptionsCode[] = null;//分下拉選單

    //欄位驗證
    formControl = new FormControl('', [
      Validators.required
    ]);

    //取得欄位驗證訊息
    getErrorMessage() {
      return this.formControl.hasError('required') ? 'Required field' : '';
    }

  ngOnInit(): void {
    this.HOURS_Code = this.f01008Service.getHOURS();//時下拉選單
    this.MINUTES_Code = this.f01008Service.getMINUTES();//分下拉選單
    this.CON_TYPE_Code = this.f01008Service.getCON_TYPE();//聯絡方式下拉選單
    this.TEL_CONDITION_Code = this.f01008Service.getTEL_CONDITION();//電話狀況下拉選單
  }

  deleteAction(ID: string)//刪除
  {
    let url = 'f01/f01008scn2action3';
    let msgStr: string = "";
    let codeStr: string = "";
    let jsonObject: any = {};
    jsonObject['rowID'] = ID;
    this.f01008Service.f01008scn2(jsonObject,url).subscribe(data =>{
      codeStr = data.rspCode;
      msgStr = data.rspMsg;
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '刪除成功' && codeStr === '0000') { this.dialogRef.close({ event: 'success' }); }
    });

  }
  onNoClick()
  {
    this.dialogRef.close();
  }
  save()
  {

  }
}
