import { logging } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';

import { Childscn3Service } from './childscn3.service';
import { BaseService } from 'src/app/base.service';

interface checkBox {
  value: string;
  completed: boolean;
}
interface ANNOUNCE_REASON {
  announceReason1: string;
  announceReason2: string;
}


//Jay 偽冒通報

@Component({
  selector: 'app-childscn3',
  templateUrl: './childscn3.component.html',
  styleUrls: ['./childscn3.component.css', '../../../assets/css/f03.css']
})
export class Childscn3Component implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private childsc3Service: Childscn3Service,
    public dialog: MatDialog
  ) { }

  private applno: string;
  private search: string;
  chkArray: checkBox[] = [];
  level1: string[] = [];//裝第一層checkbox
  data: any;//裝一開始的資料表
  l1: ANNOUNCE_REASON[] = [];
  jsonObject: any = {};
  i: string;
  K = 0;
  ss: string[] = [];
  no: string;//會員帳號
  total = 1;
  loading = false;
  pageSize = 50;
  pageIndex = 1;
  na = '';
  s = 0;
  r: string;
  tes =0;
  pag:string;
  remark:string;
  TeamArry: string[] = []; //初始判斷是否為空
  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.no = BaseService.userId;
    // this.search = sessionStorage.getItem('search');
    this.pag = sessionStorage.getItem('page');
    this.getTable()//抓取資料表

  }

  getOptionDesc(option: OptionsCode[], codeVal: string): string //代碼跑名稱
  {
    for (const data of option) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }

  chkArray1(check: boolean, value: string, id: string) //第一層checkbox
  {
    if (check) {
      this.level1.push(id)
      this.s = 1;
    }
    else {
      this.level1.splice(this.level1.indexOf(id), 1)
      for (var fdL1 of this.data) {
        if (fdL1.reasonCode == id) {
          for (var fdL2 of fdL1.child) {
            fdL2.check = false;
          }
        }
      }
      if (this.level1.length == 0) {
        this.s = 0;
      }
    }
  }

  seveFraud()//發送Fraud Team
  {
    let msgStr: string = "";
    const ul = 'f01/childscn3action2';
    this.jsonObject['applno'] = this.applno;
    this.jsonObject['announceEmpno'] = this.no;
    this.l1 = [];
    for (var i of this.data) {
      if (i.check == true) {
        if (i.child.length < 1) {
          if(i.reasonCode=='5')
          {
            this.l1.push({ announceReason1: i.reasonCode, announceReason2: this.remark })
          }
          else
          {
            this.l1.push({ announceReason1: i.reasonCode, announceReason2: null })
          }
        }
        else {
          this.ss = [];
          for (var k of i.child) {

            if (k.check == true) {
              this.l1.push({ announceReason1: i.reasonCode, announceReason2: k.reasonCode })
              this.ss.push(k.check.reasonCode)
            }

          }
          if (this.ss.length == 0) {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: "第二層未勾選，儲存失敗!" }
            });
            return;
          }
        }
      }
    }
    this.jsonObject['applno'] = this.applno;
    this.jsonObject['result'] = this.l1;
    const url = 'f01/childscn3action1';
    this.childsc3Service.oneseve(url, this.jsonObject).subscribe(data => {

      msgStr = data.rspMsg
      if (data.rspCode == '0000')
       {

        this.childsc3Service.oneseve(ul, this.jsonObject).subscribe(data => {

          msgStr = data.rspMsg

          if (data.rspCode == '0000')
          {
            this.getTable()
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: msgStr }
            });
          }
          else
          {
            this.getTable()
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: msgStr }
            });
          }
        })
      }
      else
      {
        this.getTable()
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: msgStr }
        });
      }

    })
  }

  test() {

  }

  seve()//儲存
  {

    let msgStr: string = "";
    this.l1 = [];
    for (var i of this.data) {
      if (i.check == true) {
        if (i.child.length < 1)
        {
          if(i.reasonCode=='5')
          {
            this.l1.push({ announceReason1: i.reasonCode, announceReason2: this.remark })
          }
          else
          {
            this.l1.push({ announceReason1: i.reasonCode, announceReason2: null })
          }
        }
        else {
          this.ss = [];
          for (var k of i.child) {

            if (k.check == true) {
              this.l1.push({ announceReason1: i.reasonCode, announceReason2: k.reasonCode })
              this.ss.push(k.check.reasonCode)
            }
            else {

            }

          }

          if (this.ss.length == 0) {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: "第二層未勾選，儲存失敗!" }
            });
            return;
          }
        }


      }
    }
    this.jsonObject['applno'] = this.applno;
    this.jsonObject['result'] = this.l1;
    const url = 'f01/childscn3action1';
    this.childsc3Service.oneseve(url, this.jsonObject).subscribe(data => {
      msgStr = "已儲存成功";
      if (data.rspCode == '0000')
       {
        this.tes = 1;
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: msgStr }
        });
      }

    })
  }
  getTable()//抓取資料表
  {
    let jsonOb: any = {};
    const url = 'f01/childscn3';
    jsonOb['applno'] = this.applno;
    // const applno = this.applno;
    this.childsc3Service.oneseve(url, jsonOb).subscribe(data => {
      this.data = data.rspBody.list;
      this.i = data.rspBody.fraudIsLocked;
      for (const item of data.rspBody.list)
      {
        if (item.check == true) {
          if(this.i=="N")
          {
            this.level1.push(item.reasonCode)
          }
          this.TeamArry.push(item.check)
          if(item.reasonCode == "5")
          {
            this.remark=item.announce2
          }

        }
      }
      this.s = this.TeamArry.length;


    })
  }
  //檢查是否是徵信
  getSearch(): string {
    return this.search;
  }

}

