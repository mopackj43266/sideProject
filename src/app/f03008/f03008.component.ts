import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F03008Service } from './f03008.service';
import { MatTableDataSource } from '@angular/material/table';
import { F03008uploadComponent } from './f03008upload/f03008upload.component';
import { F03008editComponent } from './f03008edit/f03008edit.component';
import { MatDialog } from '@angular/material/dialog';
import { F03008deleteComponent } from './f03008delete/f03008delete.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from '../base.service';

//Nick 貸後管理異常名單維護
@Component({
  selector: 'app-f03008',
  templateUrl: './f03008.component.html',
  styleUrls: ['./f03008.component.css', '../../assets/css/f03.css']
})
export class F03008Component implements OnInit {

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public f03008Service: F03008Service
  ) { }

  total = 1;
  loading = true;
  pageIndex = 1;
  pageSize = 50;

  dialogRef: any;
  empNo: string = BaseService.userId;

  ABNORMAL_NID: string = '';
  dataSource = new MatTableDataSource<any>();


  ngOnInit(): void {
    this.getAbnormalList(this.pageIndex, this.pageSize);
  }

  //取表單
  getAbnormalList(pageIndex: number, pageSize: number) {
    const baseUrl = 'f03/f03008action1';
    let jsonObject: any = {};
    jsonObject['abnormalNid'] = this.ABNORMAL_NID;
    jsonObject['page'] = this.pageIndex;
    jsonObject['per_page'] = this.pageSize;
    this.f03008Service.elAbnormalNid(baseUrl, jsonObject)
      .subscribe(data => {
        this.total = data.rspBody.size;
        // if (this.total == 0) {
        //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
        //     data: { msgStr: "查無資料!" }
        //   });
        // }
        this.dataSource.data = data.rspBody.items;
      });
    this.loading = false;
  }

  //開啟上傳介面
  uploadNew() {
    const dialogRef = this.dialog.open(F03008uploadComponent, {
      width:"50vw",
      data: {
        ABNORMAL_NID: '',
        ABNORMAL_NAME: '',
        CUST_ID:'',
        MOBILE:'',
        PHONE:'',
        ADDRESS:'',
        DATA_SOURCE1:'',
        DATA_SOURCE2:'',
        DATA_SOURCE3:'',
        ON_CHECK: 'Y',
        TRANSFER_EMPNO: '',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refreshTable();
    });
  }

  //修改介面
  startEdit(abnormalNid: string,custId:string,mobile:string,phone:string,address:string,dataSource1:string,dataSource2:string,dataSource3:string, onCheck: string, transferEmpno: string, transferDate: string,
    changeEmpno: string, changeDate: string,) {
    const dialogRef = this.dialog.open(F03008editComponent, {
      panelClass: 'mat-dialog-transparent',
      data: {
        abnormalNid: abnormalNid,
        onCheck: onCheck,
        custId:custId,
        mobile:mobile,
        phone:phone,
        address:address,
        dataSource1:dataSource1,
        dataSource2:dataSource2,
        dataSource3:dataSource3,
        transferEmpno: transferEmpno,
        transferDate: transferDate,
        changeEmpno: changeEmpno,
        changeDate: changeDate,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && (result.event == 'success' || result == '1')) { this.refreshTable(); }
    });
  }

  //刪除介面
  deleteItem(abnormalNid: string,custId:string,mobile:string,phone:string,address:string,dataSource1:string,dataSource2:string,dataSource3:string, onCheck: string, transferEmpno: string, transferDate: string,
    changeEmpno: string, changeDate: string,) {
    const dialogRef = this.dialog.open(F03008deleteComponent, {
      minHeight: '30%',
      width: '70%',
      panelClass: 'mat-dialog-transparent',
      data: {
        abnormalNid: abnormalNid,
        onCheck: onCheck,
        custId:custId,
        mobile:mobile,
        phone:phone,
        address:address,
        dataSource1:dataSource1,
        dataSource2:dataSource2,
        dataSource3:dataSource3,
        transferEmpno: transferEmpno,
        transferDate: transferDate,
        changeEmpno: changeEmpno,
        changeDate: changeDate,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && (result.event == 'success' || result == '1')) { this.refreshTable(); }
    });
  }

  //刷新表單
  private refreshTable() {
    this.getAbnormalList(this.pageIndex, this.pageSize);
  }
  //查詢
  search() {
    this.getAbnormalList(this.pageIndex, this.pageSize);
  }

  //查詢參數異動
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.getAbnormalList(this.pageIndex, this.pageSize);

  }

}
