import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn12Service } from '../childscn12.service';
interface ynCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-childscn12delete',
  templateUrl: './childscn12delete.component.html',
  styleUrls: ['./childscn12delete.component.css','../../../../assets/css/child.css']
})
export class Childscn12deleteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<Childscn12deleteComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public childscn12Service: Childscn12Service, public dialog: MatDialog) { }
  ynCode: ynCode[] = [{value: 'Y', viewValue: '是'}, {value: 'N', viewValue: '否'}];

  ngOnInit(): void {
  }

  async deleteAction() {
    let msgStr: string = "";
    let codeStr: string = "";
    const baseUrl = 'f01/childscn12action2';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['incomeType'] = this.data.incomeType;
    await this.childscn12Service.childscn12Action(baseUrl, jsonObject).then((data: any) => {
      codeStr = data.rspCode;
      msgStr = data.rspMsg;
    });
    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });
    if (msgStr === '刪除成功' && codeStr === '0000') { this.dialogRef.close({ event:'success' }); }
  }

  close() {
    this.dialogRef.close();
  }
}
