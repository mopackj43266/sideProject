import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { OptionsCode } from '../interface/base';
import { F04002Service } from './f04002.service';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

// export const dataList = [
//   {
//     'applno': 'A1234561',
//     'IS_CHK':'N'
//   },
//   {
//     'applno': 'A1234562',
//     'IS_CHK':'N'
//   },
//   {
//     'applno': 'A1234563',
//     'IS_CHK':'N'
//   },
//   {
//     'applno': 'A1234564',
//     'IS_CHK':'N'
//   },
//   {
//     'applno': 'A1234565',
//     'IS_CHK':'N'
//   },
//   {
//     'applno': 'A1234566',
//     'IS_CHK':'N'
//   },
//   {
//     'applno': 'A1234567',
//     'IS_CHK':'N'
//   },
//   {
//     'applno': 'A1234568',
//     'IS_CHK':'N'
//   },
//   {
//     'applno': 'A1234569',
//     'IS_CHK':'N'
//   },
//   {
//     'applno': 'A1234510',
//     'IS_CHK':'N'
//   }
// ]


interface checkBox {
  value: string;
  completed: boolean;
}

//Nick 錯誤件處理 新增
@Component({
  selector: 'app-f04002',
  templateUrl: './f04002.component.html',
  styleUrls: ['./f04002.component.css', '../../assets/css/f04.css']
})
export class F04002Component implements OnInit {

  pagCode = [
    { value: '1', label: '徵審' },
    { value: '2', label: '覆審' },
    { value: '3', label: '分期徵審後' },
    { value: '4', label: 'C3憑證' },
  ];
  sysCode: OptionsCode[] = [];
  selectedValue: string;
  selectedPagValue: string
  isAllCheck: boolean = false;
  roleFunctionSource = new MatTableDataSource<any>();
  level: string;   // 目前關卡
  pag: string;
  loading: boolean = false
  i = 0;
  sysCode2 = ['DEBT_AGT_MANAGE', 'DEBT_CORE_MANAGE', 'DEBT_JCIC_SC2_MANAGE', 'DEBT_DSS3_MANAGE', 'DEBT_APPROP_MANAGE', 'CASH_AGT_MANAGE', 'CASH_CORE_MANAGE', 'CASH_JCIC_SC2_MANAGE', 'CASH_DSS3_MANAGE', 'CASH_APPROP_MANAGE', 'INST_SIGN_CNRT_MANAGE'];//判斷是不是分期型用的陣列
  hidden: boolean = false;
  chkArray: checkBox[] = [];

  constructor(private f04002Service: F04002Service,
    public dialog: MatDialog,
    private nzI18nService: NzI18nService,
  ) {
    this.nzI18nService.setLocale(zh_TW)
  }


  total = 1;
  // loading = true;
  pageSize = 10;
  pageIndex = 1;
  k: boolean = false;
  ngOnInit(): void {


    // this.f04002Service.getSysTypeCode('STEP_ERROR').subscribe(data => {
    //   this.sysCode.push({ value: '', viewValue: '請選擇' })
    //   for (const jsonObj of data.rspBody.mappingList) {
    //     const codeNo = jsonObj.codeNo;
    //     const desc = jsonObj.codeDesc;
    //     this.sysCode.push({ value: codeNo, viewValue: desc })
    //   }
    // });
  }
  ngAfterViewInit(): void {
  }

