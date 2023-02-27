import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F03008Service } from '../f03008.service';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { BaseService } from 'src/app/base.service';

@Component({
  selector: 'app-f03008edit',
  templateUrl: './f03008edit.component.html',
  styleUrls: ['./f03008edit.component.css', '../../../assets/css/f03.css']
})
export class F03008editComponent   {

  constructor(
    public dialogRef: MatDialogRef<F03008editComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public f03008Service: F03008Service ,
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

  onNoClick() {
    this.dialogRef.close();
  }
  // stopEdit() {
  //   this.dialogRef.close();
  // }

  public async stopEdit(): Promise<void> {
    let jsonObject: any = {};
    jsonObject['empNo'] = this.empNo;
    jsonObject['abnormalNid'] = this.data.abnormalNid;
    jsonObject['onCheck'] = this.data.onCheck;
    let msgStr: string = "";
    let baseUrl = 'f03/f03008action3';
    msgStr = await this.f03008Service.addOrEditAdrCodeSet(baseUrl, jsonObject);
    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });
    if (msgStr === '編輯成功!!') { this.dialogRef.close({ event: 'success' }); }
  }

}
