import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { table } from 'src/app/interface/base';
import { Childbwscn4Service } from '../childbwscn4.service';

@Component({
  selector: 'app-childbwscn4page3',
  templateUrl: './childbwscn4page3.component.html',
  styleUrls: ['./childbwscn4page3.component.css']
})
export class Childbwscn4page3Component implements OnInit {

  constructor(
    private childbwscn4Service: Childbwscn4Service,
  ) { }

  private applno: string;
  currentPage: PageEvent;
  currentSort: Sort;
  PROD_DETAILSource: Data[] = [];
  INSTALLMENT_ACCSource: Data[] = [];
  REVOLVING_ACCSource: Data[] = [];
  // INST_TRANS_DETAILSource: Data[] = []; //
  // REV_TRANS_DETAILSource: Data[] = []; //
  // APPR_STATIS_DATASource: Data[] = []; //
  // OVERDUE_STATIS_DATASource: Data[] = []; //
  // CON_PROD_STATIS_DATASource: Data[] = []; //
  // UNCLOSED_STATIS_DATASource: Data[] = []; //
  // CLOSED_STATIS_DATASource: Data[] = []; //
  // INSTAL_APPL_INFOSource: Data[] = []; //
  // DC_TRANS_DETAILSource: Data[] = []; //

  Source: table[] = [];

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
  }

  ngAfterViewInit() {
    this.getCoreCusInfo('PROD_DETAIL');
    this.getCoreCusInfo('INSTALLMENT_ACC');
    this.getCoreCusInfo('REVOLVING_ACC');
    // this.getCoreCusInfo('INST_TRANS_DETAIL', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('REV_TRANS_DETAIL', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('APPR_STATIS_DATA', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('OVERDUE_STATIS_DATA', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('CON_PROD_STATIS_DATA', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('UNCLOSED_STATIS_DATA', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('CLOSED_STATIS_DATA', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('INSTAL_APPL_INFO', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('DC_TRANS_DETAIL', this.pageIndex, this.pageSize);
  }

  async getCoreCusInfo(code: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['code'] = code;
    this.childbwscn4Service.getCoreCusInfo(jsonObject).subscribe(data => {
      this.Source.push({
        total: data.rspBody.size,
        pageIndex: 1,
        pageSize: 5,
        Source: this.childbwscn4Service.getTableDate(1, 5, data.rspBody.items),
        code: code,
        oriSource: data.rspBody.items
      });
      // if (code == 'PROD_DETAIL') { this.PROD_DETAILSource = data.rspBody.items;}
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
    this.Source[index].Source = this.childbwscn4Service.getTableDate(pageIndex, this.Source[index].pageSize, this.Source[index].oriSource);
    // this.getCoreCusInfo('PROD_DETAIL', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('INSTALLMENT_ACC', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('REVOLVING_ACC', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('INST_TRANS_DETAIL', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('REV_TRANS_DETAIL', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('APPR_STATIS_DATA', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('OVERDUE_STATIS_DATA', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('CON_PROD_STATIS_DATA', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('UNCLOSED_STATIS_DATA', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('CLOSED_STATIS_DATA', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('INSTAL_APPL_INFO', this.pageIndex, this.pageSize);
    // this.getCoreCusInfo('DC_TRANS_DETAIL', this.pageIndex, this.pageSize);
  }
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
}