  //選擇關卡
  choosePoint() {
    if (this.selectedPagValue == '1')
     {
      this.hidden = false;
      this.f04002Service.getSysTypeCode('STEP_ERROR').subscribe(data => {
        this.sysCode.push({ value: '', viewValue: '請選擇' })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.sysCode.push({ value: codeNo, viewValue: desc })
        }
      });
    }
    else if (this.selectedPagValue == '2') {
      this.hidden = false;
      this.f04002Service.getSysTypeCode('BW_STEP_ERROR').subscribe(data => {
        this.sysCode.push({ value: '', viewValue: '請選擇' })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.sysCode.push({ value: codeNo, viewValue: desc })
        }
      });
      // 20220629增加分期型
    }
    else if (this.selectedPagValue == '3') {
      this.hidden = true;
      this.f04002Service.getSysTypeCode('INST_STEP_ERROR').subscribe(data => {
        this.sysCode.push({ value: '', viewValue: '請選擇' })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.sysCode.push({ value: codeNo, viewValue: desc })
        }
      });
    }
     // 20220913增加C3憑證 Jay
    else if (this.selectedPagValue == '4') {
      this.hidden = false;
      this.f04002Service.getSysTypeCode('C3_ERROR').subscribe(data => {
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
  //重查
  newSearch() {
    var valArray: string[] = new Array;
    for (const obj of this.chkArray) {
      if (obj.completed) { valArray.push(obj.value); }

    }
    if (valArray.length < 1) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請選擇案件' }
      });
    }
    else {
      const baseUrl = 'f04/f04002fn2';
      this.loading = true
      this.f04002Service.newSearch_Decline_STEP_ERRORFunction(baseUrl, this.selectedValue, valArray, 'A').subscribe(data => {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
        this.loading = false
        if (data.rspCode == '0000') {
          if (this.pageIndex == (((this.total - valArray.length) / 10) + 1) && (((this.total - valArray.length) / 10) + 1) > 0) {
            this.getSTEP_ERRORFunction(this.pageIndex - 1, this.pageSize);
          } else {
            this.getSTEP_ERRORFunction(this.pageIndex, this.pageSize);
          }
        }
      });
    }
  }
  //婉拒
  Decline() {
    var valArray: string[] = new Array;
    for (const obj of this.chkArray) {
      if (obj.completed) { valArray.push(obj.value); }
    }
    if (valArray.length < 1) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請選擇案件' }
      });
    }
    else {
      const baseUrl = 'f04/f04002fn2';
      var result = "D";
      if (this.selectedValue == 'CSS_MANAGE') { result = "P"; }

      this.f04002Service.newSearch_Decline_STEP_ERRORFunction(baseUrl, this.selectedValue, valArray, result).subscribe(data => {
        this.loading = true

        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
        this.loading = false
        if (data.rspCode == '0000') {
          if (this.pageIndex == (((this.total - valArray.length) / 10) + 1) && (((this.total - valArray.length) / 10) + 1) > 0) {
            this.getSTEP_ERRORFunction(this.pageIndex - 1, this.pageSize);
          } else {
            this.getSTEP_ERRORFunction(this.pageIndex, this.pageSize);
          }
        }
      });
    }
  }

  //Pass功能
  certificate()
  {
    var valArray: string[] = new Array;
    for (const obj of this.chkArray) {
      if (obj.completed) { valArray.push(obj.value); }

    }
    if (valArray.length < 1) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請選擇案件' }
      });
    }
    else {
      const baseUrl = 'f04/f04002fn2';
      this.loading = true
      this.f04002Service.newSearch_Decline_STEP_ERRORFunction(baseUrl, this.selectedValue, valArray, 'pass').subscribe(data => {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
        this.loading = false
        if (data.rspCode == '0000') {
          if (this.pageIndex == (((this.total - valArray.length) / 10) + 1) && (((this.total - valArray.length) / 10) + 1) > 0) {
            this.getSTEP_ERRORFunction(this.pageIndex - 1, this.pageSize);
          } else {
            this.getSTEP_ERRORFunction(this.pageIndex, this.pageSize);
          }
        }
      });
    }
  }

  //設定checkbox資料
  setAll(completed: boolean) {
    for (const obj of this.chkArray) {
      obj.completed = completed;
    }
  }

  //切換查詢參數
  async changeSelect() {
    this.isAllCheck = false;
    this.k = false;
    await this.getSTEP_ERRORFunction(this.pageIndex, this.pageSize);
    // for (var t of this.sysCode2) {
    //   if (t == this.selectedValue) {
    //     this.k = true;
    //   }
    // }
  }

  //切換頁數
  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.i > 0) {
      const { pageSize, pageIndex } = params;
      this.pageSize = pageSize;
      this.pageIndex = pageIndex;
      this.getSTEP_ERRORFunction(pageIndex, pageSize);
    }
  }

  //取得表單
  private async getSTEP_ERRORFunction(pageIndex: number, pageSize: number) {
    this.i = 1;
    const baseUrl = 'f04/f04002fn1';
    this.f04002Service.getSTEP_ERRORFunction(baseUrl, this.selectedValue, pageIndex, pageSize).subscribe(data => {
      this.chkArray = [];
      for (const jsonObj of data.rspBody.items) {
        const chkValue = jsonObj['applno'];
        const isChk = jsonObj['IS_CHK'];
        this.chkArray.push({ value: chkValue, completed: isChk == 'N' });
      }
      this.roleFunctionSource.data = data.rspBody.items;
      this.total = data.rspBody.size;
      this.isAllCheck = false;
    });
  }
}
