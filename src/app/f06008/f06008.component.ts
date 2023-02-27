import { OptionsCode } from './../interface/base';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { F06008Service } from './f06008.service';
import { BaseService } from '../base.service';
import { MenuListService } from '../menu-list/menu-list.service';
import { F06008cancelComponent } from './f06008cancel/f06008cancel.component';

@Component({
  selector: 'app-f06008',
  templateUrl: './f06008.component.html',
  styleUrls: ['./f06008.component.css', '../../assets/css/f02.css']
})
export class F06008Component implements OnInit {

  constructor(
    private f06008Service: F06008Service,
    private menuListService: MenuListService,
    private dialog: MatDialog,
  ) { }

  applno: string = "";
  nationalId: string = "";
  custId: string = "";
  cuCname: string = "";
  cuMTel: string = "";
  statusDetailCode: OptionsCode[] = [];
  x: string;

  total: number;
  loading = false;
  pageSize = 50;
  pageIndex = 1;
  resultData = [];
  newData: any[] = [];
  firstFleg = 1;

  order: string;
  sor: string;
  sortArry = ['ascend', 'descend'];

  ngOnInit(): void {
    // 查詢案件分類
    this.f06008Service.getSysTypeCode('STATUS_DETAIL').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.statusDetailCode.push({ value: codeNo, viewValue: desc })
      }
    });
  }

  select() {
    this.firstFleg = 2;
    this.pageIndex = 1;
    if (this.check()) {
      let url = "f06/f06008action1";
      let jsonObject: any = {};
      jsonObject['applno'] = this.applno;
      jsonObject['nationalID'] = this.nationalId;
      jsonObject['custID'] = this.custId;
      jsonObject['cuCname'] = this.cuCname;
      jsonObject['cuMTel'] = this.cuMTel;
      this.f06008Service.getData(url, jsonObject).subscribe(data => {
        if (data.rspBody.size == 0) {
          this.f06008Service.confrimCom("查無資料!");
          this.clear();
          return;
        } else {
          this.resultData = data.rspBody.item;
          this.total = this.resultData.length;
          this.loading = false;
          this.newData = this.f06008Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        }
      })
    } else {
      this.f06008Service.confrimCom("至少輸入一項查詢!");
      return;
    }
  }

  check(): boolean {
    if (
      this.applno == "" &&
      this.nationalId == "" &&
      this.custId == "" &&
      this.cuCname == "" &&
      this.cuMTel == ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // 判斷是否為第一次進頁面
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      if (this.firstFleg != 1) {
        this.pageIndex = pageIndex;
        this.newData = this.f06008Service.getTableDate(pageIndex, this.pageSize, this.resultData);
      }
    }
  }

  sortChange(e: string, param: string) {
    switch (param) {
      case "APPLNO":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        } else {
          this.order = param;
          this.sor = '';
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
          : this.resultData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
        this.newData = this.f06008Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
      case "APPLYEND_TIME":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        } else {
          this.order = param;
          this.sor = '';
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.APPLYEND_TIME.localeCompare(b.APPLYEND_TIME))
          : this.resultData.sort((a, b) => b.APPLYEND_TIME.localeCompare(a.APPLYEND_TIME));
        this.newData = this.f06008Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
    }
  }

  clear() {
    this.applno = "";
    this.nationalId = "";
    this.custId = "";
    this.cuCname = "";
    this.cuMTel = "";
    this.resultData = [];
    this.newData = [];
    this.total = 0;
    this.pageSize = 50;
    this.pageIndex = 1;
    this.order = "";
    this.sor = "";
  }

  //明細
  detail(id: string, nationalId: string, cuCname: string, custId: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = id;
    jsonObject['nationalID'] = nationalId;
    jsonObject['searchKind'] = '1';//查詢種類1:案件查詢2:客服案件查詢3:補件資訊查詢
    jsonObject['cuCname'] = cuCname;//客戶姓名CU_CNAME
    let apiurl = 'f02/f02001action2';
    this.f06008Service.getData(apiurl, jsonObject).subscribe(data => {
      if (data.rspMsg == "success" && data.rspBody == "儲存成功!") {
        sessionStorage.setItem('queryDate', '');
        // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
        sessionStorage.setItem('page', '0');
        sessionStorage.setItem('stepName', '0');

        sessionStorage.setItem('searchUserId', BaseService.userId);
        sessionStorage.setItem('searchEmpName', BaseService.empName);
        sessionStorage.setItem('searchEmpId', BaseService.empId);

        //要发送的参数
        let params = {
          "applno": id,
          "nationalId": nationalId,
          "custId": custId,
          "search": "Y",
          "winClose": "Y"
        };
        window["filter"] = params;

        //開啟徵審主畫面
        let safeUrl = this.f06008Service.getNowUrlPath("/#/F01002/F01002SCN1");
        let url = window.open(safeUrl);
        url.onload = function () {
          window["filter"] = "";
        };
        this.menuListService.setUrl({
          url: url
        });

        sessionStorage.setItem('winClose', 'N');
        sessionStorage.setItem('search', 'N');
        sessionStorage.removeItem('page');
        sessionStorage.removeItem('stepName');
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

  cancel(applno: string, statusDesc: string) {
    const dialogRef = this.dialog.open(F06008cancelComponent, {
      panelClass: 'mat-dialog-transparent',
      height: '80%',
      width: '80%',
      data: {
        applno: applno,
        statusDesc: statusDesc
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.select();
    })
  }

  data_number(p: number) {
    this.x = '';
    this.x = (p + "")
    if (this.x != null) {
      this.x = this.x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return this.x
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

  //判斷案件A還是B
  grab(applno: string, approve_amt: string, approve_iamt: string) {
    if (applno.substr(8, 1) == 'A') {
      if (approve_amt != 'undefined') {
        return approve_amt
      }
      return
    } else {
      if (approve_iamt != 'undefined') {
        return approve_iamt
      }
      return
    }
  }
}
