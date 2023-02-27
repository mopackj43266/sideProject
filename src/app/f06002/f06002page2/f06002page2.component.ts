import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F06002Service } from '../f06002.service';
import { F06002page2step1Component } from './f06002page2step1/f06002page2step1.component';
import { F06002page2step2Component } from './f06002page2step2/f06002page2step2.component';
import { F06002page2step3Component } from './f06002page2step3/f06002page2step3.component';
import { F06002page2step4Component } from './f06002page2step4/f06002page2step4.component';
import { F06002page2step5Component } from './f06002page2step5/f06002page2step5.component';
import { F06002page2step6Component } from './f06002page2step6/f06002page2step6.component';
import { F06006ConfirmComponent } from 'src/app/f06006/f06006-confirm/f06006-confirm.component';

@Component({
  selector: 'app-f06002page2',
  templateUrl: './f06002page2.component.html',
  styleUrls: ['./f06002page2.component.css'],
})
export class F06002page2Component implements OnInit {

  constructor(
    public dialog: MatDialog,
    public f06002Service: F06002Service,
    private router: Router
  ) {
    this.f06002Service.checkCurrent$.subscribe((data) => {
      this.checkCurrent = data.boolean;
      if (this.checkCurrent) {
        this.changeRouter();
        this.checkCurrent = false;
        this.f06002Service.setCheckCurrent({
          boolean: false
        });
      }
    });
  }

  checkCurrent: false;

  applno: string;
  opid: string;
  flag: string = 'N';
  hidden: boolean = false;
  readonly ifidStep1Next: string = "MMBKELNA045001"; //步驟1(下一步)電文名稱
  block: boolean = false;
  step: string = '下一步';
  pdMinLmtAmt: number = 0;
  opidCheck: string;
  opidBool: boolean = false;
  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.component = F06002page2step1Component;
    // 判斷該筆案件是否有已完成撥款,如果已完成撥款需隱藏重選方案按鈕
    let msg = '';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.f06002Service.getTransferResult(jsonObject).subscribe(data => {
      msg = data.rspMsg;
      if (msg === 'S') {
        this.hidden = true;
      }
    });

    if (this.flag != 'Y') {
      let jsonObject: any = {};
      jsonObject['applno'] = this.applno;
      this.f06002Service.getCreditmainInfo(jsonObject).subscribe(data => {
        if (data.rspCode == '0000') {
          if (data.rspBody.applicationDebtStrgy === '01') {
            this.step = '完成';
          }
          this.opid = data.rspBody.opid;
          switch (this.opid) {
            case '2700': {
              this.component = this.componentList.get('step1');
              this.f06002Service.setCurrent(0);
              break;
            }
            case '2900': {
              this.component = this.componentList.get('step2');
              this.f06002Service.setCurrent(1);
              sessionStorage.setItem('strgy', '03');
              break;
            }
            case '2910': {
              this.component = this.componentList.get('step3');
              this.f06002Service.setCurrent(2);
              break;
            }
            case '2920': {
              this.component = this.componentList.get('step4');
              this.f06002Service.setCurrent(3);
              break;
            }
            case '2930': {
              this.component = this.componentList.get('step5');
              this.f06002Service.setCurrent(4);
              break;
            }
            case '2940': {
              this.component = this.componentList.get('step6');
              this.f06002Service.setCurrent(5);
              break;
            }
          }
          if (data.rspBody.pdMinLmtAmt != null) {
            this.pdMinLmtAmt = data.rspBody.pdMinLmtAmt;
          }
        }
      });
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('strgy')
  }

  index = 'First-content';
  component: any;
  componentList = new Map<string, any>(
    [
      ['step1', F06002page2step1Component],
      ['step2', F06002page2step2Component],
      ['step3', F06002page2step3Component],
      ['step4', F06002page2step4Component],
      ['step5', F06002page2step5Component],
      ['step6', F06002page2step6Component]
    ]
  );

  // 下一步
  async next(): Promise<any> {
    // 第一步
    if (this.f06002Service.getCurrent() === 0) {
      if (sessionStorage.getItem('strgy') === '' || sessionStorage.getItem('strgy') == null) {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請選擇方案" }
        });
        return;
      }
      await this.getCheckOpid('2700', '');
      this.f06002Service.opidresetfn('2700');

