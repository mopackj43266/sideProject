import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Childscn9Service } from '../childscn9.service';

@Component({
  selector: 'app-childscn9page4',
  templateUrl: './childscn9page4.component.html',
  styleUrls: ['./childscn9page4.component.css', '../../../../assets/css/child.css']
})
export class Childscn9page4Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private childscn9Service: Childscn9Service
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
    const baseUrl = 'f01/childscn9action'
    this.childscn9Service.getData(baseUrl, jsonObject).subscribe(data => {
      this.total = data.rspBody.size;
      this.dcTransDetailSource = data.rspBody.items;
      this.newData = this.childscn9Service.getTableDate(this.pageIndex, this.pageSize, this.dcTransDetailSource);
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    this.newData = this.childscn9Service.getTableDate(pageIndex, this.pageSize, this.dcTransDetailSource);
  }
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
}
function ngAfterViewInit() {
  throw new Error('Function not implemented.');
}


