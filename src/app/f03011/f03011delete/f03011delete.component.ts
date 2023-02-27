import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F03011Service } from '../f03011.service';

@Component({
  selector: 'app-f03011delete',
  templateUrl: './f03011delete.component.html',
  styleUrls: ['./f03011delete.component.css', '../../../assets/css/f03.css']
})
export class F03011deleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<F03011deleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public f03011Service: F03011Service,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  async deleteAction() {
    let msg = '';
    const baseUrl = 'f03/f03011action3';
    let jsonObject: any = {};
    jsonObject['scklv'] = this.data.scklv;
    jsonObject['calv'] = this.data.calv;
    jsonObject['tvNo'] = this.data.tvNo;
    await this.f03011Service.delWithJson(baseUrl, jsonObject).then((data: any) => {
      msg = data.rspMsg;
    });
    const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msg } });
    this.dialogRef.close({ event: msg });

  }

  close() {
    this.dialogRef.close();
  }
}
