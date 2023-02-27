import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn18Service } from './childscn18.service';

@Component({
  selector: 'app-childscn18',
  templateUrl: './childscn18.component.html',
  styleUrls: ['./childscn18.component.css', '../../../assets/css/f01.css']
})
export class Childscn18Component implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childscn18Component>,
    public childscn18Service: Childscn18Service,
    public dialog: MatDialog,
    private router: Router,
  ) { }

  empNo: string;  //上傳員編
  applno: string;  //案件編號
  swcID: string;  //身分證字號
  custID: string;  //客戶編號
  level: string; //文審徵信
  searchArray: string[] = [];  //查詢項目
  block: boolean = false;
  newData = [];
  pageSize = 50;
  pageIndex = 1;
  total = 1;
  k=false
  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.swcID = sessionStorage.getItem('nationalId');
    this.custID = sessionStorage.getItem('custId');
    this.empNo = BaseService.userId;
    this.level = sessionStorage.getItem('stepName');
    this.gethistory();
    this.newData = [];
  }

  log(value: string[]): void {
    this.searchArray = value;
  }
  close() {
    this.dialogRef.close();
  }

  checkboxSelect(check: boolean, item: string) {
    if ( check ) {
      this.searchArray.push( item );
    } else {
      const index: number = this.searchArray.indexOf( item );
      this.searchArray.splice(index, 1);
    }
  }

  reSearch() {
    this.block = true;
    const url = "f01/childscn18action1";  //API
    let jsonObject: any = {};
    jsonObject['empNo'] = this.empNo;
    jsonObject['applno'] = this.applno;
    jsonObject['swcNationalId'] = this.swcID;
    jsonObject['swcCustId'] = this.custID;
    jsonObject['searchArray'] = this.searchArray.toString();
    jsonObject['level'] = this.level;
    this.childscn18Service.reSearch(url, jsonObject).subscribe(data => {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: data.rspMsg }
      });
      this.block = false;
      // this.router.navigate(['./F01002'], { skipLocationChange: true });
      if (this.level == 'APPLCreditL4') {
        this.router.navigate(['./F01001']);
      } else {
        this.router.navigate(['./F01002']);
      }
      this.dialogRef.close();
    });
  }
  //案件重查歷程
  gethistory()
  {
    const baseUrl = 'f01/childscn18action2';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childscn18Service.reSearch(baseUrl, jsonObject).subscribe(data => {
      this.newData = data.rspBody;

    });
  }
  //歷程開關
  course(i:boolean)
  {
    if(!i)
    {
      this.k=true;
    }
    else
    {
      this.k =false;
    }
  }
}
