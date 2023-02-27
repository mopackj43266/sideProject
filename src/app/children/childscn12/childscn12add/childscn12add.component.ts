import { OptionsCode } from 'src/app/interface/base';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn12Service } from '../childscn12.service';

@Component({
  selector: 'app-childscn12add',
  templateUrl: './childscn12add.component.html',
  styleUrls: ['./childscn12add.component.css','../../../../assets/css/child.css']
})
export class Childscn12addComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childscn12addComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public childscn12Service: Childscn12Service,
    public dialog: MatDialog
  ) { }

  ynCode: OptionsCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' }];
  incomeType: string;
  cuId: string;
  cuCname: string;
  num: string;

  ngOnInit(): void {
  }

  async save() {
    let msgStr: string = "";
    let codeStr: string = "";
    const baseUrl = 'f01/childscn12action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['incomeType'] = this.incomeType;
    jsonObject['cuId'] = this.cuId;
    jsonObject['cuCname'] = this.cuCname;
    jsonObject['num'] = this.num;
    jsonObject['mincomeExp'] = this.data.mincomeExp;
    await this.childscn12Service.childscn12Action(baseUrl, jsonObject).then((data: any) => {
      codeStr = data.rspCode;
      msgStr = data.rspMsg;
    });

    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });
    if (msgStr === '儲存成功' && codeStr === '0000') { this.dialogRef.close({ event: 'success' }); }
  }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
    this.formControl.hasError('email') ? 'Not a valid email' :
    '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
