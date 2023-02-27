import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from '../base.service';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { F02001Service } from '../f02001/f02001.service';
import { MenuListService } from '../menu-list/menu-list.service';
import { F02005Service } from './f02005.service';

// Jay 歷史案件查詢
interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f02005',
  templateUrl: './f02005.component.html',
  styleUrls: ['./f02005.component.css', '../../assets/css/f02.css']
})

export class F02005Component implements OnInit {
  applno: string = ''; //案件編號
  national_ID: string = ''; //身分證字號
  cust_ID: string = ''; //客戶ID
  cust_CNAME: string = ''; //客戶姓名
  l3EMPNO: string = ''; //徵信員
  credit_RESULT: sysCode[] = []; //審核結果陣列
  credit_RESULT_Value: string = '';//審核結果值
  status_DESC: sysCode[] = []; //案件狀態
  status_DESC_Value: string = '';//案件狀態值
  cust_FLAG: sysCode[] = []; //客群標籤
  cust_FLAG_Value: string = '';//客群標籤值
  risk_GRADE: sysCode[] = [];//風險等級分群
  risk_GRADE_Value: string = '';//風險等級分群值
  mobilePhone: string = '';//手機
  residencePhone: string = '';//住宅電話
  workPhone: string = '';//公司電話
  Email: string = '';//信箱
  IpAddress: string = '';
  company: string = '';//公司名稱
  apply_TIME: [Date, Date];//甄審進件日期
  proof_DOCUMENT_TIME: [Date, Date];//上傳財力日期
  sign_UP_TIME: [Date, Date];//簽約完成日期
  statusDescSecond: sysCode[] = [];//案件狀態第二層
  statusDescSecondValue: string = '';//案件狀態值第二層
  l3EMPNOList: sysCode[] = [];//徵信員員編陣列
  productList :sysCode[] = [];//產品名稱陣列
  product_NAME: string = '';//產品名稱
  quantity: number;
  pageSize = 50;
  pageIndex = 1;
  jsonObject: any = {};
  resultData = [];
  newData: any[] = [];
  total: number;
  firstFlag = 1;
  sortArry = ['ascend', 'descend']
  sort: string;
  order: string;
  sor: string;
  x: string;
  statusDetailCode: sysCode[] = [];
  constructor(
    private f02005Service: F02005Service,
    private router: Router,
    public pipe: DatePipe,
    public nzI18nService: NzI18nService,
    public dialog: MatDialog,
    private f02001Service: F02001Service,
    private menuListService: MenuListService,
  ) {
    this.nzI18nService.setLocale(zh_TW)
  }

