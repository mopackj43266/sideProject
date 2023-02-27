import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, LOCALE_ID } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { MenuListService } from 'src/app/menu-list/menu-list.service';
import { F06002Service } from '../f06002.service';
import { F06002editComponent } from '../f06002edit/f06002edit.component';
import { F01006restartComponent } from '../../f01006/f01006restart/f01006restart.component';
import { F01006Service } from '../../f01006/f01006.service';
import { formatDate } from '@angular/common'
import { DisabledTimeFn } from 'ng-zorro-antd/date-picker';

interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f06002pickup',
  templateUrl: './f06002pickup.component.html',
  styleUrls: ['./f06002pickup.component.css', '../../../assets/css/f03.css']
})
export class F06002pickupComponent implements OnInit {
  hour = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  addreset$: Subscription //rxjs訂閱者
  reset$: Subscription //rxjs訂閱者
  isChk: boolean = false
  userId: string//登陸員編
  histroyOutbound: any//Outbound歷史紀錄
  genderCode: sysCode[] = []; //性別下拉
  genderValue: string //性別值
  educationCode: sysCode[] = [];//學歷下拉
  residenceCode: sysCode[] = [];//現居年數
  educationValue: string //學歷值
  cuRdtlCode: sysCode[] = [];//居住類型下拉
  cuRdtlValue: string //居住類型值
  livingStatusCode: sysCode[] = [];//住宅所有權下拉
  livingStatusValue: string //住宅所有權值
  peiodCode: sysCode[] = []; //分期下拉
  peiodValue: string; //分期下拉
  sameEmpno: boolean = false
  opid: string// OPID
  custType: string //客戶原因
  //本次Outbound註記
  isConnectCode: sysCode[] = [];//是否接通下拉
  isConnectValue: string = "";//是否接通
  notConnectCode: sysCode[] = [];//未接通原因下拉
  notConnectValue: string = "";//未接通原因
  notConnectMemo: string;//未接通註記
  isContactNextCode: sysCode[] = [];//是否需再次聯繫下拉
  isContactNextValue: string = "";//是否需再次聯繫
  nextContactTime: string//預計下次聯繫時間
  nextContactTimeHour: string//預計下次聯繫時間
  custReasonCode: sysCode[] = [];//客戶原因下拉
  custReasonValue: string = "";//客戶原因
  custReasonMemo: string;//其他補充
  startValue: Date | null = null;
  pageSize: number = 10;
  pageIndex: number = 1;
  total: number;
  newData: any = [];
  firstFlag = 1;
  json: any

  //申請書欄位
  settleDate: Date;
  //客戶基本資料
  applno = sessionStorage.getItem('applno'); //案編
  nationalId: string//身分證
  page:string//頁數
  cuBirthday: string//生日
  cuSex: string//性別
  cuEducation: string//學歷
  cuMarriedStatus: string//婚姻狀況
  cuMTelIno: string//手機區碼
  cuMTel: string//手機號碼
  cuEmail: string//信箱
  cuHAddrCode: string//郵遞區號
  cuHAddr1: string//地址
  cuHTelIno: string//電話區碼
  cuHTel: string//電話號碼
  cuRdtl: string//居住類型
  livingStatus: string//住宅所有權
  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  newhistroyOutbound: any[] = [];
  customerInfoForm: FormGroup = this.fb.group({

    APPLNO: ['', []],      // 數位存款帳戶類型
    CU_CNAME: ['', []],      // 數位存款帳戶類型
    ACC_TYPE: ['', []],      // 數位存款帳戶類型
    NATIONAL_ID: ['', []],      // 身分證字號
    CU_SEX: ['', []],           // 性別
    CU_RDTL: ['', []],   // 居住類型
    CU_BIRTHDAY: ['', []],      // 生日
    CU_MARRIED_STATUS: ['', []],// 婚姻
    LIVING_STATUS: ['', []],    // 現居狀況
    CU_EDUCATION: ['', []],     // 學歷
    CU_H_ADDR_CODE: ['', []],   // 住宅郵區
    CU_H_ADDR1: ['', []],       // 住宅地址1
    CU_H_ADDR2: ['', []],       // 住宅地址2
    CU_H_TEL_INO: ['', []],     // 住宅電話區碼
    CU_H_TEL: ['', []],         // 住宅電話
    CU_EMAIL: ['', []],         // eMail
    CU_M_TEL: ['', []],         // 行動電話
    CU_M_TEL_INO: ['', []],         // 行動電話區碼

  });


