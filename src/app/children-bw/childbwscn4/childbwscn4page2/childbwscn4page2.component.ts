import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { table } from 'src/app/interface/base';
import { Childbwscn4Service } from '../childbwscn4.service';

@Component({
  selector: 'app-childbwscn4page2',
  templateUrl: './childbwscn4page2.component.html',
  styleUrls: ['./childbwscn4page2.component.css']
})
export class Childbwscn4page2Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private Childbwscn4Service: Childbwscn4Service,

  ) { }

  private applno: string;
  private cuid: string;
  DEPOSITSource: Data[] = [];
  DEPOSIT_STATIS_DATASource: Data[] = [];
  SAVING_TRANS_DETAILSource: Data[] = [];
  // DM_DEP_TRANS_DETAILSource: Data[] = [];
  // TIME_DEP_TRANS_DETAILSource: Data[] = [];
  loading = false;

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
  totalSTD = 1;
  pageSizeSTD = 10;
  pageIndexSTD = 1;
  newSAVING_TRANS_DETAILSource: any[] = [];

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
  }

  ngAfterViewInit() {
    this.getCoreCusInfo('DEPOSIT');
    this.getCoreCusInfo('DEPOSIT_STATIS_DATA');
    this.getCoreCusInfo('SAVING_TRANS_DETAIL');
    // this.getCoreCusInfo('DM_DEP_TRANS_DETAIL', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('TIME_DEP_TRANS_DETAIL', this.pageIndex, this.pageSize);
  }
  getCoreCusInfo(code: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['cuid'] = this.cuid;
    jsonObject['code'] = code;
    const baseUrl = 'f01/childBwScn4action';
    this.Childbwscn4Service.getDate(baseUrl, jsonObject).subscribe(data => {
      // this.totalCount = data.rspBody.size;
      if (code == 'DEPOSIT') {
        this.DEPOSITSource = data.rspBody.items;
        this.newDEPOSITSource = this.Childbwscn4Service.getTableDate(this.pageIndexDep, this.pageSizeDep, this.DEPOSITSource);
        this.totalDep = data.rspBody.size;
      }
      if (code == 'DEPOSIT_STATIS_DATA') {
        this.DEPOSIT_STATIS_DATASource = data.rspBody.items;
        this.newDEPOSIT_STATIS_DATASource = this.Childbwscn4Service.getTableDate(this.pageIndexDSD, this.pageSizeDSD, this.DEPOSIT_STATIS_DATASource);
        this.totalDSD = data.rspBody.size;
      }
      if (code == 'SAVING_TRANS_DETAIL') {
        this.SAVING_TRANS_DETAILSource = data.rspBody.items;
        this.newSAVING_TRANS_DETAILSource = this.Childbwscn4Service.getTableDate(this.pageIndexSTD, this.pageSizeSTD, this.SAVING_TRANS_DETAILSource);
        this.totalSTD = data.rspBody.size;
      }
      // if (code == 'DM_DEP_TRANS_DETAIL') { this.DM_DEP_TRANS_DETAILSource = data.rspBody.items; }
      // if (code == 'TIME_DEP_TRANS_DETAIL') { this.TIME_DEP_TRANS_DETAILSource = data.rspBody.items; }
    });
  }
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }

  onQueryParamsChange(params: NzTableQueryParams, code: string, index?: number): void {
    const { pageIndex } = params;
    if (code == 'DEPOSIT') { this.newDEPOSITSource = this.Childbwscn4Service.getTableDate(pageIndex, this.pageSizeDep, this.DEPOSITSource); }
    if (code == 'DEPOSIT_STATIS_DATA') {this.newDEPOSIT_STATIS_DATASource = this.Childbwscn4Service.getTableDate(pageIndex, this.pageSizeDSD, this.DEPOSIT_STATIS_DATASource); }
    if (code == 'SAVING_TRANS_DETAIL') { this.newSAVING_TRANS_DETAILSource = this.Childbwscn4Service.getTableDate(pageIndex, this.pageSizeSTD, this.SAVING_TRANS_DETAILSource); }
  }
}
function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}
