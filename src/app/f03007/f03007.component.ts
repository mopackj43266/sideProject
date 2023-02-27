import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { OptionsCode } from '../interface/base';
import { F03007Service } from './f03007.service';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';

interface checkBox {
  value: string;
  completed: boolean;
}

@Component({
  selector: 'app-f03007',
  templateUrl: './f03007.component.html',
  styleUrls: ['./f03007.component.css', '../../assets/css/f03.css']
})
export class F03007Component implements OnInit, AfterViewInit {

  constructor(
    private f03007Service: F03007Service,
    public dialog: MatDialog,
    private nzI18nService: NzI18nService,
  ) {
    this.nzI18nService.setLocale(zh_TW)
  }

  isAllCheck: boolean = false;
  sysCode: OptionsCode[] = [];
  chkArray: checkBox[] = [];
  selectedValue: string = 'default';
  roleFunctionSource = new MatTableDataSource<any>();

  ngAfterViewInit() { }
  ngOnInit(): void {
    const baseUrl = 'f03/f03007';
    let jsonObject: any = {};
    this.f03007Service.roleFunction(baseUrl, jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.list) {
        const codeNo = jsonObj['roleNo'];
        const desc = jsonObj['roleName'];
        this.sysCode.push({ value: codeNo, viewValue: desc })
      }
      // for (const jsonObj of data.rspBody.functionList) {
      //   this.chkArray.push({ value: jsonObj['FN_NO'], completed: false })
      // }
      // this.roleFunctionSource.data = data.rspBody.functionList;
    });
  }

  save() {
    if (this.selectedValue == 'default') {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請選擇角色!!!!' }
      });
      return false;
    }
    var valArray: string[] = new Array;
    for (const obj of this.chkArray)
    {
      if (obj.completed)
      { valArray.push(obj.value); }
    }
    let fnNo: string = valArray.toString();
    let jsonObject: any = {};
    jsonObject['roleNo'] = this.selectedValue;
    jsonObject['fnNo'] = fnNo;
    const baseUrl = 'f03/f03007action2';
    this.f03007Service.roleFunction(baseUrl, jsonObject).subscribe(data => {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: data.rspMsg }
      });
    });
  }

  setAll(completed: boolean) {
    for (const obj of this.chkArray) {
      obj.completed = completed;
    }
  }

  async changeSelect() {
    this.isAllCheck = false;
    await this.getRoleFunction();
  }

  private async getRoleFunction() {
    const baseUrl = 'f03/f03007action1';
    let jsonObject: any = {};
    jsonObject['roleNo'] = this.selectedValue;
    this.f03007Service.roleFunction(baseUrl, jsonObject).subscribe(data => {
      if (this.chkArray.length > 0) {
        let i: number = 0;
        for (const jsonObj of data.rspBody) {
          const chkValue = jsonObj['FN_NO'];
          const isChk = jsonObj['IS_CHK'];
          this.chkArray[i] = { value: chkValue, completed: isChk == 'Y' };
          i++;
        }

      } else {
        for (const jsonObj of data.rspBody) {
          const chkValue = jsonObj['FN_NO'];
          const isChk = jsonObj['IS_CHK'];
          this.chkArray.push({ value: chkValue, completed: isChk == 'Y' });
        }
      }
      this.roleFunctionSource.data = data.rspBody;
    });
  }
}
