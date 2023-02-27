import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Childscn1Service } from 'src/app/children/childscn1/childscn1.service';
import { Childscn18Component } from 'src/app/children/childscn18/childscn18.component';
import { Childscn19Component } from 'src/app/children/childscn19/childscn19.component';
import { Childscn20Component } from 'src/app/children/childscn20/childscn20.component';
import { Childscn22Component } from 'src/app/children/childscn22/childscn22.component';
import { Childscn24Component } from 'src/app/children/childscn24/childscn24.component';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01005scn1Service } from './f01005scn1.service';

@Component({
  selector: 'app-f01005scn1',
  templateUrl: './f01005scn1.component.html',
  styleUrls: ['./f01005scn1.component.css', '../../../assets/css/f01.css']
})
export class F01005scn1Component implements OnInit {
  f01005: string;
empNo:string;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private f01005scn1Service: F01005scn1Service,
    private childscn1Service: Childscn1Service,
  ) {
    this.JCICAddSource$ = this.f01005scn1Service.JCICAddSource$.subscribe((data) => {
      this.addData = data;
      this.isShowAdd = data.show;
    });
    this.JCICSource$ = this.f01005scn1Service.JCICSource$.subscribe((data) => {
      this.editData = data;
      this.isShowEdit = data.show;
    });
    this.JCICSource$ = this.f01005scn1Service.JCICItemsSource$.subscribe((data) => {
      this.isShowItems = data.show;
    });
  }
  private creditLevel: string = 'APPLCreditL3';
  private applno: string;
  private search: string;
  private cuid: string;
  private routerCase: string;
  fds: string
  private winClose: string = '';

  addData: any;
  editData: any;
  isShowAdd: boolean;
  isShowEdit: boolean;
  isShowItems: boolean;
  JCICSource$: Subscription;
  JCICAddSource$: Subscription;

  creditResult: string;
  level: string;
  creditMemo: string;
  approveAmt: string;
  lowestPayRate: string;
  approveInterest: string;
  interest: string;
  interestType: string;
  period: string;
  periodType: string;
  interestBase: string;
  caApplicationAmount: string;
  caPmcus: string;
  caRisk: string;
  mark: string;

  block: boolean = false;

  ngOnInit(): void {
    this.empNo = sessionStorage.getItem('empNo')
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.cuid = sessionStorage.getItem('nationalId');
    this.fds = sessionStorage.getItem('fds');
    this.level = sessionStorage.getItem('level');
    this.winClose = sessionStorage.getItem('winClose');
  }
  ngOnDestroy() {
    this.JCICSource$.unsubscribe();
  }

  reScan() {
    const dialogRef = this.dialog.open(Childscn19Component, {
      panelClass: 'mat-dialog-transparent',
      height: '100%',
      width: '70%',
      data: {
        applno: this.applno,
        cuid: this.cuid
      }
    });
  }

  reSearch() {
    const dialogRef = this.dialog.open(Childscn18Component, {
      panelClass: 'mat-dialog-transparent',
      data: {
        applno: this.applno,
        cuid: this.cuid
      }
    });
  }

  recalculate() {
    const dialogRef = this.dialog.open(Childscn22Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        applno: this.applno,
        cuid: this.cuid
      }
    });
  }
  sendBack() {
    const dialogRef = this.dialog.open(Childscn24Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        applno: this.applno,
        level: sessionStorage.getItem('level'),
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.router.navigate(['./F01005']);
      }
    });
  }

  blockList() {
    const dialogRef = this.dialog.open(Childscn20Component, {
      panelClass: 'mat-dialog-transparent',
      data: {
        applno: this.applno,
        cuid: this.cuid
      }
    });
  }

  getSearch(): String {
    return this.search;
  }

  getWinClose(): String {
    return this.winClose;
  }

  leave() {
    // this.router.navigate(['./F02002']);
    window.close();
  }

  // finish() {
  //   const baseUrl = 'f01/childscn0';
  //   let msg = '';
  //   let jsonObject: any = {};
  //   jsonObject['applno'] = this.applno;
  //   jsonObject['level'] = 'L3';
  //   this.creditResult = sessionStorage.getItem('creditResult');
  //   if (this.creditResult == '' || this.creditResult == 'null' || this.creditResult == null){
  //     const childernDialogRef = this.dialog.open(ConfirmComponent, {
  //       data: { msgStr: '請填寫核決結果!' }
  //     });
  //   } else {
  //     let json: any = {};
  //     json['creditResult'] = this.creditResult;
  //     jsonObject['creditResult'] = json;
  //     this.f01002scn1Service.send( baseUrl, jsonObject ).subscribe(data => {
  //       this.router.navigate(['./F01002']);
  //     });
  //     const childernDialogRef = this.dialog.open(ConfirmComponent, {
  //       data: { msgStr: '案件完成' }
  //     });
  //   }
  // }

  save(url: string, result: string) {

    let count: number = Number(sessionStorage.getItem('count'));

    const baseUrl = url;
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;

    //讓後端判斷入口
    jsonObject['level'] = sessionStorage.getItem('raudKey') == "1" ? 'Fraud' : 'FraudList';
    // jsonObject['level'] = 'Fraud';  案件清單
    // jsonObject['level'] = 'FraudList'; 徵信通報

    this.creditResult = sessionStorage.getItem('creditResult');

    let jsoncreditResult: any = {};
    jsoncreditResult['creditResult'] = this.creditResult;

    jsonObject['creditResult'] = jsoncreditResult;
    // if (this.creditResult == '' || this.creditResult == 'null' || this.creditResult == null) {
    //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
    //     data: { msgStr: '請填寫核決結果!' }
    //   });
    // } else {
    //   if (this.creditResult == 'A') {
    //     if (this.approveAmt != '' && this.lowestPayRate != '' && this.approveInterest != '' && this.interest != '' && this.interestType != '' && this.periodType != '' && this.period != '' && this.mark != '' && this.mark != null) {
    this.result(baseUrl, jsonObject, result, count);
    // } else {
    // const childernDialogRef = this.dialog.open(ConfirmComponent, {
    //   data: { msgStr: '審核結果未填寫' }
    // });
    // }
    // } else {
    // this.result(baseUrl, jsonObject, result);
    // }
    // }
  }

  saveResult(url: string, json: JSON): string {
    return this.f01005scn1Service.saveOrEditMsgJson(url, json);
  }

  result(baseUrl: string, jsonObject: JSON, result: string, count: number) {
    this.block = true;
    this.f01005scn1Service.send(baseUrl, jsonObject).subscribe(data => {
      let childernDialogRef: any;
      if (data.rspMsg != null && data.rspMsg != '') {
        childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
      }
      if (data.rspMsg.includes('處理案件異常') || baseUrl == 'f01/childscn0action1') { }
      else if(data.rspMsg.includes('該案客戶已取消'))
      {
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['./F01005']);
        }, 1500);
      }else {
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        // this.saveMemo();
        this.removeSession(count);
        setTimeout(() => {
          this.router.navigate(['./F01005']);
        }, 1500);
      }
      this.block = false;
    });
  }

  removeSession(count: number) {
    for (let index = 1; index <= count; index++) {
      sessionStorage.removeItem("period" + index);
      sessionStorage.removeItem("periodType" + index);
      sessionStorage.removeItem("interestType" + index);
      sessionStorage.removeItem("approveInterest" + index);
      sessionStorage.removeItem("interest" + index);
      sessionStorage.removeItem("interestBase" + index);
      sessionStorage.removeItem("id" + index);
    }
    sessionStorage.removeItem("resultApproveAmt");
    sessionStorage.removeItem("resultLowestPayRate");
    sessionStorage.removeItem("creditResult");
    sessionStorage.removeItem("caApplicationAmount");
    sessionStorage.removeItem("caPmcus");
    sessionStorage.removeItem("caRisk");
    sessionStorage.removeItem("mark");
  }

  scrollToTop(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}



