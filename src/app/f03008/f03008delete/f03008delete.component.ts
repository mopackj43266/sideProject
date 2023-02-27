import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F03008Service } from '../f03008.service';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { BaseService } from 'src/app/base.service';


@Component({
  selector: 'app-f03008delete',
  templateUrl: './f03008delete.component.html',
  styleUrls: ['./f03008delete.component.css', '../../../assets/css/f03.css']
})
export class F03008deleteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<F03008deleteComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public f03008Service: F03008Service,
    private nzI18nService: NzI18nService,
    ) {
      this.nzI18nService.setLocale(zh_TW)
    }

  YNselect: OptionsCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' }];
  empNo: string = BaseService.userId;

  ngOnInit(): void {

  }

  submit() {
  }

  //取消
  onNoClick() {
    this.dialogRef.close();
  }

  //刪除
  public async deleteAction(abnormalNid: string): Promise<void> {
    let baseUrl = 'f03/f03008action4';
    let jsonObject: any = {};
    let msgStr: string = "";
    jsonObject['abnormalNid'] = abnormalNid;
    this.f03008Service.elAbnormalNid(baseUrl, jsonObject).subscribe(data => {
      msgStr = data.rspMsg;
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: data.rspMsg }
      });
      // this.refreshTable();
      if (msgStr === '刪除成功!!') { this.dialogRef.close({ event: 'success' }); }
    });

  }


}
