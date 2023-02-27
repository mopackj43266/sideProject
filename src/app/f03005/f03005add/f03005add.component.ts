import { NgZorroAntdModule } from './../../ngzorro/ng-zorro-antd.module';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F03005Service } from '../f03005.service';
import { OptionsCode } from 'src/app/interface/base';

@Component({
  selector: 'app-f03005add',
  templateUrl: './f03005add.component.html',
  styleUrls: ['./f03005add.component.css', '../../../assets/css/f03.css']
})
export class F03005addComponent {

  constructor(
    public dialogRef: MatDialogRef<F03005addComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public f03005Service: F03005Service,
    public dialog: MatDialog
  ) { }

  ynCode: OptionsCode[] = [];
  hidden: string = "hidden";

  ngOnInit(): void {
    this.f03005Service.getSysTypeCode('YN').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.ynCode.push({ value: codeNo, viewValue: desc })
      }
    });
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

  submit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async confirmAdd(): Promise<void> {
    let msgStr: string = "";
    let baseUrl = 'f03/f03005action2';
    this.hidden = "hidden";
    if( isNaN( this.data.reasonSort ) ) {
      this.hidden = "";
    } else {
      msgStr = await this.f03005Service.addOrEditAdrCodeSet(baseUrl, this.data);
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '新增成功!') { this.dialogRef.close({ event:'success' }); }
    }
  }
}
