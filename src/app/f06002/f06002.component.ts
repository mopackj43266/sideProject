import { logging } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OptionsCode } from '../interface/base';
import { F06002Service } from './f06002.service';
import { BaseService } from '../base.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { F06002pickupComponent } from './f06002pickup/f06002pickup.component';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { Data, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MenuListService } from '../menu-list/menu-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-f06002',
  templateUrl: './f06002.component.html',
  styleUrls: ['./f06002.component.css', '../../assets/css/f03.css']
})
export class F06002Component implements OnInit {
  arrange: boolean = false
  checkOptionsOne = [];
  checkOptionsOneList = []
  checkOptionsOneFirst = [];
  checkOptionsTwo = [
    { label: 'A', value: 'A', checked: false },
    { label: 'B', value: 'B', checked: false },
    { label: 'C', value: 'C', checked: false },
    { label: 'D', value: 'D', checked: false },
    { label: 'E', value: 'E', checked: false },
    { label: 'F', value: 'F', checked: false },

  ];
  applicationDebtStrgyValueCode: OptionsCode[] = [
    { value: '', viewValue: '請選擇' },
    { value: '03', viewValue: '是' },
    { value: '01', viewValue: '否' }

  ];
  tableTypeValue: string //table案件類型
  json: any
  sortArry = ['ascend', 'descend']
  s: string = "請輸入選項";
  line: string
  limit: number;
  order: string;
  sor: string;
  clientList: any[] = [];
  client: string = '';
  newData: any = [];
  total: number = 0;
  loading = false;
  pageSize: number = 50;
  pageIndex: number = 1;
  firstFlag = 1;
  outboundTypeCode: OptionsCode[] = [];
  remitResult: string = '';//是否退匯
  remitResultCode: OptionsCode[] = [
    { value: '', viewValue: '請選擇' },
    { value: 'N', viewValue: '無匯款紀錄' },
    { value: 'F', viewValue: '是' },
    { value: 'T', viewValue: '否' }
  ];//是否退匯下拉
  outboundTypeValue: string = 'O1';
  outboundCustQryCode: OptionsCode[] = [];
  outboundCustQryValue: string;
  YNValue: string = '';//通知客戶值
  inputCustIdValue: string = '' //客戶ID值
  inputNameValue: string = '' //客戶姓名
  inputNationalIdValue: string = '' //身分證字號值
  inputMobileValue: string = '' //客戶手機號值
  test: string = '';
  YNCode: OptionsCode[] = []; //通知客戶
  te: string = ''
  settleDateTitle: string = '案件到期日'//案件到期日標題
  aprvDebtAmt: string //增加核准案件額度
  approveInterestUp: string//增加核准利率上限
  approveInterestDown: string//增加核准利率下現
  settleDate: [Date, Date];//指定結清日
  settleDateUp: Date//增加指定截清日
  settleDateDown: Date//增加指定截清日
  prodCode: string = ''//  增加產品類型
  elProductInfoCode: any = []//產品類型下拉
  applicationDebtStrgy: string = ''//是否有轉貸方案
  recordTime: [Date, Date];// 最近一次聯繫日
  recordTimeUp: Date//  最近一次聯繫日上
  recordTimeDown: Date//  最近一次聯繫日下
  reset$: Subscription //rxjs訂閱者
  opidCheck: string//OPID
  resultData = [] //查詢資料
  inputoOutboundCustQry: string//客戶查詢輸入條件
  lowPrice: string//申請最低金額
  highPrice: string//申請最高金額
  applno: string//案件編號
  jsonObjectSet: any = {};
  empno: string;
  number: boolean = true

  constructor(
    private f06002Service: F06002Service,
    public dialog: MatDialog,
    private router: Router,
    private BaseService: BaseService,
    private pipe: DatePipe,
    private menuListService: MenuListService

  ) {
    this.reset$ = this.menuListService.addreset$.subscribe(data => {
      this.json = data

    })
  }

