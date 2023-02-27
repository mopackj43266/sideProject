import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childbwscn1Service } from '../childbwscn1.service';

@Component({
  selector: 'app-childbwscn1edit',
  templateUrl: './childbwscn1edit.component.html',
  styleUrls: ['./childbwscn1edit.component.css', '../../../../assets/css/child.css']
})
export class Childbwscn1editComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childbwscn1editComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public childbwscn1Service: Childbwscn1Service
  ) { }

  ngOnInit(): void {
  }

  //欄位驗證
  formControl = new FormControl('', [
    Validators.required
  ]);

  //欄位驗證
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填' : '';
  }

  //儲存
  public async save(): Promise<void> {
    let msgStr: string = "";
    let baseUrl = 'f01/childbwscn1action2';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['creditaction'] = this.data.creditaction;
    jsonObject['creditlevel'] = this.data.level;
    jsonObject['rowId'] = this.data.rowId;
    msgStr = await this.childbwscn1Service.saveCreditmemo(baseUrl, jsonObject);
    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });
    if (msgStr === '儲存成功！') { this.dialogRef.close({ event: 'success' }); }
  }

  //取消
  onNoClick(): void {
    this.dialogRef.close();
  }


}