  ngOnInit(): void {
    this.getStatusDesc();
    this.getCreditResult();
    this.getl3EMPNO();
    this.getCustFlag();
    this.getRiskGrade();
    this.quantity = 0;
    // 查詢案件分類
    this.f02005Service.getSysTypeCode('STATUS_DETAIL').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.statusDetailCode.push({ value: codeNo, viewValue: desc })
      }
    });

  }

  getStatusDesc() {
    this.f02005Service.getSysTypeCode('STATUS_CODE').subscribe(data => {

      this.status_DESC.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj['codeNo'];
        const desc = jsonObj['codeDesc'];
        this.status_DESC.push({ value: codeNo, viewValue: desc })
      }
    });
  }
  getCustFlag()//客群標籤
  {
    this.f02005Service.getSysTypeCode('CUST_TAG').subscribe(data => {
      this.cust_FLAG.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj['codeNo'];
        const desc = jsonObj['codeDesc'];
        this.cust_FLAG.push({ value: codeNo, viewValue: desc })
      }
    });
  }
  getRiskGrade() //風險
  {
    this.f02005Service.getSysTypeCode('RISK_GROUP').subscribe(data => {
      this.risk_GRADE.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj['codeNo'];
        const desc = jsonObj['codeDesc'];
        this.risk_GRADE.push({ value: codeNo, viewValue: desc })
      }
    });
  }
  //狀態第二層
  changeStatsCode(codeTag: string) {
    this.statusDescSecond = [];
    let jsonObject: any = {};
    jsonObject['statusDesc'] = codeTag;
    if (this.status_DESC_Value == '') {
      this.statusDescSecondValue = '';
    }
    this.f02001Service.changeStatsCode(jsonObject).subscribe(data => {
      this.statusDescSecond.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody) {
        const value = jsonObj['codeNo'];
        const viewValue = jsonObj['codeNo'] + jsonObj['codeDesc'];
        this.statusDescSecond.push({ value: value, viewValue: viewValue })
      }
    });
  }
  getCreditResult() {
    this.f02005Service.getSysTypeCode('CREDIT_RESULT').subscribe(data => {

      this.credit_RESULT.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj['codeNo'];
        const desc = jsonObj['codeDesc'];
        this.credit_RESULT.push({ value: codeNo, viewValue: desc })
      }
    });
  }

  getl3EMPNO()//取得徵信員員編下拉
  {
    this.f02005Service.getStatusDesc().subscribe(data => {
      this.l3EMPNOList.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.l3EmpNoList) {
        const value = jsonObj['EMP_NO'];
        const viewValue = jsonObj['EMP_NO'] + jsonObj['EMP_NAME'];
        this.l3EMPNOList.push({ value: value, viewValue: viewValue })
      }
      this.productList.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.prodCodeAndName) {
        const codeNo = jsonObj['PROD_CODE'];
        const desc = jsonObj['PROD_NAME'];
        this.productList.push({ value: codeNo, viewValue: desc })
      }
    });
  }

  dateNull(t: [Date, Date], name: string) {

    if (t.length < 1) {
      switch (name) {
        case 'apply_TIME':
          this.apply_TIME = null;
          break;
        case 'proof_DOCUMENT_TIME':
          this.proof_DOCUMENT_TIME = null;
          break;
        case 'sign_UP_TIME':
          this.sign_UP_TIME = null;
          break;
      }
    }
  }
  Clear()//清除
  {
    this.newData = [];
    this.applno = '';
    this.national_ID = '';
    this.cust_ID = '';
    this.cust_CNAME = '';
    this.mobilePhone = '';
    this.residencePhone = '';
    this.status_DESC_Value = '';
    this.cust_FLAG_Value = '';
    this.risk_GRADE_Value = '';
    this.l3EMPNO = '';
    this.credit_RESULT_Value = '';
    this.workPhone = '';
    this.Email = '';
    this.IpAddress = '';
    this.company = '';
    this.apply_TIME = null;
    this.proof_DOCUMENT_TIME = null;
    this.sign_UP_TIME = null;
    this.resultData = [];
    this.firstFlag = 1;
    this.quantity = 0;
    this.statusDescSecondValue = '';
    this.order = '';
    this.sor = '';
    this.product_NAME='';

  }
  select() {
    if (this.applno == '' && this.national_ID == '' && this.cust_ID == '' && this.cust_CNAME == '' && this.mobilePhone == '' && this.residencePhone == '' && this.status_DESC_Value == ''
      && this.cust_FLAG_Value == '' && this.risk_GRADE_Value == '' && this.l3EMPNO == '' && this.statusDescSecondValue == '' && this.credit_RESULT_Value == '' && this.workPhone == '' && this.Email == '' && this.IpAddress == '' && this.company == ''
      && this.apply_TIME == null && this.proof_DOCUMENT_TIME == null && this.sign_UP_TIME == null && this.product_NAME == '') {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請至少選擇一項條件" }
      });
    }
    else {
      this.changePage();
      this.selectData(this.pageIndex, this.pageSize, '', '');
    }
  }

  changePage() {
    this.pageIndex = 1;
  }

  selectData(pageIndex: number, pageSize: number, na: string, sort: string) {


    this.jsonObject['page'] = pageIndex;
    this.jsonObject['per_page'] = pageSize;
    let url = "f02/f02001action3";
    this.jsonObject['applno'] = this.applno;//案件編號
    this.jsonObject['nationalID'] = this.national_ID;//身分證字號
    this.jsonObject['custID'] = this.cust_ID;//客戶ID
    this.jsonObject['cuCname'] = this.cust_CNAME;//客戶姓名
    this.jsonObject['l3EmpNo'] = this.l3EMPNO;//徵信員員編姓名
    this.jsonObject['creditResult'] = this.credit_RESULT_Value;//審核結果
    this.jsonObject['statusDesc'] = this.status_DESC_Value;//案件狀態--有修改第一層
    this.jsonObject['opDesc'] = this.statusDescSecondValue;//案件狀態--有修改第二層
    this.jsonObject['custFlag'] = this.cust_FLAG_Value;//客群標籤
    this.jsonObject['riskGrade'] = this.risk_GRADE_Value;//風險等級分群
    this.jsonObject['cuCpTel'] = this.workPhone;//公司電話
    this.jsonObject['cuCpName'] = this.company;//公司名稱
    this.jsonObject['cuMTel'] = this.mobilePhone;//手機
    this.jsonObject['hTel'] = this.residencePhone;//住宅電話
    this.jsonObject['cuIpAddr'] = this.IpAddress;//IpAddress
    this.jsonObject['cuEmail'] = this.Email;//Email
    this.jsonObject['prodCode'] = this.product_NAME;//產品名稱
    if (na == '') {
      this.jsonObject['orderByValue'] = na;
      this.jsonObject['sortValue'] = sort;
    }
    else {
      this.jsonObject['orderByValue'] = na;
      this.jsonObject['sortValue'] = sort;
    }
    if (this.national_ID != '' || this.cust_ID != '') {

      if (this.apply_TIME != null)//進件日期
      {

        if (this.dealwithData365(this.apply_TIME)) {
          this.jsonObject['applyEndTimeStart'] = this.pipe.transform(new Date(this.apply_TIME[0]), 'yyyyMMdd');
          this.jsonObject['applyEndTimeEnd'] = this.pipe.transform(new Date(this.apply_TIME[1]), 'yyyyMMdd');
        }
        else {

          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "進件日期查詢區間最多一年內!" }

          });
          return;
        }

      }
      else {

        this.jsonObject['applyEndTimeStart'] = '';
        this.jsonObject['applyEndTimeEnd'] = '';
      }

      if (this.proof_DOCUMENT_TIME != null)//上傳財力日期
      {
        if (this.dealwithData365(this.proof_DOCUMENT_TIME)) {
          this.jsonObject['proofDocumentTimeStart'] = this.pipe.transform(new Date(this.proof_DOCUMENT_TIME[0]), 'yyyyMMdd');
          this.jsonObject['proofDocumentTimeEnd'] = this.pipe.transform(new Date(this.proof_DOCUMENT_TIME[1]), 'yyyyMMdd');

        }
        else {

          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "上傳財力日期查詢區間最多一年內!" }
          });
          return;
        }
      }
      else {
        this.jsonObject['proofDocumentTimeStart'] = '';
        this.jsonObject['proofDocumentTimeEnd'] = '';
      }

      if (this.sign_UP_TIME != null)//簽約完成日期
      {
        if (this.dealwithData365(this.sign_UP_TIME)) {
          this.jsonObject['signUpTimeStart'] = this.pipe.transform(new Date(this.sign_UP_TIME[0]), 'yyyyMMdd');
          this.jsonObject['signUpTimeEnd'] = this.pipe.transform(new Date(this.sign_UP_TIME[1]), 'yyyyMMdd');
        }
        else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "簽約完成日期查詢區間最多一年內!" }
          });
          return;
        }

      }
      else {
        this.jsonObject['signUpTimeStart'] = '';
        this.jsonObject['signUpTimeEnd'] = '';
      }

    }
    else {
      if (this.apply_TIME != null)//進件日期
      {
        if (this.dealwithData90(this.apply_TIME)) {
          this.jsonObject['applyEndTimeStart'] = this.pipe.transform(new Date(this.apply_TIME[0]), 'yyyyMMdd');
          this.jsonObject['applyEndTimeEnd'] = this.pipe.transform(new Date(this.apply_TIME[1]), 'yyyyMMdd');
        }
        else {
          return;
        }

      }
      else {
        this.jsonObject['applyEndTimeStart'] = '';
        this.jsonObject['applyEndTimeEnd'] = '';
      }

      if (this.proof_DOCUMENT_TIME != null)//上傳財力日期
      {
        if (this.dealwithData90(this.proof_DOCUMENT_TIME)) {
          this.jsonObject['proofDocumentTimeStart'] = this.pipe.transform(new Date(this.proof_DOCUMENT_TIME[0]), 'yyyyMMdd');
          this.jsonObject['proofDocumentTimeEnd'] = this.pipe.transform(new Date(this.proof_DOCUMENT_TIME[1]), 'yyyyMMdd');
        }
        else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "上傳財力日期查詢區間最多三個內!" }
          });
          return;
        }

      }
      else {
        this.jsonObject['proofDocumentTimeStart'] = '';
        this.jsonObject['proofDocumentTimeEnd'] = '';
      }
      if (this.sign_UP_TIME != null)//簽約完成日期
      {
        if (this.dealwithData90(this.sign_UP_TIME)) {
          this.jsonObject['signUpTimeStart'] = this.pipe.transform(new Date(this.sign_UP_TIME[0]), 'yyyyMMdd');
          this.jsonObject['signUpTimeEnd'] = this.pipe.transform(new Date(this.sign_UP_TIME[1]), 'yyyyMMdd');
        }
        else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "簽約完成日期查詢區間最多三個內!" }
          });
          return;
        }
      }
      else {
        this.jsonObject['signUpTimeStart'] = '';
        this.jsonObject['signUpTimeEnd'] = '';
      }

    }

    this.f02005Service.inquiry(url, this.jsonObject).subscribe(data => {
      console.log(data)
      if (data.rspBody.size == 0) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        })
        this.resultData = [];
        this.newData = [];
        this.quantity = 0;
      }
      else {

        this.resultData = data.rspBody.item;
        this.total = data.rspBody.size;
        this.quantity = data.rspBody.size;
        this.firstFlag = 2;
        this.newData = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);


      }

    }
    )
  }
  dealwithData14(time: Date) {
    var startDate
    startDate = new Date();
    return new Date(Date.now() - (13 * 24 * 60 * 60 * 1000));

  }
  dealwithData365(stime: any) {
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
  dealwithData90(stime: any) {
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
        this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.APPLNO.localeCompare(b.APPLNO))
          : this.resultData.sort((a, b) => b.APPLNO.localeCompare(a.APPLNO));
        this.newData = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
        break;
    }
  }
  onQueryParamsChange(params: NzTableQueryParams): void {
    // 判斷是否為第一次進頁面
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      if (this.firstFlag != 1) {
        this.pageIndex = pageIndex;
        this.newData = this.f02001Service.getTableDate(pageIndex, this.pageSize, this.resultData);
        // this.selectData(pageIndex, this.pageSize, this.order, this.sor);
      }
    }
  }
  Detail(id: string, nationalId: string, cuCname: string, custId: string)//明細
  {
    let jsonObject: any = {};
    jsonObject['applno'] = id;
    jsonObject['nationalId'] = nationalId;
    jsonObject['searchKind'] = '5';//查詢種類1:案件查詢2:客服案件查詢3:補件資訊查詢
    jsonObject['cuCname'] = cuCname;//客戶姓名CU_CNAME
    let apiurl = 'f02/f02005action6';
    this.f02005Service.postJson(apiurl, jsonObject).subscribe(data => {

      if (data.rspMsg == "success") {
        sessionStorage.setItem('applno', id);
        sessionStorage.setItem('nationalId', nationalId);
        sessionStorage.setItem('custId', custId);
        sessionStorage.setItem('search', 'Y');
        sessionStorage.setItem('queryDate', '');
        sessionStorage.setItem('winClose', 'Y');
        // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
        sessionStorage.setItem('page', '0');
        sessionStorage.setItem('stepName', '0');

        sessionStorage.setItem('searchUserId', BaseService.userId);
        sessionStorage.setItem('searchEmpName', BaseService.empName);
        sessionStorage.setItem('searchEmpId', BaseService.empId);

        //開啟徵審主畫面
        let safeUrl = this.f02005Service.getNowUrlPath("/#/F01002/F01002SCN1");
        let url = window.open(safeUrl);
        this.menuListService.setUrl({
          url: url
        });

        sessionStorage.setItem('winClose', 'N');
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
  // 轉成中文
  getType(codeVal: string): string {
    for (const data of this.statusDetailCode) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }
  data_number(p: number)//千分號
  {
    this.x = '';
    this.x = (p + "")
    if (this.x != null) {
      this.x = this.x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return this.x
  }

}
