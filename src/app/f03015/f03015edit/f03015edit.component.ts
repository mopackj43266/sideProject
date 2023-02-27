import { NzI18nService } from 'ng-zorro-antd/i18n';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F03015Service } from '../f03015.service';
import { F03015confirmComponent } from '../f03015confirm/f03015confirm.component';

//下拉選單框架
interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f03015edit',
  templateUrl: './f03015edit.component.html',
  styleUrls: ['./f03015edit.component.css', '../../../assets/css/f03.css']
})
export class F03015editComponent implements OnInit {
  //proxyIncome 維護
  constructor(public dialogRef: MatDialogRef<F03015confirmComponent>, public f03015Service: F03015Service, public dialog: MatDialog, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any) { }
  insert = true; //insert
  update = true;  //update

  insertForm: FormGroup = this.fb.group({
    INDUC_CODE: ['', [Validators.maxLength(6)]],
    INDUC_LEVEL1: ['', [Validators.maxLength(2), Validators.required]],
    INDUC_LEVEL1_DESC: ['', [Validators.maxLength(100), Validators.required]],
    INDUC_LEVEL2: ['', [Validators.maxLength(2), Validators.required]],
    INDUC_LEVEL2_DESC: ['', [Validators.maxLength(100), Validators.required]],
    JOB_CODE: ['', [Validators.maxLength(2), Validators.required]],
    JOB_CODE_DESC: ['', [Validators.maxLength(100), Validators.required]],
    TEN_PERCENT_SALARY: ['', [Validators.maxLength(8), Validators.maxLength(8), Validators.required]],
    MID_SALARY: ['', [Validators.maxLength(8), Validators.maxLength(8), Validators.required]],
    NINETY_PERCENT_SALARY: ['', [Validators.maxLength(8), Validators.maxLength(8), Validators.required]],
    ROWID: []
  });

  formControl = new FormControl('', [
    Validators.required
  ]);

  ngOnInit(): void {
    let isInsert = this.data.isInsert;

    if (isInsert == true) {
      this.insert = false;
    } else {
      this.update = false;
      this.insertForm.patchValue({ INDUC_CODE: this.data.row.INDUC_CODE });
      this.insertForm.patchValue({ INDUC_LEVEL1: this.data.row.INDUC_LEVEL1 });
      this.insertForm.patchValue({ INDUC_LEVEL1_DESC: this.data.row.INDUC_LEVEL1_DESC });
      this.insertForm.patchValue({ INDUC_LEVEL2: this.data.row.INDUC_LEVEL2 });
      this.insertForm.patchValue({ INDUC_LEVEL2_DESC: this.data.row.INDUC_LEVEL2_DESC });
      this.insertForm.patchValue({ JOB_CODE: this.data.row.JOB_CODE });
      this.insertForm.patchValue({ JOB_CODE_DESC: this.data.row.JOB_CODE_DESC });
      this.insertForm.patchValue({ TEN_PERCENT_SALARY: this.data.row.TEN_PERCENT_SALARY });
      this.insertForm.patchValue({ MID_SALARY: this.data.row.MID_SALARY });
      this.insertForm.patchValue({ NINETY_PERCENT_SALARY: this.data.row.NINETY_PERCENT_SALARY });
      this.insertForm.patchValue({ ROWID: this.data.row.RID });
    }
  }


  changeJobCodeSelect() {
    if (this.data.isInsert == true) {
      let inducCode = this.insertForm.value.INDUC_LEVEL1 + this.insertForm.value.INDUC_LEVEL2 + this.insertForm.value.JOB_CODE;
      this.insertForm.patchValue({ INDUC_CODE: inducCode });
    }
  }

  getErrorMessage(formControl: FormControl) {
    return this.formControl.hasError('required') ? '此欄位必填' : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async confirmAdd(): Promise<void> {
    let msgStr: string = "";
    if (this.insertForm.invalid) {
      for (const i in this.insertForm.controls) {
        if (this.insertForm.controls.hasOwnProperty(i)) {
          this.insertForm.controls[i].markAsDirty();
          this.insertForm.controls[i].updateValueAndValidity();
        }
      }
    } else {
      let jsonObject: any = {};

      jsonObject['inducCode'] = this.insertForm.value.INDUC_CODE;
      jsonObject['inducLevel1'] = this.insertForm.value.INDUC_LEVEL1;
      jsonObject['inducLevel1Desc'] = this.insertForm.value.INDUC_LEVEL1_DESC;
      jsonObject['inducLevel2'] = this.insertForm.value.INDUC_LEVEL2;
      jsonObject['inducLevel2Desc'] = this.insertForm.value.INDUC_LEVEL2_DESC;
      jsonObject['jobCode'] = this.insertForm.value.JOB_CODE;
      jsonObject['jobCodeDesc'] = this.insertForm.value.JOB_CODE_DESC;
      jsonObject['tenPercentSalary'] = this.insertForm.value.TEN_PERCENT_SALARY;
      jsonObject['midSalary'] = this.insertForm.value.MID_SALARY;
      jsonObject['ninetyPercentSalary'] = this.insertForm.value.NINETY_PERCENT_SALARY;

      await this.f03015Service.getReturn('f03/f03015action1', jsonObject).subscribe(data => {
        this.dialog.open(F03015confirmComponent, { data: { msgStr: data.rspMsg } });
        if (data.rspCode === '0000') { this.dialogRef.close({ event: 'success' }); }
      });
    }
  }

  public async updateData(): Promise<void> {
    let msgStr: string = "";
    if (!this.insertForm.valid) {
      msgStr = '資料格式有誤，請修正!';
      const childernDialogRef = this.dialog.open(F03015confirmComponent, {
        data: { msgStr: msgStr }
      });
    } else {
      let jsonObject: any = {};
      jsonObject['inducCode'] = this.insertForm.value.INDUC_CODE;
      jsonObject['inducLevel1'] = this.insertForm.value.INDUC_LEVEL1;
      jsonObject['inducLevel1Desc'] = this.insertForm.value.INDUC_LEVEL1_DESC;
      jsonObject['inducLevel2'] = this.insertForm.value.INDUC_LEVEL2;
      jsonObject['inducLevel2Desc'] = this.insertForm.value.INDUC_LEVEL2_DESC;
      jsonObject['jobCode'] = this.insertForm.value.JOB_CODE;
      jsonObject['jobCodeDesc'] = this.insertForm.value.JOB_CODE_DESC;
      jsonObject['tenPercentSalary'] = this.insertForm.value.TEN_PERCENT_SALARY;
      jsonObject['midSalary'] = this.insertForm.value.MID_SALARY;
      jsonObject['ninetyPercentSalary'] = this.insertForm.value.NINETY_PERCENT_SALARY;
      jsonObject['rowID'] = this.insertForm.value.ROWID;

      await this.f03015Service.getReturn('f03/f03015action3', jsonObject).subscribe(data => {
        this.dialog.open(F03015confirmComponent, { data: { msgStr: data.rspMsg } });
        if (data.rspCode === '0000') { this.dialogRef.close({ event: 'success' }); }
      });
    }
  }

}
