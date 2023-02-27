import { OptionsCode } from './../interface/base';
import { Component, OnInit } from '@angular/core';
import { F02003Service } from './f02003.service';
import { DatePipe } from '@angular/common';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { F02001Service } from '../f02001/f02001.service';
import { BaseService } from '../base.service';
// Jay 複審案件查詢
interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f02003',
  templateUrl: './f02003.component.html',
  styleUrls: ['./f02003.component.css', '../../assets/css/f02.css']
})

export class F02003Component implements OnInit {

  constructor(private f02003Service: F02003Service,
     public pipe: DatePipe,
      public dialog: MatDialog,
      private f02001Service: F02001Service,) { }

  applno: string = ''; //案件編號
  nationalId: string = '';//身分證字號
  custId: string = '';//客戶ID
  custName: string = '';//客戶姓名
  total: number;
  loading = false;
  pageSize: number;
  pageIndex: number;
  l4EMPNO: string = '';//複審人員
  l4EMPNOArry: sysCode[] = [];//複審人員陣列
  input: string = '';//進件類型
  inputArry: sysCode[] = [];//進件類型陣列
  credit: string ='';//審核結果
  creditArry: sysCode[] = [];//審核結果陣列
  apply_TIME: [Date, Date];//進件日期
  credit_TIME: [Date, Date];//核決日期
  firstFlag = 1;
  custListFlag:string = '';//客戶名單身分註記
  custListFlagList :sysCode[] = [];//客戶名單身分註記陣列
  isEnd:string=''//是否結案
  YNcodeList :sysCode[] = [
    {value:'',viewValue:'請選擇'},
    {value:'Y',viewValue:'是'},
    {value:'N',viewValue:'否'}
  ];//是否結案陣列
  //test
  resultData = [];
  order: string;
  sortArry = ['ascend', 'descend']
  quantity: number;
  sor: string;
  newData: any[] = [];
  ngOnInit(): void {
    this.quantity = 0;
    this.review();
    this.getCREDIT();
    this.getINPUT();
    this.custListFlagList.push({ value: '', viewValue:'請選擇' })
    this.custListFlagList.push({ value: 'Y', viewValue:'Y' })
    this.custListFlagList.push({ value: 'N', viewValue:'N' })
  }

  changePage() {
    this.pageIndex = 1;
    this.pageSize = 50;
    this.total = 1;
  }

