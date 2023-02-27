import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { ChildrenService } from '../children.service';
import { Childscn20Service } from './childscn20.service';

interface checkBox {
  value: string;
  completed: boolean;
}
interface sysCode {
  value: string;
  viewValue: string;
}
//Mount 提報黑名單
@Component({
  selector: 'app-childscn20',
  templateUrl: './childscn20.component.html',
  styleUrls: ['./childscn20.component.css', '../../../assets/css/child.css']
})
export class Childscn20Component implements OnInit {

  reportReason1: sysCode[] = [];  //通報原因1下拉
  reportReason2: sysCode[] = [];  //通報原因2下拉
  reportReason3: sysCode[] = []; //通報原因3下拉
  useFlag: sysCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' }]; //使用中下拉
  reportReason1Value: string;  //通報原因1選擇
  reportReason2Value: string;  //通報原因2選擇
  reportReason3Value: string; //通報原因3選擇
  useFlagValue: string; //使用中選擇
  currentPage: PageEvent;
  currentSort: Sort;
rid:[]=[]
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private childscn20Service: Childscn20Service,
    public childService: ChildrenService,
    public dialogRef: MatDialogRef<Childscn20Component>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  blockListForm: FormGroup = this.fb.group({
    REPORT_UNIT: [this.data.no, []],
    REPORT_REASON1: [this.data.reportReason1Value, []],
    REPORT_REASON2: [this.data.reportReason2Value, []],
    REPORT_REASON3: [this.data.reportReason3Value, []],
    REPORT_CONTENT: [this.data.REPORT_CONTENT, []],
    USE_FLAG: [this.data.USE_FLAG, []],
    BK_COLUMN: [this.data.BK_COLUMN, []],
    BK_CONTENT: [this.data.BK_CONTENT, []],
    CU_CNAME: [this.data.CU_CNAME, []],
    NATIONAL_ID: [this.data.NATIONAL_ID, []],
    CU_H_TEL: [this.data.CU_H_TEL, []],
    CU_CP_TEL: [this.data.CU_CP_TEL, []],
    CU_M_TEL: [this.data.CU_M_TEL, []],
    ROWID: [this.data.ROWID, []],
    pageIndex: ['', [Validators.maxLength(3)]],
    pageSize: ['', [Validators.maxLength(3)]]
  });

  formControl = new FormControl('', [
    Validators.required
  ]);
   //欄位驗證
   getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  blockListDataSource: readonly Data[] = [];
  private applno: string;
  chkArray: string[] = [];
  contentArray: string[] = [];
  jsonObject: any = {};
  no: string;//會員帳號
  total = 1;
  loading = false;
  pageSize = 5;
  pageIndex = 1;

