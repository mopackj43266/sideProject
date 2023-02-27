import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01002Scn1Service } from 'src/app/f01002/f01002scn1/f01002scn1.service';
import { OptionsCode } from 'src/app/interface/base';
import { Childscn8Service } from '../childscn8.service';

//徵信照會table框架
interface CALLOUTCode {
  APPLNO: string;
  CON_TYPE: string;
  PHONE: string;
  TEL_CONDITION: string;
  TEL_CHECK: string;
  CON_MEMO: string;
  CALLOUT_DATE: string;
  CON_TYPE_View: string;
  TEL_CONDITION_View: string;
  TEL_CHECK_View: string;
  CALLOUT_SETTIME: string;
  CALLOUT_YN: string;
  CALLOUT_YN_View: string;
  CALLOUT_EMPNO: string;
}

//照會項目table框架
interface MDtable {
  MD_NO?: OptionsCode;
  CHECK_DATA?: string;
  REPLY_CONDITION?: string;
  CHECK_NOTE?: string;
  CHECK_DATE?: string;
  CHECK_EMPNO?: string;
  txt?: string;//提問
}

//徵信照會checkbox框架
interface checkboxCode {
  value: string;
  viewValue: string;
  checked: boolean;
}

@Component({
  selector: 'app-childscn8items',
  templateUrl: './childscn8items.component.html',
  styleUrls: ['./childscn8items.component.css', '.../../../assets/css/f03.css']
})
export class Childscn8itemsComponent implements OnInit {

  constructor(
    private childscn8Service: Childscn8Service,
    private f01002scn1Service: F01002Scn1Service,
    public dialog: MatDialog,
  ) { }

  private applno: string;

  //照會項目 複選額外處理
  MDtable: MDtable[] = [];
  REPLY_CONDITION14code: checkboxCode[]
    = [{ value: 'A', viewValue: '生活費用', checked: false },
    { value: 'B', viewValue: '修繕房屋、汽車', checked: false },
    { value: 'C', viewValue: '購置汽車', checked: false },
    { value: 'D', viewValue: '教育、旅遊費用', checked: false },
    { value: 'E', viewValue: '結婚基金', checked: false },
    { value: 'F', viewValue: '代償他行', checked: false },
    { value: 'G', viewValue: '醫療費用', checked: false },
    { value: 'H', viewValue: '投資理財', checked: false },
    { value: 'I', viewValue: '非本人使用', checked: false },
    { value: 'J', viewValue: '週轉金', checked: false },
    { value: 'Z', viewValue: '其他:', checked: false },];
  REPLY_CONDITION17code: checkboxCode[]
    = [{ value: 'K', viewValue: '網路得知', checked: false },
    { value: 'L', viewValue: 'LINE Corp. 推播', checked: false },
    { value: 'M', viewValue: '電視報章雜誌廣告', checked: false },
    { value: 'N', viewValue: '他人介紹', checked: false },
    { value: 'O', viewValue: 'LINE BANK 開戶', checked: false },
    { value: 'Z', viewValue: '其他:', checked: false },];

