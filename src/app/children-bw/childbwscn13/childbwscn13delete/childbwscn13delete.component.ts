import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childbwscn13Service } from '../childbwscn13.service';

@Component({
  selector: 'app-childbwscn13delete',
  templateUrl: './childbwscn13delete.component.html',
  styleUrls: ['./childbwscn13delete.component.css','../../../../assets/css/child.css']
})
export class Childbwscn13deleteComponent implements OnInit {

  imageSrc: string;
  rowId: string;
  msg: string = "";

  constructor(
    public dialogRef: MatDialogRef<Childbwscn13deleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public childbwscn13Service: Childbwscn13Service,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.rowId = this.data.rowId;
    this.imageSrc = 'data:image/png;base64,' + this.data.base64;
  }

  async deleteFile() {
    const baseUrl = 'f01/childbwscn13action3';
    let jsonObject: any = {};
    jsonObject['rowid'] = this.rowId;
    let msgStr: string = "";
    let codeStr: string = "";
    await this.childbwscn13Service.childbwscn13Del(baseUrl, jsonObject).then((data: any) => {
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
