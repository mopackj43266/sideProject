import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { table } from 'src/app/interface/base';
import { Childscn9Service } from '../childscn9.service';

@Component({
  selector: 'app-childscn9page2',
  templateUrl: './childscn9page2.component.html',
  styleUrls: ['./childscn9page2.component.css', '../../../../assets/css/child.css']
})
export class Childscn9page2Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private childscn9Service: Childscn9Service,
  ) { }

  private applno: string;
  private cuid: string;
  DEPOSITSource: Data[] = [];
  DEPOSIT_STATIS_DATASource: Data[] = [];
  SAVING_TRANS_DETAILSource: Data[] = [];

  // for DEPOSITSource
  totalDep = 1;
  pageSizeDep = 10;
  pageIndexDep = 1;
  newDEPOSITSource: any[] = [];

  // for DEPOSIT_STATIS_DATASource
  totalDSD = 1;
  pageSizeDSD = 10;
  pageIndexDSD = 1;
  newDEPOSIT_STATIS_DATASource: any[] = [];

  // for SAVING_TRANS_DETAILSource
  newSAVING_TRANS_DETAILSource: table[] = [];

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
  }

  totalCount: any;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sortTable', { static: true }) sortTable: MatSort;

  ngAfterViewInit() {
    this.getCoreCusInfo('DEPOSIT');
    this.getCoreCusInfo('DEPOSIT_STATIS_DATA');
    this.getSavingDetail();
  }

  getCoreCusInfo(code: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['cuid'] = this.cuid;
    jsonObject['code'] = code;
    const baseUrl = 'f01/childscn9action';

    this.childscn9Service.getData(baseUrl, jsonObject).subscribe(data => {
      // this.totalCount = data.rspBody.size;
      if (code == 'DEPOSIT') {
        this.DEPOSITSource = data.rspBody.items;
        this.newDEPOSITSource = this.childscn9Service.getTableDate(this.pageIndexDep, this.pageSizeDep, this.DEPOSITSource);
        this.totalDep = data.rspBody.size;
      }
      if (code == 'DEPOSIT_STATIS_DATA') {
        this.DEPOSIT_STATIS_DATASource = data.rspBody.items;
        this.newDEPOSIT_STATIS_DATASource = this.childscn9Service.getTableDate(this.pageIndexDSD, this.pageSizeDSD, this.DEPOSIT_STATIS_DATASource);
        this.totalDSD = data.rspBody.size;
      }
    });
  }

  getSavingDetail() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    const baseUrl = 'f01/childscn9action4';
    this.childscn9Service.getData(baseUrl, jsonObject).subscribe(data => {
      this.SAVING_TRANS_DETAILSource = data.rspBody.tableList;
      for (let index = 0; index < data.rspBody.size; index++) {
        this.newSAVING_TRANS_DETAILSource.push({
          total: data.rspBody.tableList[index].length,
          pageIndex: 1,
          pageSize: 10,
          Source: this.childscn9Service.getTableDate(1, 10, data.rspBody.tableList[index])
        });
      }
    });
  }

  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }

  onQueryParamsChange(params: NzTableQueryParams, code: string, index?: number): void {
    const { pageIndex } = params;
    if (code == 'DEPOSIT') { this.newDEPOSITSource = this.childscn9Service.getTableDate(pageIndex, this.pageSizeDep, this.DEPOSITSource); }
    if (code == 'DEPOSIT_STATIS_DATA') {this.newDEPOSIT_STATIS_DATASource = this.childscn9Service.getTableDate(pageIndex, this.pageSizeDSD, this.DEPOSIT_STATIS_DATASource); }
    if (code == 'SAVING_TRANS_DETAIL') { this.newSAVING_TRANS_DETAILSource[index].Source = this.childscn9Service.getTableDate(pageIndex, this.newSAVING_TRANS_DETAILSource[index].pageSize, this.SAVING_TRANS_DETAILSource[index]) }
  }
}

function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}

