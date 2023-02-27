import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { table } from 'src/app/interface/base';
import { ChildrenService } from '../../children.service';
import { Childscn9Service } from '../childscn9.service';

@Component({
  selector: 'app-childscn9page3',
  templateUrl: './childscn9page3.component.html',
  styleUrls: ['./childscn9page3.component.css', '../../../../assets/css/child.css']
})
export class Childscn9page3Component implements OnInit {
  firstFlag = 1;
  queryDate:string
  pageSize: number = 50;
  pageIndex: number = 1;
  constructor(
    private fb: FormBuilder,
    private childscn9Service: Childscn9Service,
  ) {
  }

  private applno: string;
  private cuid: string;
  currentPage: PageEvent;
  currentSort: Sort;

  // PROD_DETAILSource: Data[] = [];
  // INSTALLMENT_ACCSource: Data[] = [];
  // REVOLVING_ACCSource: Data[] = [];
  // INST_TRANS_DETAILSource: Data[] = [];
  // REV_TRANS_DETAILSource: Data[] = [];
  // APPR_STATIS_DATASource: Data[] = [];
  // OVERDUE_STATIS_DATASource: Data[] = [];
  // CON_PROD_STATIS_DATASource: Data[] = [];
  // UNCLOSED_STATIS_DATASource: Data[] = [];
  // CLOSED_STATIS_DATASource: Data[] = [];
  // INSTAL_APPL_INFOSource: Data[] = [];
  // DC_TRANS_DETAILSource: Data[] = [];

  Source: table[] = [];

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
  }

  ngAfterViewInit() {

    this.queryDate=this.childscn9Service.getQueryDate()
    this.getCoreCusInfo('PROD_DETAIL');
    this.getCoreCusInfo('INSTALLMENT_ACC');
    this.getCoreCusInfo('REVOLVING_ACC');
    // this.getCoreCusInfo('INST_TRANS_DETAIL');
    // this.getCoreCusInfo('REV_TRANS_DETAIL');
    // this.getCoreCusInfo('APPR_STATIS_DATA');
    // this.getCoreCusInfo('OVERDUE_STATIS_DATA');
    // this.getCoreCusInfo('CON_PROD_STATIS_DATA');
    // this.getCoreCusInfo('UNCLOSED_STATIS_DATA');
    // this.getCoreCusInfo('CLOSED_STATIS_DATA');
    // this.getCoreCusInfo('INSTAL_APPL_INFO');
    // this.getCoreCusInfo('DC_TRANS_DETAIL');
  }

  async getCoreCusInfo(code: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['cuid'] = this.cuid;
    jsonObject['code'] = code;
    jsonObject['queryDate'] = this.queryDate;
    const baseUrl = 'f01/childscn9action'

    this.childscn9Service.getData(baseUrl, jsonObject).subscribe(data => {
      console.log(data)
      this.firstFlag = 2;
      this.Source.push({
        total: data.rspBody.size,
        pageIndex: 1,
        pageSize: 5,
        Source: this.childscn9Service.getTableDate(1, 5, data.rspBody.items),
        code: code,
        oriSource: data.rspBody.items
      });
      // if (code == 'PROD_DETAIL') { this.PROD_DETAILSource = data.rspBody.items; }
      // if (code == 'INSTALLMENT_ACC') { this.INSTALLMENT_ACCSource = data.rspBody.items; }
      // if (code == 'REVOLVING_ACC') { this.REVOLVING_ACCSource = data.rspBody.items; }
      // if (code == 'INST_TRANS_DETAIL') { this.INST_TRANS_DETAILSource = data.rspBody.items; }
      // if (code == 'REV_TRANS_DETAIL') { this.REV_TRANS_DETAILSource = data.rspBody.items; }
      // if (code == 'APPR_STATIS_DATA') { this.APPR_STATIS_DATASource = data.rspBody.items; }
      // if (code == 'OVERDUE_STATIS_DATA') { this.OVERDUE_STATIS_DATASource = data.rspBody.items; }
      // if (code == 'CON_PROD_STATIS_DATA') { this.CON_PROD_STATIS_DATASource = data.rspBody.items; }
      // if (code == 'UNCLOSED_STATIS_DATA') { this.UNCLOSED_STATIS_DATASource = data.rspBody.items; }
      // if (code == 'CLOSED_STATIS_DATA') { this.CLOSED_STATIS_DATASource = data.rspBody.items; }
      // if (code == 'INSTAL_APPL_INFO') { this.INSTAL_APPL_INFOSource = data.rspBody.items; }
      // if (code == 'DC_TRANS_DETAIL') { this.DC_TRANS_DETAILSource = data.rspBody.items; }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams, index?: number): void {
    const { pageIndex } = params;
    if(this.pageIndex!==pageIndex){
      if(this.firstFlag!=1){
      this.pageIndex-pageIndex
        this.Source[index].Source = this.childscn9Service.getTableDate(pageIndex, this.Source[index].pageSize, this.Source[index].oriSource);

      }
    }
    // this.getCoreCusInfo('PROD_DETAIL');
    // this.getCoreCusInfo('INSTALLMENT_ACC');
    // this.getCoreCusInfo('REVOLVING_ACC');
    // this.getCoreCusInfo('INST_TRANS_DETAIL');
    // this.getCoreCusInfo('REV_TRANS_DETAIL');
    // this.getCoreCusInfo('APPR_STATIS_DATA');
    // this.getCoreCusInfo('OVERDUE_STATIS_DATA');
    // this.getCoreCusInfo('CON_PROD_STATIS_DATA');
    // this.getCoreCusInfo('UNCLOSED_STATIS_DATA');
    // this.getCoreCusInfo('CLOSED_STATIS_DATA');
    // this.getCoreCusInfo('INSTAL_APPL_INFO');
    // this.getCoreCusInfo('DC_TRANS_DETAIL');
  }
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
}
function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}
