import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Childscn15Service } from './childscn15.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { ChildrenService } from '../children.service';

// Nick 偽冒案件處理
@Component({
  selector: 'app-childscn15',
  templateUrl: './childscn15.component.html',
  styleUrls: [ '../../../assets/css/f03.css','./childscn15.component.css']
})
export class Childscn15Component implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private childscn15Service: Childscn15Service,
    public dialog: MatDialog,
    public childService: ChildrenService
  ) { }

  manageHigh: string = "";//fm高度偽冒風險
  manageOther: string = "";//fm其他
  delayOther: string = "";//fd其他
  delayOtherTwo: string = "";//fd申貸前異動資料-其他
  fmData = new MatTableDataSource<any>();//判斷結果資料表
  fdData = new MatTableDataSource<any>();//Delay警訊原因表
  // 資料格式
  // "REASON_KIND": "FM",
  // "REASON_DESC": "無異常",
  // "UP_REASON_CODE": "Z01",
  // "REASON_CODE": "A",
  // "REASON_LEVEL": "1",
  // "checkbox": false,
  // "sort": 1,
  // "level2": []



  applno: string;
  private search: string;
  private page: string;
  private empNo: string;

  ngOnInit(): void {
      this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.page = sessionStorage.getItem('page');
    this.empNo = sessionStorage.getItem('empNo')

    const baseUrl = 'f01/childscn15';
    this.childscn15Service.getReason(baseUrl, this.applno).subscribe(data => {

      this.manageHigh = data.rspBody.manageHigh;//fm高度偽冒風險
      this.manageOther = data.rspBody.manageOther;//fm其他
      this.delayOther = data.rspBody.delayOther;//fd其他
      this.delayOtherTwo = data.rspBody.delayOtherTwo;//fd申貸前異動資料-其他
      this.fmData.data = data.rspBody.fmList;//fm原因表
      this.fdData.data = data.rspBody.fdList;//fd原因表
    });

  }

  getApplno(): String {
    return this.applno;
  }

  getSearch(): string {
    return this.search;
  }

  getPage(): string {
    return this.page;
  }

  //儲存 雙表單
  save() {


    var fmString: string = "";// fm表單儲存用字串
    var fmL1String = ""; // fm判斷此列是否儲存過
    var fmL2String = ""; // fm判斷此列是否儲存過

    var fdString: string = "";// fd表單儲存用字串
    var fdL1String = ""; // fd判斷此列是否儲存過

    //fm資料儲存格式 一列三格 以a分隔不同欄位 以b分隔多筆資料       無資料以cc代替
    // 1a1a1b1a1a2                            1a1a1b1a1a2b2accacc
    for (var fmL1 of this.fmData.data) {
      for (var fmL2 of fmL1.level2) {
        for (var fmL3 of fmL2.level3) {
          //列三打勾儲存 並於此列12做記號
          if (fmL3.checkbox) {
            fmString += `${fmL1.REASON_CODE}a${fmL2.REASON_CODE}a${fmL3.REASON_CODE}b`
            fmL2String = `${fmL1.REASON_CODE}a${fmL2.REASON_CODE}accb`
            fmL1String = `${fmL1.REASON_CODE}accaccb`
          }
        }
        //列二打勾且判斷不與列三重複 儲存 並於此列1做記號
        if (fmL2.checkbox && (fmL2String != `${fmL1.REASON_CODE}a${fmL2.REASON_CODE}accb`)) {
          fmString += `${fmL1.REASON_CODE}a${fmL2.REASON_CODE}accb`
          fmL1String = `${fmL1.REASON_CODE}accaccb`
        }
        fmL2String = "";//此列結束消除記號
      }
      //列一打勾且判斷不與列三列二重複 儲存
      if (fmL1.checkbox && (fmL1String != `${fmL1.REASON_CODE}accaccb`)) {
        fmString += `${fmL1.REASON_CODE}accaccb`
      }
      fmL1String = "";//此列結束消除記號
    }

    //fd資料儲存格式 一列兩格 以a分隔不同欄位 以-分隔多筆資料       無資料以cc代替
    // 1a1-1a2                           1a1-1a1-2acc
    for (var fdL1 of this.fdData.data) {
      for (var fdL2 of fdL1.level2) {
        //列二打勾 儲存 並於此列1做記號
        if (fdL2.checkbox) {
          fdString += `${fdL1.REASON_CODE}a${fdL2.REASON_CODE}b`
          fdL1String = `${fdL1.REASON_CODE}accb`
        }
      }
      //列一打勾且判斷不與列二重複 儲存
      if (fdL1.checkbox && (fdL1String != `${fdL1.REASON_CODE}accb`)) {
        fdString += `${fdL1.REASON_CODE}accb`
      }
      fdL1String = "";//此列結束消除記號
    }


    //有資料則消除最後一筆分隔記號
    fmString = fmString.length > 0 ? fmString.slice(0, fmString.length - 1) : fmString;
    fdString = fdString.length > 0 ? fdString.slice(0, fdString.length - 1) : fdString;

    //有資料才儲存
    if (fmString == "" && fdString == "") {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請選擇資料!' }
      });
    }
    else {
      //資料傳送
      let jsonObject: any = {};
      jsonObject['applno'] = this.applno;
      jsonObject['manageHigh'] = this.manageHigh;
      jsonObject['manageOther'] = this.manageOther;
      jsonObject['delayOther'] = this.delayOther;
      jsonObject['delayOtherTwo'] = this.delayOtherTwo;
      jsonObject['manageString'] = fmString;
      jsonObject['delayString'] = fdString;
      jsonObject['userId'] = this.empNo;
      let msgStr: string = "";
      let codeStr: string = "";
      const baseUrl = 'f01/childscn15action1';
      this.childscn15Service.saveReason(baseUrl, jsonObject).then((data: any) => {
        codeStr = data.rspCode;
        msgStr = data.rspMsg;
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: msgStr }
        });
      });
    }
  }

  //checkbox子資料取消勾選及清空文字
  checkboxSelect(check: boolean, data: any) {
    if (!check) {
      if (data.REASON_KIND == "FD") {  //FD Delay原因表單
        if (data.REASON_LEVEL == 1) {//判斷觸發層級
          for (var fdL1 of this.fdData.data) {
            if (data.REASON_DESC == "其他" && fdL1.REASON_DESC == "其他") { this.delayOther = ""; }//其他 清空文字
            for (var fdL2 of fdL1.level2) {
              if (fdL2.UP_REASON_CODE == data.REASON_CODE) {
                fdL2.checkbox = false;
                if (data.REASON_DESC == "申貸前異動資料" && fdL2.REASON_DESC == "其他") { this.delayOtherTwo = ""; }//申貸前異動資料-其他 清空文字
              }
            }
          }
        }
        else {
          if (data.REASON_DESC == "其他") { this.delayOtherTwo = ""; }
        }
      }
      else {  //FM 表單
        switch (data.REASON_LEVEL) {//判斷觸發層級
          case '1': {
            for (var fmL1 of this.fmData.data) {
              if (data.REASON_DESC == "高度偽冒風險" && fmL1.REASON_DESC == "高度偽冒風險") { this.manageHigh = ""; }//高度偽冒風險 清空文字
              if (data.REASON_DESC == "其他" && fmL1.REASON_DESC == "其他") { this.manageOther = ""; }//其他 清空文字
              for (var fmL2 of fmL1.level2) {
                if (fmL2.UP_REASON_CODE == data.REASON_CODE) {
                  fmL2.checkbox = false;
                  for (var fmL3 of fmL2.level3) {
                    if (fmL3.UP_REASON_CODE == fmL2.REASON_CODE) {
                      fmL3.checkbox = false;
                    }
                  }
                }
              }
            }
            break;
          }
          case '2': {
            for (var L1 of this.fmData.data) {
              for (var L2 of L1.level2) {
                for (var L3 of L2.level3) {
                  if (L3.UP_REASON_CODE == data.REASON_CODE) {
                    L3.checkbox = false;
                  }
                }
              }
            }
            break;
          }
          default: {
            //statements;
            break;
          }
        }
      }
    }
  }

}


