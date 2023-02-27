import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { OptionsCode } from 'src/app/interface/base';
import { F06002Service } from '../f06002.service';
import { F06002pickupComponent } from '../f06002pickup/f06002pickup.component';

@Component({
  selector: 'app-f06002page1',
  templateUrl: './f06002page1.component.html',
  styleUrls: ['./f06002page1.component.css', '../../../assets/css/f03.css']
})
export class F06002page1Component implements OnInit {

  constructor(
    private f06002Service: F06002Service,
    public dialog: MatDialog,
  ) { }

  checkOptionsOne = [];
  checkOptionsTwo = [
    { label: 'A', value: 'A', checked: false },
    { label: 'B', value: 'B', checked: false },
    { label: 'C', value: 'C', checked: false },
    { label: 'D', value: 'D', checked: false },
    { label: 'E', value: 'E', checked: false },

  ];
  s: string = "請輸入選項";
  limit: number;
  clientList: any[] = [];
  client: string = '';
  newData: any = [];
  total: number;
  loading = false;
  pageSize: number;
  pageIndex: number;
  firstFlag = 1;
  outboundTypeCode: OptionsCode[] = [];
  outboundTypeValue: string;
  outboundCustQryCode: OptionsCode[] = [];
  outboundCustQryValue: string;
  YNValue: string = '';//通知客戶值
  inputCustIdValue: string = '' //客戶ID值
  inputNationalIdValue: string = '' //身分證字號值
  inputMobileValue: string = '' //客戶手機號值
  test: string = '';
  YNCode: OptionsCode[] = []; //通知客戶
  te: string = ''
  resultData: [] //查詢資料
  inputoOutboundCustQry: string//客戶查詢輸入條件
  lowPrice: string//申請最低金額
  highPrice: string//申請最高金額

  ngOnInit(): void {
    this.outboundTypeValue = 'O1'
    this.changeOption(this.outboundTypeValue)
    this.outboundTypeCode = []
    this.outboundCustQryCode = []
    this.getYNresult()
    this.getclientList();
    this.getSearchSelect()
    this.inputoOutboundCustQry = null
    this.lowPrice = null
    this.highPrice = null
    this.test = "請先選擇客戶查詢"
  }

  clientMethod(i: string) {
    this.inputCustIdValue = '';
    this.inputNationalIdValue = ''
    this.inputMobileValue = ''
    this.te = ''
    switch (i) {
      case 'C':
        this.s = "請輸入客戶ID";
        this.limit = 15;
        this.inputCustIdValue = this.te
        break;
      case 'N':
        this.s = "請輸入身分證字號";
        this.inputNationalIdValue = this.te;
        this.limit = 10;
        break;
      case 'P':
        this.s = "請輸入客戶手機號";
        this.limit = 10;
        this.inputMobileValue = this.te;
        break;
      default:
        this.s = '';
        break;
    }
  }

  teMethod(i: string) {
    switch (i) {
      case 'C':
        this.s = "請輸入客戶ID";
        this.limit = 15;
        this.inputCustIdValue = this.te
        break;
      case 'N':
        this.s = "請輸入身分證字號";
        this.inputNationalIdValue = this.te;
        this.limit = 10;
        break;
      case 'P':
        this.s = "請輸入客戶手機號";
        this.limit = 10;
        this.inputMobileValue = this.te;
        break;
      default:
        this.s = '';
        break;
    }
  }

  //取得
  getSearchSelect() {
    let jsonObject: any = {};
    const baseUrl = "f06/f06002";
    this.outboundCustQryCode.push({ value: '', viewValue: '請選擇' })
    this.f06002Service.getData(baseUrl, jsonObject).subscribe(data => {
      for (const row of data.rspBody[0].type) {
        const codeNo = row.codeNo
        const codeDesc = row.codeDesc
        this.outboundTypeCode.push({ value: codeNo, viewValue: codeDesc })
      }
      for (const row of data.rspBody[0].custQry) {
        const codeNo = row.codeNo
        const codeDesc = row.codeDesc
        this.outboundCustQryCode.push({ value: codeNo, viewValue: codeDesc })
      }

    });
  }