  applicationData: FormGroup = this.fb.group({
    PROD_CODE: ['', []],      // 申請產品
    APRV_DEBT_AMT: ['', []],      // BT核准額度
    DSBSACCTNBR: ['', []],   // 撥款帳號
    RPAYACCTNBR: ['', []],      // 還款帳號
    APRV_INST_CASH_AMT: ['', []],// 現金撥款核准額度
    LNAPPAMT: ['', []],    // 現金撥款申請額度
    SETTLE_DATE: ['', []],     // 結清日
    PERIOD: ['', []],   // 期數
    CTR_MIN_PRD: ['', []],   // 期數低值
    CTR_MAX_PRD: ['', []],   // 期數高值
    WEB_API: ['', []],       // 每月還款金額
    TEST: ['', []],       // 每月還款金額


  })





  constructor(
    public dialogRef: MatDialogRef<F06002pickupComponent>,
    private f06002Service: F06002Service,
    private f01006Service: F01006Service,
    private menuListService: MenuListService,
    private router: Router,
    private fb: FormBuilder,
    private pipe: DatePipe,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.addreset$ = this.f06002Service.addreset$.subscribe((data) => {
      this.getData()

    });
    this.reset$ = this.f01006Service.restart$.subscribe((data) => {
      this.router.navigate(['./F06002']);
    });
  }

