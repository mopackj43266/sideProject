import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { BaseService } from 'src/app/base.service';
import { Childscn22Service } from 'src/app/children/childscn22/childscn22.service';
import { OptionsCode } from 'src/app/interface/base';
import { Childbwscn14Service } from './childbwscn14.service';

@Component({
  selector: 'app-childbwscn14',
  templateUrl: './childbwscn14.component.html',
  styleUrls: ['./childbwscn14.component.css']
})
export class Childbwscn14Component implements OnInit {

  constructor(
    private childbwscn14Service: Childbwscn14Service,
    private nzI18nService: NzI18nService,
    public dialog: MatDialog, //測試用
  ) {
    this.nzI18nService.setLocale(zh_TW)
  }

  private applno: string;
  empNo: string = BaseService.userId;//測試用
  nowDateTime: Date;
  PERSONSource = [];//table資料
  limitTypeCode: OptionsCode[] = [];
  block: boolean = false;

  ngOnInit(): void {
    this.childbwscn14Service.getSysTypeCode('LIMIT_TYPE').subscribe(data => {
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
    const baseUrl = 'f01/childbwscn14';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno
    this.childbwscn14Service.postJsonObject_PERSON_MAIN(baseUrl, jsonObject).subscribe(data => {
      if (data.rspMsg == 'success') {
        this.PERSONSource = data.rspBody;
      }
      this.nowDateTime = data.rspBody[0].queryDate;
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
}
