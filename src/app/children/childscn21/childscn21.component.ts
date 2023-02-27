import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Childscn21Service } from './childscn21.service';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n'
import { OptionsCode } from 'src/app/interface/base';
import { Childscn22Service } from '../childscn22/childscn22.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/base.service';

//Nick 額度資訊
@Component({
  selector: 'app-childscn21',
  templateUrl: './childscn21.component.html',
  styleUrls: ['./childscn21.component.css']
})
export class Childscn21Component implements OnInit {
  constructor(
    private childscn21Service: Childscn21Service,
    private nzI18nService: NzI18nService,
    public dialog: MatDialog, //測試用
    private childsnc22Service: Childscn22Service//測試用
  ) { this.nzI18nService.setLocale(zh_TW) }

  private applno: string;
  empNo: string = BaseService.userId;//測試用
  stepName: string = sessionStorage.getItem('stepName');//測試用
  nowDateTime: Date;
  PERSONSource = [];//table資料
  limitTypeCode: OptionsCode[] = [];
  block: boolean = false;
  ngOnInit(): void {
    this.childscn21Service.getSysTypeCode('LIMIT_TYPE').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.limitTypeCode.push({ value: codeNo, viewValue: desc })
      }
    });
    this.applno = sessionStorage.getItem('applno');
    this.getCALLOUTFunction();//載入頁面
  }

  //取Table
  private async getCALLOUTFunction() {
    const baseUrl = 'f01/childscn21';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno
    this.childscn21Service.postJsonObject_PERSON_MAIN(baseUrl, jsonObject).subscribe(data => {
      if (data.rspMsg == 'success') {
        this.PERSONSource = data.rspBody;
      }
      if (data.rspBody != null) {
        if (Object.keys(data.rspBody[0]).length === 0) {
          this.nowDateTime = data.rspBody[0].queryDate;
        }
      }
    });
  }

  getStyle(value: string) {
    // value = this.toNumber(value);
    value = value != null ? value.replace(',', '') : value;
    return {
      'text-align': this.isNumber(value) ? 'right' : 'left'
    }
  }

  isNumber(value: any) { return /^-?[\d.]+(?:e-?\d+)?$/.test(value); }

  toCurrency(amount: string) {
    return amount != null ? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\w\s]|_/g, '') : data;
  }

  // 轉成中文
  transCode(codeVal: string): string {
    for (const data of this.limitTypeCode) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }
  //測試用
  public async callTest(): Promise<void> {
    alert('test')
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['empno'] = this.empNo;
    let msgStr: string = '';
    if (this.stepName == 'APPLCreditL3') {
      msgStr = await this.childsnc22Service.doDss3Search(jsonObject);
      const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msgStr } });
      setTimeout(() => {
        this.dialog.closeAll();
      }, 2000);
    } else if (this.stepName == 'APPLCreditL2') {
      msgStr = await this.childsnc22Service.doDss2Search(jsonObject);
      const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msgStr } });
      setTimeout(() => {
        this.dialog.closeAll();
      }, 2000);
      // } else {
      //   msgStr = await this.childsnc22Service.doDss4Search(jsonObject);
      //   this.block = false;
      //   const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msgStr } });
    }
  }
}
