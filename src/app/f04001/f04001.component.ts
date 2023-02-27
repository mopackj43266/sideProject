import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { OptionsCode } from '../interface/base';
import { F04001Service } from './f04001.service';

interface checkBox {
  value: string;
  completed: boolean;
}

@Component({
  selector: 'app-f04001',
  templateUrl: './f04001.component.html',
  styleUrls: ['./f04001.component.css', '../../assets/css/f04.css']
})

export class F04001Component implements OnInit {

  isAllCheck: boolean = false;
  selectedPagValue: string;// 流程
  pagCode = [
    { value: '', label: '請選擇' },
    { value: '1', label: '徵審' },
    { value: '2', label: '覆審' },
  ];// 流程下拉
  selectedValue: string;// 案件關卡
  sysCode: OptionsCode[] = [];// 案件關卡下拉
  chkArray: checkBox[] = [];
  applnoSource = [];
  readonly pageSize = 50;
  pageIndex = 1;
  total: any;
  i = 0;
  newData = [];
  constructor(private f04001Service: F04001Service, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.sysCode.push({ value: '', viewValue: '請選擇' })
    this.selectedValue = "";
    this.selectedPagValue = "";
  }


  setAll(completed: boolean) {
    for (const obj of this.chkArray) {
      obj.completed = completed;
    }
  }

  unlock() {
    if (this.selectedPagValue == null || this.selectedPagValue == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇流程" }
      });
      return;
    } else if (this.selectedValue == null || this.selectedValue == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇案件關卡" }
      });
      return;
    }
    const truthy = this.chkArray.filter(el => el.completed)
    if (truthy.length) {
      truthy
    } else {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "至少選一件案件！" }
      });
      return;
    }
    var valArray: string[] = new Array;
    for (const obj of truthy) {
      if (obj.completed) { valArray.push(obj.value); }
    }
    const baseUrl = 'f04/f04001fn2';
    let jsonObject: any = {};
    jsonObject['step'] = this.selectedValue;
    jsonObject['applnoList'] = valArray;

    this.f04001Service.saveFlowStep(jsonObject)
      .subscribe(data => {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
        if (data.rspCode == '0000') {
          this.getLockApplno();
        }
      });
  }

  // 參數
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      this.pageIndex = pageIndex;
      this.newData = this.f04001Service.getTableDate(pageIndex, this.pageSize, this.applnoSource);
      this.getLockApplno();
    }
  }

  getLockApplno() {
    this.i = 1;
    let jsonObject: any = {};
    jsonObject['step'] = this.selectedValue;
    this.f04001Service.getLockApplno(jsonObject).subscribe(data => {
      if (this.chkArray.length > 0) {
        let i: number = 0;
        for (const jsonObj of data.rspBody.items) {
          const chkValue = jsonObj['applno'];
          const isChk = jsonObj['IS_CHK'];
          this.chkArray[i] = { value: chkValue, completed: isChk == 'N' };
          i++;
        }
      } else {
        for (const jsonObj of data.rspBody.items) {
          const chkValue = jsonObj['applno'];
          const isChk = jsonObj['IS_CHK'];
          this.chkArray.push({ value: chkValue, completed: isChk == 'N' });
        }
      }
      this.total = data.rspBody.size;
      this.applnoSource = data.rspBody.items;
      this.newData = this.f04001Service.getTableDate(this.pageIndex, this.pageSize, this.applnoSource);
      this.isAllCheck = false;
    });
  }
  // 流程下拉
  choosePoint() {
    this.newData = [];
    this.selectedValue = "";
    if (this.selectedPagValue == '1') {
      this.f04001Service.getSysTypeCode('FLOW_STEP').subscribe(data => {
        this.sysCode.push({ value: '', viewValue: '請選擇' })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.sysCode.push({ value: codeNo, viewValue: desc })
        }
      });
    }
    else if (this.selectedPagValue == '2') {
      this.f04001Service.getSysTypeCode('BW_FLOW_STEP').subscribe(data => {
        this.sysCode.push({ value: '', viewValue: '請選擇' })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.sysCode.push({ value: codeNo, viewValue: desc })
        }
      });
    }
    this.sysCode = []
  }
  // 關卡下拉
  changeSelect() {
    if(this.selectedValue == ''){
      this.newData = [];
    }
    this.isAllCheck = false;
    this.getLockApplno();
  }
}