      if (this.opidBool) {
        return;
      }
      this.block = true;
      let msg = '';
      let jsonObject: any = {};
      jsonObject['applno'] = this.applno;
      jsonObject['sltdDebtOptCd'] = sessionStorage.getItem('strgy');
      jsonObject['ifId'] = 'MMBKELNA045001';
      this.f06002Service.stepHandle(jsonObject).subscribe(data => {
        this.block = false;
        msg = data.rspMsg;
        if (msg === '執行失敗') {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: msg }
          });
          return;
        } else {
          if (sessionStorage.getItem('strgy') === '01') {
            this.f06002Service.setCurrent(this.f06002Service.getCurrent() + 2);
            this.f06002Service.opidresetfn('2910');
            this.changeRouter();
            this.step = '完成';
            return;
          } else {
            this.f06002Service.setCurrent(this.f06002Service.getCurrent() + 1);
            this.f06002Service.opidresetfn('2920');
            this.changeRouter();
            return;
          }
        }
      });
    }
    // 第二步
    if (this.f06002Service.getCurrent() === 1) {
      this.f06002Service.opidresetfn('2900');
      this.f06002Service.resetfn1();
      let array = [];
      array = JSON.parse(sessionStorage.getItem('chkArray'));
      let count = 0;
      let count2 = 0;
      if (array.length != 0) {
        for (const data of array) {
          if (data.sltdYn == true) {
            break;
          } else {
            count++;
          }
        }
        for (const data of array) {
          if (data.sltdYn == true) {
            count2++;
          }
        }
        if (count == array.length) {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "債整銀行請至少勾選一項" }
          });
          return;
        }
        if (count2 > 15) {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "債整銀行不可勾選大於15項" }
          });
          return;
        }
      }
      if (sessionStorage.getItem('custLnAmt') == '') {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請輸入現金申請額度" }
        });
        return;
      }
      if (parseInt(sessionStorage.getItem('custLnAmt')) % 100 != 0) {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "申請貸款金額請以100為單位" }
        });
        return;
      }
      let lnLmtAmt = sessionStorage.getItem('lnLmtAmt') == '' ? 0 : sessionStorage.getItem('lnLmtAmt');
      // 現金申請額度custLnAmt不能大於現金核准額度lnLmtAmt
      if (sessionStorage.getItem('lnLmtAmt') != '0') {
        if (parseInt(sessionStorage.getItem('custLnAmt')) > lnLmtAmt) {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "現金申請額度不能大於現金核准額度" }
          });
          return;
        }
        if (sessionStorage.getItem('custLnAmtcheck') == 'true' && (sessionStorage.getItem('custLnAmt') == null || sessionStorage.getItem('custLnAmt') == undefined
          || sessionStorage.getItem('custLnAmt') == '' || (parseInt(sessionStorage.getItem('custLnAmt')) < this.pdMinLmtAmt))) {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "現金申請額度不能小於產品最小額度" + this.pdMinLmtAmt + "元" }
          });
          return;
        }
      }
      if (sessionStorage.getItem('periodValue') < sessionStorage.getItem('prdcMinVal') || sessionStorage.getItem('periodValue') > sessionStorage.getItem('prdcMaxVal')) {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請選擇合法申請期數" }
        });
        return;
      }
      await this.getCheckOpid('2900', '');
      if (this.opidBool) {
        return;
      }
      this.block = true;
      let msg = '';
      this.f06002Service.stepHandle(JSON.parse(sessionStorage.getItem('jsonObjForStep2'))).subscribe(data => {
        msg = data.rspMsg;
        this.block = false;
        if (msg !== '執行成功') {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: msg }
          });
          return;
        } else {
          this.f06002Service.setCurrent(this.f06002Service.getCurrent() + 1);
          this.f06002Service.opidresetfn('2910');
          this.changeRouter();
          return;
        }
      });
    }
    // 第三步
    if (this.f06002Service.getCurrent() === 2) {
      this.f06002Service.setCheckSrp('');
      this.f06002Service.resetfn2();
      if (sessionStorage.getItem('strgy') === '01') {
        if (sessionStorage.getItem('custLnAmtForStep3') == '') {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "請輸入現金申請額度" }
          });
          return;
        }
        if (parseInt(sessionStorage.getItem('custLnAmtForStep3')) % 100 != 0) {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "現金申請額度請以100為單位" }
          });
          return;
        }
        let lnLmtAmtForStep3 = sessionStorage.getItem('lnLmtAmtForStep3') == '' ? 0 : sessionStorage.getItem('lnLmtAmtForStep3');
        // 現金申請額度custLnAmt不能大於現金核准額度lnLmtAmt
        if (parseInt(sessionStorage.getItem('custLnAmtForStep3')) > lnLmtAmtForStep3) {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "現金申請額度不能大於現金核准額度" }
          });
          return;
        }
        if (sessionStorage.getItem('custLnAmtForStep3') == '0') {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "現金申請額度不得為0元" }
          });
          return;
        }
        if ((parseInt(sessionStorage.getItem('custLnAmtForStep3')) < this.pdMinLmtAmt)) {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "現金申請額度不能小於產品最小額度" + this.pdMinLmtAmt + "元" }
          });
          return;
        }

        if (sessionStorage.getItem('periodValueForStep3') == '') {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "請選擇現金貸款期限" }
          });
          return;
        }
      }
      if (sessionStorage.getItem('custLnAmtForStep3') != '0') {
        if (sessionStorage.getItem('bcnValueForStep3') == '') {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "請選擇銀行名" }
          });
          return;
        }

        if (sessionStorage.getItem('bcnValueForStep3') != '824' && sessionStorage.getItem('bbcValueForStep3') == '6880') {
          sessionStorage.setItem('bbcValueForStep3', '')
        }

        if (parseInt(sessionStorage.getItem('custLnAmtForStep3')) > 2000000) {
          if (sessionStorage.getItem('bbcValueForStep3') == '') {
            const confirmDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: "請選擇分行別" }
            });
            return;
          }
        }
        // 撥款帳號不得為空
        if (sessionStorage.getItem('acctNbrForStep3') == '') {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: "請輸入撥款帳號" }
          });
          return;
        }
        // 若撥款帳號非本行,則不得選擇本行824
        if (sessionStorage.getItem('acctNbrForStep3') != sessionStorage.getItem('acctOriginNbrForStep3')) {
          if (sessionStorage.getItem('bcnValueForStep3') == '824') {
            const confirmDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: "非本行帳戶請重新選擇銀行別" }
            });
            return;
          }
        }
      }
      if (this.f06002Service.getCheckSrp() !== '') {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: this.f06002Service.getCheckSrp() }
        });
        return;
      }
      await this.getCheckOpid('2910', '');
      if (this.opidBool) {
        return;
      }
      this.block = true;
      let msg = '';
      let statusCode = '';
      this.f06002Service.stepHandle(JSON.parse(sessionStorage.getItem('jsonObjForStep3'))).subscribe(data => {
        this.block = false;
        msg = data.rspMsg;
        statusCode = data.rspBody;
        if (msg != '執行成功') {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: msg }
          });
          return;
        } else if (msg === '執行成功') {
          if (statusCode == 'XC80') {
            this.f06002Service.setCurrent(this.f06002Service.getCurrent() + 1);
            this.changeRouter();
            this.f06002Service.opidresetfn('2920');
            return;
          } else if (statusCode == 'V090') {
            this.f06002Service.setCurrent(this.f06002Service.getCurrent() + 2);
            this.changeRouter();
            this.f06002Service.opidresetfn('2930');
            return;
          }
        } else {
          const confirmDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: '案件錯誤!' }
          });
          return;
        }
      });
    }
  }

  changeRouter(): void {
    switch (this.f06002Service.getCurrent()) {
      case 0: {
        this.component = this.componentList.get('step1');
        break;
      }
      case 1: {
        this.component = this.componentList.get('step2');
        break;
      }
      case 2: {
        this.component = this.componentList.get('step3');
        break;
      }
      case 3: {
        this.component = this.componentList.get('step4');
        break;
      }
      case 4: {
        this.component = this.componentList.get('step5');
        break;
      }
    }
  }

  // 重選方案打電文
  async pre(): Promise<any> {
    await this.getCheckOpid('', 'Y');
    if (this.opidBool) {
      return;
    }
    const dialogRef = this.dialog.open(F06006ConfirmComponent, {
      minHeight: '50vh',
      width: '500px',
      panelClass: 'mat-dialog-transparent',
      data: {
        i: "重新選擇方案可能導致過去資料流失,仍然要重選方案嗎?"
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.value == 'confirm') {
        let msg = '';
        let jsonObject: any = {};
        jsonObject['applno'] = this.applno;
        jsonObject['sltdDebtOptCd'] = '04';
        jsonObject['ifId'] = this.ifidStep1Next;
        this.block = true;
        this.f06002Service.stepHandle(jsonObject).subscribe(data => {
          msg = data.rspMsg;
          if (msg === '執行失敗') {
            const confirmDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: msg }
            });
            this.block = false;
            return;
          } else {
            this.flag = 'Y';
            this.f06002Service.setCurrent(0)
            this.component = F06002page2step1Component;
            sessionStorage.removeItem('strgy');
            this.block = false;
            this.step = '下一步';
            this.f06002Service.opidresetfn('2700')
            this.changeRouter();
          }
        });
      }

    });
  }

  async getCheckOpid(opid: string, preFlag: string): Promise<any> {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    await this.f06002Service.getOpid(jsonObject).then((data: any) => {
      if (data.rspCode == '0000') {
        this.opidCheck = data.rspBody;
      }
    });
    //重選方案按鈕判斷
    if (preFlag === 'Y') {
      if (Number(this.opidCheck) < 2700 || Number(this.opidCheck) > 2940) {
        this.opidBool = true;
        setTimeout(() => {
          this.router.navigate(['./F06002']);
        }, 1000);
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "該案件已在關卡" + this.opidCheck }
        });
      }
    } else if (opid != this.opidCheck) {
      this.opidBool = true;
      setTimeout(() => {
        this.router.navigate(['./F06002']);
      }, 1000);
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "該案件已不在關卡" + opid }
      });
    }
  }

}
