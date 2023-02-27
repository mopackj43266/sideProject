import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MappingCode } from 'src/app/mappingcode.model';
import { Childscn11Service } from '../childscn11.service';
import { MatDialog } from '@angular/material/dialog';
import { Childscn11page6Component } from '../childscn11page6/childscn11page6.component'

interface Code {
  compareColumn: string;
  result: string;
  count: string;
}
//Nick COMPARE本案申請書資訊合理性比對
@Component({
  selector: 'app-childscn11page1',
  templateUrl: './childscn11page1.component.html',
  styleUrls: ['./childscn11page1.component.css', '../../../../assets/css/f01.css']
})
export class Childscn11page1Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private childscn11Service: Childscn11Service,
    private pipe: DatePipe,
    public dialog: MatDialog
  ) { }

  private applno: string;
  private check: string;
  private cuid: string;
  mappingOption: MappingCode[];
  compare: any
  notFind: string;
  loading: boolean = false;
  time: string;
  // compareForm: FormGroup = this.fb.group({
  //   IP_ADDR: ['', []],
  //   PHONE_MODEL: ['', []],
  //   P_TEL: ['', []],
  //   C_TEL: ['', []],
  //   CP_NAME: ['', []],
  //   CP_TEL: ['', []],
  //   SALARY_YEAR: ['', []],
  // });

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.getCOMPARE();
    this.check = sessionStorage.getItem('check');

  }
  //取資料
  getCOMPARE() {
    let jsonObject: any = {};
    const url = 'f01/childscn11action3';
    jsonObject['applno'] = this.applno;
    // jsonObject['code'] = 'EL_APPLY_COMPARE';
    this.childscn11Service.selectCustomer(url, jsonObject).subscribe(data => {
      if ( data.rspBody.compare == 'not find') {
        this.notFind = "此案編查無比對資料";
      } else {
        // this.mappingOption = data.rspBody.table;
        this.compare = data.rspBody;
        this.loading = true
      }
    });
    this.childscn11Service.selectCustomer(url, jsonObject).subscribe(data => {
      this.time = this.pipe.transform(new Date(data.rspBody.time), 'yyyy-MM-dd HH:mm:ss');
    });
  }
  //取viewValue  取絕對值&相對值
  // getOptionDesc(codeVal: string): string {
  //   for (const data of this.mappingOption) {
  //     if (data.codeNo == codeVal) {
  //       return data.codeDesc;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }

  // Inquire()
  // {

  //     const url = 'f01/childscn11action3';
  //     let jsonObject: any = {};
  //     jsonObject['applno'] = this.applno;
  //     this.childscn11Service.selectCustomer(url, jsonObject).subscribe(data => {
  //       sessionStorage.setItem('check','Y');
  //       const dialogRef = this.dialog.open(Childscn11page6Component, {
  //         panelClass: 'mat-dialog-transparent',
  //         maxHeight: '90vh',
  //         width: '40%',
  //         data: {
  //           data: data
  //         }
  //       })
  //       sessionStorage.removeItem('check');
  //     })
  // }
}
