import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { Childscn12Service } from '../childscn12.service';
interface ynCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-childscn12edit',
  templateUrl: './childscn12edit.component.html',
  styleUrls: ['./childscn12edit.component.css','../../../../assets/css/child.css']
})
export class Childscn12editComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childscn12editComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public childscn12Service: Childscn12Service,
    public dialog: MatDialog
  ) { }

  ynCode: OptionsCode[] = [{value: 'Y', viewValue: '是'}, {value: 'N', viewValue: '否'}];

  ngOnInit(): void {
  }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async save() {
    let msgStr: string = "";
    let codeStr: string = "";
    const baseUrl = 'f01/childscn12action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['incomeType'] = this.data.incomeType;
    jsonObject['cuId'] = this.data.cuId;
    jsonObject['cuCname'] = this.data.cuCname;
    jsonObject['num'] = this.data.num;
    jsonObject['mincomeExp'] = this.data.mincomeExp;
    await this.childscn12Service.childscn12Action(baseUrl, jsonObject).then((data: any) => {
      codeStr = data.rspCode;
      msgStr = data.rspMsg;
    });
    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });
    if (msgStr === '儲存成功' && codeStr === '0000') { this.dialogRef.close({ event:'success' }); }
  }
}
