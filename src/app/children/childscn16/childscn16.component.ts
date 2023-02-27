import { Component, OnInit, ViewChild } from '@angular/core';
import { ChildrenService } from '../children.service';
import { Childscn16Service } from './childscn16.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Childscn1Component } from '../childscn1/childscn1.component'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { Data, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from 'src/app/base.service';
import { MenuListService } from 'src/app/menu-list/menu-list.service';

//Jay 歷史資料

@Component({
  selector: 'app-childscn16',
  templateUrl: './childscn16.component.html',
  styleUrls: ['./childscn16.component.css', '../../../assets/css/child.css']
})
export class Childscn16Component implements OnInit {

  constructor(
    private router: Router,
    private childscn16Service: Childscn16Service,
    private pipe: DatePipe,
    public childService: ChildrenService,
    public dialog: MatDialog,
    private menuListService: MenuListService,
  ) { }
  applno: string;
  jsonObject: any = {};
  data: any;//裝一開始的資料表
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sortTable', { static: true }) sortTable: MatSort;
  currentPage: PageEvent;
  currentSort: Sort;
  totalCount: any;
  ruleParamCondition: Data[] = [];
  transactionLogSource: Data[] = [];
  total = 1;
  loading = false;
  pageSize = 50;
  pageIndex = 1;
  nationalId: string;
  custId: string;
  fds: string = "";

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.nationalId = sessionStorage.getItem('nationalId');
    this.custId = sessionStorage.getItem('custId');
    this.initial(this.pageIndex, this.pageSize);

  }
  ngAfterViewInit() {
    //this.initial( this.pageIndex, this.pageSize );
  }

  // ngAfterViewInit() {
  //   this.currentPage = {
  //     pageIndex: 0,
  //     pageSize: 10,
  //     length: null
  //   };
  //   this.currentSort = {
  //     active: '',
  //     direction: ''
  //   };

  // }
  Inquire(id: string) //查詢
  {
    const url = 'f01/f01002fn1';
    let jsonObject: any = {};
    jsonObject['swcApplno'] = id;
    this.childscn16Service.selectCustomer(url, jsonObject).subscribe(data => {

      // if ( data.rspBody.length > 0 ) {
      //   this.fds = data.rspBody[0].fds
      // }
      sessionStorage.setItem('applno', id);
      sessionStorage.setItem('nationalId', this.nationalId);
      sessionStorage.setItem('custId', this.custId);
      sessionStorage.setItem('search', 'Y');
      sessionStorage.setItem('queryDate', '');
      sessionStorage.setItem('winClose', 'Y');

      sessionStorage.setItem('searchUserId', BaseService.userId);
      sessionStorage.setItem('searchEmpName', BaseService.empName);
      sessionStorage.setItem('searchEmpId', BaseService.empId);

      //開啟徵審主畫面
      let safeUrl = this.childscn16Service.getNowUrlPath("/#/F01002/F01002SCN1");
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
    })
  }
  initial(pageIndex: number, pageSize: number)//初始查詢
  {
    let url = 'f01/childscn16';
    this.jsonObject['applno'] = this.applno;
    this.jsonObject['page'] = pageIndex;
    this.jsonObject['per_page'] = pageSize;
    this.childscn16Service.selectCustomer(url, this.jsonObject).subscribe(data => {
      this.total = data.rspBody.size;
      this.ruleParamCondition = data.rspBody.items;
      this.limit();
    })
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    // this.initial(pageIndex, pageSize);
  }
  sortChange(e: string) {
    this.ruleParamCondition = e === 'ascend' ? this.ruleParamCondition.sort(
      (a, b) => a.applnoOld.localeCompare(b.applnoOld)) : this.ruleParamCondition.sort((a, b) => b.applnoOld.localeCompare(a.applnoOld))
  }
  limit() {
    for (const item of this.ruleParamCondition) {
      item.income = item.income != undefined ? (item.income + "").replace(/\B(?=(\d{3})+(?!\d))/g, ',') : item.income;
      item.applicationAmount = item.applicationAmount != undefined ? (item.applicationAmount + "").replace(/\B(?=(\d{3})+(?!\d))/g, ',') : item.applicationAmount;
      item.approveAmt = item.approveAmt != undefined ? (item.approveAmt + "").replace(/\B(?=(\d{3})+(?!\d))/g, ',') : item.approveAmt;
    }
  }
}
