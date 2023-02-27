import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { F03013Service } from './f03013.service';
import { F03013createComponent } from './f03013create/f03013create.component';
//20210911 alvin.lee
interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-f03013',
  templateUrl: './f03013.component.html',
  styleUrls: ['./f03013.component.css', '../../assets/css/f03.css']
})

export class F03013Component implements OnInit {
  selectedValue: string;    //欲創建年度行事曆
  yearValue: string;        //查詢年份
  monthValue: string;       //查詢月份
  yearCode: sysCode[] = []; //年份下拉
  monthCode: sysCode[] = []; //月份下拉
  jsonObject: any = {};
  workingDateDataSource: readonly Data[] = [];

  constructor(
    private f03013Service: F03013Service,
    private pipe: DatePipe,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getYearRange();
    this.getMonthRange();
    this.selectedValue = '';
    this.yearValue = '';
    this.monthValue = '';
  }
 
  //創建年度行事曆
  createCalendar() {
    if (this.selectedValue == null || this.selectedValue =='') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇需創建年份" }
      });
    } else if (this.selectedValue != null) {
    this.dialog.closeAll(); 

      const confirmDialogRef = this.dialog.open(F03013createComponent, {
        minHeight: '70vh',
        width: '50%',
        panelClass: 'mat-dialog-transparent',
        data: {
          value: this.selectedValue,
        }
      });
    }
  }

  // 查詢選擇之年度與月份
  queryIsWorkDay() {
    if (this.yearValue == '' && this.monthValue == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇年份與月份" }
      });
    } else if (this.yearValue == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇年份" }
      });
    } else if (this.monthValue == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇月份" }
      });
    } else {
      this.jsonObject['year'] = this.yearValue;
      this.jsonObject['month'] = this.monthValue;
      this.f03013Service.queryIsWorkDay(this.jsonObject).subscribe(data => {
        this.workingDateDataSource = data.rspBody;
        if (data.rspBody.length == '0') {

          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: '請先初始化' + this.yearValue + '年度行事曆' }
          });
          }
      });
    }
  }
  
  // 取得年份下拉
  getYearRange() {
    this.f03013Service.getSysTypeCode('YEAR').subscribe(data => {
      this.yearCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj['codeNo'];
        const desc = jsonObj['codeDesc'];
        this.yearCode.push({ value: codeNo, viewValue: desc })
      }
    });
  }

  // 取得月份下拉
  getMonthRange() {
    this.f03013Service.getSysTypeCode('MONTH').subscribe(data => {
      this.monthCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj['codeNo'];
        const desc = jsonObj['codeDesc'];
        this.monthCode.push({ value: codeNo, viewValue: desc });
      }
    });
  }
  // 修改工作日
  updateWorkingDate(wDate: string, isWork: string) {
    this.jsonObject['wDate'] = this.pipe.transform(new Date(wDate), 'yyyy-MM-dd');
    this.jsonObject['isWork'] = isWork;
    this.f03013Service.updateWorkingDate(this.jsonObject).subscribe(data => {
      if (data.rspMsg == 'success') {
        this.queryIsWorkDay();
      }
    });
  }
}



