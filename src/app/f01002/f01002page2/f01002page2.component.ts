import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { HandleSubscribeService } from 'src/app/services/handle-subscribe.service';
import { F01002Service } from '../f01002.service';
import { F01002page2updateComponent } from './f01002page2update/f01002page2update.component';

//20211014 alvin.lee

//徵信照會table框架
interface callout {
  APPLNO: string;
  CON_TYPE: string;
  PHONE: string;
  TEL_CONDITION: string;
  TEL_CHECK: string;
  CON_MEMO: string;
  CALLOUT_DATE: string;
  CALLOUT_RDO: string;
}

@Component({
  selector: 'app-f01002page2',
  templateUrl: './f01002page2.component.html',
  styleUrls: ['./f01002page2.component.css', '../../../assets/css/f01.css']
})

export class F01002page2Component implements OnInit {
  intervalRef: any;
  applno: string;
  callOutDataSource = [];           // 照會提醒清單
  rspBodyList: callout[] = [];      //table資料
  telCheck: OptionsCode[] = [];     // 電話驗證
  telCondition: OptionsCode[] = []; // 電話狀況
  conType: OptionsCode[] = [];      // 聯絡方式
  total = 1;
  loading = true;
  pageSize = 50;
  pageIndex = 1;
  extendTimeValue: string;
  extendTimeCode = [
    { value: '30', label: '30分' },
    { value: '60', label: '60分' },
    { value: '90', label: '90分' },
    { value: '120', label: '120分' }];

  constructor(
    private f01002Service: F01002Service,
    public dialog: MatDialog,
    private router: Router,
    private handleSubscribeService: HandleSubscribeService
  ) { }

  ngOnInit(): void {
    this.f01002Service.getSysTypeCode('TEL_CHECK').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.telCheck.push({ value: codeNo, viewValue: desc })
      }
    });
    this.f01002Service.getSysTypeCode('TEL_CONDITION').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.telCondition.push({ value: codeNo, viewValue: desc })
      }
    });
    this.f01002Service.getSysTypeCode('CON_TYPE').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.conType.push({ value: codeNo, viewValue: desc })
      }
    });

    // this.search = sessionStorage.getItem('search');
    // this.empNo = BaseService.userId;
    this.getCalloutList(this.pageIndex, this.pageSize);
    this.intervalRef = setInterval(
      () => {
        this.getCalloutList(this.pageIndex, this.pageSize);
      }, 5 * 60 * 1000);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    if(this.pageIndex !==pageIndex){// 判斷是否為第一次進頁面
      const { pageSize, pageIndex } = params;
      this.getCalloutList(pageIndex, pageSize);
    }
  }

  // 照會提醒清單
  getCalloutList(pageIndex: number, pageSize: number) {
    let jsonObject: any = {};
    jsonObject['swcL3EmpNo'] = BaseService.userId;
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.loading = false;
    this.f01002Service.getCalloutList(jsonObject).subscribe(data => {
      this.total = data.rspBody.size;
      this.rspBodyList = data.rspBody.items;
      this.callOutDataSource = this.rspBodyList;
    });
  }
// 排序
sortChange(e: string) {
  this.rspBodyList = e === 'ascend' ? this.rspBodyList.sort(
    (a, b) => a.APPLNO.localeCompare(b.APPLNO)) : this.rspBodyList.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO))
}
  //延長下次照會提醒時間
  extendTime(ID: string, calloutRdo: string) {
    let msg = '';
    let jsonObject: any = {};
    jsonObject['rowid'] = ID;
    jsonObject['extendTime'] = calloutRdo;
    this.f01002Service.updateCalloutTime(jsonObject).subscribe(data => {
      msg = data.rspMsg;
    });
    setTimeout(() => {
      const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msg } });
      if (msg != null && msg == '延長成功') {
        this.getCalloutList(this.pageIndex, this.pageSize);
        this.handleSubscribeService.updateCallout();
      }
    }, 1000);
  }

  //取消照會提醒
  cancelCallout(ID: string) {
    const dialogRef = this.dialog.open(F01002page2updateComponent, {
      minHeight: '70vh',
      width: '50%',
      panelClass: 'mat-dialog-transparent',
      data: {
        ID: ID,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') { this.refreshTable(); }
    })
  }

  //透過案編跳轉至徵信照會
  toCalloutPage(applno: string) {
    sessionStorage.setItem('applno', applno);
    sessionStorage.setItem('search', 'Y');
    sessionStorage.setItem('winClose', 'N');
    sessionStorage.setItem('level', '3');
    // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
    sessionStorage.setItem('page', '2');
    this.router.navigate(['./F01002/F01002SCN1/CHILDSCN8']);
  }

  refreshTable() {
    this.getCalloutList(this.pageIndex, this.pageSize);
  }

  // 將案件類型轉成中文
  getTelCheck(codeVal: string): string {
    for (const data of this.telCheck) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }

  getTelCondition(codeVal: string): string {
    for (const data of this.telCheck) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }

  getConType(codeVal: string): string {
    for (const data of this.conType) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }

}
