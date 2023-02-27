import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Childscn9Service } from '../childscn9.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { F03015Service } from 'src/app/f03015/f03015.service';
// import { ConsoleReporter } from 'jasmine';
interface dateCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-childscn9page1',
  templateUrl: './childscn9page1.component.html',
  styleUrls: ['./childscn9page1.component.css', '../../../../assets/css/child.css']
})
export class Childscn9page1Component implements OnInit {


  constructor(
    private fb: FormBuilder,
    private childscn9Service: Childscn9Service,
    private pipe: DatePipe,
    private f03015Service: F03015Service

  ) { }
  blockingCodeSource: any
  coreCustInfoForm: FormGroup = this.fb.group({
    APPLNO: ['', []],
    AGE: ['', []],
    STAR_SIGN: ['', []],
    CHI_ZODIAC: ['', []],
    CONTACT_DATE: ['', []],
    BLACK_MARK_INFO: ['', []],
    BLOCKING_CODE: ['', []],
    ACCIDENT_RECORD: ['', []],
    NAME: ['', []],
    BIRTHDAY: ['', []],
    EDUCATION: ['', []],
    ACC_OPEN_DATE: ['', []],
    ACC_TYPE: ['', []],
    LOGIN_ID: ['', []],
    EMAIL: ['', []],
    SALARY_YEAR: ['', []],
    CP_NO: ['', []],
    CP_NAME: ['', []],
    CP_TEL: ['', []],
    CP_ADDR: ['', []],
    CP_TITLE: ['', []],
    MOBILE: ['', []],
    P_TEL: ['', []],
    H_TEL: ['', []],
    P_ADDR: ['', []],
    H_ADDR: ['', []],
    SEND_CARD_ADDR: ['', []]
  });

