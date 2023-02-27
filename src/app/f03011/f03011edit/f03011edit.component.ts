import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F03011Service } from '../f03011.service';

@Component({
  selector: 'app-f03011edit',
  templateUrl: './f03011edit.component.html',
  styleUrls: ['./f03011edit.component.css', '../../../assets/css/f03.css']
})
export class F03011editComponent implements OnInit {

  scklvCode: OptionsCode[] = [];
  calvCode: OptionsCode[] = [];
  tvNoCode: OptionsCode[] = [];

  oldscklv: string;
  oldcalv: string;
  oldtvNo: string;

  constructor(public dialogRef: MatDialogRef<F03011editComponent>,private f03011Service: F03011Service, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  submit() {
  }

  ngOnInit(): void {
    this.f03011Service.getSysTypeCode('SCKLV').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.scklvCode.push({value: codeNo, viewValue: desc})
      }
    });
    this.f03011Service.getSysTypeCode('CALV').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.calvCode.push({value: codeNo, viewValue: desc})
      }
    });
    this.f03011Service.getSysTypeCode('TV_NO').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.tvNoCode.push({value: codeNo, viewValue: desc})
      }
    });
    this.oldtvNo = this.data.tvNo;
    this.oldscklv = this.data.scklv;
    this.oldcalv = this.data.calv;
  }

  public async save(): Promise<void> {
    let msgStr: string = "";
    let baseUrl = 'f03/f03011action2';
    msgStr = await this.f03011Service.update(baseUrl, this.data, this.oldtvNo, this.oldscklv, this.oldcalv);
    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });
    if (msgStr === '更新成功!') { this.dialogRef.close({ event:'success'}); }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
