import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { OptionsCode } from 'src/app/interface/base';
import { Childscn4Service } from './childscn4.service';

//Jay 案件歷程
@Component({
  selector: 'app-childscn4',
  templateUrl: './childscn4.component.html',
  styleUrls: ['./childscn4.component.css', '../../../assets/css/child.css']
})
export class Childscn4Component implements OnInit {

  constructor(
    private childscn4Service: Childscn4Service,
    public dialog: MatDialog
  ) { }

  caseStepSource: Data[] = [];
  total = 1;
  loading = true;
  pageSize = 50;
  pageIndex = 1;

  cancelCaseSource: [] = [];
  cancelCaseExist: boolean = false;
  cancelReasonCode: OptionsCode[] = [];

  private applno: string;
  newData: any[] = [];

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.childscn4Service.getSysTypeCode('CANCEL_REASON').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.cancelReasonCode.push({ value: codeNo, viewValue: desc });
      }
    });
  }

  ngAfterViewInit() {
    this.getCaseStep(this.pageIndex, this.pageSize);
  }

  getCaseStep(pageIndex: number, pageSize: number) {
    const baseUrl = 'f01/childscn4';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.childscn4Service.getCaseStep(baseUrl, jsonObject).subscribe(data => {
      this.loading = false;
      this.total = data.rspBody.list.length;
      this.caseStepSource = data.rspBody.list;
      this.newData = this.childscn4Service.getTableDate(this.pageIndex, this.pageSize, this.caseStepSource);
      if (data.rspBody.cancelCase.length > 0) {
        this.cancelCaseExist = true;
        this.cancelCaseSource = data.rspBody.cancelCase;
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    this.newData = this.childscn4Service.getTableDate(pageIndex, this.pageSize, this.caseStepSource);
  }

  sortChange(e: string) {
    this.caseStepSource = e === 'ascend' ? this.caseStepSource.sort((a, b) => a.startDate.localeCompare(b.startDate))
      : this.caseStepSource.sort((a, b) => b.startDate.localeCompare(a.startDate));
    this.newData = this.childscn4Service.getTableDate(this.pageIndex, this.pageSize, this.caseStepSource);
  }

  getCancelText(codeVal: string): string {
    for (const data of this.cancelReasonCode) {
      if (data.value == codeVal) {
        return data.viewValue;
      }
    }
    return codeVal;
  }

  changeStatus(cancelStatus: string) {
    switch (cancelStatus) {
      case 'W':
        return '等待主管覆核';
      case 'S':
        return '取消成功';
      case 'R':
        return '拒絕取消';
      case 'F':
        return '取消失敗';
    }
    return '';
  }
}