  //是否通知客戶下拉
  getYNresult() {
    this.YNCode.push({ value: '', viewValue: '請選擇' })
    this.f06002Service.getSysTypeCode('YN').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.YNCode.push({ value: codeNo, viewValue: desc })
      }

    });
  }

  //案件狀態checkbox
  changeOption(value: string) {
    this.checkOptionsOne = []
    let jsonObject: any = {};
    const baseUrl = "f06/f06002";
    jsonObject["custType"] = value;
    this.f06002Service.getData(baseUrl, jsonObject).subscribe(data => {
      for (const row of data.rspBody) {
        const codeNo = row
        const codeDesc = row
        this.checkOptionsOne.push({ label: codeNo, value: codeDesc, checked: false })
      }
    })
  }

  //客戶查詢下拉
  getclientList() {
    this.clientList.push({ value: '', viewValue: '請選擇' })
    this.clientList.push({ value: 'C', viewValue: '客戶ID' })
    this.clientList.push({ value: 'N', viewValue: '身分證字號' })
    this.clientList.push({ value: 'P', viewValue: '客戶手機號' })
  }

  searchTable() {
    let jsonObject: any = {};
    const baseUrl = "f06/f06002action1";
    jsonObject['empno'] = BaseService.userId; // 負責人
    jsonObject['custId'] = this.inputCustIdValue;  //客戶ID
    jsonObject['nationalId'] = this.inputNationalIdValue;  //身分證字號
    jsonObject['cuMTel'] = this.inputMobileValue;  //客戶手機號
    jsonObject['amtUp'] = this.highPrice;  //申請金額上限
    jsonObject['amtDown'] = this.lowPrice;  //申請金額下限
    jsonObject['statusCodeList'] = this.checkOptionsOne  //案件狀態
    jsonObject['custFlagList'] = this.checkOptionsTwo;
    jsonObject['custType'] = this.outboundTypeValue != '' ? this.outboundTypeValue : "O1";  //案件類型
    jsonObject['nextContact'] = this.YNValue;  //是否需要再次聯繫
    this.f06002Service.inquiry(baseUrl, jsonObject).subscribe(data => {
      if (data.rspBody.length > 0) {
        this.resultData = data.rspBody
        this.firstFlag = 2;
      } else {
        this.clear()
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        });
        return;
      }
    })
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // 判斷是否為第一次進頁面
    const { pageSize, pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      if (this.firstFlag != 1) {
        // const { pageSize, pageIndex } = params;
        this.pageIndex = pageIndex;
        this.newData = this.f06002Service.getTableDate(pageIndex, this.pageSize, this.resultData);
      }
    }
  }

  //清除
  clear() {
    this.outboundTypeValue = "O1"
    this.changeOption(this.outboundTypeValue)
    this.checkOptionsOne = []
    this.client = '';
    this.s = "請選擇"
    this.inputCustIdValue = ''
    this.te = ''
    this.inputNationalIdValue = ''
    this.inputMobileValue = ''
    this.YNValue = ""
    this.checkOptionsTwo = [
      { label: 'A', value: 'A', checked: false },
      { label: 'B', value: 'B', checked: false },
      { label: 'C', value: 'C', checked: false },
      { label: 'D', value: 'D', checked: false },
      { label: 'E', value: 'E', checked: false },
    ];
    this.outboundCustQryValue = ""
    this.lowPrice = ""
    this.highPrice = ""
    this.resultData = []
  }

  //取件
  pickup(applno: string, custType: string, recordTime: string) {
    const url = 'f06/f06002action2';
    let jsonObject: any = {};
    jsonObject['applno'] = applno
    jsonObject['custType'] = custType
    this.f06002Service.getData(url, jsonObject).subscribe(data => {
      const dialogRef = this.dialog.open(F06002pickupComponent, {
        // panelClass: 'mat-dialog-transparent',
        height: '90%',
        width: '90%',
        data: {
          applno: applno,
          custType: custType,
          recordTime: recordTime,
          data: data,
        },
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') {
          this.refreshTable()
        }
      })
    })
  }

  private refreshTable() {
    // this.paginator._changePageSize(this.paginator.pageSize)
  }

  //案件類型轉換中文
  getOutboundChinese(codeVal: string): string {
    for (const data of this.outboundTypeCode) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }
  //金額加千分位
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
}
