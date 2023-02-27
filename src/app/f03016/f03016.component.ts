


import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,FormControl,Validators } from '@angular/forms';
import { F03016Service } from './f03016.service';;
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from '../base.service';

interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f03016',
  templateUrl: './f03016.component.html',
  styleUrls: ['./f03016.component.css', '../../assets/css/f03.css']
})
export class F03016Component implements OnInit {
  total = 1;
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  selectedValue: string;
  compareTableCode: sysCode[] = [];
  DssJcicSet:number=0;
  DssMailDay: number=0;
  BasicLimit: string;
  CssPassStart: Date;
  CssPassEnd: Date;
  IsJcic: string = '';
  TableName: string = '';
  columnName: string = '';
  originalValue: string;
  currentValue: string;
  transEmpNo: string = BaseService.userId;;
  transDate: string;
  ChangeSource: any;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  currentPage: PageEvent;



  constructor(public dialogRef: MatDialogRef<F03016Service>, private f03016Service: F03016Service, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private pipe: DatePipe) { }

  ngOnInit(): void {
    this.getImpertmentParameterInfo(this.pageIndex, this.pageSize);

  }

  ngAfterViewInit(){

  }
  formControl = new FormControl('', [
    Validators.required
  ]);
  //欄位驗證
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    // const { pageSize, pageIndex } = params;
    let pageSize = params.pageSize;
    const pageIndex = params.pageIndex;
    pageSize = 1;
    this.getImpertmentParameterInfo(params.pageIndex, params.pageSize);
  }
  //取得資料
   getImpertmentParameterInfo(pageIndex: number, pageSize: number) {

    const date = new Date();

    const baseUrl = 'f03/f03016';
    let jsonObject: any = {};
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
   this.f03016Service.getImpertmentParameter(baseUrl, jsonObject).subscribe(data => {
      this.DssJcicSet = data.rspBody.ipList[0].dssJcicSet;
      this.DssMailDay = data.rspBody.ipList[0].dssMailDay;
      this.BasicLimit = data.rspBody.ipList[0].basicLimit =  data.rspBody.ipList[0].basicLimit != undefined ? (data.rspBody.ipList[0].basicLimit + "").replace(/\B(?=(\d{3})+(?!\d))/g, ',') : data.rspBody.ipList[0].basicLimit;
      this.IsJcic = data.rspBody.ipList[0].isJcic;
      this.CssPassStart=new Date(this.pipe.transform(new Date( data.rspBody.ipList[0].cssPassStart), 'yyyy-MM-dd'))
      // this.CssPassStart.setDate(this.CssPassStart.getDate() - 1);
      this.CssPassEnd=new Date(this.pipe.transform(new Date(data.rspBody.ipList[0].cssPassEnd), 'yyyy-MM-dd'))
      // this.CssPassEnd.setDate(this.CssPassEnd.getDate() - 1);
      this.ChangeSource = data.rspBody.tlList;
      this.columnName = data.rspBody.tlList[0].columnName;
      this.originalValue = data.rspBody.tlList[0].originalValue;
      this.currentValue = data.rspBody.tlList[0].currentValue;
      this.transEmpNo = data.rspBody.tlList[0].transEmpNo;
      this.transDate = data.rspBody.tlList[0].transDate;
      this.total = data.rspBody.size;
      // this.clear();
    });
  }


  // 儲存資料
  public async save(): Promise<void> {
    let jsonObject: any = {};
    jsonObject['dssJcicSet'] = this.DssJcicSet;
    jsonObject['dssMailDay'] = this.DssMailDay;
    jsonObject['basicLimit'] = this.BasicLimit!= "" ? this.Cut( this.BasicLimit) : "0";
    this.CssPassStart = new Date(this.CssPassStart);
    this.CssPassEnd = new Date(this.CssPassEnd);
    if (this.CssPassStart < this.CssPassEnd) {
    // let CssPassStartString = this.pipe.transform(new Date(this.CssPassStart).setDate(this.CssPassStart.getDate() +1), 'yyyy-MM-dd');
    // let CssPassEndString = this.pipe.transform(new Date(this.CssPassEnd).setDate(this.CssPassStart.getDate() +1), 'yyyy-MM-dd');
    let CssPassStartString = this.pipe.transform(new Date(this.CssPassStart), 'yyyyMMdd');
    let CssPassEndString = this.pipe.transform(new Date(this.CssPassEnd), 'yyyyMMdd');
      if (CssPassStartString != '1970-01-01' && CssPassEndString != '1970-01-01'
      ) {
        jsonObject['cssPassStart'] = CssPassStartString;
        jsonObject['cssPassEnd'] = CssPassEndString;
      } else {
        return alert('請輸入正確時間')
      }
    }
    else {
      return alert('請輸入正確時間')
    }
    jsonObject['isJcic'] = this.IsJcic;
    jsonObject['transEmpNo'] = this.transEmpNo;
    let msgStr: string = "";
    let baseUrl = 'f03/f03016action1';

    msgStr = await this.f03016Service.update(baseUrl, jsonObject);
    if (msgStr == 'success') {
      msgStr = '儲存成功！'
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      this.changePage();
      this.getImpertmentParameterInfo(this.pageIndex, this.pageSize);
    } else {
      msgStr = '資料無更改!'
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
    }
  }
  onChange(result: Date): void {

  }

  changePage() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 1;
  }

 //儲存前處理千分位
 Cut(s: string)  {
  if(s!=null)
  {
    s = s.replace(/,/g, "")
  }

  return s
}



  isNumber(value: any) { return /^-?[\d.]+(?:e-?\d+)?$/.test(value); }

	//去除符號/中英文
	toNumber(data: string) {
		return data != null ? data.replace(/[^\w\s]|_/g, '') : data;

	}
	// 只允許輸入數字
	numberOnly(event: { which: any; keyCode: any; }): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode < 110 && charCode > 110) {
			const childernDialogRef = this.dialog.open(ConfirmComponent, {
				data: { msgStr: '請輸入數字!' }
			});
			return false;
		}
		return true;
	}

	//+逗號
	toCurrency(amount: string) {
		return amount != null ? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
	}
  data_number(p: string) {
    p = p.replace(/,/g, "")
    if (p!= null)
    {
      p = p.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    this.BasicLimit =p;

  }



}
