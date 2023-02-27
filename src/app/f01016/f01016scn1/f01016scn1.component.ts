import { DatePipe } from '@angular/common';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01015Service } from 'src/app/f01015/f01015.service';
import { OptionsCode } from 'src/app/interface/base';
import { MenuListService } from 'src/app/menu-list/menu-list.service';
import { F01016Service } from './../f01016.service';
interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f01016scn1',
  templateUrl: './f01016scn1.component.html',
  styleUrls: ['./f01016scn1.component.css', '../../../assets/css/f01.css']
})
export class F01016scn1Component implements OnInit {

  constructor(
    private f01015Service: F01015Service,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private router: Router,
    private f01016Service: F01016Service,
    private menuListService: MenuListService,
  ) { }

  nationalId: string; //身分證字號
  custId: string; //customer_ID
  targetCustSource = []; //解凍降額Table
  creditMainSource = []; //貸後管理紀錄Table
  page: string         //頁面
  suiManageData: any = {}
  total = 1;
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  levelNo: any; //層級
  executeValueChinese: string = ''
  limitTypeCode: sysCode[] = []; //額度類別
  YNCode: OptionsCode[] = []; //通知客戶
  reasonCode: sysCode[] = []; //執行原因
  reasonDetailCode: sysCode[] = []; //執行細項
  limitCode: sysCode[] = []; //額度號
  limit: sysCode[] = [] //
  frozenList = [] //
  contactCode: sysCode[] = [
    { value: '', viewValue: '請選擇' },
    { value: '1', viewValue: '電話' },
    { value: '2', viewValue: '山竹簡訊' },
    { value: '3', viewValue: '其他' },
  ];//通知方式
  bossCreditCode: sysCode[] = [
    { value: '', viewValue: '請選擇' },
    { value: 'Y', viewValue: '同意' },
    { value: 'N', viewValue: '不同意' },
  ];//主管核決
  executeCode: sysCode[] = [
    { value: '', viewValue: '請選擇' },
    { value: 'FRZ', viewValue: 'FRZ-凍結' },
    { value: 'DWN', viewValue: 'DWN-降額' },
    { value: 'HLD', viewValue: 'HLD-解凍' }
  ];//執行策略
  YNValue: string = '';//通知客戶值
  mobile: string//行動電話
  executeValue: string = '';//執行措施策略值
  reasonValue: string = ''//執行原因值
  reasonDetail: string = '' //執行細項值
  limitNo: string = ''//額度號值
  contact: string = ''//通知方式值
  contactContent: string//通知內容值
  reserveLimit: string //預佔額度
  creditMemo: string //本次執行說明
  creditTime: any//本次執行時間
  creditEmpno: any//執行員編
  bossCreditValue: string//主管核決值
  bossContent: string//主管覆核值
  bossTime: any//主管覆核時間
  bossEmpno: any//主管覆核員編
  useId: string //員編
  x: string
  applno: string //案編
  msg: string//訊息
  sort: string;
  checkTime: string;
  //頁面離開時觸發
  ngOnDestroy() {
  }

