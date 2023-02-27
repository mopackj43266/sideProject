import { OptionsCode } from './../../interface/base';
import { Component, Input, OnInit } from '@angular/core';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { F06008Service } from 'src/app/f06008/f06008.service';

@Component({
  selector: 'app-ob-history',
  templateUrl: './ob-history.component.html',
  styleUrls: ['./ob-history.component.css', '../../../assets/css/f03.css']
})
export class ObHistoryComponent implements OnInit {

  constructor(
    private f06008Service: F06008Service,
    private fb: FormBuilder,
  ) { }

  @Input() applno: string;
  @Input() statusDesc: string;
  o1StatusList = ['L010', 'L020', 'L030', 'L035'];
  o2StatusList = ['XC80', 'V090', 'V091', 'B040', 'B070'];
  pageSize: number = 10;
  pageIndex: number = 1;
  total: number;
  firstFlag = 1;
  newData: any = [];
  histroyOutbound: any//Outbound歷史紀錄
  genderCode: OptionsCode[] = []; //性別下拉
  educationCode: OptionsCode[] = [];//學歷下拉
  residenceCode: OptionsCode[] = [];//現居年數
  livingStatusCode: OptionsCode[] = [];//住宅所有權下拉
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

  ngOnInit(): void {
    this.f06008Service.getSysTypeCode('GENDER')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.genderCode.push({ value: codeNo, viewValue: desc });
        }
      });

    //取學歷
    this.f06008Service.getSysTypeCode('EDUCATION')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.educationCode.push({ value: codeNo, viewValue: desc });
        }
      });

    //已居住年數
    this.f06008Service.getSysTypeCode('RESIDENCE_YEAR').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.residenceCode.push({ value: codeNo, viewValue: desc })
      }
    });

    //取現居狀況
    this.f06008Service.getSysTypeCode('LIVING_STATUS')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.livingStatusCode.push({ value: codeNo, viewValue: desc })
        }
      });
  }

  ngAfterViewInit(): void {
    this.getData();
  }

  getData() {
    const url = 'f06/f06002action2';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['custType'] = this.o1StatusList.includes(this.statusDesc) ? 'O1' : (this.o2StatusList.includes(this.statusDesc) ? 'O2' : '')
    this.f06008Service.getData(url, jsonObject).subscribe(data => {
      this.histroyOutbound = data.rspBody.histroyOutbound;
      this.total = data.rspBody.histroyOutbound.length;
      this.newData = this.f06008Service.getTableDate(this.pageIndex, this.pageSize, this.histroyOutbound)
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
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // 判斷是否為第一次進頁面
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      if (this.firstFlag != 1) {
        this.pageIndex = pageIndex;
        this.newData = this.f06008Service.getTableDate(pageIndex, this.pageSize, this.histroyOutbound);
      }
    }
  }

  //數位存款帳戶類型中文轉換
  accTypeChange(value: string) {
    switch (value) {
      case '1':
        return value = 'Type 1'
      case '2':
        return value = 'Type 1+'
      case '3':
        return value = 'Type 3'
    }
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
}
