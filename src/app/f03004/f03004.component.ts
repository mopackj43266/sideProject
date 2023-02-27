import { AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { F03004addComponent } from './f03004add/f03004add.component';
import { F03004editComponent } from './f03004edit/f03004edit.component';
import { F03004Service } from './f03004.service';
import { OptionsCode } from '../interface/base';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-f03004',
  templateUrl: './f03004.component.html',
  styleUrls: ['./f03004.component.css', '../../assets/css/f03.css']
})
export class F03004Component implements OnInit, AfterViewInit {

  constructor(
    private f03004Service: F03004Service,
    public dialog: MatDialog
  ) { }

  mappingCodeSource: Data[] = [];
  total = 1;
  pageIndex = 1;
  pageSize = 50;
  sysCode: OptionsCode[] = [];
  selectedValue: string;

  ngOnInit(): void {
    const baseUrl = 'f03/f03004';
    let jsonObject: any = {};
    this.f03004Service.getMappingCodeList(baseUrl, jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody) {
        const codeNo = jsonObj['codeNo'];
        const desc = jsonObj['codeDesc'];
        this.sysCode.push({ value: codeNo, viewValue: desc })
      }
    });
  }

  ngAfterViewInit() {
    //this.getMappingCode(this.pageIndex, this.pageSize);
  }

  changeSort(sortInfo: Sort) {
    this.getMappingCode(this.pageIndex, this.pageSize);
  }

  getMappingCode(pageIndex: number, pageSize: number) {
    const baseUrl = 'f03/f03004action1';
    let jsonObject: any = {};
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    jsonObject['codeType'] = this.selectedValue;
    this.f03004Service.getMappingCodeList(baseUrl, jsonObject)
      .subscribe(data => {
        if (data.rspBody != null) {
          this.total = data.rspBody.size;
          this.mappingCodeSource = data.rspBody.items;
        }
      });
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.mappingCodeSource.filter = filterValue.trim().toLowerCase();
  // }

  changePage() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 1;
  }

  changeSelect() {
    this.changePage();
    this.getMappingCode(this.pageIndex, this.pageSize);
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getMappingCode(pageIndex, pageSize);
  }

  addNew() {
    if (this.selectedValue == null || this.selectedValue == '') {
      alert('請選擇：代碼類別');
    } else {
      const dialogRef = this.dialog.open(F03004addComponent, {
        minHeight: '70vh',
        width: '50%',
        panelClass: 'mat-dialog-transparent',
        data: {
          codeType: this.selectedValue,
          codeNo: '', codeDesc: '',
          codeSort: '', codeTag: '',
          codeFlag: 'N'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') {
          this.changePage();
          this.getMappingCode(this.pageIndex, this.pageSize);
        }
      });
    }
  }

  startEdit(
    codeType: string, codeNo: string, codeDesc: string,
    codeSort: string, codeTag: string, codeFlag: string) {
    const dialogRef = this.dialog.open(F03004editComponent, {
      minHeight: '70vh',
      width: '50%',
      panelClass: 'mat-dialog-transparent',
      data: {
        codeType: codeType, codeNo: codeNo, codeDesc: codeDesc,
        codeSort: codeSort, codeTag: codeTag, codeFlag: codeFlag
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.changePage();
        this.getMappingCode(this.pageIndex, this.pageSize);
      }
    });
  }

  Clear() {
    this.selectedValue = "";
    this.mappingCodeSource = null;
  }

  private refreshTable() {
    //this.paginator._changePageSize(this.paginator.pageSize);
  }

}
