import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { MenuListService } from 'src/app/menu-list/menu-list.service';
import { F06005Service } from '../f06005.service';

interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f06005pickup',
  templateUrl: './f06005pickup.component.html',
  styleUrls: ['./f06005pickup.component.css', '../../../assets/css/f03.css']
})
export class F06005pickupComponent implements OnInit {
  closeButton: boolean = true
  dataList: any;
  block: boolean = false;
  bcnList: any[] = []; //銀行名下拉
  bcnListCode: any[] = []; //銀行名下拉
  bcnValue: string = ""; //銀行名值
  bbCList: any[] = []; //分行別下拉
  bbCListCode: any[] = []; //分行別下拉
  bbcValue: string = ""; //分行別值
  empno: string //員編
  instalTransFeeCode: sysCode[] = []//轉帳/匯款手續費下拉
  instalTransFeeString: string//轉帳/匯款手續費值
  instalTransFeeNumber: number//轉帳/匯款手續費
  applicationDebtStrgy: string//方案別
  

  accounForm: FormGroup = this.fb.group({
    APPLNO: ['', []],      // 案編
    CUST_ID: ['', []],      // 客戶ID
    CU_CNAME: ['', []],           // 姓名
    ACC_TYPE: ['', []],   // 數位存款帳戶類型
    PROD_TYPE_CODE: ['', []],      // 產品類型
    AGREE_TYPE: ['', []],// 合約條款版控
    PROD_NAME: ['', []],    // 合約條款版控
    APPROVE_INTEREST: ['', []],     // 利率
    PERIOD: ['', []],   // 貸款期間
    REPAYMENT_METHOD: ['', []],   // 還款方式代碼
    RPAYDAY: ['', []],   // 還款日
    AJSTLNAMT: ['', []],   // 貸款金額
    STRGY_ORIGINFEE: ['', []],   // 開辦費
    ACC_STATUS_CODE: ['', []],   // 帳戶狀態
    DSBSBNKCD: ['', []],   // 銀行名
    DSBSBRCD: ['', []],   // 分行別
    DSBSACCTNBR: ['', []],   // 撥款帳號
    INTER_BANK_TRANS_FEE: ['', []],   // 轉帳手續費
    TOTAL: ['', []],   // 實際撥款金額

  });

