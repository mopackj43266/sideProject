import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Childscn9Service } from 'src/app/children/childscn9/childscn9.service';
import { Childbwscn4Service } from '../childbwscn4.service';

interface dateCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-childbwscn4page1',
  templateUrl: './childbwscn4page1.component.html',
  styleUrls: ['./childbwscn4page1.component.css']
})
export class Childbwscn4page1Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private Childbwscn4Service: Childbwscn4Service,
    private pipe: DatePipe,

  ) { }

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
  educationCode: dateCode[] = [];           //學歷下拉
  dateValue: string;
  blockingCodeSource:any
  private applno: string;
  private cuid: string;
  private search: string;


  ngOnInit(): void {

    // this.blockingCodeSource()
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.search = sessionStorage.getItem('search');
    const url = "f01/childBwScn4";

    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['cuid'] = this.cuid;
    jsonObject['code'] = 'CORE_CUS_INFO';
    this.Childbwscn4Service.getDate(url, jsonObject).subscribe(data => {
      if (data.rspBody.items.length > 0) {
         for (let i = 0; i < data.rspBody.items.length; i++) {
         this.dateCode.push({ value: data.rspBody.items[i].QUERYDATE, viewValue: data.rspBody.items[i].QUERYDATE })
         }
        this.dateValue = data.rspBody.items[0].QUERYDATE
        this.getCoreCusInfo(this.dateValue);
        this.getBlockingCodeInfo();
        }

    });

       //取學歷
       this.Childbwscn4Service.getSysTypeCode('EDUCATION')
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


  getBlockingCodeInfo(){
    let jsonObject:any={}
    jsonObject['applno'] = this.applno;
    this.Childbwscn4Service.getBlockingCode(jsonObject).subscribe(data=>{
      this.blockingCodeSource=data.rspBody.blockingCodeList
    })
  }
  getCoreCusInfo(dateValue: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['cuid'] = this.cuid;
    jsonObject['code'] = 'CORE_CUS_INFO';

    this.Childbwscn4Service.getCoreCusInfo(jsonObject).subscribe(data => {
      this.coreCustInfoForm.patchValue({ APPLNO: data.rspBody.items[0].APPLNO })
      this.coreCustInfoForm.patchValue({ AGE: data.rspBody.items[0].AGE })
      this.coreCustInfoForm.patchValue({ STAR_SIGN: data.rspBody.items[0].STAR_SIGN })
      this.coreCustInfoForm.patchValue({ CHI_ZODIAC: data.rspBody.items[0].CHI_ZODIAC })
      this.coreCustInfoForm.patchValue({ CONTACT_DATE: data.rspBody.items[0].CONTACT_DATE })
      this.coreCustInfoForm.patchValue({ BLACK_MARK_INFO: data.rspBody.items[0].BLACK_MARK_INFO })
      this.coreCustInfoForm.patchValue({ BLOCKING_CODE: data.rspBody.items[0].BLOCKING_CODE })
      this.coreCustInfoForm.patchValue({ ACCIDENT_RECORD: data.rspBody.items[0].ACCIDENT_RECORD })
      this.coreCustInfoForm.patchValue({ NAME: data.rspBody.items[0].NAME })
      this.coreCustInfoForm.patchValue({ BIRTHDAY: data.rspBody.items[0].BIRTHDAY })
      this.coreCustInfoForm.patchValue({ EDUCATION: data.rspBody.items[0].EDUCATION+this.geteducation(data.rspBody.items[0].EDUCATION) })
      this.coreCustInfoForm.patchValue({ ACC_OPEN_DATE:this.pipe.transform(new Date(data.rspBody.items[0].ACC_OPEN_DATE), 'yyyy-MM-dd')})
      this.coreCustInfoForm.patchValue({ ACC_TYPE: this.accTypeChange(data.rspBody.items[0].ACC_TYPE) })
      this.coreCustInfoForm.patchValue({ LOGIN_ID: data.rspBody.items[0].LOGIN_ID })
      this.coreCustInfoForm.patchValue({ EMAIL: data.rspBody.items[0].EMAIL })
      this.coreCustInfoForm.patchValue({ SALARY_YEAR: this.toCurrency(data.rspBody.items[0].SALARY_YEAR) })
      this.coreCustInfoForm.patchValue({ CP_NO: data.rspBody.items[0].CP_NO })
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
  console.log(value)
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