  search(pageIndex: number, pageSize: number) {
    let url = "f02/f02003action1"
    let jsonObject: any = {};
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['custId'] = this.custId;
    jsonObject['custCname'] = this.custName;
    jsonObject['l4EmpNo'] = this.l4EMPNO;
    jsonObject['creditResult'] = this.credit;
    jsonObject['inputType'] = this.input;
    jsonObject['custListFlag'] = this.custListFlag;
    jsonObject['isEnd'] = this.isEnd;
    if (this.nationalId != '' || this.custId != '')
    {

      if (this.apply_TIME != null)//進件日期
      {
        if (this.dealwithData365(this.apply_TIME)) {
          jsonObject['startTimeStart'] = this.pipe.transform(new Date(this.apply_TIME[0]), 'yyyyMMdd');
          jsonObject['startTimeEnd'] = this.pipe.transform(new Date(this.apply_TIME[1]), 'yyyyMMdd');
        }
        else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "進件日期查詢區間最多一年內!" }
          });
          return;
        }
      }
      else {
        jsonObject['startTimeStart'] = '';
        jsonObject['startTimeEnd'] = '';
      }
      if (this.credit_TIME != null)//核決日期
      {
        if (this.dealwithData365(this.credit_TIME)) {
          jsonObject['creditTimeStart'] = this.pipe.transform(new Date(this.credit_TIME[0]), 'yyyyMMdd');
          jsonObject['creditTimeEnd'] = this.pipe.transform(new Date(this.credit_TIME[1]), 'yyyyMMdd');
        }
        else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "核決日期查詢區間最多一年內!" }
          });
          return;
        }
      }
      else {
        jsonObject['creditTimeStart'] = '';
        jsonObject['creditTimeEnd'] = '';
      }

    }
    else {
      if (this.apply_TIME != null)//進件日期
      {
        if (this.dealwithData90(this.apply_TIME)) {
          jsonObject['startTimeStart'] = this.pipe.transform(new Date(this.apply_TIME[0]), 'yyyyMMdd');
          jsonObject['startTimeEnd'] = this.pipe.transform(new Date(this.apply_TIME[1]), 'yyyyMMdd');
        }
        else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "進件日期查詢區間最多三個月內!" }
          });
          return;
        }
      }
      else {
        jsonObject['startTimeStart'] = '';
        jsonObject['startTimeEnd'] = '';
      }
      if (this.credit_TIME != null)//核決日期
      {
        if (this.dealwithData90(this.credit_TIME)) {
          jsonObject['creditTimeStart'] = this.pipe.transform(new Date(this.credit_TIME[0]), 'yyyyMMdd');
          jsonObject['creditTimeEnd'] = this.pipe.transform(new Date(this.credit_TIME[1]), 'yyyyMMdd');
        }
        else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "核決日期查詢區間最多三個月內!" }
          });
          return;
        }
      }
      else {
        jsonObject['creditTimeStart'] = '';
        jsonObject['creditTimeEnd'] = '';
      }

    }
    console.log(jsonObject)
    this.f02003Service.inquiry(url,jsonObject).subscribe(data=>{
      this.newData =[];
      this.quantity = 0;
      if(data.rspMsg =='error')
      {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "筆數大於五百請增加查詢條件，重新查詢" }})

      }
      else if(data.rspBody.size == 0)
      {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }})
      }
      else
      {
        this.resultData = data.rspBody.item
        this.newData = this.f02001Service.getTableDate(pageIndex, this.pageSize,this.resultData);
        this.quantity = data.rspBody.size
        this.total=data.rspBody.size
        this.firstFlag = 2;
      }
    })

  }

  clear() {
    this.applno = '';
    this.nationalId = '';
    this.isEnd='';
    this.custId = '';
    this.custName = '';
    this.l4EMPNO = '';
    this.input = '';
    this.credit = '';
    this.apply_TIME = null;
    this.credit_TIME = null;
    this.resultData = [];
    this.newData = [];
    this.order = '';
    this.sor = '';
    this.quantity = 0;
    this.custListFlag = '';
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
     // 判斷是否為第一次進頁面
      const { pageSize, pageIndex } = params;
      if (this.pageIndex !== pageIndex)
      {
        if (this.firstFlag != 1) {
        // const { pageSize, pageIndex } = params;
        this.pageIndex = pageIndex;
        this.newData = this.f02001Service.getTableDate(pageIndex, this.pageSize, this.resultData);
        }
        }
      }
  review() {
    let url = "f02/f02003"
    let jsonObject: any = {};
    this.f02003Service.inquiry(url, jsonObject).subscribe(data => {
      this.l4EMPNOArry.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody) {
        const codeNo = jsonObj.EMP_NO;
        const desc = jsonObj.EMP_NAME;
        this.l4EMPNOArry.push({ value: codeNo, viewValue:codeNo+desc })
      }

    })
  }

  changeStatsCode(codeTag: string) {

  }
  dateNull(t: [Date, Date], name: string)
  {
    if (t.length < 1) {
      switch (name) {
        case 'apply_TIME':
          this.apply_TIME = null;
          break;
        case 'credit_TIME':
          this.credit_TIME = null;
          break;
      }
    }
  }
  Detail(id: string, nationalId: string, custId: string,cuCname:string)//明細
  {
    let jsonObject: any = {};
    jsonObject['applno'] = id;
    jsonObject['nationalID'] = nationalId;
    jsonObject['cuCname'] = cuCname;//客戶姓名CU_CNAME
    let apiurl = 'f02/f02003action2';
    this.f02003Service.inquiry(apiurl, jsonObject).subscribe(data => {
      if (data.rspMsg == "success")
      {
        sessionStorage.setItem('applno', id);
        sessionStorage.setItem('nationalId', nationalId);
        sessionStorage.setItem('custId', custId);
        sessionStorage.setItem('search', 'Y');
        sessionStorage.setItem('queryDate', '');
        sessionStorage.setItem('winClose', 'Y');
        // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
        sessionStorage.setItem('page', '03');
        sessionStorage.setItem('stepName', '0');

        sessionStorage.setItem('searchUserId',BaseService.userId);
        sessionStorage.setItem('searchEmpName',BaseService.empName);
        sessionStorage.setItem('searchEmpId',BaseService.empId);

        //開啟徵審主畫面
        let safeUrl = this.f02003Service.getNowUrlPath("/#/F01009/F01009SCN1");
        window.open(safeUrl);

        sessionStorage.setItem('winClose', 'N');//window.open開啟B視窗後 將原本A視窗session值做調整
        sessionStorage.setItem('search', 'N');

        sessionStorage.removeItem('searchUserId');
        sessionStorage.removeItem('searchEmpName');
        sessionStorage.removeItem('searchEmpId');
      } else {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查詢案件紀錄異常" }
        });
      }

    })

  }
  getCREDIT()//審核結果
  {
    this.f02003Service.getSysTypeCode('BW_MGR_STATUS')
      .subscribe(data => {
        this.creditArry.push({ value: '', viewValue: '請選擇' })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeNo+'-'+jsonObj.codeDesc;
          this.creditArry.push({ value: codeNo, viewValue: desc })
        }
      });
  }
  getINPUT()//進件類型
  {
    this.f02003Service.getSysTypeCode('BW_INPUT_TYPE')
      .subscribe(data => {
        this.inputArry.push({ value: '', viewValue: '請選擇' })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.inputArry.push({ value: codeNo, viewValue: desc })
        }
      });
  }
  dealwithData365(stime: any)//判斷一年時間
   {
    var startDate, endDate;
    startDate = new Date(stime[0]);
    endDate = new Date(stime[1]);
    if ((endDate - startDate) / 1000 / 60 / 60 / 24 > 365) {
      return false;
    }
    else {
      return true;
    }
  }
  dealwithData90(stime: any)//判斷三個月時間
   {
    var startDate, endDate;
    startDate = new Date(stime[0]);
    endDate = new Date(stime[1]);
    if ((endDate - startDate) / 1000 / 60 / 60 / 24 > 90) {
      return false;
    }
    else {
      return true;
    }
  }
  conditionCheck() //擋空白查詢
  {
    if (this.applno == '' && this.nationalId == '' && this.custId == '' && this.custName == '' && this.l4EMPNO == '' && this.input == ''
      && this.credit == '' && this.apply_TIME == null && this.credit_TIME == null && this.custListFlag==''&& this.isEnd == ''
    ) {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請至少選擇一項條件" }
      });
    } else {
      this.changePage();
      this.search(this.pageIndex, this.pageSize);
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
        this.resultData = e === 'ascend' ? this.resultData.sort((a,b) => a.APPLNO.localeCompare(b.APPLNO))
        : this.resultData.sort((a,b) => b.APPLNO.localeCompare(a.APPLNO));
        this.newData = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
    }
    // this.resultData = e === 'ascend' ? this.resultData.sort(
    //   (a, b) => a.START_TIME.localeCompare(b.START_TIME)) : this.resultData.sort((a, b) => b.START_TIME.localeCompare(a.START_TIME))

  }
}

