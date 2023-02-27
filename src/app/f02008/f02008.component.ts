import { OptionsCode } from './../interface/base';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from '../base.service';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { F02008Service } from './f02008.service';
import { MenuListService } from '../menu-list/menu-list.service';

@Component({
  selector: 'app-f02008',
  templateUrl: './f02008.component.html',
  styleUrls: ['./f02008.component.css', '../../assets/css/f02.css']
})
export class F02008Component implements OnInit {

  constructor(
    public dialog: MatDialog,
    public pipe: DatePipe,
    private f02008Service: F02008Service,
    private menuListService: MenuListService,
  ) { }

  applno: string = '';
  nationalId: string = '';
  custId: string = '';
  custCname: string = '';
  applyTime: [Date, Date];
  signUpTime: [Date, Date];
  firstFlag: number = 1;
  statusDetailCode: OptionsCode[] = [];
  x: string;

  //data
  resultData = [];
  total: number=0;
  loading = false;
  pageSize = 50;
  pageIndex = 1;
  sortArry = ['ascend', 'descend'];
  newData: any[] = [];

  ngOnInit(): void {

    // 查詢案件分類
    this.f02008Service.getSysTypeCode('STATUS_DETAIL').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.statusDetailCode.push({ value: codeNo, viewValue: desc })
      }
    });
  }

  dateNull(t: [Date, Date], name: string) {
    if (t.length < 1) {
      switch (name) {
        case 'applyTime':
          this.applyTime = null;
          break;
        case 'signUpTime':
          this.signUpTime = null;
          break;
      }
    }
  }

  select() {
    this.changePage();
    this.conditionCheck();
  }

  changePage() {
    this.pageIndex = 1;
  }

  conditionCheck() {
    if (
      this.applno == '' &&
      this.nationalId == '' &&
      this.custId == '' &&
      this.custCname == '' &&
      this.applyTime == null &&
      this.signUpTime == null
    ) {
      this.total = 0;
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請至少選擇一項條件" }
      });
    } else {
      this.selectData(this.pageIndex, this.pageSize);
    }
  }

  selectData(pageIndex: number, pageSize: number) {
    this.firstFlag = 2;
    let url = "f02/f02008action1";
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['nationalID'] = this.nationalId;
    jsonObject['custID'] = this.custId;
    jsonObject['cuCname'] = this.custCname;
    if (this.nationalId != '' || this.custId != '') {
      //進件日期
      if (this.applyTime != null) {
        if (this.dealwithData365(this.applyTime)) {
          jsonObject['applyEndTimeStart'] = this.pipe.transform(new Date(this.applyTime[0]), 'yyyyMMdd');
          jsonObject['applyEndTimeEnd'] = this.pipe.transform(new Date(this.applyTime[1]), 'yyyyMMdd');
        } else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "進件日期查詢區間最多一年內!" }
          });
          return;
        }
      } else {
        jsonObject['applyEndTimeStart'] = '';
        jsonObject['applyEndTimeEnd'] = '';
      }
      //簽約完成日期
      if (this.signUpTime != null) {
        if (this.dealwithData365(this.signUpTime)) {
          jsonObject['signUpTimeStart'] = this.pipe.transform(new Date(this.signUpTime[0]), 'yyyyMMdd');
          jsonObject['signUpTimeEnd'] = this.pipe.transform(new Date(this.signUpTime[1]), 'yyyyMMdd');
        } else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "簽約完成日期查詢區間最多一年內!" }
          });
          return;
        }
      } else {
        jsonObject['signUpTimeStart'] = '';
        jsonObject['signUpTimeEnd'] = '';
      }
    } else {
      //進件日期
      if (this.applyTime != null) {
        if (this.dealwithData90(this.applyTime)) {
          jsonObject['applyEndTimeStart'] = this.pipe.transform(new Date(this.applyTime[0]), 'yyyyMMdd');
          jsonObject['applyEndTimeEnd'] = this.pipe.transform(new Date(this.applyTime[1]), 'yyyyMMdd');
        } else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "進件日期查詢區間最多三個內!" }
          });
          return;
        }
      } else {
        jsonObject['applyEndTimeStart'] = '';
        jsonObject['applyEndTimeEnd'] = '';
      }
      //簽約完成日期
      if (this.signUpTime != null) {
        if (this.dealwithData90(this.signUpTime)) {
          jsonObject['signUpTimeStart'] = this.pipe.transform(new Date(this.signUpTime[0]), 'yyyyMMdd');
          jsonObject['signUpTimeEnd'] = this.pipe.transform(new Date(this.signUpTime[1]), 'yyyyMMdd');
        } else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "簽約完成日期查詢區間最多三個內!" }
          });
          return;
        }
      } else {
        jsonObject['signUpTimeStart'] = '';
        jsonObject['signUpTimeEnd'] = '';
      }
    }
    this.f02008Service.getData(url, jsonObject).subscribe(data => {
      if (data.rspBody.size == 0) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        })
        this.resultData = [];
        this.total = 0;
      } else {
        this.resultData = data.rspBody.item;
        this.newData = this.f02008Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        this.total = data.rspBody.size;
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    if (this.firstFlag != 1) {
      this.pageIndex = pageIndex;
      this.newData = this.f02008Service.getTableDate(pageIndex, this.pageSize, this.resultData);
    }
  }

  sortChange(e: string, param: string) {
    switch (param) {
      case "APPLNO":
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
          : this.resultData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
        this.newData = this.f02008Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
      case "APPLYEND_TIME":
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.APPLYEND_TIME.localeCompare(b.APPLYEND_TIME))
          : this.resultData.sort((a, b) => b.APPLYEND_TIME.localeCompare(a.APPLYEND_TIME));
        this.newData = this.f02008Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
    }
  }

  dealwithData365(stime: any) {
    var startDate, endDate;
    startDate = new Date(stime[0]);
    endDate = new Date(stime[1]);
    if ((endDate - startDate) / 1000 / 60 / 60 / 24 > 365) {
      return false;
    }
    else {
      return true;
    }
  }

  dealwithData90(stime: any) {
    var startDate, endDate;
    startDate = new Date(stime[0]);
    endDate = new Date(stime[1]);
    if ((endDate - startDate) / 1000 / 60 / 60 / 24 > 90) {
      return false;
    }
    else {
      return true;
    }
  }

  clear() {
    this.applno = '';
    this.nationalId = '';
    this.custId = '';
    this.custCname = '';
    this.applyTime = null;
    this.signUpTime = null;
    this.newData = [];
    this.total=0
  }

  Detail(id: string, nationalId: string, cuCname: string, custId: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = id;
    jsonObject['nationalID'] = nationalId;
    jsonObject['searchKind'] = '1';//查詢種類1:案件查詢2:客服案件查詢3:補件資訊查詢
    jsonObject['cuCname'] = cuCname;//客戶姓名CU_CNAME
    let apiurl = 'f02/f02001action2';
    this.f02008Service.postJson(apiurl, jsonObject).subscribe(data => {
      if (data.rspMsg == "success" && data.rspBody == "儲存成功!") {
        sessionStorage.setItem('applno', id);
        sessionStorage.setItem('nationalId', nationalId);
        sessionStorage.setItem('custId', custId);
        sessionStorage.setItem('search', 'Y');
        sessionStorage.setItem('queryDate', '');
        sessionStorage.setItem('winClose', 'Y');
        // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
        sessionStorage.setItem('page', '0');
        sessionStorage.setItem('stepName', '0');

        sessionStorage.setItem('searchUserId', BaseService.userId);
        sessionStorage.setItem('searchEmpName', BaseService.empName);
        sessionStorage.setItem('searchEmpId', BaseService.empId);

        //開啟徵審主畫面
        let safeUrl = this.f02008Service.getNowUrlPath("/#/F01008/F01008SCN1");
        let url = window.open(safeUrl);
        this.menuListService.setUrl({
          url: url
        });

        sessionStorage.setItem('winClose', 'N');
        sessionStorage.setItem('search', 'N');
        sessionStorage.removeItem('searchUserId');
        sessionStorage.removeItem('searchEmpName');
        sessionStorage.removeItem('searchEmpId');
      } else {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查詢案件紀錄異常" }
        });
      }
    })
  }

  // 轉成中文
  getType(codeVal: string): string {
    for (const data of this.statusDetailCode) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }

  data_number(p: number) {
    this.x = '';
    this.x = (p + "")
    if (this.x != null) {
      this.x = this.x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return this.x
  }
}