  block: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.applno = sessionStorage.getItem('applno');//案件代碼
      this.no = BaseService.userId;
      this.selectBlockList(this.pageIndex, this.pageSize)//一進去畫面就抓取資料表
    });




    //抓取資料表
    this.blockListForm.patchValue({ 'REPORT_UNIT': this.no })
    this.selectBlockList(this.pageIndex, this.pageSize);

    //取Customer_info資料
    this.selectCustInfo();



    //取下拉選單資料
    this.childscn20Service.getSysTypeCode('BK_REASON')//通報原因下拉選單
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.reportReason1.push({ value: codeNo, viewValue: desc })
          this.reportReason2.push({ value: codeNo, viewValue: desc })
          this.reportReason3.push({ value: codeNo, viewValue: desc })
        }
      });
  }

  checkboxSelect(check: boolean, data: any) {
    if (check) {
      this.chkArray.push(data);
    } else {
      this.chkArray.forEach((element, index) => {
        if (element == data) {
          this.chkArray.splice(index, 1);
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  //新增
  insertData() {
    if (this.blockListForm.value.REPORT_REASON1 == '' || this.blockListForm.value.REPORT_REASON1 == null) {
      this.dialog.open(ConfirmComponent, { data: { msgStr: "請選擇通報原因1" } });
    }
     else {

      if(this.chkArray.length == 0){
        this.dialog.open(ConfirmComponent, { data: { msgStr: "請勾選項目" } });
        return;
      }

      let test12345:string[] = [];

      this.contentArray = [];
      this.chkArray.forEach((element) => {
        if (element === "CU_CNAME") { this.blockListForm.value.CU_CNAME != null && this.blockListForm.value.CU_CNAME != "" ? this.contentArray.push(this.blockListForm.value.CU_CNAME) : test12345.push('1'); }
        if (element === "NATIONAL_ID") { this.blockListForm.value.NATIONAL_ID != null && this.blockListForm.value.NATIONAL_ID != "" ? this.contentArray.push(this.blockListForm.value.NATIONAL_ID): test12345.push('1'); }
        if (element === "CU_H_TEL") {  this.blockListForm.value.CU_H_TEL != null && this.blockListForm.value.CU_H_TEL != "" ?this.contentArray.push(this.blockListForm.value.CU_H_TEL): test12345.push('1');  }
        if (element === "CU_CP_TEL") { this.blockListForm.value.CU_CP_TEL != null && this.blockListForm.value.CU_CP_TEL != "" ?this.contentArray.push(this.blockListForm.value.CU_CP_TEL): test12345.push('1');}
        if (element === "CU_M_TEL") { this.blockListForm.value.CU_M_TEL != null && this.blockListForm.value.CU_M_TEL != "" ?this.contentArray.push(this.blockListForm.value.CU_M_TEL): test12345.push('1'); }
      });

      if(test12345.length > 0){
        this.dialog.open(ConfirmComponent, { data: { msgStr: "勾選欄位不可為空!" } });
        return;
      }

      this.jsonObject['BK_COLUMN'] = this.chkArray;
      this.jsonObject['BK_CONTENT'] = this.contentArray;
      this.jsonObject['applno'] = this.applno;
      this.jsonObject['REPORT_UNIT'] = this.blockListForm.value.REPORT_UNIT;
      this.jsonObject['REPORT_REASON1'] = this.blockListForm.value.REPORT_REASON1;
      this.jsonObject['REPORT_REASON2'] = this.blockListForm.value.REPORT_REASON2;
      this.jsonObject['REPORT_REASON3'] = this.blockListForm.value.REPORT_REASON3;
      this.jsonObject['REPORT_CONTENT'] = this.blockListForm.value.REPORT_CONTENT;
      this.jsonObject['USE_FLAG'] = this.blockListForm.value.USE_FLAG;


      const url = 'f01/childscn20action3';
      this.block = true;
      this.childscn20Service.onsave(url, this.jsonObject).subscribe(data => {
        if (data.rspMsg == "insertSuccess"||data.rspMsg == "saveSuccess") {
          this.dialog.open(ConfirmComponent, { data: { msgStr: "儲存成功" } });
          this.block = false;
          this.selectBlockList(this.pageIndex, this.pageSize);
        }
        else{
          this.dialog.open(ConfirmComponent, { data: { msgStr: "儲存失敗" } });
          this.block = false;
        }
      })
    }
  }

  //查詢客戶資料
  selectCustInfo() {
    const url = 'f01/childscn20action2';
    const applno = this.applno;
    let jsonObject: any = {};
    this.childscn20Service.gettable(url, applno, jsonObject).subscribe(data => {
      this.blockListForm.patchValue({ 'CU_CNAME': data.rspBody.list[0].cuCname })
      this.blockListForm.patchValue({ 'NATIONAL_ID': data.rspBody.list[0].nationalId })
      this.blockListForm.patchValue({ 'CU_H_TEL': data.rspBody.list[0].cuHTel })
      this.blockListForm.patchValue({ 'CU_CP_TEL': data.rspBody.list[0].cuCpTel })
      this.blockListForm.patchValue({ 'CU_M_TEL': data.rspBody.list[0].cuMTel })
      this.blockListForm.patchValue({ 'RID': data.rspBody.list[0].rid })

    })
  }

  //查詢資料表
  selectBlockList(pageIndex: number, pageSize: number) {
    const url = 'f01/childscn20action1';
    const applno = this.applno;

    let jsonObject: any = {};
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;

    this.childscn20Service.gettable(url, applno, jsonObject).subscribe(data => {
      this.blockListDataSource = data.rspBody.list;

      for(const items of this.blockListDataSource){
        if(items.bkColumn=="CU_CNAME")

        switch(items.bkColumn){
          case "CU_CNAME":
            items.bkColumn="姓名"
            break;
        }
        if(items.bkColumn=="NATIONAL_ID")
        switch(items.bkColumn){
          case "NATIONAL_ID":
            items.bkColumn="身分證字號"
            break;
        }
        if(items.bkColumn=="CU_H_TEL")
        switch(items.bkColumn){
          case "CU_H_TEL":
            items.bkColumn="住家電話"
            break;
        }
        if(items.bkColumn=="CU_CP_TEL")
        switch(items.bkColumn){
          case "CU_CP_TEL":
            items.bkColumn="公司電話"
            break;
        }
        if(items.bkColumn=="CU_M_TEL")
        switch(items.bkColumn){
          case "CU_M_TEL":
            items.bkColumn="手機號碼"
            break;
        }

      }
      this.total = data.rspBody.size;
      this.loading = false;
    })
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.selectBlockList(this.pageIndex, this.pageSize);
  }
}
