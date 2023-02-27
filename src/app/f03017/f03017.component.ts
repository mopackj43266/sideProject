import { element } from 'protractor'
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { F03017Service } from '../f03017/f03017.service'
import { DatePipe } from '@angular/common'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { MatSort, Sort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { F03017editComponent } from './f03017edit/f03017edit.component'
import { F03017uploadComponent } from './f03017upload/f03017upload.component'
import { NzTableQueryParams } from 'ng-zorro-antd/table'
import { getMaxListeners } from 'process'
import { ConfirmComponent } from '../common-lib/confirm/confirm.component'
import { Subscription } from 'rxjs'
import { BaseService } from '../base.service'
interface sysCode {
  value: string
  viewValue: string
}

@Component({
  selector: 'app-f03017',
  templateUrl: './f03017.component.html',
  styleUrls: ['./f03017.component.css', '../../assets/css/f03.css']
})
export class F03017Component implements OnInit {
  useId: string
  Id: number[] = []
  editreset$: Subscription //rxjs訂閱者
  bkColumnCode: sysCode[] = [] //建檔項目欄位下拉
  bkColumnValue: string //建檔項目欄位
  bkContentValue: string //建檔項目欄位值內容下拉
  chkArray: string[] = [] //勾選欄
  transEmpNo: string = localStorage.getItem('BK_EMPNO')
  contentArray: string[] = [] //勾選欄內容
  isHidden: boolean
  myDate: any = new Date()
  loading = true
  total = 1
  pageSize = 10
  pageIndex = 1
  @ViewChild('CU_CNAME') CU_CNAME: ElementRef
  constructor(
    private f03017Service: F03017Service,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.myDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd-HH:mm:SS')
    // this.editreset$ = this.f03017Service.editreset$.subscribe((data) => {
    //   let jsonObject: any = {}
    //   jsonObject['page'] = this.currentPage.pageIndex + 1
    //   jsonObject['per_page'] = this.currentPage.pageSize
    //   jsonObject['bkColumn'] = this.bkColumnValue
    //   jsonObject['bkContent'] = this.bkContentValue
    //   jsonObject['useId'] = this.useId
    //   this.f03017Service.getReturn('f03/f03017', jsonObject).subscribe(data => {
    //     if (data.rspBody.size != 0) {
    //       this.total = data.rspBody.size
    //       this.bkIncomeDataSource = data.rspBody.items
    //     } else {
    //       const confirmDialogRef = this.dialog.open(ConfirmComponent, {
    //         data: { msgStr: "查無項目!" }
    //       });
    //     }

    //   })
    // });
  }

  bkIncomeForm: FormGroup = this.fb.group({
    Id: [this.data.Id, [Validators.maxLength(30)]],
    BK_COLUMN: [this.data.bkColumnValue, [Validators.maxLength(30)]],
    BK_CONTENT: [this.data.bkContentValue, [Validators.maxLength(30)]],
    CU_CNAME: [this.data.CU_CNAME, []],
    NATIONAL_ID: [this.data.NATIONAL_ID, []],
    CU_H_TEL: [this.data.CU_H_TEL, []],
    CU_CP_TEL: [this.data.CU_CP_TEL, []],
    CU_M_TEL: [this.data.CU_M_TEL, []],
    page: ['', [Validators.maxLength(3)]],
    per_page: ['', [Validators.maxLength(3)]],
  })

  formControl = new FormControl('', [Validators.required])

  ngOnInit(): void {
    this.useId = BaseService.userId
    this.bkColumnValue = ''
    this.currentPage = {
      pageIndex: 0,
      pageSize: 10,
      length: null,
    }
    this.getListValue()
    this.isHidden = false

    // 取得下拉選單資料
  }

  totalCount: any
  @ViewChild('paginator', { static: true }) paginator: MatPaginator
  @ViewChild('sortTable', { static: true }) sortTable: MatSort
  currentPage: PageEvent
  currentSort: Sort
  bkIncomeDataSource = [];

  ngAfterViewInit() {

    this.currentSort = {
      active: '',
      direction: '',
    }
    this.paginator.page.subscribe((page: PageEvent) => {
      this.currentPage = page
    })
  }
  changeSort(sortInfo: Sort) {
    this.currentSort = sortInfo
  }
  // 建檔項目選項
  getListValue() {
    this.f03017Service.getSysTypeCode('BLACK_ITEM').subscribe(data => {
      this.bkColumnCode.push({ value: '', viewValue: '請選擇' })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo
        const desc = jsonObj.codeDesc
        this.bkColumnCode.push({ value: codeNo, viewValue: desc })
      }
    })
  }
  // 欄位標題文字轉換
  chageColumntext(codeVal: string): string {
    for (const data of this.bkColumnCode) {
      if (data.value == codeVal) {
        return data.viewValue
        break
      }
    }
    return codeVal
  }

  // 取得table資料
  async getBkIncomeData() {
    if (this.bkColumnValue == '' || this.bkColumnValue == null) {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇建檔項目" }
      });
    } else if (this.bkContentValue == null || this.bkContentValue == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇建檔內容" }
      });
    } else {
      let jsonObject: any = {}
      jsonObject['page'] = this.currentPage.pageIndex + 1
      jsonObject['per_page'] = this.currentPage.pageSize
      jsonObject['bkColumn'] = this.bkColumnValue
      jsonObject['bkContent'] = this.bkContentValue
      jsonObject['useId'] = this.useId
      await this.f03017Service.getReturn('f03/f03017', jsonObject).subscribe(data => {
        if (data.rspBody.size != 0) {
          this.total = data.rspBody.size
          this.bkIncomeDataSource = data.rspBody.items
        } else {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "查無項目!" }
          });
        }

      })
      this.loading = false
    }

    // if (typeof this.bkColumnValue == 'undefined')
    // {return alert('請選擇建檔項目')}
    // else if(typeof this.bkColumnValue == null){return alert('請選擇建檔內容')}
    // else if(typeof this.bkContentValue == 'undefined'){return alert('請選擇建檔內容')}
    // else if(typeof this.bkContentValue == null){return alert('請選擇建檔內容')}
  }

  // onQueryParamsChange(params: NzTableQueryParams): void {
  //   const { pageSize, pageIndex } = params;
  //   this.pageSize=pageSize;
  //   this.pageIndex=pageIndex;
  //   this.getBkIncomeData(pageIndex, pageSize);

  // }

  //新增
  insert(isInsert: boolean) {
    const dialogRef = this.dialog.open(F03017editComponent, {
      minHeight: '80vh',
      width: '50%',
      panelClass: 'mat-dialog-transparent',
      data: {
        isInsert: isInsert,
        isUpdate: false,
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (this.bkColumnValue != '' && this.bkColumnValue != null && this.bkContentValue == null || this.bkContentValue == '') { this.getBkIncomeData(); }
      // if (result != null && result.event == 'success') {
      // 	this.refreshTable()
      // }
    })
  }

  //編輯
  update(isUpdate: boolean, data: any, row: any) {
    this.chkArray.forEach(element => {
      var checked: boolean = true
      if (element === 'CU_CNAME') {
        this.contentArray.push(this.bkIncomeForm.value.CU_CNAME)
      }
      if (element === 'NATIONAL_ID') {
        this.contentArray.push(this.bkIncomeForm.value.NATIONAL_ID)
      }
      if (element === 'CU_H_TEL') {
        this.contentArray.push(this.bkIncomeForm.value.CU_H_TEL)
      }
      if (element === 'CU_CP_TEL') {
        this.contentArray.push(this.bkIncomeForm.value.CU_CP_TEL)
      }
      if (element === 'CU_M_TEL') {
        this.contentArray.push(this.bkIncomeForm.value.CU_M_TEL)
      }
    })

    this.bkColumnValue = data.BK_COLUMN;
    this.bkContentValue = data.BK_CONTENT;
    const dialogRef = this.dialog.open(F03017editComponent, {
      minHeight: '80vh',
      width: '70%',
      panelClass: 'mat-dialog-transparent',
      data: {
        // BK_COLUMN:chkArray,
        // BK_CONTENT :contentArray,
        isUpdate: isUpdate,
        isInsert: false,
        rowID: row,
        reportReason1Value: data.REPORT_REASON1,
        reportReason2Value: data.REPORT_REASON2,
        reportReason3Value: data.REPORT_REASON3,
        USE_FLAG: data.USE_FLAG,
        REPORT_CONTENT: data.REPORT_CONTENT,
        BK_CONTENT: data.BK_CONTENT,
        BK_COLUMN: data.BK_COLUMN,

        // CU_CNAME:data.bkContent,
        //   NATIONAL_ID:data.bkContent,
        //   CU_H_TEL:data.bkContent,
        //   CU_CP_TEL:data.bkContent,
        //   CU_M_TEL:data.bkContent,
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'change') {
        this.clear();
      } else {
        this.getBkIncomeData();
        this.bkContentValue = '',
          this.bkColumnValue = '',
          this.bkColumnCode = [],
          this.getListValue();
      }
    })
  }
  //清除資料
  clear() {
    this.bkContentValue = '',
      this.bkColumnValue = '',
      this.bkColumnCode = [],
      this.getListValue(),
      this.bkIncomeDataSource = null;
  }

  //上傳EXCEL
  uploadExcel() {
    const dialogRef = this.dialog.open(F03017uploadComponent, {
      data: {
        ABNORMAL_NID: '',
        ABNORMAL_NAME: '',
        ON_CHECK: 'Y',
        TRANSFER_EMPNO: '',
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.refreshTable()
      }
    })
  }
  refreshTable() {
    let jsonObject: any = {}

    jsonObject['page'] = this.currentPage.pageIndex + 1
    jsonObject['per_page'] = this.currentPage.pageSize
    jsonObject['bkColumn'] = this.bkColumnValue
    jsonObject['bkContent'] = this.bkContentValue
    jsonObject['useId'] = this.useId
    this.f03017Service.getReturn('f03/f03017', jsonObject).subscribe(data => {
      if (data.rspBody.size != 0) {
        this.total = data.rspBody.size
        this.bkIncomeDataSource = data.rspBody.items
      } else {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無項目!" }
        });
      }

    })
    this.loading = false
  }

  //從客戶資訊查詢客戶手機
  getBkInfo(bkColumn: string, bkContent: string) {
    let jsonObject: any = {}
    jsonObject['page'] = this.currentPage.pageIndex + 1
    jsonObject['per_page'] = this.currentPage.pageSize
    jsonObject['bkColumn'] = bkColumn
    jsonObject['bkContent'] = bkContent
    this.f03017Service.getImpertmentParameter(jsonObject).subscribe(data => {
      // this.clear();
    })
  }
}
