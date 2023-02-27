import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Sort, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Childscn29Service } from './childscn29.service';


@Component({
  selector: 'app-childscn29',
  templateUrl: './childscn29.component.html',
  styleUrls: ['./childscn29.component.css','../../../assets/css/child.css']
})
export class Childscn29Component implements OnInit {

  constructor(
    private Childscn29Service: Childscn29Service,
    public dialog: MatDialog
  ) { }
  creditLevelSource: Data[] = [];
  data:[];
  total = 1;
  loading = true;
  pageSize = 10;
  pageIndex = 1;

  private applno: string;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
  }
ngAfterViewInit() {
    this.getCreditLevel( this.pageIndex, this.pageSize );
  }

  getCreditLevel( pageIndex: number, pageSize: number )//查詢
  {
    const baseUrl = 'f01/childscn29';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.Childscn29Service.getCreditLevel( baseUrl, jsonObject ).subscribe(data => {
      this.loading = false;
      this.total = data.rspBody.size;
      this.creditLevelSource = data.rspBody;
      this.sortData()
   

      
    });
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    // this.getCreditLevel(pageIndex, pageSize);
  }
  sortChange(e: string) {
    this.creditLevelSource = e === 'ascend' ? this.creditLevelSource.sort(
      (a, b) => a.startDate.localeCompare(b.startDate)) : this.creditLevelSource.sort((a, b) => b.startDate.localeCompare(a.startDate))
  }
   sortData() {
    return this.creditLevelSource.sort((a, b) => {
      return <any>new Date(a.CREDIT_TIME) - <any>new Date(b.CREDIT_TIME) 
  
    }
    
    );
  }
}
