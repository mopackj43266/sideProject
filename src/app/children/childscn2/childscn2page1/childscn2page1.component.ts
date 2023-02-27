import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Childscn2Service } from '../childscn2.service';


@Component({
  selector: 'app-childscn2page1',
  templateUrl: './childscn2page1.component.html',
  styleUrls: ['./childscn2page1.component.css', '../../../../assets/css/child.css']
})
export class Childscn2page1Component implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private childscn2Service: Childscn2Service
  ) { }


  private applno: string;               //案件編號
  transactionLogSource: Data[] = [];
  total: any;
  loading = true;
  currentPage: PageEvent;
  pageIndex = 1;
  pageSize = 50;
  empName: string;
  sort: string;

  newData: any[] = [];

  @ViewChild('paginator', { static: true }) paginator: MatPaginator

  ngOnInit(): void {
    this.sort = 'ascend';
    this.applno = sessionStorage.getItem('applno');
    this.getTransLog(this.pageIndex, this.pageSize);
  }

  // 排序
  sortChange(e: string, param: string) {
    this.sort = '';
    switch (param) {
      case "transDate":
        this.transactionLogSource = e === 'ascend' ? this.transactionLogSource.sort(
          (a, b) => a.transDate.localeCompare(b.transDate)) : this.transactionLogSource.sort((a, b) => b.transDate.localeCompare(a.transDate))
        break;
    }
  }

  getTransLog(pageIndex: number, pageSize: number) {
    const baseUrl = "f01/childscn2";
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.childscn2Service.getTransLog(baseUrl, jsonObject)
      .subscribe(data => {
        this.total = data.rspBody.size;
        this.empName = data.rspBody.empName;
        this.transactionLogSource = data.rspBody.items;
        this.newData = this.childscn2Service.getTableDate(this.pageIndex, this.pageSize, this.transactionLogSource);
      });
    this.loading = false;
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize)
  }

  // 切換分頁
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    this.newData = this.childscn2Service.getTableDate(pageIndex, this.pageSize, this.transactionLogSource);
  }

  formatDate(date: string) {
    // return date.split("T")[0]+" "+date.split("T")[1].split(".")[0];
    // return date.split(".")[0];
  }
}
