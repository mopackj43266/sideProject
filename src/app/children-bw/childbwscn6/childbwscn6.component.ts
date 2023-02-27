import { Component, OnInit, ViewChild } from '@angular/core';
import { Childbwscn6Service } from './childbwscn6.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Data, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from 'src/app/base.service';
import { environment } from 'src/environments/environment';
import { MenuListService } from 'src/app/menu-list/menu-list.service';

@Component({
  selector: 'app-childbwscn6',
  templateUrl: './childbwscn6.component.html',
  styleUrls: ['./childbwscn6.component.css']
})
export class Childbwscn6Component implements OnInit {

  constructor(
    public childbwscn6Service: Childbwscn6Service,
    public dialog: MatDialog,
    private menuListService: MenuListService,
  ) { }
  applno: string;
  jsonObject: any = {};
  totalCount: any;
  ruleParamCondition = [];
  newData = [];
  total :number;
  pageSize = 50;
  pageIndex = 1;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.initial();
  }


  //取得表單資料
  initial() {
    const baseUrl = 'f01/childbwscn6'
    let jsonObject: any = {}
    jsonObject['applno'] = this.applno;
    this.childbwscn6Service.selectCustomer(baseUrl, jsonObject).subscribe(data => {
      this.ruleParamCondition = data.rspBody.items;
      this.total = data.rspBody.size;
      this.newData = this.childbwscn6Service.getTableDate(this.pageIndex, this.pageSize, this.ruleParamCondition);
    })
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params
    if (this.pageIndex !== pageIndex) {
      this.pageIndex = pageIndex;
      this.newData = this.childbwscn6Service.getTableDate(pageIndex, this.pageSize, this.ruleParamCondition);
      const matTable = document.getElementById('matTable');
      matTable.scrollIntoView();
    }

  }

  detail(applno2: string, nationalId: string, custId: string) {
    sessionStorage.setItem('applno', applno2);
    sessionStorage.setItem('nationalId', nationalId);
    sessionStorage.setItem('custId', custId);
    sessionStorage.setItem('search', 'Y');
    sessionStorage.setItem('queryDate', '');
    sessionStorage.setItem('winClose', 'Y');
    sessionStorage.setItem('searchUserId', BaseService.userId);
    sessionStorage.setItem('searchEmpName', BaseService.empName);
    sessionStorage.setItem('searchEmpId', BaseService.empId);

    //開啟徵審主畫面
    let safeUrl = this.childbwscn6Service.getNowUrlPath("/#/F01009/F01009SCN1");
    let url = window.open(safeUrl);
    this.menuListService.setUrl({
      url: url
    });

    sessionStorage.setItem('winClose', 'N');
    sessionStorage.setItem('search', 'N');
    sessionStorage.setItem('applno', this.applno);
    sessionStorage.removeItem('searchUserId');
    sessionStorage.removeItem('searchEmpName');
    sessionStorage.removeItem('searchEmpId');
  }
}
