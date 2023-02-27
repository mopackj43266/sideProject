import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MappingCode } from 'src/app/mappingcode.model';
import { MatDialog } from '@angular/material/dialog';
import { Childscn11Service } from '../childscn11.service';
import { Childscn11page6Component } from '../childscn11page6/childscn11page6.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AnyMxRecord } from 'dns';


interface Code {
  compareColumn: string;
  result: string;
  count: string;
}
//Nick KRM043報送資料比對
@Component({
  selector: 'app-childscn11page4',
  templateUrl: './childscn11page4.component.html',
  styleUrls: ['./childscn11page4.component.css', '../../../../assets/css/f01.css']
})
export class Childscn11page4Component implements OnInit {

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
  color: string;
  notFind: string;
  loading: boolean = false;
  time: string;


  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.check = sessionStorage.getItem('check');
    this.getKRM043();
  }

  //取資料
  getKRM043() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;;
    jsonObject['code'] = 'EL_KRM043_COMPARE';
    this.childscn11Service.getCompare4(jsonObject).subscribe(data => {
      if (Object.keys(data.rspBody).length <= 2) {
        this.notFind = "此案編查無比對資料";
      } else {
        this.mappingOption = data.rspBody.table;
        this.compare = data.rspBody;
        this.loading = true;
      }
    });
    this.childscn11Service.getCompare4(jsonObject).subscribe(data => {
      this.time = data.rspBody.COMPARE_TIME != '' ? this.pipe.transform(new Date(data.rspBody.COMPARE_TIME), 'yyyy-MM-dd HH:mm:ss') : '';
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

  test(x: string) {
    if (x == '1') {
      return '絕對值'
    }

    else if (x == '2') {
      return '相對值'
    }
  }

  //依照回傳rspBody放值
  InputCount1(x: any) {
    if (x.count == null) {
      return x
    }
    else {
      return x.count
    }
  };




  Inquire(col: string) //查詢
  {
    // if (this.check == 'Y') {
    //   return
    // } else {

    const url = 'f01/childscn11action5';
    let jsonObject: any = {};
    jsonObject['naid'] = this.cuid;
    jsonObject['applno'] = this.applno;
    jsonObject['code'] = 'EL_JCIC_KRM043';
    jsonObject['col'] = col;
    this.childscn11Service.selectCustomer(url, jsonObject).subscribe(data => {
      // sessionStorage.setItem('check', 'Y');
      const dialogRef = this.dialog.open(Childscn11page6Component, {
        panelClass: 'mat-dialog-transparent',
        maxHeight: '90vh',
        width: '40%',
        data: {
          data: data
        }

      })
      // sessionStorage.removeItem('check');
    })
  }
}
// }