  dateCode: dateCode[] = [];
  dateValue: string;
  educationCode: dateCode[] = [];           //學歷下拉
  cpNoCode1: dateCode[] = [];           //職業下拉
  cpNoCode2: dateCode[] = [];           //職業下拉
  cpNoCode3: dateCode[] = [];           //職業下拉
  CoreCusdata: any
  private applno: string;
  private cuid: string;
  private search: string;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.search = sessionStorage.getItem('search');
    const url = 'f01/childscn9';
    let jsonObject1: any = {};
    const date = new Date()
    jsonObject1['applno'] = this.applno;
    jsonObject1['cuid'] = this.cuid;
    jsonObject1['code'] = 'CORE_CUS_INFO';
    this.childscn9Service.getDate(url, jsonObject1).subscribe(data => {
      if (data.rspBody.items.length > 0) {
        for (let i = 0; i < data.rspBody.items.length; i++) {
          this.dateCode.push({ value: data.rspBody.items[i].QUERYDATE, viewValue: data.rspBody.items[i].QUERYDATE })
        }
        this.dateValue = data.rspBody.items[0].QUERYDATE
        this.getCoreCusInfo(this.dateValue);
        this.getBlockingCodeInfo()
      }
    });
    // 行業Level1下拉
    let jsonObject: any = {};
    this.f03015Service.getReturn('f03/f03015action6', jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody.items) {
        const codeNo = jsonObj['INDUC_LEVEL1'];
        const desc = jsonObj['INDUC_LEVEL1_DESC'];
        this.cpNoCode1.push({ value: codeNo, viewValue: desc });
      }
    });



    //取學歷
    this.childscn9Service.getSysTypeCode('EDUCATION')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.educationCode.push({ value: codeNo, viewValue: desc })
        }
      });

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



  //職業代碼1轉換中文
  getrole1(codeVal: string): string {

    for (const data of this.cpNoCode1) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }
  //職業代碼2轉換中文
  getrole2(codeVal: string): string {

    for (const data of this.cpNoCode2)
    {
      if (data.value == codeVal) {
        return data.viewValue;

        break;
      }

    }
    return codeVal;
  }
  //職業代碼3轉換中文
  getrole3(codeVal: string): string {

    for (const data of this.cpNoCode3) {
      if (data.value == codeVal) {
        return data.viewValue;
        break;
      }
    }
    return codeVal;
  }
  getBlockingCodeInfo() {
    let jsonObject: any = {}
    jsonObject['applno'] = this.applno;
    this.childscn9Service.getBlockingCode(jsonObject).subscribe(data => {
      this.blockingCodeSource = data.rspBody.blockingCodeList
    })
  }
  getCoreCusInfo(dateValue: string) {
    let jsonObject: any = {};
    const date = new Date()
    jsonObject['applno'] = this.applno;
    jsonObject['cuid'] = this.cuid;
    jsonObject['code'] = 'CORE_CUS_INFO';
    const baseUrl = 'f01/childscn9action';
    this.childscn9Service.getData(baseUrl, jsonObject).subscribe(data => {
      let birthday = moment(data.rspBody.items[0].BIRTHDAY).format('YYYY-MM-DD');
      this.coreCustInfoForm.patchValue({ APPLNO: data.rspBody.items[0].APPLNO })
      this.coreCustInfoForm.patchValue({ AGE: data.rspBody.items[0].AGE })
      this.coreCustInfoForm.patchValue({ STAR_SIGN: data.rspBody.items[0].STAR_SIGN })
      this.coreCustInfoForm.patchValue({ CHI_ZODIAC: data.rspBody.items[0].CHI_ZODIAC })
      this.coreCustInfoForm.patchValue({ CONTACT_DATE: data.rspBody.items[0].CONTACT_DATE })
      this.coreCustInfoForm.patchValue({ BLACK_MARK_INFO: data.rspBody.items[0].BLACK_MARK_INFO })
      this.coreCustInfoForm.patchValue({ BLOCKING_CODE: data.rspBody.items[0].BLOCKING_CODE })
      this.coreCustInfoForm.patchValue({ ACCIDENT_RECORD: data.rspBody.items[0].ACCIDENT_RECORD })
      this.coreCustInfoForm.patchValue({ NAME: data.rspBody.items[0].NAME })
      this.coreCustInfoForm.patchValue({ BIRTHDAY: birthday })
      this.coreCustInfoForm.patchValue({ EDUCATION: data.rspBody.items[0].EDUCATION + this.geteducation(data.rspBody.items[0].EDUCATION) })
      this.coreCustInfoForm.patchValue({ ACC_OPEN_DATE: data.rspBody.items[0].ACC_OPEN_DATE == null ? '' : this.pipe.transform(new Date(data.rspBody.items[0].ACC_OPEN_DATE), 'yyyy-MM-dd ') })
      this.coreCustInfoForm.patchValue({ ACC_TYPE: this.accTypeChange(data.rspBody.items[0].ACC_TYPE) })
      this.coreCustInfoForm.patchValue({ LOGIN_ID: data.rspBody.items[0].LOGIN_ID })
      this.coreCustInfoForm.patchValue({ EMAIL: data.rspBody.items[0].EMAIL })
      this.coreCustInfoForm.patchValue({ SALARY_YEAR: this.toCurrency(data.rspBody.items[0].SALARY_YEAR) })
      this.coreCustInfoForm.patchValue({ CP_NO: (data.rspBody.code)})
      this.coreCustInfoForm.patchValue({ CP_NAME: data.rspBody.items[0].CP_NAME })
      this.coreCustInfoForm.patchValue({ CP_TEL: data.rspBody.items[0].CP_TEL })
      this.coreCustInfoForm.patchValue({ CP_ADDR: data.rspBody.items[0].CP_ADDR })
      this.coreCustInfoForm.patchValue({ CP_TITLE: data.rspBody.items[0].CP_TITLE })
      this.coreCustInfoForm.patchValue({ MOBILE: data.rspBody.items[0].MOBILE })
      this.coreCustInfoForm.patchValue({ P_TEL: data.rspBody.items[0].P_TEL })
      this.coreCustInfoForm.patchValue({ H_TEL: data.rspBody.items[0].H_TEL })
      this.coreCustInfoForm.patchValue({ P_ADDR: data.rspBody.items[0].P_ADDR })
      this.coreCustInfoForm.patchValue({ H_ADDR: data.rspBody.items[0].H_ADDR })
      this.coreCustInfoForm.patchValue({ SEND_CARD_ADDR: data.rspBody.items[0].SEND_CARD_ADDR })
    });
  }

  getSearch(): string {
    return this.search;
  }
  changeDate() {
    this.getCoreCusInfo(this.dateValue);
  }
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
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

}