  ngOnInit(): void {
    // console.log(sessionStorage.getItem('exit'))
    //   if (sessionStorage.getItem('exit') == 'exit') {
    //     this.json=this.menuListService.getSearchData()
    //     this.searchTable(this.outboundTypeValue, this.json)
    //   }
    // sessionStorage.removeItem('exit')
    sessionStorage.removeItem('applno');
    sessionStorage.removeItem('search');
    sessionStorage.removeItem('page');
    this.outboundTypeCode = []
    this.outboundCustQryCode = []
    this.inputoOutboundCustQry = null
    this.lowPrice = null
    this.highPrice = null
    this.test = "請先選擇客戶查詢"
    if (this.f06002Service.getSearchData().get('jsonData') != undefined && this.f06002Service.getSearchData().get('jsonData') != null && sessionStorage.getItem('exit') == 'exit') {
      sessionStorage.removeItem('exit')
      this.reset();
      this.outboundTypeValue = this.f06002Service.getSearchData().get('jsonData')['custType'];
      this.checkOptionsOne = this.f06002Service.getSearchData().get('jsonData')['statusCodeList'];
      this.checkOptionsTwo = this.f06002Service.getSearchData().get('jsonData')['custFlagList'];
      if (this.f06002Service.getSearchData().get('jsonData')['amtDown'] != null && this.f06002Service.getSearchData().get('jsonData')['amtDown'] != undefined) {
        this.lowPrice = this.f06002Service.getSearchData().get('jsonData')['amtDown'].replace('0000', '');

      }
      if (this.f06002Service.getSearchData().get('jsonData')['amtUp'] != null && this.f06002Service.getSearchData().get('jsonData')['amtUp'] != undefined) {

        this.highPrice = this.f06002Service.getSearchData().get('jsonData')['amtUp'].replace('0000', '');
      }

      this.getYNresult();
      this.YNValue = this.f06002Service.getSearchData().get('jsonData')['nextContact'];
      this.getSearchSelect();
      this.prodCode = this.f06002Service.getSearchData().get('jsonData')['prodCode'];
      this.getclientList();
      this.client = this.f06002Service.getSearchData().get('jsonData')['client'];
      this.te = this.f06002Service.getSearchData().get('jsonData')['clientValue'];

      this.empno = this.f06002Service.getSearchData().get('jsonData')['empno'];

      if (this.f06002Service.getSearchData().get('jsonData')['recordTimeUp'] != null) {
        this.recordTimeUp = this.f06002Service.getSearchData().get('recordTime')[0];
        this.recordTime = [this.recordTimeUp, this.recordTimeDown]
      }

      if (this.f06002Service.getSearchData().get('jsonData')['recordTimeDown'] != null) {
        this.recordTimeDown = this.f06002Service.getSearchData().get('recordTime')[1];
        this.recordTime = [this.recordTimeUp, this.recordTimeDown]

      }

      this.approveInterestUp = this.f06002Service.getSearchData().get('jsonData')['approveInterestUp'];
      this.approveInterestDown = this.f06002Service.getSearchData().get('jsonData')['approveInterestDown'];

      if (this.f06002Service.getSearchData().get('jsonData')['settleDateUp'] != null) {
        this.settleDateUp = new Date(this.f06002Service.getSearchData().get('settleData')[0]);
        this.settleDate = [this.settleDateUp, this.settleDateDown]
      }
      if (this.f06002Service.getSearchData().get('jsonData')['settleDateDown'] != null) {
        this.settleDateDown = new Date(this.f06002Service.getSearchData().get('settleData')[1]);
        this.settleDate = [this.settleDateUp, this.settleDateDown]
      }
      this.applicationDebtStrgy = this.f06002Service.getSearchData().get('jsonData')['applicationDebtStrgy'];
      this.remitResult = this.f06002Service.getSearchData().get('jsonData')['remitResult'];

      this.searchTable(this.outboundTypeValue)
    }
    else {
      this.changeOption(this.outboundTypeValue)
      this.getYNresult()
      this.getclientList();
      this.getSearchSelect()
    }

  }
  //是否退匯英轉中
  resultChange(value: string) {
    if (value == 'F') {
      return '是'
    } else if (value == 'T') {
      return '否'
    }
  }
  //案件到期日判斷
  judgeSettleDateTitle(value: string) {
    switch (value) {
      case 'O1':
        this.settleDateTitle = '案件到期日';
        break;

      case 'O2':
        this.settleDateTitle = '簽約有效期';
        break;
    }
  }
  clientMethod(i: string) {
    this.inputCustIdValue = '';
    this.inputNationalIdValue = ''
    this.inputMobileValue = ''
    this.inputNameValue = ''
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
      case 'L':
        this.s = "請輸入客戶姓名";
        this.limit = 20;
        this.inputNameValue = this.te;
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
      case 'L':
        this.s = "請輸入客戶姓名";
        this.limit = 20;
        this.inputNameValue = this.te;
        break;
      default:
        this.s = '';
        break;
    }
  }

  changeNull(x: string) {
    return x == 'null' ? '' : x;
  }

  //取得
  getSearchSelect() {
    this.newData = []
    let jsonObject: any = {};
    const baseUrl = "f06/f06002";
    this.outboundCustQryCode.push({ value: '', viewValue: '請選擇' })
    this.elProductInfoCode.push({ value: '', viewValue: '請選擇' })
    this.f06002Service.getData(baseUrl, jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.prodInfo) {
        const codeNo = jsonObj.prodCode;
        const desc = jsonObj.prodName;
        this.elProductInfoCode.push({ value: codeNo, viewValue: desc })
      }
      for (const row of data.rspBody.outboundData[0].type) {
        const codeNo = row.codeNo
        const codeDesc = row.codeDesc
        this.outboundTypeCode.push({ value: codeNo, viewValue: codeDesc })
      }
      for (const row of data.rspBody.outboundData[0].custQry) {
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
  //轉換是否有轉貸方案中文
  chiangeApplicationDebtStrgy(value: string) {
    if (value != null) {
      if (value == '03') {
        return value = "是"
      } else if (value == '01') {
        return value = "否"

      }
    } else {
      return value
    }
  }
  //案件狀態checkbox
  changeOption(value: string) {
    this.checkOptionsOne = []
    let jsonObject: any = {};
    const baseUrl = "f06/f06002";
    jsonObject["custType"] = value;
    // this.searchTable(value)
    this.f06002Service.getData(baseUrl, jsonObject).subscribe(data => {
      for (const row of data.rspBody) {
        const codeNo = row
        const codeDesc = row
        this.checkOptionsOne.push({ label: codeNo, value: codeDesc, checked: false })
      }
    })
  }

  dateRecordTimeNull() {
    if (this.recordTime.length < 1) {
      this.recordTime = null;
    }
  }
  dateSettleDateNull() {
    if (this.settleDate.length < 1) {
      this.settleDate = null;
    }
  }
  //客戶查詢下拉
  getclientList() {
    this.clientList.push({ value: '', viewValue: '請選擇' })
    this.clientList.push({ value: 'C', viewValue: '客戶ID' })
    this.clientList.push({ value: 'N', viewValue: '身分證字號' })
    this.clientList.push({ value: 'P', viewValue: '客戶手機號' })
    this.clientList.push({ value: 'L', viewValue: '客戶姓名' })
  }
  //儲存前處理千分位
  Cut(key: string) {
    if (key == 'h') {
      this.highPrice = this.highPrice != null ? this.highPrice.replace(/[^\d]/g, '') : this.highPrice
      return this.highPrice != null && this.highPrice != '' ? this.highPrice + '0000' : this.highPrice
    }
    this.lowPrice = this.lowPrice != null ? this.lowPrice.replace(/[^\d]/g, '') : this.lowPrice
    return this.lowPrice != null && this.lowPrice != '' ? this.lowPrice + '0000' : this.lowPrice
  }

  verify(i: any) {
    for (var w of i) {
      if (w.checked == true) {
        return true
      }
    }

    return false
  }

  searchTable(outboundTypeValue: string, json?: any) {
    this.resultData = [];
    this.jsonObjectSet = {};
    this.loading = true;
    this.pageIndex = 1;
    this.newData = [];
    this.total = 0;
    const baseUrl = "f06/f06002action1";
    // const baseUrl1 = "f06/f06002";
    this.judgeSettleDateTitle(outboundTypeValue)
    if (this.f06002Service.getSearchData() != undefined && this.f06002Service.getSearchData() != null) {
      this.jsonObjectSet['empno'] = this.empno;
    }
    else {
      this.jsonObjectSet['empno'] = BaseService.userId; // 負責人
    }
    // this.jsonObjectSet['custId'] = this.inputCustIdValue;
    // this.jsonObjectSet['nationalId'] = this.inputNationalIdValue;
    // this.jsonObjectSet['cuMTel'] = this.inputMobileValue;
    if (!isNaN(parseInt(this.highPrice))) {
      this.jsonObjectSet['amtUp'] = (Number(this.toNumber(this.highPrice)) * 10000).toString();  //申請金額上限
    }
    if (!isNaN(parseInt(this.lowPrice))) {
      this.jsonObjectSet['amtDown'] = (Number(this.toNumber(this.lowPrice)) * 10000).toString();;  //申請金額下限
    }
    this.jsonObjectSet['statusCodeList'] = this.checkOptionsOne //案件狀態
    this.jsonObjectSet['custFlagList'] = this.checkOptionsTwo;
    this.jsonObjectSet['applno'] = this.applno;
    this.jsonObjectSet['remitResult'] = this.remitResult;//是否退匯
    this.jsonObjectSet['custType'] = outboundTypeValue;  //案件類型
    this.jsonObjectSet['nextContact'] = this.YNValue;  //是否需要再次聯繫
    if (this.settleDate != null) {   //指定結清日
      this.jsonObjectSet['settleDateUp'] = this.pipe.transform(new Date(this.settleDate[0]), 'yyyyMMdd');
      this.jsonObjectSet['settleDateDown'] = this.pipe.transform(new Date(this.settleDate[1]), 'yyyyMMdd');
    }
    this.jsonObjectSet['prodCode'] = this.prodCode;  //產品類型

    if (this.recordTime != null) {   //最後一次聯繫日
      this.jsonObjectSet['recordTimeUp'] = this.pipe.transform(new Date(this.recordTime[0]), 'yyyyMMdd');
      this.jsonObjectSet['recordTimeDown'] = this.pipe.transform(new Date(this.recordTime[1]), 'yyyyMMdd');
    }
    this.jsonObjectSet['applicationDebtStrgy'] = this.applicationDebtStrgy;  //是否有轉貸方案
    this.jsonObjectSet['client'] = this.client;
    this.jsonObjectSet['clientValue'] = this.te;

    this.f06002Service.saveSearchData(this.jsonObjectSet, this.settleDate, this.recordTime)

    this.f06002Service.inquiry(baseUrl, this.jsonObjectSet).subscribe(data => {
      this.tableTypeValue = outboundTypeValue
      if (data.rspBody.length > 0) {
        if (this.outboundTypeValue == 'O2') {
          if ((this.approveInterestDown == "" || this.approveInterestDown == null) && (this.approveInterestUp == "" || this.approveInterestUp == null)) {
            this.resultData = data.rspBody;
          } else {
            for (var data of data.rspBody) {
              var filter: boolean = false
              if (this.approveInterestUp != null && this.approveInterestUp != "" &&
                this.approveInterestDown != null && this.approveInterestDown != "") {
                for (const items of data.interestList) {
                  if (items >= Number(this.approveInterestUp) && items <= Number(this.approveInterestDown)) {
                    filter = true;
                    continue;
                  }
                }
              } else if (this.approveInterestDown != null && this.approveInterestDown != "" && (this.approveInterestUp == "" || this.approveInterestUp == null)) {
                for (const items of data.interestList) {
                  if (items <= Number(this.approveInterestDown)) {
                    filter = true;
                    continue;
                  }
                }
              } else if ((this.approveInterestUp != null && this.approveInterestUp != "") && (this.approveInterestDown == "" || this.approveInterestDown == null)) {
                for (const items of data.interestList) {
                  if (items >= Number(this.approveInterestUp)) {
                    filter = true;
                    continue;
                  }
                }
              } else {
                for (const items of data.interestList) {
                  filter = true;
                  continue;
                }
              }
              if (filter) {
                this.resultData.push(data)
              }
            }
          }
        } else {
          this.resultData = data.rspBody
        }
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        this.total = this.resultData.length;
        if (this.total == 0) {
          this.dialog.open(ConfirmComponent, {
            data: { msgStr: "查無資料" }
          });
        }
        // this.applicationDebtStrgy = data.rspBody.applicationDebtStrgy
        this.firstFlag = 2;
        // if (this.newData != []) {
        //   setTimeout(() => {
        this.loading = false;
      }

      //   if (this.jsonObjectSet['approveInterestUp'] || this.jsonObjectSet['approveInterestDown']) {
      //     for (var data of data.rspBody) {
      //       for (const items of data.interestList) {
      //         console.log(items)
      //         console.log('!!!!!!!!!!!!!!!!!')
      //         console.log(Number(this.approveInterestUp))
      //         console.log(Number(this.approveInterestDown))
      //         if (items > Number(this.approveInterestUp) && items < Number(this.approveInterestDown)) {
      //           filter = true
      //         } else {
      //           filter = false
      //           break
      //         }
      //       }
      //       if (filter) {
      //         this.resultData.push(data)
      //         console.log(this.resultData)
      //       }
      //     }
      //   }else{

      //     this.resultData = data.rspBody

      //   }, 5000);
      // }
      //   }
      // }
      else {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        });
        this.loading = false;
        this.resultData = []
        this.newData = []
        return;
      }
    })

  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // 判斷是否為第一次進頁面
    const { pageIndex } = params;
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
    this.total = 0
    this.applno = ''
    this.remitResult = ''
    this.changeOption(this.outboundTypeValue)
    this.checkOptionsOne = []
    this.client = '';
    this.s = "請輸入選項"
    this.inputCustIdValue = ''
    this.inputNameValue = ''
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
      { label: 'F', value: 'F', checked: false },

    ];
    this.outboundCustQryValue = ""
    this.lowPrice = ""
    this.highPrice = ""
    this.resultData = []
    this.newData = []
    this.settleDate = null
    this.prodCode = ''
    this.approveInterestUp = ''
    this.approveInterestDown = ''
    this.recordTime = null
    this.applicationDebtStrgy = ''
  }

  //取件
  async pickup(applno: string, custType: string, recordTime: string, json: any): Promise<any> {

    this.f06002Service.saveSearchData(this.jsonObjectSet, this.settleDate, this.recordTime)
    const url = 'f06/f06002action2';
    let jsonObject: any = {};
    let jsonObjectCheck: any = {};
    jsonObjectCheck['applno'] = applno;
    jsonObject['applno'] = applno
    jsonObject['custType'] = custType
    await this.f06002Service.getOpid(jsonObjectCheck).then((data: any) => {
      if (data.rspCode == '0000') {
        this.opidCheck = data.rspBody
        this.f06002Service.opidresetfn(this.opidCheck)
        var i = this.f06002Service.getFirstFlag();
        i++;
        this.f06002Service.setFirstFlag(i);
        if (Number(this.opidCheck) > 2940) {
          this.f06002Service.setFirstFlag(2);
        }
        sessionStorage.setItem('opidCheck', this.opidCheck);
      }
    })
    this.f06002Service.getData(url, jsonObject).subscribe(data => {
      this.f06002Service.setCustType(custType)
      sessionStorage.setItem('applno', applno);
      sessionStorage.setItem('custId', this.inputCustIdValue);
      sessionStorage.setItem('page', '0602');
      sessionStorage.setItem('custType', custType);
      sessionStorage.setItem('ctrtMaxPrd', data.rspBody.applicationData.ctrtMaxPrd);
      sessionStorage.setItem('ctrtMinPrd', data.rspBody.applicationData.ctrtMinPrd);
      // let safeUrl = this.BaseService.getNowUrlPath("/#/F06002SCN1");
      // let url = window.open(safeUrl);
      // this.menuListService.setUrl({
      //   url: url
      // });
      this.router.navigate(['./F06002SCN1']);
      // const dialogRef = this.dialog.open(F06002pickupComponent, {
      //   // panelClass: 'mat-dialog-transparent',
      //   height: '90%',
      //   width: '90%',
      //   data: {
      //     applno: applno,
      //     custType: custType,
      //     recordTime: recordTime,
      //     data: data,

      //   },
      // })
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result != null && result.event == 'success') {
      //     this.refreshTable()
      //   }
      // })
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

  //核准利率指輸入數字
  toprofit(amount: string, name: string) {
    this.caluclate(amount)
    if (this.number) {
      amount = amount.replace(/[^\d.]/g, "")

      switch (name) {
        case "approveInterestUp":
          this.approveInterestUp = amount;
          break;
        case "approveInterestDown":
          this.approveInterestDown = amount;
          break;
      }
    }
    else {
      switch (name) {
        case "approveInterestUp":
          this.approveInterestUp = '';
          break;
        case "approveInterestDown":
          this.approveInterestDown = '';
          break;
      }
    }

  }


  //+逗號
  //+逗號
  toCurrency(amount: string, name: string) {
    amount = amount.replace(/,/g, "")
    amount = amount.replace(/\D/g, '')

    if (amount.length > 0) {
      amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    switch (name) {
      case "lowPrice":
        this.lowPrice = amount;
        break;
      case "highPrice":
        this.highPrice = amount;
        break;
    }
    // return amount != null ? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }

  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\w\s]|_/g, '') : data;
  }
  toCurrencyShow(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
  //table排序
  sortChange(e: string, param: string) {
    switch (param) {
      case "APPLNO":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }

        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.applno.localeCompare(b.applno))
          : this.resultData.sort((a, b) => b.applno.localeCompare(a.applno));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
      case "tableTypeValue":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.tableTypeValue.localeCompare(b.tableTypeValue))
          : this.resultData.sort((a, b) => b.tableTypeValue.localeCompare(a.tableTypeValue));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
      case "nextContactTime":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.nextContactTime == null) { data.nextContactTime = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.nextContactTime.localeCompare(b.nextContactTime))
          : this.resultData.sort((a, b) => b.nextContactTime.localeCompare(a.nextContactTime));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
      case "applyTime":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.applyTime == null) { data.applyTime = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.applyTime.localeCompare(b.applyTime))
          : this.resultData.sort((a, b) => b.applyTime.localeCompare(a.applyTime));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "prodCode":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.prodCode == null) { data.prodCode = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.prodCode.localeCompare(b.prodCode))
          : this.resultData.sort((a, b) => b.prodCode.localeCompare(a.prodCode));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "custFlag":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.custFlag == null) { data.custFlag = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.custFlag.localeCompare(b.custFlag))
          : this.resultData.sort((a, b) => b.custFlag.localeCompare(a.custFlag));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "statusCode":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.statusCode == null) { data.statusCode = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.statusCode.localeCompare(b.statusCode))
          : this.resultData.sort((a, b) => b.statusCode.localeCompare(a.statusCode));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "lastChngTmstmp":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.lastChngTmstmp == null) { data.lastChngTmstmp = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.lastChngTmstmp.localeCompare(b.lastChngTmstmp))
          : this.resultData.sort((a, b) => b.lastChngTmstmp.localeCompare(a.lastChngTmstmp));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "count":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.count == null) { data.count = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.count - (b.count))
          : this.resultData.sort((a, b) => b.count - (a.count));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "amount":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.amount == null) { data.amount = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.amount.toString() - (b.amount.toString()))
          : this.resultData.sort((a, b) => b.amount.toString() - (a.amount.toString()));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "creditTime":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.creditTime == null) { data.creditTime = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.creditTime.localeCompare(b.creditTime))
          : this.resultData.sort((a, b) => b.creditTime.localeCompare(a.creditTime));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      // case "interest":
      //   if (e === 'ascend') {
      //     this.order = param;
      //     this.sor = 'DESC';
      //   }
      //   else {
      //     this.order = param;
      //     this.sor = '';
      //   }
      //   for (const data of this.resultData) {
      //     if (data.interest == null) { data.interest = ''; };
      //   }
      //   this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.interest.localeCompare(b.interest))
      //     : this.resultData.sort((a, b) => b.interest.localeCompare(a.interest));
      //   this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

      //   break;
      // case "approveAmt":
      //   if (e === 'ascend') {
      //     this.order = param;
      //     this.sor = 'DESC';
      //   }
      //   else {
      //     this.order = param;
      //     this.sor = '';
      //   }
      //   for (const data of this.resultData) {
      //     if (data.approveAmt == null) { data.approveAmt = ''; };
      //   }
      //   this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.approveAmt.localeCompare(b.approveAmt))
      //     : this.resultData.sort((a, b) => b.approveAmt.localeCompare(a.approveAmt));
      //   this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

      //   break;
      case "interest":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.arrange = true
        if (this.arrange) {
          this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.interest.split('／')[0] - b.interest.split('／')[0])
            : this.resultData.sort((a, b) => b.interest.split('／')[0] - a.interest.split('／')[0]);
          this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
          // this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => ((a.interest == "" || a.interest == null) ? "" : a.interest.split('/')[0].length)
          //   - (((b.interest == "" || b.interest == null) ? "" : b.interest.split('／')[0].length)))
          //   : this.resultData.sort((a, b) => ((b.interest == "" || b.interest == null) ? "" : b.interest.split('／')[0].length)
          //     - (((a.interest == "" || a.interest == null) ? "" : a.interest.split('／')[0].length)));
          this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
          this.arrange = false
        }
        // for (const data of this.resultData) {
        //   if (data.interest == null) { data.interest = ''; };
        // }
        // this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.interest.localeCompare(b.interest))
        //   : this.resultData.sort((a, b) => b.interest.localeCompare(a.interest));
        // this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "approveAmt":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.arrange = true
        if (this.arrange) {
          this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.approveAmt.split('／')[0] - b.approveAmt.split('／')[0])
            : this.resultData.sort((a, b) => b.approveAmt.split('／')[0] - a.approveAmt.split('／')[0]);
          this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
          this.arrange = false
        }
        // for (const data of this.resultData) {
        //   if (data.approveAmt == null) { data.approveAmt = ''; };
        // }
        // this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.interest.localeCompare(b.interest))
        //   : this.resultData.sort((a, b) => b.interest.localeCompare(a.interest));
        // this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;

      // case "approveAmt":
      //   if (e === 'ascend') {
      //     this.order = param;
      //     this.sor = 'DESC';
      //   }
      //   else {
      //     this.order = param;
      //     this.sor = '';

      //   }
      //   this.arrange = true
      //   if (this.arrange) {
      //     for (const data of this.resultData) {
      //       if (data.approveAmt) {
      //         console.log(data.approveAmt)

      //         if (data.approveAmt != null) {
      //           data.approveAmt = '';
      //           if (data.approveAmt != '') {
      //           data.approveAmt.split('/')

      //           // }
      //         } else {
      //           data.approveAmt = '';
      //         }
      //         this.arrange = false;
      //       } else {

      //       }
      //     }
      //   }
      //   if (this.arrange) {
      //     this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => ((a.approveAmt == "" || a.approveAmt == null) ? "" : a.approveAmt.split('/')[0].length)
      //       - (((b.approveAmt == "" || b.approveAmt == null) ? "" : b.approveAmt.split('／')[0].length)))
      //       : this.resultData.sort((a, b) => ((b.approveAmt == "" || b.approveAmt == null) ? "" : b.approveAmt.split('／')[0].length)
      //         - (((a.approveAmt == "" || a.approveAmt == null) ? "" : a.approveAmt.split('／')[0].length)));
      //     this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
      //     this.arrange = false
      //   }

      //   break;
      case "applyTime":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.applyTime == null) { data.applyTime = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.applyTime.localeCompare(b.applyTime))
          : this.resultData.sort((a, b) => b.applyTime.localeCompare(a.applyTime));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "settleDate":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.settleDate == null) { data.settleDate = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.settleDate.localeCompare(b.settleDate))
          : this.resultData.sort((a, b) => b.settleDate.localeCompare(a.settleDate));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "applicationDebtStrgy":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.applicationDebtStrgy == null) { data.applicationDebtStrgy = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.applicationDebtStrgy.localeCompare(b.applicationDebtStrgy))
          : this.resultData.sort((a, b) => b.applicationDebtStrgy.localeCompare(a.applicationDebtStrgy));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;
      case "recordTime":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        for (const data of this.resultData) {
          if (data.recordTime == null) { data.recordTime = ''; };
        }
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.recordTime.localeCompare(b.recordTime))
          : this.resultData.sort((a, b) => b.recordTime.localeCompare(a.recordTime));
        this.newData = this.f06002Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);

        break;


    }
  }
  // //明細
  detail(applno: string, nationalId: string, custId: string) {
    sessionStorage.setItem('searchUserId', BaseService.userId);
    sessionStorage.setItem('searchEmpName', BaseService.empName);
    sessionStorage.setItem('searchEmpId', BaseService.empId);

    //要发送的参数
    let params = {
      "applno": applno,
      "nationalId": nationalId,
      "custId": custId,
      "search": "Y",
      "winClose": "Y"
    };
    window["filter"] = params;

    //開啟徵審主畫面
    let safeUrl = this.BaseService.getNowUrlPath("/#/F01002/F01002SCN1");
    let url = window.open(safeUrl);
    url.onload = function () {
      window["filter"] = "";
    };
    this.menuListService.setUrl({
      url: url
    });

    sessionStorage.removeItem('searchUserId');
    sessionStorage.removeItem('searchEmpName');
    sessionStorage.removeItem('searchEmpId');
  }




  //只輸入數字
  numberOnly(event: { which: any; keyCode: any; }): boolean {
    console.log(event)
    console.log(event.which)
    console.log(event.keyCode)

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請輸入數字!' }
      });

      return false;
    }
    return true;
  }

  //檢核小數點
  caluclate(value: any, caseType?: string) {
    if (isNaN(value)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '利率請輸入數字!' }
      });
      this.approveInterestUp = ''
      this.approveInterestDown = ''
      return;
    }

    if (value.includes(".")) {
      if (value.split(".")[1].length > 3) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '利率請輸入至小數點第三位!' }
        });
        this.approveInterestUp = ''
        this.approveInterestDown = ''
        return;
      }
    }

    if (value.toString().includes(".")) {
      if (Number(value > 99)) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '利率不得超過99%!' }
        });
        this.approveInterestUp = ''
        this.approveInterestDown = ''
        return;
      }
    }

    if (Number(value > 99)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '利率不得超過99%!' }
      });
      this.approveInterestUp = ''
      this.approveInterestDown = ''
      return;
    }
  }
  //清空
  reset() {
    this.checkOptionsOne = [];
    this.checkOptionsTwo = [];
  }
}
