import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { disableDebugTools } from '@angular/platform-browser';
import { isCheckDisabled } from 'ng-zorro-antd/core/tree';
import { MappingCode } from 'src/app/mappingcode.model';
import { Childscn11Service } from '../childscn11.service';
import { Childscn11page6Component } from '../childscn11page6/childscn11page6.component'

interface Code {
  compareColumn: string;
  result: string;
  count: string;
}
//Nick COMPARE_UNID 歷史申請書比對 (不同NID)
@Component({
  selector: 'app-childscn11page2',
  templateUrl: './childscn11page2.component.html',
  styleUrls: ['./childscn11page2.component.css', '../../../../assets/css/child.css']
})
export class Childscn11page2Component implements OnInit {


  constructor(
    private fb: FormBuilder,
    private childscn11Service: Childscn11Service,
    private pipe: DatePipe,
    public dialog: MatDialog,
  ) { }

  private applno: string;
  private cuid: string;
  private check: string;
  naitonalId: string;
  mappingOption: MappingCode[];
  compare: Code[] = [];
  notFind: string;
  loading: boolean = false;
  time: string;

  compare_UNIDForm: FormGroup = this.fb.group({
    GPS_1: ['', []],//			GPS - 時點1比對次數
    GPS_2: ['', []],//			GPS - 時點2比對次數
    IP_ADDR_1: ['', []],//			IP address - 時點1比對次數
    IP_ADDR_2: ['', []],//			IP address - 時點2比對次數
    PHONE_MODEL_1: ['', []],//			手機型號 - 時點1比對次數
    PHONE_MODEL_2: ['', []],//			手機型號 - 時點2比對次數
    DEVICE_ID_1: ['', []],//			Device ID - 時點1比對次數
    DEVICE_ID_2: ['', []],//			Device ID - 時點2比對次數
    EMAIL: ['', []],//			eMail比對次數
    MOBILE: ['', []],//			行動電話比對次數
    P_TEL: ['', []],//			戶籍電話比對次數
    C_TEL: ['', []],//			通訊電話比對次數
    P_ADDR: ['', []],//			戶籍地址完整比對次數
    P_ADDR_FUZZY: ['', []],//			戶籍地址模糊比對次數
    C_ADDR: ['', []],//			通訊地址完整比對次數
    C_ADDR_FUZZY: ['', []],//			通訊地址模糊比對次數
    M_ADDR: ['', []],//			寄卡地址完整比對次數
    SEND_ADDR_FUZZY: ['', []],//			寄卡地址模糊比對次數
    CP_NAME: ['', []],//			公司名稱比對次數
    CP_TEL: ['', []],//			公司電話比對次數
    CP_ADDR: ['', []],//			公司地址完整比對次數
    CP_ADDR_FUZZY: ['', []],//			公司地址模糊比對次數
  });

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.check = sessionStorage.getItem('check');
    this.getCOMPARE();
  }
  //取資料
  getCOMPARE() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;;
    jsonObject['code'] = 'EL_HISTORY_COMPARE_UNID';
    this.childscn11Service.getCompare(jsonObject).subscribe(data => {
      if (data.rspBody.compare == 'not find') {
        this.notFind = "此案編查無比對資料";
      } else {
        this.mappingOption = data.rspBody.table;
        this.compare = data.rspBody.compare;
        this.loading = true
      }
    });
    this.childscn11Service.getCompare1(jsonObject).subscribe(data => {
      this.time = this.pipe.transform(new Date(data.rspBody.compareDate), 'yyyy-MM-dd HH:mm:ss');
      // this.time = data.rspBody.compareDate;


    });
  }
  //取viewValue
  getOptionDesc(codeVal: string): string {
    for (const data of this.mappingOption) {
      if (data.codeNo == codeVal) {
        return data.codeDesc;
        break;
      }
    }
    return codeVal;
  }
  compareValue() {
    // if(this.compare[9].count){}
  }
  // test1(){
  //   if(this.compare=null){
  //     this.loading = true
  //   }else{
  //     this.loading= false
  //   }
  // }
  test(x: string) {
    if (x == '1') {
      return '絕對值'
    }
    else if (x == '2') {
      return '相對值'
    }
  }

  Inquire(col: string) //查詢
  {
    if (this.check == 'Y') {
      return
    } else {

      const url = 'f01/childscn11action2';
      let jsonObject: any = {};
      jsonObject['nationalId'] = this.cuid;
      jsonObject['applno'] = this.applno;
      jsonObject['code'] = 'EL_HISTORY_COMPARE_UNID';
      jsonObject['col'] = col;
      this.childscn11Service.selectCustomer(url, jsonObject).subscribe(data => {
        sessionStorage.setItem('check','Y');
        const dialogRef = this.dialog.open(Childscn11page6Component, {
          panelClass: 'mat-dialog-transparent',
          maxHeight: '90vh',
          width: '40%',
          data: {
            data: data
          }

        })
        sessionStorage.removeItem('check');
      })
    }
  }
}
