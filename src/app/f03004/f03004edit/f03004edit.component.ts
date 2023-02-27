import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F03004Service } from '../f03004.service';

interface ynCode {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-f03004edit',
  templateUrl: './f03004edit.component.html',
  styleUrls: ['./f03004edit.component.css', '../../../assets/css/f03.css']
})
export class F03004editComponent {

  constructor(
    public dialogRef: MatDialogRef<F03004editComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public f03004Service: F03004Service
  ) { }

  ynCode: ynCode[] = [{value: 'Y', viewValue: '是'}, {value: 'N', viewValue: '否'}];
  hidden: string = "hidden";

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' : '';
  }

  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async stopEdit(): Promise<void> {
    let msgStr: string = "";
    let baseUrl = 'f03/f03004action3';
    this.hidden = "hidden";
    if( isNaN( this.data.codeSort ) ) {
      this.hidden = "";
      return;
    } else {
      msgStr = await this.f03004Service.addOrEditSystemCodeSet(baseUrl, this.data);
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '編輯成功!') { this.dialogRef.close({ event:'success' }); }
    }
  }

  min = 1;
  max = 1;
  test1() {
    // this.min = 10;
    this.min = this.data.codeTag.length / (document.getElementById('test').clientWidth / 10);
  }

  test2() {
   this.min = 1;
  }

  change() {
    this.min = this.data.codeTag.length / (document.getElementById('test').clientWidth / 10);
  }
}
