import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { logging } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { F02001Service } from '../f02001/f02001.service';
import { F06003Service } from './f06003.service';
import { OptionsCode } from '../interface/base';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-f06003',
  templateUrl: './f06003.component.html',
  styleUrls: ['./f06003.component.css', '../../assets/css/f03.css']
})
//Jay Outbound案件轉派
export class F06003Component implements OnInit {

  constructor(
    private f06003Service: F06003Service,
    public dialog: MatDialog,
    private f02001Service: F02001Service,
    private pipe: DatePipe,
  ) { }
  checkOptionsTwo = [
    { label: 'A', value: 'A', checked: false },
    { label: 'B', value: 'B', checked: false },
    { label: 'C', value: 'C', checked: false },
    { label: 'D', value: 'D', checked: false },
    { label: 'E', value: 'E', checked: false },
    { label: 'F', value: 'F', checked: false },

  ];
  tableTypeValue: string //table 案件類型
  clientList: any[] = [];
  client: string = '';
  remitResult:string='';//是否退匯
  remitResultCode: OptionsCode[] = [
    { value: '', viewValue: '請選擇' },
    { value: 'N', viewValue: '無匯款紀錄' },
    { value: 'F', viewValue: '是' },
    { value: 'T', viewValue: '否' }
  ];//是否退匯下拉
  settleDateTitle: string = '案件到期日'//案件到期日標題
  YNValue: string = '';//通知客戶值
  YNCode: any[] = [];//通知客戶
  outboundTypeCode: any[] = [];
  outboundTypeValue: string = 'O1';
  checkOptionsOne = [];
  dispatchList: any[] = [];
  checkOptionsOneList: any[] = [];//案件狀態值
  userGroupList: any[] = [];//客群值
  dispatch: string = 'no';
  Maxmoney: string = ''; //最大
  Minmoney: string = ''; //最小
  prodCode: string = ''//  增加產品類型
  elProductInfoCode: any = []//產品類型下拉
  settleDate: [Date, Date];//指定結清日
  approveInterestUp: string =''//增加核准利率上限
  approveInterestDown: string = ''//增加核准利率下現
  recordTime: [Date, Date];// 最近一次聯繫日
  applicationDebtStrgy: string = ''//是否有轉貸方案
  applicationDebtStrgyValueCode: OptionsCode[] = [
    { value: '', viewValue: '請選擇' },
    { value: '03', viewValue: '是' },
    { value: '01', viewValue: '否' }

  ];
  s: string = '請輸入選項';
  x: string
  limit: number;
  IsExists: string = '';
  loading = false;
  transferList: any[] = [];//轉件人員陣列
  transfer: string = '';//轉件人員
  OutboundTable: Data[] = [];//裝查詢結果
  inputCustIdValue: string = '';//客戶查詢輸入值
  newOutboundTable: any[] = [];
  newTable: any;
  newTable2: any[] = [];
  condition: number = 0;
  changeList: any[] = [];//轉件陣列
  isAllCheck = false;
  indeterminate = true;
  applNo:string//案件編號
  pageSize = 50;
  pageIndex = 1;
  firstFlag = 1;
  total = 0;
  order: string;
  sor: string;
  J= true;
  sortArry = ['ascend', 'descend']
  ngOnInit(): void {
    this.Clear();
    this.getYNresult();
    this.getclientList();
    this.getdispatch()
    // this.changeOption(this.outboundTypeValue)

  }  //是否退匯英轉中
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
    switch (i) {
      case 'C':
        this.s = '請輸入客戶ID';
        this.limit = 15;
        break;
      case 'N':
        this.s = '請輸入身分證字號';
        this.limit = 10;
        break;
      case 'T':
        this.s = '請輸入客戶手機號';
        this.limit = 10;
        break;
      case 'L':
        this.s = '請輸入客戶姓名';
        this.limit = 20;
        break;
      default:
        this.s = '';
        break;
    }
  }
  public async select()//查詢
  {
    this.newTable = [];
    this.newTable2 = [];
    this.total = 0;
    this.newOutboundTable = [];
    this.checkOptionsOneList = [];
    this.userGroupList = [];
    this.pageIndex = 1;
    if (this.client != '') {
      if (this.inputCustIdValue == '') {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: this.s }
        });
        return;
      }
    }
    if (this.outboundTypeValue != '')
    {
      if (this.dispatch == 'no' && this.YNValue == '' && this.client == '' && this.inputCustIdValue == '' && this.prodCode == ''&&this.applNo==''&&this.remitResult==''
        && this.Minmoney == '' && this.Maxmoney == '' && this.settleDate == null && this.approveInterestUp=='' && this.approveInterestDown==''
        && this.recordTime == null && this.applicationDebtStrgy == '' && this.test(this.checkOptionsOne) == '' && this.test(this.checkOptionsTwo) == '') {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請至少選擇一項條件" }
        });
        this.loading = false;
        return;

      }
      else {
        for (var t of this.checkOptionsTwo) {
          if (t.checked) {
            this.userGroupList.push(t.label)
          }
        }
        if(parseInt(this.toNumber(this.Maxmoney))>=0)
        {
          if(parseInt(this.toNumber(this.Maxmoney))<parseInt(this.toNumber(this.Minmoney)))
          {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: "最低金額不應該比最高金額大" }
            });
            return
          }
        }
        console.log(parseInt(this.approveInterestDown))
        if(parseInt(this.approveInterestDown)>=0)
        {
          if(parseInt(this.approveInterestDown)<parseInt(this.approveInterestUp))
          {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: "最低利率不應該比最高利率大" }
            });
            return
          }
        }

        let url = 'f06/f06003action1'
        let jsonObject: any = {};
        this.loading = true;
        this.judgeSettleDateTitle(this.outboundTypeValue)
        jsonObject["assign"] = this.dispatch; //派案
        jsonObject["caseType"] = this.outboundTypeValue; //案件類型
        jsonObject["isConnect"] = this.YNValue;//是否需要再次聯繫
        jsonObject["statusCodeList"] = this.checkOptionsOne;//案件狀態值
        jsonObject["applNo"] = this.applNo;
        jsonObject["remitResult"] = this.remitResult;//是否退匯
        jsonObject["userGroup"] = this.userGroupList;//客群值
        jsonObject["userQuery"] = this.client;//客戶查詢
        jsonObject["queryValue"] = this.inputCustIdValue;//客戶填的值

        if(parseInt(this.toNumber(this.Minmoney))>=0)
        {
          jsonObject["minApplyAmount"] = (Number(this.toNumber(this.Minmoney))*10000).toString();//輸入最低金額
        }

        if(parseInt(this.toNumber(this.Maxmoney))>=0)
        {
          jsonObject["maxApplyAmount"] = (Number(this.toNumber(this.Maxmoney))*10000).toString();//請輸入最高金額
        }

        // if(this.Maxmoney)
        // {
        //   jsonObject["maxApplyAmount"] =(Number(this.toNumber(this.Maxmoney))*10000).toString();//請輸入最高金額
        // }

        if (this.settleDate != null) {   //指定結清日
          jsonObject['settleDateUp'] = this.pipe.transform(new Date(this.settleDate[0]), 'yyyyMMdd');
          jsonObject['settleDateDown'] = this.pipe.transform(new Date(this.settleDate[1]), 'yyyyMMdd');
        }
        jsonObject['prodCode'] = this.prodCode;  //產品類型
        // jsonObject['approveInterestUp'] = this.approveInterestUp;  //增加核准利率
        // jsonObject['approveInterestDown'] = this.approveInterestDown;  //增加核准利率
        if (this.recordTime != null) {   //最後一次聯繫日
          jsonObject['recordTimeUp'] = this.pipe.transform(new Date(this.recordTime[0]), 'yyyyMMdd');
          jsonObject['recordTimeDown'] = this.pipe.transform(new Date(this.recordTime[1]), 'yyyyMMdd');
        }
        jsonObject['applicationDebtStrgy'] = this.applicationDebtStrgy;  //是否有轉貸方案
        this.f06003Service.getData(url, jsonObject).subscribe(data => {
          console.log(data)
          this.tableTypeValue = this.outboundTypeValue
          var p = 0;
          var q = 99;
          if (data.rspBody.length > 0)
          {
            var o :boolean =false;
            this.OutboundTable = data.rspBody;
            if(this.approveInterestUp.length>0)
            {
               p = Number(this.approveInterestUp);
            }
            if(this.approveInterestDown.length>0)
            {
              q = Number(this.approveInterestDown)
            }

            if(this.approveInterestUp.trim() || this.approveInterestDown.trim())
            {
              for (const t of this.OutboundTable)
              {
                o=false;
                for(const ff of t.INTEREST_LIST)
                {
                  if(p<=ff && ff<=q)
                  {
                   o =true
                   break;
                  }

                }
                if(o)
                {
                  this.newTable = {
                    APPLNO: t.APPLNO, PROD_NAME: t.PROD_NAME, EMPNO: t.EMPNO, tableTypeValue: t.tableTypeValue, CUST_FLAG: t.OCUPATN_CUST_STGP1_PM,
                    O1_NEXT_CONTACT_TIME: t.NEXTCONTACTTIME, STATUS_CODE: t.STATUS_CODE, OP_TIME: t.OP_TIME, CONNECTCOUNT: t.CONNECTCOUNT + "", APPLICATIONAMOUNT: this.data_number(t.APPLICATIONAMOUNT),
                    CREDIT_TIME: t.CREDIT_TIME, INTEREST: t.INTEREST,RESULT: t.RESULT, RECENT_RECORD_TIME: t.RECENT_RECORD_TIME,CU_CNAME: t.CU_CNAME,CU_CP_NAME: t.CU_CP_NAME,ASSIGN_RECORD: t.ASSIGN_RECORD,
                    APRV_DEBT_AMT: this.test1(t.PROD_CODE, t),
                    CUST_REASON_MEMO: t.CUST_REASON_MEMO,
                    MATURITYTIME: t.MATURITYTIME, SETTLE_DATE: t.SETTLE_DATE, APPROVED_DEBT_STRGY: t.APPROVED_DEBT_STRGY, RECORD_TIME: t.RECORD_TIME
                  }
                  this.newTable2.push(this.newTable);

                }

              }
              if(this.newTable2.length==0)
              {
                this.dialog.open(ConfirmComponent, {
                  data: { msgStr: "查無資料" }
                });
                this.loading = false;
                return;
              }
            }
            else
            {
              console.log(this.OutboundTable)
              for (var t of this.OutboundTable)
              {
                  this.newTable = {
                    APPLNO: t.APPLNO, PROD_NAME: t.PROD_NAME, EMPNO: t.EMPNO, tableTypeValue: t.tableTypeValue, CUST_FLAG: t.OCUPATN_CUST_STGP1_PM,
                    O1_NEXT_CONTACT_TIME: t.NEXTCONTACTTIME, STATUS_CODE: t.STATUS_CODE, OP_TIME: t.OP_TIME, CONNECTCOUNT: t.CONNECTCOUNT + "", APPLICATIONAMOUNT: this.data_number(t.APPLICATIONAMOUNT),
                    CREDIT_TIME: t.CREDIT_TIME,  INTEREST: t.INTEREST, RESULT: t.RESULT, RECENT_RECORD_TIME: t.RECENT_RECORD_TIME,CU_CNAME: t.CU_CNAME,CU_CP_NAME: t.CU_CP_NAME,ASSIGN_RECORD: t.ASSIGN_RECORD,
                    APRV_DEBT_AMT: this.test1(t.PROD_CODE, t),
                    CUST_REASON_MEMO: t.CUST_REASON_MEMO,
                    MATURITYTIME: t.MATURITYTIME, SETTLE_DATE: t.SETTLE_DATE, APPROVED_DEBT_STRGY: t.APPROVED_DEBT_STRGY, RECORD_TIME: t.RECORD_TIME
                  }
                  this.newTable2.push(this.newTable);
              }

            }

            this.newOutboundTable = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);

            console.log(this.newOutboundTable)

            if(this.approveInterestUp.trim() || this.approveInterestDown.trim())
            {
              this.total = this.newTable2.length;
            }
            else
            {
              this.total = data.rspBody.length;
            }

            this.firstFlag = 2;
            this.loading = false;
          }
          else {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: "查無資料" }
            });
            this.loading = false;
            return;
          }

        })
      }
      // var p = await this.verify(this.checkOptionsOne)
      // if (p == true) {
      // if (this.checkOptionsOne)
      // for (var i of this.checkOptionsOne) {
      //   if (i.checked) {
      //     this.checkOptionsOneList.push(i.label)
      //   }

      // }


      // }
      // else {
      //   this.dialog.open(ConfirmComponent, {
      //     data: { msgStr: "請選擇一項案件狀態" }
      //   });
      //   this.loading = false;
      //   return;
      // }

    }
    else {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇案件類型" }
      });
      this.loading = false;
      return;
    }

  }

  public async verify(i: any): Promise<boolean> {
    for (var w of i) {
      if (w.checked == true) {
        return true
      }
    }

    return false
  }
  test(t: any) {
    for (var i of t) {
      if (i.checked == true) {
        return t
      }
    }
    return '';
  }

  test1(i: string, t: any) {
    console.log(i)
    console.log(t)
    if (i.includes('0201002')) {
      return t.APPROVE_AMT + "";
    }
    else {
      // for(let k of t)
      // {
      switch (t.APPROVED_DEBT_STRGY) {
        case "01":
          if (t.STRGY_1_CASH_APRV_AMT) {
            return t.STRGY_1_CASH_APRV_AMT + "";
          } else {
            return ""
          }
        case "03":
          if (t.STRGY_2_APRV_AMT) {

            return t.STRGY_2_APRV_AMT + ""
          } else {
            return ""
          }
        case "01,03":
          if (t.STRGY_1_CASH_APRV_AMT && t.STRGY_2_APRV_AMT)
           {
            return t.STRGY_1_CASH_APRV_AMT + '/' + t.STRGY_2_APRV_AMT;
          } else if (t.STRGY_1_CASH_APRV_AMT) {
            return t.STRGY_1_CASH_APRV_AMT
          }else if(t.STRGY_2_APRV_AMT){
            return t.STRGY_2_APRV_AMT
          }else{
            return ""
          }
          default:
            return ""
      }
      // }

    }
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

  //+逗號
  toCurrency(amount: string,name:string) {
    amount = amount.replace(/,/g, "")
    amount = amount.replace(/\D/g, '')

    if(amount.length>0)
    {
      amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    switch(name)
    {
      case "Minmoney":
        this.Minmoney = amount;
        break;
        case "Maxmoney":
          this.Maxmoney = amount;
          break;
    }
    // return amount != null ? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }

  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\w\s]|_/g, '') : data;
  }
  toprofit(amount: string,name:string)
  {
    this.caluclate(amount)
    if(this.J)
    {
      amount = amount.replace(/[^\d.]/g,"")

      switch(name)
      {
        case "approveInterestUp":
          this.approveInterestUp = amount;
          break;
          case "approveInterestDown":
            this.approveInterestDown = amount;
            break;
      }
    }
    else
    {
      switch(name)
      {
        case "approveInterestUp":
          this.approveInterestUp = '';
          break;
          case "approveInterestDown":
            this.approveInterestDown = '';
            break;
      }
    }

  }

  Clear()//清除
  {
    this.applNo='';
    this.newTable = [];
    this.newTable2 = [];
    this.dispatch = 'no';
    this.remitResult= ''
    this.total = 0
    this.changeList = [];
    this.condition = 0;
    this.s = '請輸入選項';
    this.J = true;
    this.inputCustIdValue = '';
    this.outboundTypeValue = 'O1';
    this.Maxmoney = '';
    this.Minmoney = '';
    this.client = '';
    this.YNValue = '';
    this.total = 0;
    this.transfer = '';
    this.firstFlag = 1;
    this.prodCode = '';
    this.approveInterestUp = '';
    this.approveInterestDown = '';
    this.settleDate = null;
    this.recordTime = null;
    this.applicationDebtStrgy = '';
    this.checkOptionsOne = [];
    this.changeOption(this.outboundTypeValue)
    this.userGroupList = [];
    this.checkOptionsOneList = [];
    this.newOutboundTable = [];
    this.checkOptionsTwo = [
      { label: 'A', value: 'A', checked: false },
      { label: 'B', value: 'B', checked: false },
      { label: 'C', value: 'C', checked: false },
      { label: 'D', value: 'D', checked: false },
      { label: 'E', value: 'E', checked: false },
      { label: 'F', value: 'F', checked: false },

    ];
  }

  //客戶查詢下拉
  getclientList() {
    this.clientList.push({ value: '', viewValue: '請選擇' })
    this.clientList.push({ value: 'C', viewValue: '客戶ID' })
    this.clientList.push({ value: 'N', viewValue: '身分證字號' })
    this.clientList.push({ value: 'T', viewValue: '客戶手機號' })
    this.clientList.push({ value: 'L', viewValue: '客戶姓名' })
  }

  //是否通知客戶下拉
  getYNresult() {
    this.YNCode.push({ value: '', viewValue: '請選擇' })
    this.f06003Service.getSysTypeCode('YN').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.YNCode.push({ value: codeNo, viewValue: desc })
      }

    });
    //案件類型下拉
    this.outboundTypeCode.push({ value: '', viewValue: '請選擇' })
    this.f06003Service.getSysTypeCode('OUTBOUND_TYPE').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        if (jsonObj.codeNo != this.IsExists) {
          this.IsExists = jsonObj.codeNo;
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.outboundTypeCode.push({ value: codeNo, viewValue: desc })
        }

      }

    });

  }

  //案件類型
  changeOption(value: string) {
    if (value == '') {
      this.checkOptionsOne = [];
      return;
    }
    this.checkOptionsOne = [];
    let jsonObject: any = {};
    const baseUrl = "f06/f06002";
    jsonObject["custType"] = value;
    this.f06003Service.getData(baseUrl, jsonObject).subscribe(data => {

      for (const row of data.rspBody) {
        const codeNo = row
        const codeDesc = row
        this.checkOptionsOne.push({ label: codeNo, value: codeDesc, checked: false })
      }
    })
  }
  getdispatch()//派案下拉
  {
    this.dispatchList = [];
    this.elProductInfoCode = [];
    let url = 'f06/f06003'
    let jsonObject: any = {};
    this.dispatchList.push({ value: 'no', viewValue: '請選擇' })
    this.elProductInfoCode.push({ value: '', viewValue: '請選擇' })
    this.dispatchList.push({ value: '', viewValue: '未派案' })
    this.transferList.push({ value: '', viewValue: '未派案' })
    this.f06003Service.getData(url, jsonObject).subscribe(data => {
      for (const row of data.rspBody.assignerList) {
        const codeNo = row.EMP_NO
        const codeDesc = row.EMP_NAME
        this.dispatchList.push({ value: codeNo, viewValue: codeDesc })
        this.transferList.push({ value: codeNo, viewValue: codeDesc })
      }
    })
    this.f06003Service.getData(url, jsonObject).subscribe(data => {
      for (const row of data.rspBody.productInfoList) {
        const codeNo = row.prodCode
        const codeDesc = row.prodName
        this.elProductInfoCode.push({ value: codeNo, viewValue: codeDesc })
      }
      console.log(this.elProductInfoCode)
    })
  }
  //分頁控制
  onQueryParamsChange(params: NzTableQueryParams): void {
    // 判斷是否為第一次進頁面
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      if (this.firstFlag != 1) {
        this.pageIndex = pageIndex;
        this.newOutboundTable = this.f02001Service.getTableDate(pageIndex, this.pageSize, this.newTable2);

        // this.selectData(pageIndex, this.pageSize, this.order, this.sor);
      }
    }
  }
  addcheckbox(check: boolean, APPLNO: string) {

    if (check) {
      this.changeList.push(APPLNO);
      console.log(this.changeList)
    }
    else {
      this.changeList.splice(this.changeList.indexOf(APPLNO), 1)
    }
    // this.checkboxAny.splice(this.checkboxAny.indexOf(f.ID), 1)
  }
  //轉件
  change() {
    let jsonObject: any = {};
    let url = 'f06/f06003action2';

    if (this.changeList.length > 0) {
      for (var i of this.changeList) {
        for (var t of this.newOutboundTable) {
          if (t.APPLNO == i) {
            if (t.EMPNO.substr(0, 7) == this.transfer) {
              this.dialog.open(ConfirmComponent, {
                data: { msgStr: "案件" + t.APPLNO + "目前處理人員與轉件人員相同" }
              });
              return;
            }
          }
        }
      }
    }
    else {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請勾選要轉派的案件" }
      });
      return;
    }

    jsonObject["applno"] = this.changeList;
    jsonObject["empNo"] = this.transfer;
    jsonObject["caseType"] = this.outboundTypeValue;

    this.f06003Service.getData(url, jsonObject).subscribe(data => {
      if (data.rspMsg == "轉件成功") {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
        this.changeList = [];
        this.select();
      }

    })
  }

  convert(i: string)//代碼轉中文
  {
    if (i == "O1") {
      return "未完成進件"
    }
    else {
      return "未完成撥款"
    }
  }

  //全選
  setAll(completed: any) {
    console.log(completed)
    this.indeterminate = false;
    if (completed == true) {
      for (const obj of this.newOutboundTable) {
        obj.completed = completed;
        this.changeList.push(obj.APPLNO);
        console.log(this.changeList)
      }
    } else if (completed == false) {
      for (const obj of this.newOutboundTable) {
        obj.completed = false;
        this.changeList.splice(this.changeList.indexOf(obj.APPLNO), 1)
        console.log(this.changeList)

      }
    }

  }
  // 千分號標點符號(form顯示用)
  data_number(p: number) {
    this.x = '';
    this.x = (p + "").replace(/,/g, "")
    if (this.x != null) {
      this.x = this.x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return this.x
  }
  dateSettleDateNull() {
    if (this.settleDate.length < 1) {
      this.settleDate = null;
    }
  }
  dateRecordTimeNull() {
    if (this.recordTime.length < 1) {
      this.recordTime = null;
    }
  }
  //只輸入數字
  numberOnly(event: { which: any; keyCode: any; }): boolean {
    if(isNaN(parseInt(event.which)))
    {

      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請輸入數字!' }
      });
      return false;
    }
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
  caluclate(value: any) {
    if (isNaN(value)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '利率請輸入數字!' }
      });
      this.J=false;
      return;
    }

    if (value.includes(".")) {
      if (value.split(".")[1].length > 3) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '利率請輸入至小數點第三位!' }
        });
        this.J=false;
        return;
      }
    }

    if (value.toString().includes(".")) {
      if (Number(value > 99)) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '利率不得超過99%!' }
        });
        this.J=false;
        return;
      }
    }

    if (Number(value > 99)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '利率不得超過99%!' }
      });
      this.J=false;
      return;
    }

    this.J=true;
  }
  //轉換是否有轉貸方案中文
  chiangeApplicationDebtStrgy(value: string) {
    if (value != null) {
      if (value.indexOf('03')>=0) {
        return value = "是"
      } else if (value == '01') {
        return value = "否"

      }
    } else {
      return value
    }
  }
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
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
          : this.newTable2.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "EMP_NAME":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.EMPNO.localeCompare(b.EMPNO))
          : this.newTable2.sort((a, b) => b.EMPNO.localeCompare(a.EMPNO));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
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
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
          : this.newTable2.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "OCUPATN_CUST_STGP1_PM":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.OCUPATN_CUST_STGP1_PM.localeCompare(b.OCUPATN_CUST_STGP1_PM))
          : this.newTable2.sort((a, b) => b.OCUPATN_CUST_STGP1_PM.localeCompare(a.OCUPATN_CUST_STGP1_PM));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "CUST_FLAG":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.CUST_FLAG.localeCompare(b.CUST_FLAG))
          : this.newTable2.sort((a, b) => b.CUST_FLAG.localeCompare(a.CUST_FLAG));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "O1_NEXT_CONTACT_TIME":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.O1_NEXT_CONTACT_TIME.localeCompare(b.O1_NEXT_CONTACT_TIME))
          : this.newTable2.sort((a, b) => b.O1_NEXT_CONTACT_TIME.localeCompare(a.O1_NEXT_CONTACT_TIME));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "STATUS_CODE":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.STATUS_CODE.localeCompare(b.STATUS_CODE))
          : this.newTable2.sort((a, b) => b.STATUS_CODE.localeCompare(a.STATUS_CODE));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "OP_TIME":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.OP_TIME.localeCompare(b.OP_TIME))
          : this.newTable2.sort((a, b) => b.OP_TIME.localeCompare(a.OP_TIME));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "CONNECTCOUNT":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.CONNECTCOUNT-(b.CONNECTCOUNT))
          : this.newTable2.sort((a, b) => b.CONNECTCOUNT-(a.CONNECTCOUNT));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "APPLICATIONAMOUNT":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.APPLICATIONAMOUNT.localeCompare(b.APPLICATIONAMOUNT))
          : this.newTable2.sort((a, b) => b.APPLICATIONAMOUNT.localeCompare(a.APPLICATIONAMOUNT));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "CREDIT_TIME":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.CREDIT_TIME.localeCompare(b.CREDIT_TIME))
          : this.newTable2.sort((a, b) => b.CREDIT_TIME.localeCompare(a.CREDIT_TIME));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "INTEREST":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        console.log(this.newTable2)
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => (a.INTEREST.split('／')[0]) - (b.INTEREST.split('／')[0]))
          : this.newTable2.sort((a, b) => (b.INTEREST.split('／')[0]) - (a.INTEREST.split('／')[0]));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "APRV_DEBT_AMT":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => (a.APRV_DEBT_AMT.split('/')[0]) - (b.APRV_DEBT_AMT.split('/')[0]))
          : this.newTable2.sort((a, b) => (b.APRV_DEBT_AMT.split('/')[0]) - (a.APRV_DEBT_AMT.split('/')[0]));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "MATURITYTIME":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.MATURITYTIME.localeCompare(b.MATURITYTIME))
          : this.newTable2.sort((a, b) => b.MATURITYTIME.localeCompare(a.MATURITYTIME));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "SETTLE_DATE":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.SETTLE_DATE.localeCompare(b.SETTLE_DATE))
          : this.newTable2.sort((a, b) => b.SETTLE_DATE.localeCompare(a.SETTLE_DATE));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "APPROVED_DEBT_STRGY":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.APPROVED_DEBT_STRGY.localeCompare(b.APPROVED_DEBT_STRGY))
          : this.newTable2.sort((a, b) => b.APPROVED_DEBT_STRGY.localeCompare(a.APPROVED_DEBT_STRGY));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
      case "RECORD_TIME":
        if (e === 'ascend') {
          this.order = param;
          this.sor = 'DESC';
        }
        else {
          this.order = param;
          this.sor = '';
        }
        this.newTable2 = e === 'ascend' ? this.newTable2.sort((a, b) => a.RECORD_TIME.localeCompare(b.RECORD_TIME))
          : this.newTable2.sort((a, b) => b.RECORD_TIME.localeCompare(a.RECORD_TIME));
        this.newOutboundTable = this.f06003Service.getTableDate(this.pageIndex, this.pageSize, this.newTable2);
        break;
    }

  }
}
