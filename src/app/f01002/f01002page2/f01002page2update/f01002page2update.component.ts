import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { HandleSubscribeService } from 'src/app/services/handle-subscribe.service';
import { F01002Service } from '../../f01002.service';

@Component({
  selector: 'app-f01002page2update',
  templateUrl: './f01002page2update.component.html',
  styleUrls: ['./f01002page2update.component.css',]
})
export class F01002page2updateComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private f01002Service: F01002Service,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<F01002page2updateComponent>,
    private handleSubscribeS: HandleSubscribeService
  ) { }

  ngOnInit(): void {
  }

  public async cancelCallout(): Promise<void> {
    let jsonObject: any = {};
    jsonObject['rowid'] = this.data.ID;
    let msgStr: string = '';
    msgStr = await this.f01002Service.updateCalloutYN(jsonObject);
    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });
    if (msgStr === '取消成功!') { this.dialogRef.close({ event: 'success' }); }
    this.handleSubscribeS.updateCallout();
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