  ngOnInit(): void {
    this.sort = 'ascend';
    // this.applno = this.f01016Service.getApplno();
    this.page = this.f01016Service.getPage();
    if (sessionStorage.getItem('router') == '15' || sessionStorage.getItem('router') == '16' || sessionStorage.getItem('page') == '09') {
      this.page = '16';
    } else {
      this.page = '16chk';
    }
    this.applno = sessionStorage.getItem('applno');
    this.checkTime = sessionStorage.getItem('checkTime');
    this.getSuiManagerData();
    this.f01015Service.getSysTypeCode('LIMIT_TYPE').subscribe(data => {
      // this.limitTypeCode=data.rspBody.mappingList;
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.limitTypeCode.push({ value: codeNo, viewValue: desc })
      }
    });
    this.changereasonDetail()
    this.getlimitCode(this.executeValue)
    this.useId = BaseService.userId //進入員編
    this.getYNresult();
    this.getReason();
  }


  getSuiManagerData() {
    let jsonObject: any = {}
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId
    jsonObject['custId'] = this.custId
    jsonObject['checkTime'] = this.checkTime;
    this.f01016Service.getbaSuiManage(jsonObject).subscribe(data => {
      this.suiManageData = data.rspBody.baSuiManage;
      this.executeValue = this.suiManageData.executeType; //主管帶執行策略
      this.creditEmpno = this.suiManageData.creditEmpno; //主管帶本次執行員編
      this.limitNo = this.suiManageData.limitNo; //主管帶額度號
      this.custId = this.suiManageData.customerId; //主管帶customer_ID
      this.nationalId = this.suiManageData.nationalId; //主管帶身分證
      this.YNValue = this.suiManageData.contactYn; //主管帶通知客戶
      this.contact = this.suiManageData.contactType; //主管帶通知方式
      this.contactContent = this.suiManageData.contactContent != "null" ? this.suiManageData.contactContent : " ";//主管帶通知內容
      this.creditMemo = this.suiManageData.creditMemo; //主管帶creditMemo
      this.bossContent = this.suiManageData.bossContent;
      this.bossCreditValue = this.suiManageData.bossCredit;
      this.targetCustSource = data.rspBody.items
      this.creditMainSource = data.rspBody.creditMainlist
      this.mobile = this.suiManageData.mobile != "null" ? this.suiManageData.mobile : " "; //mobile
      if (this.executeValue == 'DWN') {
        this.reserveLimit = this.suiManageData.reserveLimit; //主管帶預佔額度
        this.limitNo = this.suiManageData.limitNo; //主管帶額度號
      }
      if (this.page == '16' || this.f01016Service.getPage() == '09' || this.page == '16chk') {
        this.limitNo = this.suiManageData.limitNo; //主管帶額度號
        this.creditTime = this.suiManageData.creditTime
        this.reasonValue = this.suiManageData.reasonCode; //主管帶執行原因
        this.reasonDetail = this.suiManageData.reasonDetail; //主管帶執行細項
        this.executeValue = this.suiManageData.executeType
        if (this.suiManageData.nationalId == 'undefined' || this.suiManageData.nationalId == 'null' || this.suiManageData.nationalId == null) {    //主管帶身分證
          this.nationalId = '';
        } else {
          this.nationalId = this.suiManageData.nationalId
        }
      }
    })
  }

  changeExecuteValueToChinese(value: string) {
    if (value == 'FRZ') {
      return 'FRZ-凍結'
    } else if (value == 'DWN') {
      return 'DWN-降額'
    } else if (value == 'HLD') {
      return 'HLD-解凍'
    }
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  //欄位驗證
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  getYNresult() {
    this.YNCode.push({ value: '', viewValue: '請選擇' })
    this.f01015Service.getSysTypeCode('YN').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.YNCode.push({ value: codeNo, viewValue: desc })
      }
    });
  }

  //取額度號下拉
  getlimitCode(value: string) {
    let jsonObject: any = {};
    // this.limitNo = '';
    // this.limitCode = [];
    jsonObject['nationalId'] = this.nationalId
    jsonObject['custId'] = this.custId
    if (value == 'FRZ' || value == 'DWN') {
      this.f01015Service.getImpertmentParameter(jsonObject).subscribe(data => {
        this.limitCode.push({ value: '', viewValue: '請選擇' })
        for (const jsonObj of data.rspBody.limitNoList) {
          const codeNo = jsonObj;
          const desc = jsonObj;
          this.limitCode.push({ value: codeNo, viewValue: desc });
        }
      })
    } else if (value == 'HLD') {
      this.f01015Service.getImpertmentParameter2(jsonObject).subscribe(data => {
        // this.limitNo = '';
        // this.limitCode = [];
        for (const row of data.rspBody.items) {
          const codeNo = row;
          const desc = row;
          this.limitCode.push({ value: codeNo, viewValue: desc })
        }
      })
      this.limitCode = []
    }
  }

  //輸入加千分位
  data_number(p: string) {
    p = p.replace(/,/g, "")
    if (p != null) {
      p = p.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    this.reserveLimit = p;
  }

  //儲存前處理千分位
  Cut(s: string) {
    if (s != null) {
      s = s.replace(/,/g, "")
    }
    return s
  }

  //本次原因執行取得中文
  test(key: string) {
    for (const row of this.reasonCode) {
      if (key == row.value) {
        return row.viewValue
      }
    }
  }

  //取本次執行原因下拉
  getReason() {
    let jsonObject: any = {};
    this.reasonCode.push({ value: '', viewValue: '請選擇' })
    this.f01015Service.getReturn('f01/f01015', jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.adrCodelist) {
        const codeNo = jsonObj.reasonCode;
        const desc = jsonObj.reasonDesc;
        this.reasonCode.push({ value: codeNo, viewValue: desc });
      }
    });
  }

  //取本次執行原因細項下拉
  changereasonDetail() {
    let jsonObject: any = {};
    // this.reasonDetail = '';
    jsonObject['reasonCode'] = this.reasonValue
    this.reasonDetailCode = [];
    this.executeCode = [];
    this.limitCode = [];
    // this.reasonDetail = "";
    this.reasonDetailCode.push({ value: '', viewValue: '請選擇' })
    this.f01015Service.getReturn('f01/f01015action2', jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.items) {
        const codeNo = jsonObj.reasonCode;
        const desc = jsonObj.reasonDesc;
        this.reasonDetailCode.push({ value: codeNo, viewValue: desc });
      }
    });
    if (this.reasonValue == 'A' || this.reasonValue == 'C') {
      return this.executeCode = [
        { value: '', viewValue: '請選擇' },
        { value: 'FRZ', viewValue: 'FRZ-凍結' },
      ];
    }
    else if (this.reasonValue == 'B' || this.reasonValue == 'D') {
      return this.executeCode = [
        { value: '', viewValue: '請選擇' },
        { value: 'HLD', viewValue: 'HLD-解凍' },
      ];
    } else {
      return this.executeCode = [
        { value: '', viewValue: '請選擇' },
        { value: 'DWN', viewValue: 'DWN-降額' },
      ];
    }
  }

  //+逗號
  toCurrency(amount: number) {
    this.x = '';
    this.x = (amount + "")
    if (this.x != null) {
      this.x = this.x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return this.x
    // return amount != null ? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }

  //主管送出
  save() {
    let jsonObject: any = {};
    jsonObject['creditEmpno'] = this.useId
    jsonObject['personMainData'] = this.targetCustSource
    jsonObject['reasonCode'] = this.reasonValue //本次執行原因
    jsonObject['reasonDetail'] = this.reasonDetail //本次執行原因細項
    jsonObject['custId'] = this.custId
    jsonObject['excuteType'] = this.executeValue //本次執行措施策略
    jsonObject['limitNo'] = this.limitNo //選擇額度號
    jsonObject['reserveLimit'] = this.reserveLimit != "" ? this.Cut(this.reserveLimit) : "0"; //預佔額度
    jsonObject['contactYn'] = this.YNValue //通知客戶
    jsonObject['contactType'] = this.contact //通知方式
    jsonObject['contactContent'] = this.contactContent //通知內容
    jsonObject['creditMemo'] = this.creditMemo //本次執行說明
    jsonObject['mobile'] = this.mobile //本次執行說明
    let msg: string = "";
    this.f01015Service.update(jsonObject).subscribe(data => {
      msg = data.rspMsg
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msg }
      });
    })
    setTimeout(() => {
      this.clear()
    }, 3000);
  }

  //主管覆核
  managerSave() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno
    jsonObject['custId'] = this.custId
    jsonObject['reasonDesc'] = this.test(this.reasonValue) //本次執行原因中文
    jsonObject['bossContent'] = this.bossContent //主管覆核
    jsonObject['bossCredit'] = this.bossCreditValue //主管核決
    jsonObject['bossEmpno'] = this.useId //主管員編
    jsonObject['reserveLimit'] = this.reserveLimit //預佔額度
    let msg = "";
    this.f01015Service.update2(jsonObject).subscribe(data => {
      msg = data.rspMsg
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msg }
      });
      this.router.navigate(['./F01016']);
    })

  }

  //清除
  clear() {
    this.targetCustSource = null;
    this.creditMainSource = null;
    this.nationalId = "";
    this.mobile = "";
    this.custId = "";
    this.reasonValue = "";
    this.reasonDetail = "";
    this.executeValue = "";
    this.limitNo = "";
    this.reserveLimit = null;
    this.YNValue = "";
    this.contact = "";
    this.contactContent = "";
    this.creditTime = "";
    this.creditEmpno = "";
    this.creditMemo = "";
  }

  //透過案編跳轉至複審
  toCalloutPage(applno: string) {
    sessionStorage.setItem('applno', applno);
    sessionStorage.setItem('nationalId', this.nationalId);
    sessionStorage.setItem('custId', this.custId);
    sessionStorage.setItem('search', 'Y');
    sessionStorage.setItem('winClose', 'Y');
    sessionStorage.setItem('level', '3');
    sessionStorage.setItem('searchUserId', BaseService.userId);
    sessionStorage.setItem('searchEmpName', BaseService.empName);
    sessionStorage.setItem('searchEmpId', BaseService.empId);
    sessionStorage.setItem('router', '16');
    // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
    sessionStorage.setItem('page', '2');
    //開啟徵審主畫面
    let safeUrl = '';
    if (applno.includes('D')) {
      safeUrl = this.f01015Service.getNowUrlPath("/#/F01009/F01009SCN1");
    } else if (applno.includes('G')) {
      safeUrl = this.f01015Service.getNowUrlPath("/#/F01016/F01016SCN1");
    }
    let url = window.open(safeUrl);
    this.menuListService.setUrl({
      url: url
    });

    sessionStorage.setItem('winClose', 'N');
    sessionStorage.setItem('search', 'N');
    sessionStorage.setItem('check', 'N');
    sessionStorage.setItem('applno', this.applno);
    sessionStorage.removeItem('searchUserId');
    sessionStorage.removeItem('searchEmpName');
    sessionStorage.removeItem('searchEmpId');
  }
  //額度號轉換中文
  limitTypeChange(string: string) {
    for (let row of this.limitTypeCode) {
      if (row.value == string) {
        return row.viewValue
      }
    }
    return string;
  }

  getCreditDesc(value: string) {
    for (let items of this.f01015Service.creditDescCode) {
      if (items.value == value) {
        return items.viewValue
      }
    }
    return value;
  }

  checkDescFn(value: string) {
    return value == '1' || value.includes('2') || value.includes('3') ? '' : value + '-';
  }

}
