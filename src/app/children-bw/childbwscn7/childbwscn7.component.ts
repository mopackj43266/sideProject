import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {Childbwscn7Service} from'../childbwscn7/childbwscn7.service'

// Jay 案件歷程
@Component({
  selector: 'app-childbwscn7',
  templateUrl: './childbwscn7.component.html',
  styleUrls: ['./childbwscn7.component.css']
})
export class Childbwscn7Component implements OnInit {

  constructor(
    private childscn7Service: Childbwscn7Service,
    public dialog: MatDialog
  ) { }
  caseStepSource: Data[] = [];
  total = 1;
  loading = true;
  pageSize = 10;
  pageIndex = 1;

  private applno: string;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
  }

  ngAfterViewInit() {
    this.getCaseStep( this.pageIndex, this.pageSize );
  }

  getCaseStep( pageIndex: number, pageSize: number ){
    const baseUrl = 'f01/childBwScn7';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['page'] = this.pageIndex;
    jsonObject['per_page'] = this.pageSize;
    this.childscn7Service.getCaseStep( baseUrl, jsonObject ).subscribe(data => {
      this.loading = false;
      this.total = data.rspBody.size;
      this.caseStepSource = data.rspBody;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getCaseStep(pageIndex, pageSize);
  }
}
