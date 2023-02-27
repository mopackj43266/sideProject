import { Component, OnInit, ViewChild } from '@angular/core';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Childbwscn4Service } from '../childbwscn4.service';

@Component({
  selector: 'app-childbwscn4page5',
  templateUrl: './childbwscn4page5.component.html',
  styleUrls: ['./childbwscn4page5.component.css']
})
export class Childbwscn4page5Component implements OnInit {

  constructor(
    private childbwscn4Service: Childbwscn4Service,
  ) { }

  private applno: string;
  private cuid: string;
  CORE_DATASource: Data[] = [];
  CORE_MAINLISTSource: Data[] = [];
  loading = false;

  // for  CORE_DATASource
  totalCD = 1;
  pageSizeCD = 10;
  pageIndexCD = 1;
  newCORE_DATASource: any[] = [];

  // for CORE_MAINLISTSource
  totalCM = 1;
  pageSizeCM = 10;
  pageIndexCM = 1;
  newCORE_MAINLISTSource: any[] = [];


  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
  }

  ngAfterViewInit() {
    this.getCoreCusInfo('CORE_DATA');
    this.getCoreCusInfo('CORE_MAINLIST');
  }

  getCoreCusInfo(code: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['cuid'] = this.cuid;
    jsonObject['code'] = code;
    const baseUrl = 'f01/childBwScn4action';
    this.childbwscn4Service.getDate(baseUrl,jsonObject).subscribe(data => {
      if (code == 'CORE_DATA') {
        this.CORE_DATASource = data.rspBody.items;
        this.newCORE_DATASource = this.childbwscn4Service.getTableDate(this.pageIndexCD, this.pageSizeCD, this.CORE_DATASource);
        this.totalCD = data.rspBody.size;
      }
      if (code == 'CORE_MAINLIST') {
        this.CORE_MAINLISTSource = data.rspBody.items;
        this.newCORE_MAINLISTSource = this.childbwscn4Service.getTableDate(this.pageIndexCM, this.pageSizeCM, this.CORE_MAINLISTSource);
        this.totalCM = data.rspBody.size;
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams, code: string, index?: number): void {
    const { pageIndex } = params;
    if (code == 'CORE_DATA') { this.newCORE_DATASource = this.childbwscn4Service.getTableDate(pageIndex, this.pageSizeCD, this.CORE_DATASource); }
    if (code == 'CORE_MAINLIST') {this.newCORE_MAINLISTSource = this.childbwscn4Service.getTableDate(pageIndex, this.pageSizeCM, this.CORE_MAINLISTSource); }
  }

  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
}
