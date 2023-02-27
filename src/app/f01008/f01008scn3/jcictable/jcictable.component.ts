import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { JCICCode, JCICTable } from 'src/app/interface/base';
import { F01008scn3Service } from '../f01008scn3.service';

@Component({
  selector: 'app-jcictable',
  templateUrl: './jcictable.component.html',
  styleUrls: ['./jcictable.component.css']
})
export class JcictableComponent implements OnInit {

  constructor(
    private childscn6Service: F01008scn3Service,
  ) { }

  // @Input() readonly nzData: any;
  @Input() readonly code: JCICCode;

  total = 1;
  pageSize = 50;
  pageIndex = 1;
  nzData: any;
  tableData: JCICTable;
  private applno: string;
  private cuid: string

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.tableData = this.childscn6Service.getTableData(this.code);
    this.getJCIC();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // const { pageSize, pageIndex } = params;
    this.pageSize = params.pageSize;
    this.pageIndex = params.pageIndex
    this.getJCIC();
  }

  getJCIC(): void {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.cuid;
    jsonObject['code'] = this.code;
    // jsonObject['queryDate'] = this.queryDate;
    jsonObject['page'] = this.pageIndex;
    jsonObject['per_page'] = this.pageSize;
    this.childscn6Service.getJCICSearch(jsonObject).subscribe(data => {
      // if (code == 'STM025') {
      this.total = data.rspBody.size;
      this.nzData = data.rspBody.items;
      // }
    });
  }
}
