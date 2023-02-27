import { HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookType } from 'xlsx/types';
import { F03015Service } from '../f03015/f03015.service';
import { F03015confirmComponent } from './f03015confirm/f03015confirm.component';
import { F03015editComponent } from './f03015edit/f03015edit.component';
import { F03015uploadComponent } from './f03015upload/f03015upload.component';
import * as XLSX from 'xlsx';
import { Data } from '@angular/router';
import { DeleteConfirmComponent } from '../common-lib/delete-confirm/delete-confirm.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
// import { saveAs } from 'file-saver';
interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f03015',
  templateUrl: './f03015.component.html',
  styleUrls: ['./f03015.component.css', '../../assets/css/f03.css']
})
export class F03015Component implements OnInit {

  inducCode: string = '';
  inducLevel1: sysCode[] = [];  //行職業level1下拉
  inducLevel2: sysCode[] = [];  //行職業level2下拉
  jobCode: sysCode[] = []; //職業碼下拉
  inducLevel1Value: string;  //行職業level1選擇
  inducLevel2Value: string;  //行職業level2選擇
  jobCodeValue: string; //職業碼選擇
  isHidden: boolean;
  total = 1;
  loading = false;
  pageSize = 50;
  pageIndex = 1;
  firstFlag = 1;

  myDate: any = new Date();
  constructor(public dialogRef: MatDialogRef<F03015confirmComponent>, private f03015Service: F03015Service, public dialog: MatDialog, private fb: FormBuilder, private datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.myDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd-HH:mm:SS');

  }
  proxyIncomeForm: FormGroup = this.fb.group({
    INDUC_CODE: ['', [Validators.maxLength(6)]],
    INDUC_LEVEL1: [this.data.inducLevel1Value, [Validators.maxLength(2)]],
    INDUC_LEVEL2: [this.data.inducLevel2Value, [Validators.maxLength(2)]],
    JOB_CODE: [this.data.jobCodeValue, [Validators.maxLength(2)]],
    pageIndex: ['', [Validators.maxLength(3)]],
    pageSize: ['', [Validators.maxLength(3)]]
  });