  constructor(
    public dialogRef: MatDialogRef<F06005pickupComponent>,
    private F06005Service: F06005Service,
    private BaseService: BaseService,
    private menuListService: MenuListService,
    private fb: FormBuilder,
    private pipe: DatePipe,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.getData()
    this.empno = BaseService.userId;

  }
  formControl222 = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);
  //欄位驗證
  getErrorMessage() {
    return this.formControl222.hasError('required') ? '此欄位必填!' : '';

  }


  //目前工作年資(客戶填寫)


  getData() {
    const url = 'f06/f06005action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno
    this.F06005Service.getData(url, jsonObject).subscribe(data => {
      if (data.rspMsg == '該案件錯誤!') {
        this.dialog.closeAll()
        return this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }

        })

      }
      else {
        this.dataList = data.rspBody.dataList
        this.bcnList = data.rspBody.bcnList
        this.bbCList = data.rspBody.bbCList
        this.applicationDebtStrgy = this.dataList.APPLICATION_DEBT_STRGY
        //銀行名下拉
        for (const jsonObj of this.bcnList) {
          const codeNo = jsonObj.bnkCd;
          const desc = jsonObj.bnkNm;
          this.bcnListCode.push({ value: codeNo, viewValue: desc })
        }
        //分行別下拉
        for (const jsonObj of this.bbCList) {
          const codeNo = jsonObj.branchCd;
          const desc = jsonObj.branchNm;
          this.bbCListCode.push({ value: codeNo, viewValue: desc })
        }
        //客戶基本資料
        this.getInstalTransFeeCode()
        this.accounForm.patchValue({ APPLNO: data.rspBody.dataList.APPLNO })
        this.accounForm.patchValue({ CUST_ID: data.rspBody.dataList.CUST_ID })
        this.accounForm.patchValue({ CU_CNAME: data.rspBody.dataList.CU_CNAME })
        this.accounForm.patchValue({ ACC_TYPE: data.rspBody.dataList.ACC_TYPE })
        this.accounForm.patchValue({ PROD_TYPE_CODE: data.rspBody.dataList.PROD_TYPE_CODE })
        this.accounForm.patchValue({ AGREE_TYPE: data.rspBody.dataList.AGREE_TYPE })
        this.accounForm.patchValue({ PROD_NAME: data.rspBody.dataList.PROD_NAME })
        this.accounForm.patchValue({ APPROVE_INTEREST: data.rspBody.dataList.APPROVE_INTEREST })
        this.accounForm.patchValue({ PERIOD: data.rspBody.dataList.PERIOD })
        this.accounForm.patchValue({ REPAYMENT_METHOD: data.rspBody.dataList.REPAYMENT_METHOD })
        this.accounForm.patchValue({ RPAYDAY: data.rspBody.dataList.RPAYDAY })
        this.accounForm.patchValue({ AJSTLNAMT: data.rspBody.dataList.AJSTLNAMT != undefined ? this.toCurrency(data.rspBody.dataList.AJSTLNAMT) : Number(0) })
        this.accounForm.patchValue({ STRGY_ORIGINFEE: data.rspBody.dataList.STRGY_ORIGINFEE != undefined ? this.toCurrency(data.rspBody.dataList.STRGY_ORIGINFEE) : Number(0) })
        this.accounForm.patchValue({ ACC_STATUS_CODE: data.rspBody.dataList.ACC_STATUS_CODE })
        this.accounForm.patchValue({ DSBSBNKCD: data.rspBody.dataList.DSBSBNKCD })
        this.accounForm.patchValue({ DSBSBRCD: data.rspBody.dataList.DSBSBRCD })
        this.accounForm.patchValue({ DSBSACCTNBR: data.rspBody.dataList.DSBSACCTNBR })
        this.accounForm.patchValue({ INTER_BANK_TRANS_FEE: this.instalTransFeeNumber })
        this.getDsbsbrcdCode(data.rspBody.dataList.DSBSBNKCD);
      }
    })
  }

  getInstalTransFeeCode() {
    this.BaseService.getSysTypeCode('INSTAL_TRANS_FEE').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeTag;
        const desc = jsonObj.codeDesc;
        this.instalTransFeeCode.push({ value: codeNo, viewValue: desc });
        console.log(this.instalTransFeeCode)
      }
      this.getDsbsbrcdCode(this.accounForm.value.DSBSBNKCD);
      if (this.instalTransFeeCode.length > 0) {
        if (Number(this.dataList.AJSTLNAMT) > 2000000) {
          this.instalTransFeeString = this.instalTransFeeCode[0].viewValue
          this.instalTransFeeNumber = Number(this.instalTransFeeCode[0].value)
         
            this.accounForm.patchValue({ INTER_BANK_TRANS_FEE: this.instalTransFeeNumber })
        } else if (2000000 >= Number(this.dataList.AJSTLNAMT)) {
          this.instalTransFeeString = this.instalTransFeeCode[0].viewValue
          this.instalTransFeeNumber = Number(this.instalTransFeeCode[1].value)
         
            this.accounForm.patchValue({ INTER_BANK_TRANS_FEE: this.instalTransFeeNumber })
        }
      }
      if (this.applicationDebtStrgy == '01') {
      
        this.accounForm.patchValue({ TOTAL: this.toCurrency((this.checNull(Number(this.toNumber(this.accounForm.value.AJSTLNAMT))) - this.checNull(Number(this.accounForm.value.STRGY_ORIGINFEE)) - Number(this.accounForm.value.INTER_BANK_TRANS_FEE)).toString()) })
      } else if (this.applicationDebtStrgy == '03' || this.dataList.DSBSBNKCD == '824') {
        this.accounForm.patchValue({ TOTAL:this.toCurrency(this.checNull(Number(this.toNumber(this.accounForm.value.AJSTLNAMT))).toString()) })


      }
    });
  }

  updateElCreditmain() {
    this.block = true;
    const url = 'f06/f06005action2';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno //案編
    jsonObject['custId'] = this.data.custId //customer ID
    jsonObject['b1empno'] = this.empno //員編
    jsonObject['dsbsbnkcd'] = this.accounForm.value.DSBSBNKCD//銀行名
    jsonObject['dsbsbrcd'] = this.accounForm.value.DSBSBRCD //銀行分支
    jsonObject['acctNbr'] = this.accounForm.value.DSBSACCTNBR//撥款帳號
    this.F06005Service.getData(url, jsonObject).subscribe(data => {
      this.F06005Service.resetfn(jsonObject);
      if (data.rspMsg == 'success') {
        data.rspMsg = "執行成功"
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
        this.saveData()
        this.onNoClick()
        this.block = false;

      } else {
        this.block = false;
        const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
        this.onNoClick()
      }
    })
  }

  saveData() {
    const url = 'f06/f06005action3';
    let jsonObject: any = {};
    jsonObject['applno'] = this.accounForm.value.APPLNO
    jsonObject['b1empno'] = this.empno
    jsonObject['CUST_ID'] = this.accounForm.value.CUST_ID
    jsonObject['CU_CNAME'] = this.accounForm.value.CU_CNAME
    jsonObject['ACC_TYPE'] = this.accounForm.value.ACC_TYPE
    jsonObject['PROD_TYPE_CODE'] = this.accounForm.value.PROD_TYPE_CODE
    jsonObject['AGREE_TYPE'] = this.accounForm.value.AGREE_TYPE
    jsonObject['PROD_NAME'] = this.accounForm.value.PROD_NAME
    jsonObject['APPROVE_INTEREST'] = this.accounForm.value.APPROVE_INTEREST
    jsonObject['PERIOD'] = this.accounForm.value.PERIOD
    jsonObject['REPAYMENT_METHOD'] = this.accounForm.value.REPAYMENT_METHOD
    jsonObject['RPAYDAY'] = this.accounForm.value.RPAYDAY
    jsonObject['ajstlnamt'] = this.accounForm.value.AJSTLNAMT
    jsonObject['STRGY_ORIGINFEE'] = this.accounForm.value.STRGY_ORIGINFEE
    jsonObject['ACC_STATUS_CODE'] = this.accounForm.value.ACC_STATUS_CODE
    jsonObject['dsbsbnkcd'] = this.accounForm.value.DSBSBNKCD
    jsonObject['dsbsbrcd'] = this.accounForm.value.DSBSBRCD
    jsonObject['dsbsacctnbr'] = this.accounForm.value.DSBSACCTNBR
    jsonObject['ACC_CU_CNAME'] = this.accounForm.value.ACC_CU_CNAME
    jsonObject['ACC_STRGY_ORIGINFEE'] = this.accounForm.value.ACC_STRGY_ORIGINFEE
    jsonObject['INTER_BANK_TRANS_FEE'] = this.accounForm.value.INTER_BANK_TRANS_FEE
    this.F06005Service.inquiry(url, jsonObject).subscribe(data => {
      if (data.msgStr == 'success' || data.rspCode == '0000') {
        data.msgStr = "儲存成功"
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.msgStr }
        });
        this.insertHistory()
        this.onNoClick()
      } else if (data.rspCode == '9999') {
        this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
      } else {
        const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: data.msgStr } });
        return
      }
    })
  }
  onNoClick(): void {
    this.dialogRef.close();
    this.closeButton = false
  }
  //取分行別下拉
  getDsbsbrcdCode(value: string) {
    if(value=='824'){
      this.accounForm.patchValue({ INTER_BANK_TRANS_FEE:'0' })
      this.accounForm.patchValue({ TOTAL: this.toCurrency((this.checNull(Number(this.toNumber(this.accounForm.value.AJSTLNAMT))) - this.checNull(Number(this.accounForm.value.STRGY_ORIGINFEE)) - Number(this.accounForm.value.INTER_BANK_TRANS_FEE)).toString()) })
    }else{
      this.accounForm.patchValue({INTER_BANK_TRANS_FEE:this.instalTransFeeNumber})
      this.accounForm.patchValue({ TOTAL: this.toCurrency((this.checNull(Number(this.toNumber(this.accounForm.value.AJSTLNAMT))) - this.checNull(Number(this.accounForm.value.STRGY_ORIGINFEE)) - Number(this.accounForm.value.INTER_BANK_TRANS_FEE)).toString()) })

    }
    this.bbCList = []
    this.bbCListCode = []
    const url = 'f06/f06005action4';
    let jsonObject: any = {};
    jsonObject['dsbsbnkcd'] = value
    this.F06005Service.inquiry(url, jsonObject).subscribe(data => {
      this.bbCList = data.rspBody

      //分行別下拉
      for (const jsonObj of this.bbCList) {
        const codeNo = jsonObj.branchCd;
        const desc = jsonObj.branchNm;
        this.bbCListCode.push({ value: codeNo, viewValue: desc })
      }

    })
  }

  insertHistory() {
    const content = []
    let msg = '';
    let jsonObject: any = {};
    content.push(
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'CUST_ID',
        originalValue: this.dataList.CUST_ID,
        currentValue: this.accounForm.value.CUST_ID,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'CU_CNAME',
        originalValue: this.dataList.CU_CNAME,
        currentValue: this.accounForm.value.CU_CNAME,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'ACC_TYPE',
        originalValue: this.dataList.ACC_TYPE,
        currentValue: this.accounForm.value.ACC_TYPE,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'PROD_TYPE_CODE',
        originalValue: this.dataList.PROD_TYPE_CODE,
        currentValue: this.accounForm.value.PROD_TYPE_CODE,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'AGREE_TYPE',
        originalValue: this.dataList.AGREE_TYPE,
        currentValue: this.accounForm.value.AGREE_TYPE,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'PROD_NAME',
        originalValue: this.dataList.PROD_NAME,
        currentValue: this.accounForm.value.PROD_NAME,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'APPROVE_INTEREST',
        originalValue: this.dataList.APPROVE_INTEREST,
        currentValue: this.accounForm.value.APPROVE_INTEREST,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'PERIOD',
        originalValue: this.dataList.PERIOD,
        currentValue: this.accounForm.value.PERIOD,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'REPAYMENT_METHOD',
        originalValue: this.dataList.REPAYMENT_METHOD,
        currentValue: this.accounForm.value.REPAYMENT_METHOD,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'RPAYDAY',
        originalValue: this.dataList.RPAYDAY,
        currentValue: this.accounForm.value.RPAYDAY,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'AJSTLNAMT',
        originalValue: this.dataList.AJSTLNAMT,
        currentValue: this.accounForm.value.AJSTLNAMT,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'STRGY_ORIGINFEE',
        originalValue: this.dataList.STRGY_ORIGINFEE,
        currentValue: this.accounForm.value.STRGY_ORIGINFEE,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'ACC_STATUS_CODE',
        originalValue: this.dataList.ACC_STATUS_CODE,
        currentValue: this.accounForm.value.ACC_STATUS_CODE,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        //銀行名
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'DSBSBNKCD',
        originalValue: this.dataList.DSBSBNKCD,
        currentValue: this.accounForm.value.DSBSBNKCD,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        //分行別
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'DSBSBRCD',
        originalValue: this.dataList.DSBSBRCD,
        currentValue: this.accounForm.value.DSBSBRCD,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        //撥款帳號
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'DSBSACCTNBR',
        originalValue: this.dataList.DSBSACCTNBR,
        currentValue: this.accounForm.value.DSBSACCTNBR,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'ACC_CU_CNAME',
        originalValue: this.dataList.ACC_CU_CNAME,
        currentValue: this.accounForm.value.ACC_CU_CNAME,
        transAPname: '轉帳失敗落人後處理',
      },

      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'ACC_STRGY_ORIGINFEE',
        originalValue: this.dataList.ACC_STRGY_ORIGINFEE,
        currentValue: this.accounForm.value.ACC_STRGY_ORIGINFEE,
        transAPname: '轉帳失敗落人後處理',
      },
      {
        userId: BaseService.userId,
        applno: this.accounForm.value.APPLNO,
        tableName: 'EL_ADDITIONAL_INFO',
        columnName: 'INTER_BANK_TRANS_FEE',
        originalValue: this.dataList.INTER_BANK_TRANS_FEE,
        currentValue: this.accounForm.value.INTER_BANK_TRANS_FEE,
        transAPname: '轉帳失敗落人後處理',
      },
    )
    jsonObject['content'] = content;

    this.F06005Service.insertHistory(jsonObject).subscribe(data => {
      // msg = data.rspMsg;
    });
  }
  toCurrency(amount: string) {
    return amount != null ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
  checNull(value: number) {
    return value != null ? value : 0;
  }
  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\w\s]|_/g, '') : data;
  }
  // 離開該彈窗
  cancel(): void {
    this.dialogRef.close();
    this.closeButton = false
  }
}
