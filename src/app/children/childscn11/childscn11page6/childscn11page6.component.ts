import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from 'src/app/base.service';
import { MenuListService } from 'src/app/menu-list/menu-list.service';
import { Childscn11Service } from '../childscn11.service';

@Component({
  selector: 'app-childscn11page6',
  templateUrl: './childscn11page6.component.html',
  styleUrls: ['./childscn11page6.component.css']
})
export class Childscn11page6Component implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childscn11page6Component>,
    private childscn11Service: Childscn11Service,
    private menuListService: MenuListService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  private check: string;
  applnoData: any[] = [];
  newData: any[] = [];
  cuid: string
  total: any
  pageSize = 10
  pageIndex = 1
  custId: any             //客戶ID
  applno: string;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.applnoData = this.data.data.rspBody;
    this.getData(this.pageIndex);
    this.check = sessionStorage.getItem('check');

    // int page = f02001Req.getPage();
    // int perPage = f02001Req.getPer_page();
    // int start = (page - 1) * perPage;
    // int end = (page - 1) * perPage + perPage;
    // if (end > caseDataList.size()) {
    // 	end = caseDataList.size();
    // }

    // map.put("item", caseDataList.size() < perPage ? caseDataList : caseDataList.subList(start, end));

    this.cuid = sessionStorage.getItem('nationalId');
    this.custId = sessionStorage.getItem('custId');
  }
  Inquire(col: string) //查詢
  {
    // const url = 'f01/childscn11action2';
    // let jsonObject: any = {};
    // jsonObject['nationalId'] = this.cuid;
    // jsonObject['applno'] = this.applno;
    // jsonObject['code'] = 'EL_HISTORY_COMPARE_UNID';
    // jsonObject['col'] = col;
    // this.childscn11Service.selectCustomer(url, jsonObject).subscribe(data => {


    sessionStorage.setItem('applno',  col);
    sessionStorage.setItem('nationalId', this.cuid);
    sessionStorage.setItem('custId', this.custId);
    sessionStorage.setItem('search', 'Y');
    sessionStorage.setItem('queryDate', '');
    sessionStorage.setItem('winClose', 'Y');
    // sessionStorage.setItem('check', 'Y');

    sessionStorage.setItem('searchUserId', BaseService.userId);
    sessionStorage.setItem('searchEmpName', BaseService.empName);
    sessionStorage.setItem('searchEmpId', BaseService.empId);

    //   //開啟徵審主畫面
    let safeUrl = this.childscn11Service.getNowUrlPath("/#/F01002/F01002SCN1");
    let url = window.open(safeUrl);
    this.menuListService.setUrl({
      url: url
    });

    sessionStorage.setItem('winClose', 'N');
    sessionStorage.setItem('search', 'N');
    sessionStorage.setItem('check', 'N');
    sessionStorage.setItem('applno', this.applno);
    sessionStorage.removeItem('searchUserId');
    sessionStorage.removeItem('searchEmpName');
    sessionStorage.removeItem('searchEmpId');
    // })
  }
  //取消
  onNoClick(): void {
    this.dialogRef.close()
  }
  getCheck(): String {
    return this.check;
  }
  getData(pageIndex: number) {
    this.total = this.applnoData.length;
    let start: number = (pageIndex - 1) * this.pageSize;
    let count: number = 0;
    this.newData = [];
    for (let index = start; index < this.applnoData.length; index++) {
      this.newData.push(this.applnoData[index]);
      count = count + 1;
      if (count == 10) {
        break;
      }
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getData(pageIndex);
  }
}