  formControl = new FormControl('', [
    Validators.required
  ]);
  ngOnInit(): void {
    this.isHidden = false;
    let jsonObject: any = {};

    this.f03015Service.getReturn('f03/f03015action6', jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.items) {
        const codeNo = jsonObj['INDUC_LEVEL1'];
        const desc = jsonObj['INDUC_LEVEL1_DESC'];
        this.inducLevel1.push({ value: codeNo, viewValue: desc });
      }
    });
    this.inducLevel2 = [];
    this.jobCode = [];
    this.inducLevel2Value = "";
    this.jobCodeValue = "";
  }

  proxyIncomeDataSource: Data[] = [];
  ngAfterViewInit() {
  }

  //取行職業level1下拉
  getLevel1Select() {
    let jsonObject: any = {};
    this.inducLevel1 = [];
    this.inducLevel1Value = "";
    this.f03015Service.getReturn('f03/f03015action6', jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.items) {
        const codeNo = jsonObj['INDUC_LEVEL1'];
        const desc = jsonObj['INDUC_LEVEL1_DESC'];
        this.inducLevel1.push({ value: codeNo, viewValue: desc });
      }
    });
    this.inducLevel2 = [];
    this.jobCode = [];
    this.inducLevel2Value = "";
    this.jobCodeValue = "";
  }

  //取行職業level2下拉
  changeLevel1Select() {
    this.inducLevel2 = [];
    this.jobCode = [];
    this.inducLevel2Value = "";
    this.jobCodeValue = "";

    let jsonObject: any = {};

    if (this.inducLevel1Value != null && this.inducLevel1Value != "") {
      jsonObject['inducLevel1'] = this.inducLevel1Value;
      this.f03015Service.getReturn('f03/f03015action6', jsonObject).subscribe(data => {
        for (const jsonObj of data.rspBody.items) {
          const codeNo = jsonObj['INDUC_LEVEL2'];
          const desc = jsonObj['INDUC_LEVEL2_DESC'];
          this.inducLevel2.push({ value: codeNo, viewValue: codeNo + ' - ' + desc });
        }
      });
    } else {
      this.inducLevel2.push({ value: "", viewValue: "" });
    }
    this.jobCode.push({ value: "", viewValue: "" });
  }

  //取職業碼下拉
  changeLevel2Select() {
    this.jobCode = [];
    this.jobCodeValue = "";

    let jsonObject: any = {};
    jsonObject['inducLevel1'] = this.inducLevel1Value;
    jsonObject['inducLevel2'] = this.inducLevel2Value;

    if (this.inducLevel2Value != null && this.inducLevel2Value != "") {
      this.f03015Service.getReturn('f03/f03015action6', jsonObject).subscribe(data => {
        for (const jsonObj of data.rspBody.items) {
          const codeNo = jsonObj['JOB_CODE'];
          const desc = jsonObj['JOB_CODE_DESC'];
          this.jobCode.push({ value: codeNo, viewValue: codeNo + ' - ' + desc });
        }
      });
    } else {
      this.jobCode.push({ value: "", viewValue: "" });
    }
  }

  // 查詢
  async getProxyIncomeData(pageIndex: number, pageSize: number) {
    this.firstFlag = 2;
    if ((this.proxyIncomeForm.value.INDUC_CODE == null || this.proxyIncomeForm.value.INDUC_CODE == '') && (this.inducLevel1Value == undefined || this.inducLevel1Value == '')
      && (this.inducLevel2Value == undefined || this.inducLevel2Value == '') && (this.jobCodeValue == undefined || this.jobCodeValue == '')) {
      const cconfirmDialogRef = this.dialog.open(F03015confirmComponent, {
        data: { msgStr: "請點選查詢並至少選擇一項查詢條件" }
      });
    } else {
      let jsonObject: any = {};
      jsonObject['page'] = pageIndex;
      jsonObject['per_page'] = pageSize;
      jsonObject['inducCode'] = this.inducCode;
      jsonObject['inducLevel1'] = this.inducLevel1Value;
      jsonObject['inducLevel2'] = this.inducLevel2Value;
      jsonObject['jobCode'] = this.jobCodeValue;
      this.f03015Service.getReturn('f03/f03015', jsonObject).subscribe(data => {
        if (data.rspBody.size === 0) {
          this.proxyIncomeDataSource = null;
          this.dialog.open(F03015confirmComponent, {
            data: { msgStr: "查無資料" }
          });
        } else {
          this.proxyIncomeDataSource = data.rspBody.items;
          this.total = data.rspBody.size;
        }
      });
    }
  }

  //新增
  insert(isInsert: boolean) {
    const dialogRef = this.dialog.open(F03015editComponent, {
      data: {
        isInsert: isInsert,
        isUpdate: false

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.getLevel1Select();
        this.refreshTable();
      }
    });
  }

  //編輯
  update(isUpdate: boolean, row: any) {
    const dialogRef = this.dialog.open(F03015editComponent, {
      data: {
        isUpdate: isUpdate,
        isInsert: false,
        row: row
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.refreshTable();
      }
    });
  }

  //清除資料
  clear() {
    this.inducCode = '';
    this.inducLevel1Value = '';
    this.inducLevel2Value = '';
    this.jobCodeValue = '';

    this.proxyIncomeDataSource = null;

  }

  //上傳EXCEL
  uploadExcel() {
    const dialogRef = this.dialog.open(F03015uploadComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.getLevel1Select();
        this.refreshTable();
      }
    });
  }

  private refreshTable() {
    if ((this.proxyIncomeForm.value.INDUC_CODE == null || this.proxyIncomeForm.value.INDUC_CODE == '') && (this.inducLevel1Value == undefined || this.inducLevel1Value == '')
      && (this.inducLevel2Value == undefined || this.inducLevel2Value == '') && (this.jobCodeValue == undefined || this.jobCodeValue == '')) {
      this.proxyIncomeDataSource = null;
    } else {
      let jsonObject: any = {};
      jsonObject['page'] = this.pageIndex;
      jsonObject['per_page'] = this.pageSize;
      jsonObject['inducCode'] = this.inducCode;
      jsonObject['inducLevel1'] = this.inducLevel1Value;
      jsonObject['inducLevel2'] = this.inducLevel2Value;
      jsonObject['jobCode'] = this.jobCodeValue;
      this.f03015Service.getReturn('f03/f03015', jsonObject).subscribe(data => {
        if (data.rspBody.size === 0) {
          this.proxyIncomeDataSource = null;
          this.dialog.open(F03015confirmComponent, {
            data: { msgStr: "查無資料" }
          });
        } else {
          this.proxyIncomeDataSource = data.rspBody.items;
        }
      });
    }
  }

  //匯出EXCEL
  exportExcel() {
    if ((this.proxyIncomeForm.value.INDUC_CODE == null || this.proxyIncomeForm.value.INDUC_CODE == '') && (this.inducLevel1Value == undefined || this.inducLevel1Value == '')
      && (this.inducLevel2Value == undefined || this.inducLevel2Value == '') && (this.jobCodeValue == undefined || this.jobCodeValue == '')) {
      const cconfirmDialogRef = this.dialog.open(F03015confirmComponent, {
        data: { msgStr: "請至少選擇一項查詢條件並至少選擇一項查詢條件" }
      });
    } else {
      let jsonObject: any = {};
      let blob: Blob;
      jsonObject['page'] = this.pageIndex;
      jsonObject['per_page'] = this.pageSize;
      jsonObject['inducCode'] = this.inducCode;
      jsonObject['inducLevel1'] = this.inducLevel1Value;
      jsonObject['inducLevel2'] = this.inducLevel2Value;
      jsonObject['jobCode'] = this.jobCodeValue;

      this.f03015Service.downloadExcel('f03/f03015action5', jsonObject).subscribe(data => {
        blob = new Blob([data], { type: 'application/xlsx' });
        let downloadURL = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = downloadURL;
        link.download = "ProxyIncome_" + this.myDate + ".xlsx"; //瀏覽器下載時的檔案名稱
        link.click();

      });
    }
  }

  //刪除
  async delete(rowId: string) {
    let jsonObject: any = {};
    jsonObject['rowID'] = rowId;

    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: { msgStr: "" }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result.value == 'confirm') {
        await this.f03015Service.getReturn('f03/f03015action2', jsonObject).subscribe(data => {
          const deleteDialogRef = this.dialog.open(F03015confirmComponent, {
            data: { msgStr: data.rspMsg }
          });
          if (data.rspCode == '0000') {
            deleteDialogRef.afterClosed().subscribe(result => {
              // this.getLevel1Select();
              this.refreshTable();
            });
          }
        });
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.firstFlag != 1) {
      const { pageSize, pageIndex } = params;
      this.getProxyIncomeData(pageIndex, this.pageSize);
    }
  }
}
