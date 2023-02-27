import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { F06006Service } from './f06006.service';
import { F06006editComponent } from './f06006edit/f06006edit.component';

@Component({
  selector: 'app-f06006',
  templateUrl: './f06006.component.html',
  styleUrls: ['./f06006.component.css', '../../assets/css/f03.css']
})
export class F06006Component implements OnInit {

  constructor(
    public f06006Service: F06006Service,
    private dialog: MatDialog,
  ) { }

  opData: any[] = [];
  newopData: any[] = [];
  total = 1;
  pageSize = 50;
  pageIndex = 1;
  applno: string;//案件編號
  nationalId: string;//身分證
  notFirstFlag = false;
  firstFlag = 1;
  x: string;
  order: string;
  sor: string;
  sortArry = ['ascend', 'descend']
  ngOnInit(): void {
    //  this.searchTable()
  }

  //查詢
  searchTable() {
    this.newopData = [];
    let baseUrl = 'f06/f06006';
    // let jsonObject: any = {};
    // 20220218A000184
    let jsonObject: any = {};
    // let baseUrl = 'f06/f06004action1';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    this.f06006Service.getData(baseUrl, jsonObject).subscribe(data => {
      if (data.rspBody.size > 0) {
        this.opData = data.rspBody.items;
        this.newopData = this.f06006Service.getTableDate(this.pageIndex, this.pageSize, this.opData);
        this.total = data.rspBody.size;
        this.firstFlag = 2;
        for (var i of this.newopData) {
          this.x = '';
          this.x = (i.STRGY_2_APRV_AMT + "")
          if (this.x != null) {
            i.STRGY_2_APRV_AMT = this.x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }

        }
        console.log(this.newopData)
      }
      else {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        });
        return;
      }


    })

  }
  //清除
  clear() {
    this.applno = '';
    this.nationalId = '';
    this.opData = [];
    this.newopData = [];
    this.total = 1;
    this.firstFlag = 1;
  }
  //取件
  pickup(applno: string, custId: string) {
    let jsonObject: any = {};
    let baseUrl = 'f06/f06006fn1';
    // let baseUrl = 'f06/f06004action8';
    jsonObject['applno'] = applno;
    // jsonObject['nationalId'] = nationalId;
    this.f06006Service.getData(baseUrl, jsonObject).subscribe(data => {
      if (data.rspMsg == '案件鎖定成功') {
        const dialogRef = this.dialog.open(F06006editComponent, {
          panelClass: 'mat-dialog-transparent',
          height: '90%',
          width: '90%',
          data: {
            applno: applno,
            custId: custId
          }
        })
        dialogRef.afterClosed().subscribe(result => {

          if (result != null && result.event == 'success') {
            this.searchTable();
          }

        });
      }

    })


  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      if (this.firstFlag != 1) {
        this.pageIndex = pageIndex;
        this.newopData = this.f06006Service.getTableDate(pageIndex, this.pageSize, this.opData);
        // this.selectData(pageIndex, this.pageSize, this.order, this.sor);
      }
    }
  }
  sortChange(e: string, param: string) {
    switch (param) {
      case "SIGN_UP_TIME":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newopData = e === 'ascend' ? this.newopData.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
          : this.newopData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
        this.newopData = this.f06006Service.getTableDate(this.pageIndex, this.pageSize, this.newopData);
        break;
      case "APPLYEND_TIME":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newopData = e === 'ascend' ? this.newopData.sort((a, b) => a.APPLYEND_TIME.localeCompare(b.APPLYEND_TIME))
          : this.newopData.sort((a, b) => b.APPLYEND_TIME.localeCompare(a.APPLYEND_TIME));
        this.newopData = this.f06006Service.getTableDate(this.pageIndex, this.pageSize, this.newopData);
        break;
      case "SETTLE_DATE":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newopData = e === 'ascend' ? this.newopData.sort((a, b) => a.SETTLE_DATE.localeCompare(b.SETTLE_DATE))
          : this.newopData.sort((a, b) => b.SETTLE_DATE.localeCompare(a.SETTLE_DATE));
        this.newopData = this.f06006Service.getTableDate(this.pageIndex, this.pageSize, this.newopData);
        break;
    }
  }
}
