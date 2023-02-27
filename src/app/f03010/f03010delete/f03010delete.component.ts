import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F03010Service } from '../f03010.service';
import { OptionsCode } from 'src/app/interface/base';

@Component({
  selector: 'app-f03010delete',
  templateUrl: './f03010delete.component.html',
  styleUrls: ['./f03010delete.component.css', '../../../assets/css/f03.css']
})
export class F03010deleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<F03010deleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public f03010Service: F03010Service,
    public dialog: MatDialog
  ) { }

  //暫停使用下拉選單
  stopFlagCode: OptionsCode[] = [{ value: 'Y', viewValue: 'Y' }, { value: 'N', viewValue: 'N' }];

  ngOnInit(): void {

  }

  async deleteAction() {
    let msg = '';
    const baseUrl = 'f03/f03010action3';
    let jsonObject: any = {};
    jsonObject['speakingAbbreviation'] = this.data.speakingAbbreviation;
    await this.f03010Service.delWithJson(baseUrl, jsonObject).then((data: any) => {
      msg = data.rspMsg;
    });
    const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msg } });
    this.dialogRef.close({ event: msg });
  }
  close() {
    this.dialogRef.close();
  }

}
