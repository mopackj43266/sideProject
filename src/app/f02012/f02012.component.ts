import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { F02012Service } from './f02012.service';

@Component({
  selector: 'app-f02012',
  templateUrl: './f02012.component.html',
  styleUrls: ['./f02012.component.css', '../../assets/css/f02.css']
})
export class F02012Component implements OnInit {

  constructor(
    private f02012Service: F02012Service,
    private pipe: DatePipe,
    private dialog: MatDialog
  ) { }

  applno: string = '';
  custId: string = '';
  rejectTime: [Date, Date];

  pageSize = 50;
  pageIndex = 1;
  total: number=0;
  rejectData = [];
  data: any[] = [];
  firstFlag: boolean = false;

  ngOnInit(): void {
  }

  select() {
    this.data = [];
    this.firstFlag = true;
    this.pageIndex = 1;
    if (this.check()) {
      let jsonObject: any = {};
      let url = "f02/f02012action1";
      jsonObject['applno'] = this.applno;
      jsonObject['custId'] = this.custId;
      if (this.rejectTime != null) {
        jsonObject['rejectTimeStart'] = this.pipe.transform(new Date(this.rejectTime[0]), 'yyyyMMdd');
        jsonObject['rejectTimeEnd'] = this.pipe.transform(new Date(this.rejectTime[1]), 'yyyyMMdd');
      }
      this.f02012Service.getData(url, jsonObject).subscribe(data => {
        if (data.rspBody.size == 0) {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "查無資料" }
          })
          this.rejectData = [];
          this.data = [];
          this.total = 0;
        } else {
          this.rejectData = data.rspBody.item;
          this.data = this.f02012Service.getTableDate(this.pageIndex, this.pageSize, this.rejectData);
          console.log(data)
          this.total = data.rspBody.size;
        }
      })
    } else {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請至少選擇一項條件" }
      });
    }
  }

  check(): boolean {
    if (this.applno == '' && this.custId == '' && this.rejectTime == null) {
      return false;
    }
    return true;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.firstFlag) {
      const { pageIndex } = params;
      this.pageIndex = pageIndex;
      this.data = this.f02012Service.getTableDate(pageIndex, this.pageSize, this.rejectData);
    }
  }

  dateNull(t: [Date, Date], name: string) {
    if (t.length < 1) {
      switch (name) {
        case 'rejectTime':
          this.rejectTime = null;
          break;
      }
    }
  }

  clear() {
    this.applno = '';
    this.custId = '';
    this.rejectTime = null;
    this.pageIndex = 1;
    this.rejectData = [];
    this.data = [];
    this.total = 0;
  }

  sortChange(e: string, param: string) {
    switch (param) {
      case "APPLNO":
        this.rejectData = e === 'ascend' ? this.rejectData.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
          : this.rejectData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
        this.data = this.f02012Service.getTableDate(this.pageIndex, this.pageSize, this.rejectData);
        break;
      case "REJECT_TIME":
        this.rejectData = e === 'ascend' ? this.rejectData.sort((a, b) => a.REJECT_TIME.localeCompare(b.REJECT_TIME))
          : this.rejectData.sort((a, b) => b.REJECT_TIME.localeCompare(a.REJECT_TIME));
        this.data = this.f02012Service.getTableDate(this.pageIndex, this.pageSize, this.rejectData);
        break;
    }
  }
}
