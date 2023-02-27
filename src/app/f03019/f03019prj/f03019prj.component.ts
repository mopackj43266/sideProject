import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F03019Service } from '../f03019.service';

//角色checkBox框架
interface checkBox {
  value: string;
  completed: boolean;
}
//Jay 組織人員維護-儲存角色設定
@Component({
  selector: 'app-f03019prj',
  templateUrl: './f03019prj.component.html',
  styleUrls: ['./f03019prj.component.css', '../../../assets/css/f03.css']
})
export class F03019prjComponent {
  constructor(public dialogRef: MatDialogRef<F03019prjComponent>,
     public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public f03019Service: F03019Service) { }
  submit() {
  }
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
    var valArray: string[] = new Array;
    for (const obj of this.data.CHECKBOX) {
      if (obj.completed) { valArray.push(obj.value); }
    }
    let jsonObject: any = {};
    jsonObject['empNo'] = this.data.empNo;
    jsonObject['roleNo'] = valArray.toString();
    let msgStr = '';
    const baseUrl = 'f03/f03006action4';
     this.f03019Service.saveEmployeeRole(baseUrl, jsonObject).subscribe(data => {
      msgStr = (data.rspCode === '0000' && data.rspMsg === '儲存成功!') ? '儲存成功！' : '儲存失敗！';
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr === '儲存成功！') { this.dialogRef.close({ event:'success' }); }
    });
  }

}
