import { Component, ElementRef, OnInit, Inject, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { F06002Service } from '../../f06002.service';
import { F06004Service } from '../../../f06004/f06004.service';
import { OptionsCode } from '../../../interface/base';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { DatePipe } from '@angular/common';
import { DeleteConfirmComponent } from 'src/app/common-lib/delete-confirm/delete-confirm.component';
import { F06004debtComponent } from '../../../f06004/f06004debt/f06004debt.component';
import { toNumber } from 'ng-zorro-antd/core/util';
import { Router } from '@angular/router';


@Component({
  selector: 'app-f06002page2step4',
  templateUrl: './f06002page2step4.component.html',
  styleUrls: ['./f06002page2step4.component.css']
})
export class F06002page2step4Component implements OnInit {
  dataSource = [];
  newData = [];
  // pageIndex = 1;
  // total: number;
  // readonly pageSize = 50;

  rowId: string;
  custContent: string;
  prodName: string;
  aprvDebtAmt: string;
  dsbsacctnbr: string;
  rpayacctnbr: string;
  aprvInstCashAmt: string;
  ajstlnamt: string;
  settleDate: string;
  oriSettleDate: string;
  period: string;
  periodCode: OptionsCode[] = [{ value: '', viewValue: '請選擇' }];
  periodMin: string;
  periodMax: string;
  monthLowAmt: string; //帶確認
  ok: boolean = false;
  goldenKey: string = '';
  lastDisbursementTimeCheck: boolean = true;

  debtData = [];
  pageSize = 50;
  pageIndex = 1;
  total = 0;

  dsbsacctnbrList: OptionsCode[] = [];
  rpayacctnbrList: OptionsCode[] = [];
  listBoolean: boolean;
  memberType: string;
  newAccNbr: string;

  showDate: number[] = [];
  checkTime: string = '';
  opidCheck: string;
  block: boolean = false;

  // 20220908 PM-REQ-17 新增銀(分)行別
  dsbsbnkcd: string; // 撥款銀行代碼
  dsbsbrcd: string; // 撥款銀行分行代碼
  rpaybnkcd: string; // 還款帳號銀行代碼
  @ViewChild('absBox') absBox: ElementRef             // 抓取table id
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private f06002Service: F06002Service,
    public f06004Service: F06004Service,
    private dialog: MatDialog,
    private pipe: DatePipe,
    private router: Router
  ) { }

  // 計算剩餘table資料長度
  get tableHeight(): string {
    if (this.absBox) {
      return (this.absBox.nativeElement.offsetHeight - 190) + 'px';
    }
  }

  // ngOnInit(): void {
  //   console.log(sessionStorage)
  // }
  ngOnInit(): void {
    // remove session
    sessionStorage.removeItem('bcnValueForStep3');
    sessionStorage.removeItem('bbcValueForStep3');

    // applno: applno,
    // nationalId: nationalId,
    // custId: custId,
    // cuCname: cuCname

    this.data.applno = sessionStorage.getItem('applno');
    this.getDate();
    // this.data.custId = sessionStorage.getItem('custId');
    // this.data.nationalId = sessionStorage.getItem('nationalId');
    // this.data.cuCname = sessionStorage.getItem('cuCname');

    let jsonObject: any = {};
    let baseUrl = 'f06/f06004action2';
    jsonObject['applno'] = this.data.applno;

    // jsonObject['applno'] = '20220407A000013';
    this.f06004Service.getData(baseUrl, jsonObject).subscribe(data => {
      this.checkTime = data.rspBody.checkTime;
      this.periodCalculate(data.rspBody.applictionInfo[0].CTRT_MAX_PRD, data.rspBody.applictionInfo[0].CTRT_MIN_PRD);
      this.rowId = data.rspBody.applictionInfo[0].RID;
      this.prodName = data.rspBody.applictionInfo[0].PROD_CODE + data.rspBody.applictionInfo[0].PROD_NAME;
      this.aprvDebtAmt = data.rspBody.applictionInfo[0].APRV_DEBT_AMT ? this.f06004Service.toCurrency(data.rspBody.applictionInfo[0].APRV_DEBT_AMT.toString()) : '';
      this.dsbsacctnbr = data.rspBody.applictionInfo[0].DSBSACCTNBR ? data.rspBody.applictionInfo[0].DSBSACCTNBR : '';
      this.rpayacctnbr = data.rspBody.applictionInfo[0].RPAYACCTNBR ? data.rspBody.applictionInfo[0].RPAYACCTNBR : '';
      this.aprvInstCashAmt = data.rspBody.applictionInfo[0].APRV_INST_CASH_AMT != null ? this.f06004Service.toCurrency(data.rspBody.applictionInfo[0].APRV_INST_CASH_AMT.toString()) : '0';
      this.ajstlnamt = data.rspBody.applictionInfo[0].AJSTLNAMT != null ? this.f06004Service.toCurrency(data.rspBody.applictionInfo[0].AJSTLNAMT.toString()) : '0';
      this.settleDate = data.rspBody.applictionInfo[0].SETTLE_DATE ? data.rspBody.applictionInfo[0].SETTLE_DATE : '';
      this.oriSettleDate = this.settleDate;
      this.period = data.rspBody.applictionInfo[0].PERIOD ? data.rspBody.applictionInfo[0].PERIOD.toString() : '';
      this.monthLowAmt = data.rspBody.applictionInfo[0].MONTH_LOW_AMT ? this.f06004Service.toCurrency(data.rspBody.applictionInfo[0].MONTH_LOW_AMT) : '';
      this.custContent = data.rspBody.applictionInfo[0].CUST_CONTENT ? data.rspBody.applictionInfo[0].CUST_CONTENT : '';
      this.debtData = data.rspBody.debtBankDetail;
      this.data.custId = data.rspBody.applictionInfo[0].CUST_ID ? data.rspBody.applictionInfo[0].CUST_ID : '';
      this.data.nationalId = data.rspBody.applictionInfo[0].NATIONAL_ID ? data.rspBody.applictionInfo[0].NATIONAL_ID : '';
      this.data.cuCname = data.rspBody.applictionInfo[0].CU_CNAME ? data.rspBody.applictionInfo[0].CU_CNAME : '';
      let baseUrl = 'f06/f06004action12';
      this.f06004Service.getData(baseUrl, jsonObject).subscribe(data => {
        this.dsbsbnkcd = data.rspBody.bankName;
        this.dsbsbrcd = data.rspBody.branchName;
        this.rpaybnkcd = data.rspBody.rpaybankName;
      });
      if (this.check() && !this.calculateDate()) {
        this.ok = true;
      }

      this.dsbsacctnbrList.push({ value: this.dsbsacctnbr, viewValue: this.dsbsacctnbr });
      this.rpayacctnbrList.push({ value: this.rpayacctnbr, viewValue: this.rpayacctnbr });

      this.memberType = data.rspBody.type;
      this.listBoolean = data.rspBody.dpstAcctList;
      if (data.rspBody.dpstAcctList) {
        for (let index = 0; index < data.rspBody.dpstAcctList.length; index++) {
          this.dsbsacctnbrList.push({ value: data.rspBody.dpstAcctList[index].acctNbr, viewValue: data.rspBody.dpstAcctList[index].acctNbr });
          this.rpayacctnbrList.push({ value: data.rspBody.dpstAcctList[index].acctNbr, viewValue: data.rspBody.dpstAcctList[index].acctNbr });
        }
      }

      this.monthLowAmt = data.rspBody.monthLowAmt != '' ? this.f06004Service.toCurrency(data.rspBody.monthLowAmt.toString()) : '';
    })
  }

  getDate() {
    let jsonObject: any = {};
    jsonObject['applno'] = sessionStorage.getItem('applno');
    this.f06004Service.getData("f06/f06004action11", jsonObject).subscribe(data => {
      if (data.rspBody != null) {
        for (let index = 0; index < data.rspBody.length; index++) {
          this.showDate.push(Number(data.rspBody[index]));
        }
      }
    });
  }

  // 參數
  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageIndex } = params;
    if (this.pageIndex !== pageIndex) {
      this.pageIndex = pageIndex;
      this.newData = this.f06004Service.getTableDate(pageIndex, this.pageSize, this.dataSource);

    }
  }

  //計算期數
  periodCalculate(max: number, min: number) {
    let num = min;
    this.periodCode.push({ value: min.toString(), viewValue: min.toString() });
    for (let i = 0; i < ((max - min) / 12); i++) {
      num = Number(num) + 12;
      this.periodCode.push({ value: num.toString(), viewValue: num.toString() });
    }
  }

  async save() {
    if (this.check()) {
      if (this.calculateDate()) {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '結清日請選擇當日及之後!如超過下午三點請選擇隔日' }
        });
      } else {
        console.log('Else');
        this.ok = this.check();
        let jsonObject: any = {};
        let baseUrl = 'f06/f06004action3';
        jsonObject['rowId'] = this.rowId;
        jsonObject['applno'] = this.data.applno;
        // jsonObject['applno'] = '20220407A000013';
        // jsonObject['dsbsacctnbr'] = this.dsbsacctnbr;
        // jsonObject['rpayacctnbr'] = this.rpayacctnbr;
        // jsonObject['ajstlnamt'] = this.f06004Service.toNumber(this.ajstlnamt);
        jsonObject['settleDate'] = this.pipe.transform(new Date(this.settleDate), 'yyyyMMdd');
        jsonObject['custContent'] = this.custContent;
        // jsonObject['period'] = this.period;
        this.f06004Service.saveData(baseUrl, jsonObject).subscribe(data => {
          if (this.settleDate != this.oriSettleDate) {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: data.rspBody + '/n ※ 結清日異動，請確認結清金額是否需修改或重查! ※' }
            });
            this.oriSettleDate = this.settleDate;
          } else {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: data.rspBody }
            });
          }
        });
      }
    } else {
      this.ok = false;
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '欄位不可以為空值!' }
      });
    }
  }

  check(): boolean {
    if (
      // this.dsbsacctnbr == '' || this.rpayacctnbr == '' ||
      this.settleDate == '' || this.settleDate == null
      // || this.period == ''
    ) {
      return false;
    }
    // if (!this.only2Boolean) {
    //   if (this.ajstlnamt == '') {
    //     return false;
    //   }
    // }
    return true;
  }

  edit(guid: string, oriGuid: string, mergDebtAmt: number, isSelected: string, mergDebtProd: string) {
    if (this.rpayacctnbr == '' || !this.ok || this.calculateDate()) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '結清日及還款帳號不符合或未儲存!' }
      });
    } else {
      const dialogRef = this.dialog.open(F06004debtComponent, {
        panelClass: 'mat-dialog-transparent',
        height: '90%',
        width: '90%',
        data: {
          guid: guid,
          oriGuid: oriGuid,
          applno: this.data.applno,
          custId: this.data.custId,
          // applno: '20220407A000013',
          // custId: '1000123123',
          mergDebtAmt: mergDebtAmt,
          isSelected: isSelected,
          mergDebtProd: mergDebtProd
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      })
    }
  }

  del(guid: string, bankCode: string, branchCd: string) {
    const dialogRef = this.dialog.open(DeleteConfirmComponent, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: { msgStr: "" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.value == 'confirm') {
        let jsonObject: any = {};
        let baseUrl = 'f06/f06004action7';
        jsonObject['applno'] = this.data.applno;
        jsonObject['bankCode'] = bankCode;
        jsonObject['guid'] = guid;
        jsonObject['branchCd'] = branchCd;
        this.f06004Service.delete(baseUrl, jsonObject).subscribe(data => {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: data.rspBody }
          });
          if (data.rspBody == '刪除成功') {
            this.ngOnInit();
          }
        });
      }
    })
  }

  async finish(frstCrtnGuid: string): Promise<any> {

    let checkBlank = [];
    let checkNotLineBank = [];
    let checkCreditCard = [];
    let checkAccNo = [];
    for (let i = 0; i < this.debtData.length; i++) {
      checkBlank.push(this.debtData[i].SETTLE_AMT);
      checkBlank.push(this.debtData[i].ACCOUNT_NO);
      checkBlank.push(this.debtData[i].ACCOUNT_NM);
      checkAccNo.push(this.debtData[i].ACCOUNT_NO);
      if (!(this.debtData[i].BANK_CODE == '824')) {
        checkNotLineBank.push(this.debtData[i].BRANCH_CD);
      }
      if (this.debtData[i].MERG_DEBT_PROD == 'CreditCard') {
        checkCreditCard.push(this.debtData[i].SETTLE_CARD_NO);
      }
    }

    if (!this.f06004Service.checkBlank(checkBlank)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '結清金額、匯款帳號、匯款戶名未填寫!' }
      });
      return;
    }

    if (!this.f06004Service.checkBlank(checkNotLineBank)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '非連線銀行分行別未填寫!' }
      });
      return;
    }

    if (!this.f06004Service.checkBlank(checkCreditCard)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: 'CreditCard結清卡號未填寫!' }
      });
      return;
    }

    if (!this.f06004Service.checkOnlyNumber(checkCreditCard)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: 'CreditCard結清卡號請輸入數字!' }
      });
      return;
    }

    if (!this.f06004Service.checkOnlyNumber(checkAccNo)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '匯款帳號請輸入數字!' }
      });
      return;
    }

    if (!this.calculateDate()) {
      if (this.ok) {
        let jsonObjectCheck: any = {};
        jsonObjectCheck['applno'] = this.data.applno;
        this.f06002Service.getOpid(jsonObjectCheck).then((data: any) => {
          if (data.rspCode == '0000') {
            this.opidCheck = data.rspBody;
            this.f06002Service.opidresetfn('2930')
            if ('2920' != this.opidCheck) {
              setTimeout(() => {
                this.router.navigate(['./F06002']);
              }, 1000);
              const confirmDialogRef = this.dialog.open(ConfirmComponent, {
                data: { msgStr: "該案件已不在關卡" + '2920' }
              });
            } else {
              // if (this.f06004Service.checkAcc(this.debtData)) {
              let jsonObject: any = {};
              let baseUrl = 'f06/f06004action6';
              jsonObject['applno'] = this.data.applno;
              // jsonObject['applno'] = '20220407A000013';
              jsonObject['frstCrtnGuid'] = frstCrtnGuid;
              this.block = true;
              this.f06004Service.finish(baseUrl, jsonObject).subscribe(data => {
                if (data.rspCode == '0000') {
                  const childernDialogRef = this.dialog.open(ConfirmComponent, {
                    data: { msgStr: '案件完成!' }
                  });
                  // this.close();
                  this.block = false;
                  // this.router.navigate(['./F06002']);
                  this.f06002Service.setCurrent(4);
                  this.f06002Service.setCheckCurrent({
                    boolean: true
                  });
                } else {
                  const childernDialogRef = this.dialog.open(ConfirmComponent, {
                    data: { msgStr: '執行失敗!' }
                  });
                  this.block = false;
                }
              });
              // } else {
              //   const childernDialogRef = this.dialog.open(ConfirmComponent, {
              //     data: { msgStr: '匯款帳號重複!' }
              //   });
              // }
            }
          }
        });
      } else {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '申請資訊欄位不可為空!如有修改請先進行儲存!' }
        });
      }
    } else {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '結清日請選擇當日及之後!如超過下午三點請選擇隔日' }
      });
    }
  }

  close() {
    // this.dialogRef.close();
  }

  getStyle(value: string) {
    value = value != null ? value.replace(',', '') : value;
    return {
      'text-align': this.f06004Service.isNumber(value) ? 'right' : 'left'
    }
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請輸入數字!' }
      });
      return false;
    }
    return true;
  }

  calculateDate(): boolean {
    if (!this.lastDisbursementTimeCheck) {
      return false;
    }
    let settleDateString: string = (this.pipe.transform(new Date(this.settleDate), 'yyyy-MM-dd'));
    let today13 = new Date(settleDateString + " " + this.checkTime);
    return (new Date().getTime() >= today13.getTime());
  }

  disabledDate = (current: Date): boolean =>
    current && !(this.showDate.includes(new Date(this.pipe.transform(current, 'yyyy/MM/dd')).getTime()));

  //20220621 取最低還款
  getMonthPayForAmt(value: string) {
    if (value != "") {
      if (this.period != "") {
        let jsonObject: any = {};
        jsonObject['applno'] = this.data.applno;
        jsonObject['period'] = this.period;
        jsonObject['lnLmtAmt'] = this.f06002Service.toNumber(value);
        this.f06002Service.getAplyIntRt(jsonObject).subscribe(data => {
          if (data.rspMsg == null) {
            this.monthLowAmt = data.rspBody != '' && data.rspBody != null ? this.f06004Service.toCurrency(data.rspBody.toString()) : '';
          }
        });
      }
    } else {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '金額不可為空!' }
      });
    }
  }

  //20220621 取最低還款
  getMonthPayForPeriod(value: string) {
    if (value != "") {
      if (this.period != "") {
        let jsonObject: any = {};
        jsonObject['applno'] = this.data.applno;
        jsonObject['period'] = value;
        jsonObject['lnLmtAmt'] = this.f06002Service.toNumber(this.ajstlnamt);
        this.f06002Service.getAplyIntRt(jsonObject).subscribe(data => {
          if (data.rspMsg == null) {
            this.monthLowAmt = data.rspBody != '' && data.rspBody != null ? this.f06004Service.toCurrency(data.rspBody.toString()) : '';
          }
        });
      }
    } else {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '期數不可為空!' }
      });
    }
  }

  addAccNbr(acc: string, who: string) {
    if (acc == '' || acc == null) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '自訂帳號不可為空!' }
      });
    } else {
      switch (who) {
        case 'd':
          this.dsbsacctnbrList.push({ value: acc, viewValue: acc });
          break;
        case 'r':
          this.rpayacctnbrList.push({ value: acc, viewValue: acc });
          break;
      }
      this.newAccNbr = '';
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode.toString() === '27') {
      this.lastDisbursementTimeCheck = true;
      this.goldenKey = '';
      return;
    }
    this.goldenKey += event.keyCode.toString();
    if (this.goldenKey === '8283847810310785') {
      this.lastDisbursementTimeCheck = false;
      console.log('Stop Check disbursement time');
    }
  }
}
