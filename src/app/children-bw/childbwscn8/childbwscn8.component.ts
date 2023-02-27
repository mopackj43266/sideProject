import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Childbwscn8Service } from '../childbwscn8/childbwscn8.service';

@Component({
  selector: 'app-childbwscn8',
  templateUrl: './childbwscn8.component.html',
  styleUrls: ['./childbwscn8.component.css','../../../assets/css/child.css']
})

export class Childbwscn8Component implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private Childbwscn8Service: Childbwscn8Service
    ) { }

  applno: string;  //案件編號
  BwtransactionLogSource: Data[] = [];
  total: any;
  currentPage: PageEvent;
  pageIndex = 1;
  pageSize= 50;
  empName: string;
  sort: string;
  quantity:string;//案件數量

  @ViewChild('paginator', { static: true }) paginator: MatPaginator

  
  ngOnInit(): void {
    this.sort='ascend'
    this.applno = sessionStorage.getItem('applno');
    this.getBwTransLog(this.pageIndex, this.pageSize)
  }
  // 排序
sortChange(e: string, param: string) {
  this.sort = '';
  switch (param) {

    case "transDate":
      this.BwtransactionLogSource = e === 'ascend' ? this.BwtransactionLogSource.sort(
        (a, b) => a.transDate.localeCompare(b.transDate)) : this.BwtransactionLogSource.sort((a, b) => b.transDate.localeCompare(a.transDate))
      break;

  }
}
  getBwTransLog(pageIndex: number, pageSize: number)
  {
    let jsonObject: any = {}
    jsonObject['applno'] = this.applno
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.Childbwscn8Service.getmaterial(jsonObject).subscribe(data=>{
      if(data.rspMsg == 'success')
      {
        this.BwtransactionLogSource = data.rspBody.bwTransactionLog;
        this.empName= data.rspBody.empName;
        this.total=data.rspBody.size; 
        this.quantity = data.rspBody.bwTransactionLog.length;
      }

    })

  }
  // 切換分頁
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getBwTransLog(pageIndex, pageSize)
  }
}
