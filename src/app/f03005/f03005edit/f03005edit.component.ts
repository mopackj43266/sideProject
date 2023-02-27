import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F03005Service } from '../f03005.service';

@Component({
  selector: 'app-f03005edit',
  templateUrl: './f03005edit.component.html',
  styleUrls: ['./f03005edit.component.css', '../../../assets/css/f03.css']
})
export class F03005editComponent {

  constructor(
    public dialogRef: MatDialogRef<F03005editComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public f03005Service: F03005Service
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
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async stopEdit(): Promise<void> {
    let msgStr: string = "";
    let baseUrl = 'f03/f03005action3';
    this.hidden = "hidden";
    if (isNaN(this.data.reasonSort)) {
      this.hidden = "";
    } else {
      msgStr = await this.f03005Service.addOrEditAdrCodeSet(baseUrl, this.data);
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '更新成功!') { this.dialogRef.close({ event: 'success' }); }
    }
  }
}