  ngOnInit(): void {
    this.userId = BaseService.userId;
    this.peiodValue = '';
    //取性別
    this.f06002Service.getSysTypeCode('GENDER')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.genderCode.push({ value: codeNo, viewValue: desc })
        }
      });

    //取學歷
    this.f06002Service.getSysTypeCode('EDUCATION')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.educationCode.push({ value: codeNo, viewValue: desc })
        }

      });

    //取居住類型
    this.f06002Service.getSysTypeCode('CU_RDTL')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.educationCode.push({ value: codeNo, viewValue: desc })
        }

      });
    //取現居狀況
    this.f06002Service.getSysTypeCode('LIVING_STATUS')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.livingStatusCode.push({ value: codeNo, viewValue: desc })
        }
      });

    //是否接通
    this.f06002Service.getSysTypeCode('YN')
      .subscribe(data => {
        this.isConnectCode.push({ value: "", viewValue: "請選擇" })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.isConnectCode.push({ value: codeNo, viewValue: desc })
        }

      });

    //未接通原因
    this.f06002Service.getSysTypeCode('OUTBOUND_NOT_CONNECT_CODE')
      .subscribe(data => {
        this.notConnectCode.push({ value: "", viewValue: "請選擇" })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.notConnectCode.push({ value: codeNo, viewValue: desc })
        }

      });
 //已居住年數
 this.f06002Service.getSysTypeCode('RESIDENCE_YEAR').subscribe(data => {
  for (const jsonObj of data.rspBody.mappingList) {
    const codeNo = jsonObj.codeNo;
    const desc = jsonObj.codeDesc;
    this.residenceCode.push({ value: codeNo, viewValue: desc })
  }
});
    //是否需再次聯繫
    this.f06002Service.getSysTypeCode('YN')
      .subscribe(data => {
        this.isContactNextCode.push({ value: "", viewValue: "請選擇" })
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.isContactNextCode.push({ value: codeNo, viewValue: desc })
        }
      });

    this.page = sessionStorage.getItem('page')
    console.log(this.page)
    this.custType = sessionStorage.getItem('custType')
    this.json = this.f06002Service.getSearchData
    console.log(this.json)
    this.custTypeChange()
    this.getData()
    this.getPeriodCode()
  }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);
  //欄位驗證
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' : '';

  }


  onSubmit() {
    console.log(this.customerInfoForm.value)
  }


  onChange(result: Date): void {

    console.log(this.nextContactTime)
    console.log(this.pipe.transform(new Date(result), 'yyyy-MM-dd HH:mm:ss'));
  }

  onOk(result: string): void {
    this.nextContactTime = result
    console.log('onOk', result);
  }

  //預計下次時間鎖起來
  disabledDateTime: DisabledTimeFn = () => ({
    nzDisabledHours: () => [],
    nzDisabledMinutes: () => this.range(1, 60),
    nzDisabledSeconds: () => this.range(1, 60),
  });


  //客戶原因判斷
  custTypeChange() {
    if (this.custType == 'O1') {

      this.f06002Service.getSysTypeCode('OUTBOUND_O1_CUST_REASON')
        .subscribe(data => {
          this.custReasonCode.push({ value: "", viewValue: "請選擇" })
          for (const jsonObj of data.rspBody.mappingList) {
            const codeNo = jsonObj.codeNo;
            const desc = jsonObj.codeDesc;
            this.custReasonCode.push({ value: codeNo, viewValue: desc })
          }
        });
    } else if (this.custType == 'O2') {

      this.f06002Service.getSysTypeCode('OUTBOUND_O2_CUST_REASON')
        .subscribe(data => {
          this.custReasonCode.push({ value: "", viewValue: "請選擇" })
          for (const jsonObj of data.rspBody.mappingList) {
            const codeNo = jsonObj.codeNo;
            const desc = jsonObj.codeDesc;
            this.custReasonCode.push({ value: codeNo, viewValue: desc })
          }
        });
    }
  }

  //期數下拉
  getPeriodCode() {

    const a: number = Number(sessionStorage.getItem('ctrtMinPrd'))
    const b: number = Number(sessionStorage.getItem('ctrtMaxPrd'))
    const total: number = Number(a / b)

    for (var i = 1; i <= total; i++) {
      const codeNo = i * 12;
      const codeNoString = codeNo.toString();
      const desc = i * 12;
      const descString = desc.toString();;
      this.peiodCode.push({ value: codeNoString, viewValue: descString })
    }
  }

  saveCustomerInfo() {
    let jsonObject: any = {};
    const baseUrl = "f06/f06002action5";
    jsonObject['applno'] = this.applno//案編
    jsonObject['nationalId'] = this.customerInfoForm.value.NATIONAL_ID //身分證
    jsonObject['cuBirthday'] = this.customerInfoForm.value.CU_BIRTHDAY//生日
    jsonObject['cuSex'] = this.customerInfoForm.value.CU_SEX//性別
    jsonObject['cuEducation'] = this.customerInfoForm.value.CU_EDUCATION//學歷
    jsonObject['cuRdtl'] = this.customerInfoForm.value.CU_RDTL//居住類型
    jsonObject['cuMarriedStatus'] = this.customerInfoForm.value.CU_MARRIED_STATUS//婚姻狀況
    jsonObject['cuMTelIno'] = this.customerInfoForm.value.CU_M_TEL_INO//手機區碼
    jsonObject['cuMTel'] = this.customerInfoForm.value.CU_M_TEL//手機號碼
    jsonObject['livingStatus'] = this.customerInfoForm.value.LIVING_STATUS//住宅所有權
    jsonObject['cuEmail'] = this.customerInfoForm.value.CU_EMAIL//信箱
    jsonObject['cuHAddrCode'] = this.customerInfoForm.value.CU_H_ADDR_CODE//郵遞區號
    jsonObject['cuHAddr1'] = this.customerInfoForm.value.CU_H_ADDR1//地址
    jsonObject['cuHTelIno'] = this.customerInfoForm.value.CU_H_TEL_INO//電話區碼
    jsonObject['cuHTel'] = this.customerInfoForm.value.CU_H_TEL//電話號碼
    this.f06002Service.inquiry(baseUrl, jsonObject).subscribe(data => {
      if (data.msgStr == '更新成功') {
        data.msgStr = '更新成功'
      }
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: data.msgStr }
      });
    })
  }

  // 歷史OutBound紀錄
  saveOutboundHistory() {
    const baseUrl = "f06/f06002action3";
    let jsonObject: any = {};
    for (var t of this.newhistroyOutbound) {
      jsonObject['notConnectCode'] = t.notConnectCode;
      jsonObject['isConnect'] = t.isConnect
      jsonObject['notConnectMemo'] = this.notConnectMemo
      jsonObject['isContactNext'] = t.isContactNext
      jsonObject['nextContactTime'] = this.pipe.transform(new Date(t.nextContactTime), 'yyyyMMdd');
      jsonObject['custReason'] = this.custReasonValue
      jsonObject['custReasonMemo'] = t.custReasonMemo
      jsonObject['rowId'] = t.rowId
    }

    this.f06002Service.inquiry(baseUrl, jsonObject).subscribe(data => {
      if (data.msgStr == '更新成功' || data.rspCode == '0000') {
        data.msgStr = '更新成功'
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.msgStr }
        });
        this.onNoClick()
      }
      else {
        const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: data.msgStr } });
        return
      }
    })

    return this.isChk = false

  }
  getData() {
    const url = 'f06/f06002action2';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno
    jsonObject['custType'] = sessionStorage.getItem('custType')
    this.f06002Service.getData(url, jsonObject).subscribe(data => {
      console.log(data)
      this.histroyOutbound = data.rspBody.histroyOutbound
      this.total = data.rspBody.histroyOutbound.length
      this.newData = this.f01006Service.getTableDate(this.pageIndex, this.pageSize, this.histroyOutbound)
      this.firstFlag = 2;
      //客戶基本資料
      this.customerInfoForm.patchValue({ APPLNO: data.rspBody.customerInfo.applno })
      this.customerInfoForm.patchValue({ CU_CNAME: data.rspBody.customerInfo.cuCname })
      this.customerInfoForm.patchValue({ NATIONAL_ID: data.rspBody.customerInfo.nationalId })
      this.customerInfoForm.patchValue({ CU_BIRTHDAY: data.rspBody.customerInfo.cuBirthday })
      this.customerInfoForm.patchValue({ CU_EDUCATION: data.rspBody.customerInfo.cuEducation })
      this.customerInfoForm.patchValue({ ACC_TYPE: this.accTypeChange(data.rspBody.customerInfo.accType) })
      this.customerInfoForm.patchValue({ CU_EMAIL: data.rspBody.customerInfo.cuEmail })
      this.customerInfoForm.patchValue({ CU_H_ADDR1: data.rspBody.customerInfo.cuHAddr1 })
      this.customerInfoForm.patchValue({ CU_H_ADDR2: data.rspBody.customerInfo.cuHAddr2 })
      this.customerInfoForm.patchValue({ CU_H_ADDR_CODE: data.rspBody.customerInfo.cuHAddrCode })
      this.customerInfoForm.patchValue({ CU_H_TEL: data.rspBody.customerInfo.cuHTel })
      this.customerInfoForm.patchValue({ CU_H_TEL_INO: data.rspBody.customerInfo.cuHTelIno })
      this.customerInfoForm.patchValue({ CU_M_TEL: data.rspBody.customerInfo.cuMTel })
      this.customerInfoForm.patchValue({ CU_M_TEL_INO: data.rspBody.customerInfo.cuMTelIno })
      this.customerInfoForm.patchValue({ CU_RDTL: this.getResisdenceYear(data.rspBody.customerInfo.cuRdtl) })
      this.customerInfoForm.patchValue({ CU_SEX: data.rspBody.customerInfo.cuSex })
      this.customerInfoForm.patchValue({ LIVING_STATUS: this.getlivingstaus(data.rspBody.customerInfo.livingStatus) })
      this.customerInfoForm.patchValue({ CU_MARRIED_STATUS: data.rspBody.customerInfo.CUMarriedStatus })
      //申請書欄位
      this.applicationData.patchValue({ PROD_CODE: data.rspBody.applicationData.prodName })
      this.applicationData.patchValue({ APRV_DEBT_AMT: data.rspBody.applicationData.amt })
      this.applicationData.patchValue({ DSBSACCTNBR: data.rspBody.applicationData.dsbsacctnbr })
      this.applicationData.patchValue({ RPAYACCTNBR: data.rspBody.applicationData.rpayacctnbr })
      this.applicationData.patchValue({ APRV_INST_CASH_AMT: this.toCurrency(data.rspBody.applicationData.lnappamt) })
      this.applicationData.patchValue({ LNAPPAMT: data.rspBody.applicationData.lnappamt })
      this.applicationData.patchValue({ SETTLE_DATE: this.pipe.transform(data.rspBody.applicationData.settleDate, 'yyyy-MM-dd') })
      this.applicationData.patchValue({ CTR_MIN_PRD: data.rspBody.applicationData.ctrtMinPrd })
      this.applicationData.patchValue({ CTR_MAX_PRD: data.rspBody.applicationData.ctrtMaxPrd })
      this.applicationData.patchValue({ WEB_API: data.rspBody.applicationData.prodName })
      this.applicationData.patchValue({ PERIOD: data.rspBody.applicationData.period })
      this.f06002Service.setCustomerId(data.rspBody.customerInfo.nationalId);
    })
  }
  //數位存款帳戶類型中文轉換
  accTypeChange(value: string) {
    switch (value) {
      case '1':
        return value = 'Type 1'
        break;
      case '2':
        return value = 'Type 1+'
        break;
      case '3':
        return value = 'Type 3'
        break;


    }
  }

  //分頁控制
  onQueryParamsChange(params: NzTableQueryParams): void {
    // 判斷是否為第一次進頁面
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      if (this.firstFlag != 1) {
        this.pageIndex = pageIndex;
        this.newData = this.f06002Service.getTableDate(pageIndex, this.pageSize, this.histroyOutbound);

      }
    }
  }


  //本次outbound註記
  public async saveOutBoundRecord(): Promise<void> {

    let jsonObject: any = {};
    const baseUrl = "f06/f06002action6";
    jsonObject['custType'] = sessionStorage.getItem('custType');
    jsonObject['outboundType'] = sessionStorage.getItem('custType');
    // jsonObject['recordTime'] = this.pipe.transform(new Date(sessionStorage.getItem('recordTime')), 'yyyyMMdd')
    jsonObject['recordEmpno'] = this.userId
    jsonObject['isConnect'] = this.isConnectValue
    jsonObject['notConnectCode'] = this.notConnectValue;
    jsonObject['notConnectMemo'] = this.notConnectMemo;
    jsonObject['isContactNext'] = this.isContactNextValue;
    if (this.isContactNextValue == 'Y') {
      //判斷日期時間是否在現在以前
      var date = this.pipe.transform(this.nextContactTime, 'yyyy-MM-dd ') + this.nextContactTimeHour + ":00" + ":00";
      var newDate = date.replace(/-/g, '/'); // 變成"2012/01/01 12:30:10";
      var keyDate = new Date(newDate)
      if (keyDate.getTime() < Date.now()) {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請選擇大於現在時間" }
        });
        return;
      }
      jsonObject['nextContactTime'] = this.pipe.transform(new Date(this.nextContactTime), 'yyyy-MM-dd') + ' ' + this.nextContactTimeHour + ":00" + ":00"
      console.log(jsonObject['nextContactTime'])
      // jsonObject['nextContactTime'] = formatDate(this.nextContactTime, 'yyyy-MM-dd HH:mm:ss', this.locale);
      // this.pipe.transform(new Date(this.nextContactTime), 'yyyy-MM-dd HH:mm:ss')
      // console.log(formatDate(this.nextContactTime, 'yyyy-MM-dd HH:mm:ss', this.locale));

    }
    jsonObject['custReason'] = this.custReasonValue;
    jsonObject['custReasonMemo'] = this.custReasonMemo;
    jsonObject['applno'] = this.applno;
    let msgStr: string = "";
    this.f06002Service.inquiry(baseUrl, jsonObject).subscribe(data => {
      if (data.msgStr == '更新成功' || data.rspCode == '0000') {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "更新成功" }
        });
        this.getData()
        this.isConnectValue = ''
        this.notConnectValue = ''
        this.notConnectMemo = ''
        this.isContactNextValue = ''
        this.nextContactTime = ''
        this.nextContactTimeHour = ''
        this.custReasonValue = ''
        this.custReasonMemo = ''
        // this.onNoClick()
      } else {
        const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: data.msgStr } });
        return
      }
    })
  }

  //對應案件申請書欄位
  saveAdditionalInfo() {
    let jsonObject: any = {};

    const baseUrl = "f06/f06002action4";
    jsonObject['applno'] = this.applno;
    jsonObject['dsbsacctnbr'] = this.applicationData.value.DSBSACCTNBR //撥款帳號
    jsonObject['rpayacctnbr'] = this.applicationData.value.RPAYACCTNBR //還款帳號
    jsonObject['settleDate'] = this.pipe.transform(new Date(this.applicationData.value.SETTLE_DATE), 'yyyyMMdd').toString(); //結清日
    jsonObject['period'] = this.applicationData.value.PERIOD //期數

    this.f06002Service.inquiry(baseUrl, jsonObject).subscribe(data => {
      if (data.msgStr == '更新成功' || data.rspCode == '0000') {
        data.msgStr = "更新成功"
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.msgStr }
        });
        this.onNoClick()
      } else if (data.rspCode == '9999') {
        this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
      } else {
        const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: data.msgStr } });
        return
      }
    })

  }

  //學歷代碼轉換中文
  geteducation(codeVal: string): string {
    for (const data of this.educationCode) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }

  //現居裝況轉換中文
  getlivingstaus(codeVal: string): string {
    for (const data of this.livingStatusCode) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }
  //現居裝況轉換中文
  getResisdenceYear(codeVal: string): string {
    for (const data of this.residenceCode) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }
  //未接通原因轉換中文
  getnotConnectCode(codeVal: string): string {
    for (const data of this.notConnectCode) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeChkStatus(rowId: string, recordEmpno: string) {


    this.histroyOutbound.forEach(chk => {
      if (chk.rowId === rowId) {

        if (this.userId == recordEmpno) {
          this.sameEmpno = false
          this.isChk = true
          this.newhistroyOutbound.push(chk);
        } else if (this.userId !== recordEmpno) {
          const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: "紀錄者與登錄員編不同不可編輯" } });
          this.sameEmpno = true
          this.isChk = false
        }

      }
    })
  }
  test123(rowId: string, recordEmpno: string) {
    if (this.userId == recordEmpno) { }
    this.histroyOutbound.forEach(data => {
      if (this.userId == recordEmpno) {
        if (data.rowId === rowId) {
          this.sameEmpno = false
          this.isChk = true
        } else if (data.rowId !== rowId) {
          this.sameEmpno = true
          this.isChk = false
        }
      } else if (this.userId !== recordEmpno) {
        const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: "紀錄者與登錄員編不同不可編輯" } });

      }
    })
  }
  // 編輯
  edit(isConnect: string, codeDesc: string, notConnectMemo: string, isContactNext: string, nextContactTime: string, custReasonDesc: string, custReasonMemo: string, rowId: string) {
    console.log(new Date(nextContactTime))
    console.log(nextContactTime)
    const dialogRef = this.dialog.open(F06002editComponent, {
      panelClass: 'mat-dialog-transparent',
      height: '70%',
      width: '60%',
      data: {
        applno: this.applno,
        custType: this.custType,
        isConnect: isConnect,
        codeDesc: codeDesc,
        notConnectMemo: notConnectMemo,
        isContactNext: isContactNext,
        nextContactTime: nextContactTime!=null?new Date(nextContactTime):null,
        custReasonDesc: custReasonDesc,
        custReasonMemo: custReasonMemo,
        rowId: rowId,


      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
      }
    })
    //金額加千分位
  }
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }

  getCaseList() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.f06002Service.getCaseList(jsonObject).subscribe(data => {
      console.log(data)
      if (data.rspBody.size > 0) {
        this.getRestartCase()
      } else {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "該筆案件無法申覆" }
        })
      }
      // if (data.rspBody.size > 0) {
      //   this.total = data.rspBody.size;
      //   this.cusinfoDataSource = data.rspBody.items;
      // }
      // else {
      //   this.cusinfoDataSource = null;
      //   this.total = 0;
      //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
      //     data: { msgStr: "查無資料" }
      //   })
      // }
    });
  }

  //跳出申請頁面
  getRestartCase() {

    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.f06002Service.getCreditmainInfo(jsonObject).subscribe(data => {
      this.opid = data.rspBody.opid
      const dialogRef = this.dialog.open(F01006restartComponent, {
        minHeight: '30%',
        width: '150%',
        panelClass: 'mat-dialog-transparent',
        data: {
          applno: this.applno,
          opid: this.opid,
        }
      });
    });
  }

  cleanReason(value: string) {
    if (value == 'N') {
      this.custReasonValue = ''
    } else {
      this.notConnectMemo = ''
      this.notConnectValue = ''
    }
  }
  //離開頁面
  exitPage() {
    console.log(this.page)
    sessionStorage.setItem('exit', 'exit');
    if(this.page=='0602'){
      this.menuListService.resetfn3(this.json)
      this.router.navigate(['F06002']);
    }else if(this.page=='0607'){
      this.menuListService.resetfn3(this.json)
      this.router.navigate(['F06007']);
    }
  }

  //頁面離開時觸發
  ngOnDestroy() {
  }
}
