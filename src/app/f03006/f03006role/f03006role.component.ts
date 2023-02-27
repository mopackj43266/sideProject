import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F03006Service } from '../f03006.service';

//角色checkBox框架
interface checkBox {
  value: string;
  completed: boolean;
}

//Nick 組織人員維護-儲存角色設定
@Component({
  selector: 'app-f03006role',
  templateUrl: './f03006role.component.html',
  styleUrls: ['./f03006role.component.css', '../../../assets/css/f03.css']
})
export class F03006roleComponent {
  constructor(public dialogRef: MatDialogRef<F03006roleComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public f03006Service: F03006Service) { }
  submit() {
  }

  loading = false;

  //載入選項
  setAll(completed: boolean) {
    for (const obj of this.data.CHECKBOX) {
      obj.completed = completed;

    }
  }

  //取消
  onNoClick(): void {
    this.dialogRef.close();

  }

  //儲存角色設定
  public async confirmAdd(): Promise<void> {
    this.loading = true;
    var valArray: string[] = new Array;
    for (const obj of this.data.CHECKBOX) {
      if (obj.completed) { valArray.push(obj.value); }
    }
    let jsonObject: any = {};
    let roleNo: string = valArray.toString()
    jsonObject['empNo'] = this.data.empNo;
    jsonObject['roleNo'] = roleNo;
    let msgStr = '';
    const baseUrl = 'f03/f03006action4';
    this.f03006Service.saveEmployeeRole(baseUrl, jsonObject).subscribe(data => {
      msgStr = (data.rspCode === '0000' && data.rspMsg === '儲存成功!') ? '儲存成功！' : '儲存失敗！';
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '儲存成功！') { this.dialogRef.close({ event: 'success' }); }
      this.loading = false;
    });
  }

}
