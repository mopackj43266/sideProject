import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Childbwscn4Service } from '../childbwscn4.service';

@Component({
  selector: 'app-childbwscn4page4',
  templateUrl: './childbwscn4page4.component.html',
  styleUrls: ['./childbwscn4page4.component.css']
})
export class Childbwscn4page4Component implements OnInit {

  constructor(
    private childbwscn4Service: Childbwscn4Service
  ) { }

  private applno: string;
  private cuid: string;
  dcTransDetailSource: Data[] = [];
  total = 1;
  loading = false;
  pageSize = 10;
  pageIndex = 1;
  newData: [] = [];


  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
  }

  ngAfterViewInit() {
    this.getCoreCusInfo('DC_TRANS_DETAIL');
  }

  getCoreCusInfo(code: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['cuid'] = this.cuid;
    jsonObject['code'] = code;
    this.childbwscn4Service.getCoreCusInfo(jsonObject).subscribe(data => {
      this.total = data.rspBody.size;
      this.dcTransDetailSource = data.rspBody.items;
      this.newData = this.childbwscn4Service.getTableDate(this.pageIndex, this.pageSize, this.dcTransDetailSource);
      this.loading = false;
    });
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    this.newData = this.childbwscn4Service.getTableDate(pageIndex, this.pageSize, this.dcTransDetailSource);
  }
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
}
function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}