  ngOnInit(): void {

    this.applno = sessionStorage.getItem('applno');
    const baseUrl = 'f01/childscn8scn1';
    let jsonObject: any = {};
    jsonObject['page'] = 1;
    jsonObject['per_page'] = 50
    jsonObject['applno'] = this.applno

    this.childscn8Service.getSysTypeCode('MD_NO')//項目
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          let mdno: OptionsCode = { value: codeNo, viewValue: desc }
          this.MDtable.push({ MD_NO: mdno, CHECK_DATA: '', REPLY_CONDITION: '', CHECK_NOTE: '', CHECK_DATE: '', CHECK_EMPNO: '', txt: '' })
        }
      });

    this.childscn8Service.postJsonObject_CALLOUT(baseUrl, jsonObject).subscribe(data => {
      //照會項目
      for (const calloutData of this.MDtable) {
        for (const mdNo of data.rspBody.mdNoList) {
          calloutData.txt = calloutData.MD_NO.value == mdNo ? "p" : calloutData.txt
        }
        for (const calloutItemsData of data.rspBody.calloutItemsList) {
          if (calloutItemsData.checkItem == calloutData.MD_NO.value) {//比對項目代碼
            calloutData.CHECK_DATA = calloutItemsData.checkData;//核對資瞭
            calloutData.CHECK_DATE = calloutItemsData.checkDate//日期轉換
            calloutData.CHECK_EMPNO = calloutItemsData.checkEmpno;//確認人員
            calloutData.CHECK_NOTE = calloutItemsData.checkNote;//其他備註
            calloutData.REPLY_CONDITION = calloutItemsData.replyCondition;//回答狀況
            //回答狀況 載入時 多選另外處理
            if (calloutItemsData.checkItem == "14" && calloutItemsData.replyCondition != null) {
              let REPLY_CONDITION14 = calloutItemsData.replyCondition.split("_");
              for (const data of REPLY_CONDITION14) {
                for (const datacode of this.REPLY_CONDITION14code) {
                  datacode.checked = data == datacode.value ? true : datacode.checked;
                }
              }
            } else if (calloutItemsData.checkItem == "17" && calloutItemsData.replyCondition != null) {
              let REPLY_CONDITION17 = calloutItemsData.replyCondition.split("_");
              for (const data of REPLY_CONDITION17) {
                for (const datacode of this.REPLY_CONDITION17code) {
                  datacode.checked = data == datacode.value ? true : datacode.checked;
                }
              }
            }
          }
        }
      }
    });
  }

  // 照會項目儲存  分割多筆資料_  無資料p  單筆多重資料分割q
  async save() {
    //新增檢核 核對資料/回答狀況 要兩個一起填或不填
    for (const obj of this.MDtable) {
      if (obj.MD_NO.viewValue == "基本資料1" || obj.MD_NO.viewValue == "基本資料2" || obj.MD_NO.viewValue == "基本資料3" || obj.MD_NO.viewValue == "JCIC核對1"
        || obj.MD_NO.viewValue == "JCIC核對2" || obj.MD_NO.viewValue == "JCIC核對3" || obj.MD_NO.viewValue == "最高學歷、學校" || obj.MD_NO.viewValue == "公司名稱"
        || obj.MD_NO.viewValue == "公司現職職稱" || obj.MD_NO.viewValue == "公司現職年資") {
        if (obj.CHECK_DATA != null && obj.CHECK_DATA != '' && obj.CHECK_DATA != undefined
          && (obj.REPLY_CONDITION == null || obj.REPLY_CONDITION == '' || obj.REPLY_CONDITION == undefined)) {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "請選取'" + obj.MD_NO.viewValue + "'回答狀況" }
          });
          return;
        }
      }
    }

    let msgStr: string = "";
    let codeStr: string = "";
    let checkItem = "";
    let checkData = "";
    let replyCondition = "";
    let checkNote = "";

    // 多選先做另外處理
    this.MDtable[13].REPLY_CONDITION = "";//共20筆0開始
    for (var data of this.REPLY_CONDITION14code) {//共20筆1開始
      if (data.checked) { this.MDtable[13].REPLY_CONDITION += data.value + "_"; }
    }
    this.MDtable[16].REPLY_CONDITION = "";//共20筆0開始
    for (var data of this.REPLY_CONDITION17code) {//共20筆1開始
      if (data.checked) { this.MDtable[16].REPLY_CONDITION += data.value + "_"; }
    }
    //有資料則消除最後一筆分隔記號
    this.MDtable[13].REPLY_CONDITION = this.MDtable[13].REPLY_CONDITION.length > 0 ?
      this.MDtable[13].REPLY_CONDITION.slice(0, this.MDtable[13].REPLY_CONDITION.length - 1) :
      this.MDtable[13].REPLY_CONDITION;

    this.MDtable[16].REPLY_CONDITION = this.MDtable[16].REPLY_CONDITION.length > 0 ?
      this.MDtable[16].REPLY_CONDITION.slice(0, this.MDtable[16].REPLY_CONDITION.length - 1) :
      this.MDtable[16].REPLY_CONDITION;

    for (const calloutData of this.MDtable) {
      checkItem += calloutData.MD_NO.value + "_";
      checkData += (calloutData.CHECK_DATA != "" && calloutData.CHECK_DATA != null) ? calloutData.CHECK_DATA + "_" : "p_";
      replyCondition += (calloutData.REPLY_CONDITION != "" && calloutData.REPLY_CONDITION != null) ? calloutData.REPLY_CONDITION + "q" : "pq";
      checkNote += (calloutData.CHECK_NOTE != "" && calloutData.CHECK_NOTE != null) ? calloutData.CHECK_NOTE + "_" : "p_";
    }
    //有資料則消除最後一筆分隔記號
    checkItem = checkItem.length > 0 ? checkItem.slice(0, checkItem.length - 1) : checkItem;
    checkData = checkData.length > 0 ? checkData.slice(0, checkData.length - 1) : checkData;
    replyCondition = replyCondition.length > 0 ? replyCondition.slice(0, replyCondition.length - 1) : replyCondition;
    checkNote = checkNote.length > 0 ? checkNote.slice(0, checkNote.length - 1) : checkNote;

    const baseUrl = 'f01/childscn8action5';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['empNo'] = BaseService.userId;
    jsonObject['checkItem'] = checkItem;
    jsonObject['checkData'] = checkData;
    jsonObject['replyCondition'] = replyCondition;
    jsonObject['checkNote'] = checkNote;
    await this.childscn8Service.postJsonObject_CALLOUT(baseUrl, jsonObject).subscribe(data => {
      codeStr = data.rspCode;
      msgStr = data.rspMsg;
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      if (msgStr != null && (msgStr == '儲存成功!' || msgStr == '1')) {
        this.f01002scn1Service.setJCICItemsSource({ show: false });
        // window.location.reload();
      }
    });
  }

  //取消
  onNoClick(): void {
    // this.dialogRef.close();
    this.f01002scn1Service.setJCICItemsSource({ show: false });
  }

  //雙擊取消單選
  dblclick(MDtable: MDtable, key: string) {
    if (key == "CHECK_DATA") {
      MDtable.CHECK_DATA = null;
      MDtable.REPLY_CONDITION = null;
    } else {
      MDtable.REPLY_CONDITION = null;
    }
  }

  //限制不可輸入_
  checkSpecificKey(key: number) {
    if (this.MDtable[key].CHECK_NOTE != null){
      this.MDtable[key].CHECK_NOTE = this.MDtable[key].CHECK_NOTE.toString().replace(/_/g, '');
    }
    // return this.MDtable[key].CHECK_NOTE != null ? this.MDtable[key].CHECK_NOTE.replace('_', '') : this.MDtable[key].CHECK_NOTE;
  }

}
