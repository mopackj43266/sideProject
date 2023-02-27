import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn13Service } from '../childscn13.service';

@Component({
  selector: 'app-childscn13delete',
  templateUrl: './childscn13delete.component.html',
  styleUrls: ['./childscn13delete.component.css','../../../../assets/css/child.css']
})
export class Childscn13deleteComponent implements OnInit {

  imageSrc: string;
  rowId: string;
  msg: string = "";

  constructor(public dialogRef: MatDialogRef<Childscn13deleteComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public childscn13Service: Childscn13Service, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.rowId = this.data.rowId;
    this.imageSrc = 'data:image/png;base64,' + this.data.base64;
  }

  async deleteFile() {
    const baseUrl = 'f01/childscn13action3';
    let jsonObject: any = {};
    jsonObject['rowid'] = this.rowId;
    let msgStr: string = "";
    let codeStr: string = "";
    await this.childscn13Service.childscn13Del(baseUrl, jsonObject).then((data: any) => {
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
