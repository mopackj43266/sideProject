import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Childscn12Service } from './childscn12.service';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n'
import { flatten } from '@angular/compiler';

interface checkBox {
  value: string
  completed: boolean
}

interface INCOME_DETAILS {
  key: string;
  A11: string,
  A12: string,
  A13: string,
  A14: string,
  A15: string,
  A16: string,
  A21: string,
  A22: string,
  A23: string,
  A24: string,
  A25: string,
  A26: string,
  A41: string,
  A42: string,
  A43: string,

  A51: string,
  A52: string,
  A53: string,
  A54: string,
  A55: string,
  A56: string,
  A61: string,
  A62: string,
  A63: string,
  A64: string,
  A65: string,
  A66: string,
  A81: string,
  A82: string,
  A83: string,

  A1: string,
  A2: string,
  A3: string,
  A4: string,
  A5: string,
  A6: string,
  A7: string,
  A8: string,

  B1: string,
  B2: string,
  B3: string,
  B4: string,
  B5: string,
  B6: string,

  C1: string,
  C2: string,
  C3: string,
  C4: string,
  C5: string,
  C6: string,
  C7: string,
  C8: string,

  D1: string,
  D2: string,
  D3: string,
  D4: string,
  D5: string,
  D6: string,
  D7: string,
  D8: string,

  P1: string,
  P2: string,
  P3: string,
  P4: string,
  P5: string,
  P6: string,
  P7: string,
  P8: string,

  B: string//小計
  C: string
  D: string

  Z1: string

  Ctotal: string
  Dtotal: string


}


//Nick 收入試算
@Component({
  selector: 'app-childscn12',
  templateUrl: './childscn12.component.html',
  styleUrls: ['./childscn12.component.css', '../../../assets/css/child.css']
})
export class Childscn12Component implements OnInit {

  constructor(
    private childscn12Service: Childscn12Service,
    private nzI18nService: NzI18nService,
    public dialog: MatDialog) {
    this.nzI18nService.setLocale(zh_TW)
  }

  private applno: string;
  private stepName: string;
  private search: string;
  private page: string;

  EL_INCOME_Source = new MatTableDataSource<any>();//下方儲存table資料
  INCOME_DETAILS_List: INCOME_DETAILS[] = [];
  AddData: any;
  keylist: string[] = [];
  chkArray: checkBox[] = [];
  strArray: any;
  loading = true
  loading6 = true;//六個table用
  income: string;
  f: string;
  test1 = "1"; test2 = "2"; test3 = false; test4 = "文字";

  checkTotal: number = 0;
  checkTotaltring: string;
  ngOnInit(): void {
    this.page = sessionStorage.getItem('page');

    this.keylist.push("incomeAndTaxList"); //所得清單
    this.keylist.push("withholdingList");//扣繳憑單 X A6
    this.keylist.push("salaryTransferList"); //薪轉存褶
    this.keylist.push("paySlipList");//電腦列印薪資單 儲存時須注意欄位對照3 故跳過A4,A8
    this.keylist.push("laborDetailsList"); // 勞保投保及勞退提撥明細
    this.keylist.push("bankerList");//本行行員
    //建立資料架構
    for (const key of this.keylist) {
      this.AddData = {
        key: key,
        A11: "", A12: "", A13: "", A14: "", A15: "", A16: "",
        A21: "", A22: "", A23: "", A24: "", A25: "", A26: "",
        A41: "", A42: "", A43: "",
        A51: "", A52: "", A53: "", A54: "", A55: "", A56: "",
        A61: "", A62: "", A63: "", A64: "", A65: "", A66: "",
        A81: "", A82: "", A83: "",
        A1: "", A2: "", A3: "", A4: "", A5: "", A6: "", A7: "", A8: "",
        B1: "", B2: "", B3: "", B4: "", B5: "", B6: "",
        C1: "", C2: "", C3: "", C4: "", C5: "", C6: "", C7: "", C8: "",
        D1: "", D2: "", D3: "", D4: "", D5: "", D6: "", D7: "", D8: "",
        P1: "", P2: "", P3: "", P4: "", P5: "", P6: "", P7: "", P8: "",
        B: "", C: "", D: "", Z1: "", Ctotal: "", Dtotal: ""
      };
      this.INCOME_DETAILS_List.push(this.AddData);
      // this.save_INCOME_DETAILS_List.push(this.AddData);
    }
    this.chkArray.push({ value: "C1", completed: false });
    this.chkArray.push({ value: "C2", completed: false });
    this.chkArray.push({ value: "C3", completed: false });
    this.chkArray.push({ value: "C4", completed: false });
    this.chkArray.push({ value: "C5", completed: false });
    this.chkArray.push({ value: "C6", completed: false });
    this.chkArray.push({ value: "C7", completed: false });
    this.applno = sessionStorage.getItem('applno');
    this.stepName = sessionStorage.getItem('stepName');
    this.search = sessionStorage.getItem('search');
    this.getData();
  }

  //檢查是否是徵信
  getStepName() {
    //測試用
    // return true;
    return this.stepName == "APPLCreditL3" || this.stepName == "APPLCreditL4" ? true : false;
  }

  //檢查是否是徵信或授信
  getStepName23() {
    //測試用
    // return true;
    return (this.stepName == "APPLCreditL4" || this.stepName == "APPLCreditL3" || this.stepName == "APPLCreditL2") ? true : false;
  }

  //檢查是否是徵信或授信
  getSearch() {
    return this.search;
  }

  getPage() {
    return this.page;
  }

  //取得資料
  getData() {
    const baseUrl = 'f01/childscn12';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno
    this.childscn12Service.postJson(baseUrl, jsonObject).subscribe(data => {
      this.checkTotal = data.rspBody.creditMainList[0].income != null ? data.rspBody.creditMainList[0].income : 0;
      this.checkTotaltring = this.toCurrency(this.checkTotal + '');
      //------------------以下總表處理
      if (Object.keys(data.rspBody.income).length > 0) {
        this.EL_INCOME_Source.data = data.rspBody.income;
        //轉換checkbox
        if (data.rspBody.income.length == 7) {
          if (this.EL_INCOME_Source.data[6].checkIncome != null) {
            let i = 0;
            this.strArray = this.EL_INCOME_Source.data[6].checkIncome.split('_');
            for (const str of this.strArray) {
              for (const chk of this.chkArray) {
                chk.completed = str == chk.value ? true : chk.completed;
              }
            }
          }
          this.EL_INCOME_Source.data[6].income = this.toCurrency(this.EL_INCOME_Source.data[6].income.toString());
        }
      } else {
        this.EL_INCOME_Source.data = [];
      }

      //--------------------以上總表處理
      // this.EL_INCOME_DETAILS_Source.data = data.rspBody.incomeDetail;
      for (const INCOME_DETAILS of this.INCOME_DETAILS_List) {

        switch (INCOME_DETAILS.key) {
          case "incomeAndTaxList":
            this.setData(INCOME_DETAILS, data.rspBody.incomeAndTaxList);// incomeAndTaxList 所得清單
            break;
          case "withholdingList":
            this.setData(INCOME_DETAILS, data.rspBody.withholdingList);// withholdingList 扣繳憑單
            break;
          case "salaryTransferList":
            this.setData(INCOME_DETAILS, data.rspBody.salaryTransferList);//salaryTransferList  薪轉存褶
            break;
          case "paySlipList":
            this.setData(INCOME_DETAILS, data.rspBody.paySlipList);//paySlipList  電腦列印薪資單
            break;
          case "laborDetailsList":
            this.setData(INCOME_DETAILS, data.rspBody.laborDetailsList);//laborDetailsList  勞保投保及勞退提撥明細
            break;
          default:
            this.setData(INCOME_DETAILS, data.rspBody.bankerList); //bankerList 本行行員
            break;
        }
      }
    });
    this.loading = false;
    this.loading6 = false;
  }

  //載入時資料處理 裝資料
  setData(INCOME_DETAILS: INCOME_DETAILS, data: any) {

    if (data != null) {
      let x = 0;
      //表34特殊處理
      if (INCOME_DETAILS.key == "salaryTransferList" || INCOME_DETAILS.key == "paySlipList") {
        if (data.A1 != null) {
          let strArray = data.A1.split('_');
          INCOME_DETAILS.A11 = strArray[0];
          INCOME_DETAILS.A12 = strArray[1];
          INCOME_DETAILS.A13 = strArray[2];
          INCOME_DETAILS.A14 = strArray[3];
          INCOME_DETAILS.A15 = strArray[4];
          INCOME_DETAILS.A16 = strArray[5];
          //觸發資料計算 BCD
          INCOME_DETAILS.A11 != null ? this.data_number(INCOME_DETAILS.A11.toString(), INCOME_DETAILS.key, "A11") : this.data_number("", INCOME_DETAILS.key, "A11");
          INCOME_DETAILS.A12 != null ? this.data_number(INCOME_DETAILS.A12.toString(), INCOME_DETAILS.key, "A12") : this.data_number("", INCOME_DETAILS.key, "A12");
          INCOME_DETAILS.A13 != null ? this.data_number(INCOME_DETAILS.A13.toString(), INCOME_DETAILS.key, "A13") : this.data_number("", INCOME_DETAILS.key, "A13");
          INCOME_DETAILS.A14 != null ? this.data_number(INCOME_DETAILS.A14.toString(), INCOME_DETAILS.key, "A14") : this.data_number("", INCOME_DETAILS.key, "A14");
          INCOME_DETAILS.A15 != null ? this.data_number(INCOME_DETAILS.A15.toString(), INCOME_DETAILS.key, "A15") : this.data_number("", INCOME_DETAILS.key, "A15");
          INCOME_DETAILS.A16 != null ? this.data_number(INCOME_DETAILS.A16.toString(), INCOME_DETAILS.key, "A16") : this.data_number("", INCOME_DETAILS.key, "A16");
        }
        if (data.A2 != null) {
          let strArray = data.A2.split('_');
          INCOME_DETAILS.A21 = strArray[0];
          INCOME_DETAILS.A22 = strArray[1];
          INCOME_DETAILS.A23 = strArray[2];
          INCOME_DETAILS.A24 = strArray[3];
          INCOME_DETAILS.A25 = strArray[4];
          INCOME_DETAILS.A26 = strArray[5];
          //觸發資料計算BCD
          INCOME_DETAILS.A21 != null ? this.data_number(INCOME_DETAILS.A21.toString(), INCOME_DETAILS.key, "A21") : this.data_number("", INCOME_DETAILS.key, "A21");
          INCOME_DETAILS.A22 != null ? this.data_number(INCOME_DETAILS.A22.toString(), INCOME_DETAILS.key, "A22") : this.data_number("", INCOME_DETAILS.key, "A22");
          INCOME_DETAILS.A23 != null ? this.data_number(INCOME_DETAILS.A23.toString(), INCOME_DETAILS.key, "A23") : this.data_number("", INCOME_DETAILS.key, "A23");
          INCOME_DETAILS.A24 != null ? this.data_number(INCOME_DETAILS.A24.toString(), INCOME_DETAILS.key, "A24") : this.data_number("", INCOME_DETAILS.key, "A24");
          INCOME_DETAILS.A25 != null ? this.data_number(INCOME_DETAILS.A25.toString(), INCOME_DETAILS.key, "A25") : this.data_number("", INCOME_DETAILS.key, "A25");
          INCOME_DETAILS.A26 != null ? this.data_number(INCOME_DETAILS.A26.toString(), INCOME_DETAILS.key, "A26") : this.data_number("", INCOME_DETAILS.key, "A26");
        }
        if (data.A4 != null) {
          let strArray = data.A4.split('_');
          INCOME_DETAILS.A41 = strArray[0];
          INCOME_DETAILS.A42 = strArray[1];
          INCOME_DETAILS.A43 = strArray[2];
          //觸發資料計算 BCD
          INCOME_DETAILS.A41 != null ? this.data_number(INCOME_DETAILS.A41.toString(), INCOME_DETAILS.key, "A41") : this.data_number("", INCOME_DETAILS.key, "A41");
          INCOME_DETAILS.A42 != null ? this.data_number(INCOME_DETAILS.A42.toString(), INCOME_DETAILS.key, "A42") : this.data_number("", INCOME_DETAILS.key, "A42");
          INCOME_DETAILS.A43 != null ? this.data_number(INCOME_DETAILS.A43.toString(), INCOME_DETAILS.key, "A43") : this.data_number("", INCOME_DETAILS.key, "A43");
        }
        if (data.A5 != null) {
          let strArray = data.A5.split('_');
          INCOME_DETAILS.A51 = strArray[0];
          INCOME_DETAILS.A52 = strArray[1];
          INCOME_DETAILS.A53 = strArray[2];
          INCOME_DETAILS.A54 = strArray[3];
          INCOME_DETAILS.A55 = strArray[4];
          INCOME_DETAILS.A56 = strArray[5];
          //觸發資料計算 BCD
          INCOME_DETAILS.A51 != null ? this.data_number(INCOME_DETAILS.A51.toString(), INCOME_DETAILS.key, "A51") : this.data_number("", INCOME_DETAILS.key, "A51");
          INCOME_DETAILS.A52 != null ? this.data_number(INCOME_DETAILS.A52.toString(), INCOME_DETAILS.key, "A52") : this.data_number("", INCOME_DETAILS.key, "A52");
          INCOME_DETAILS.A53 != null ? this.data_number(INCOME_DETAILS.A53.toString(), INCOME_DETAILS.key, "A53") : this.data_number("", INCOME_DETAILS.key, "A53");
          INCOME_DETAILS.A54 != null ? this.data_number(INCOME_DETAILS.A54.toString(), INCOME_DETAILS.key, "A54") : this.data_number("", INCOME_DETAILS.key, "A54");
          INCOME_DETAILS.A55 != null ? this.data_number(INCOME_DETAILS.A55.toString(), INCOME_DETAILS.key, "A55") : this.data_number("", INCOME_DETAILS.key, "A55");
          INCOME_DETAILS.A56 != null ? this.data_number(INCOME_DETAILS.A56.toString(), INCOME_DETAILS.key, "A56") : this.data_number("", INCOME_DETAILS.key, "A56");
        }
        if (data.A6 != null) {
          let strArray = data.A6.split('_');
          INCOME_DETAILS.A61 = strArray[0];
          INCOME_DETAILS.A62 = strArray[1];
          INCOME_DETAILS.A63 = strArray[2];
          INCOME_DETAILS.A64 = strArray[3];
          INCOME_DETAILS.A65 = strArray[4];
          INCOME_DETAILS.A66 = strArray[5];
          //觸發資料計算 BCD
          INCOME_DETAILS.A61 != null ? this.data_number(INCOME_DETAILS.A61.toString(), INCOME_DETAILS.key, "A61") : this.data_number("", INCOME_DETAILS.key, "A61");
          INCOME_DETAILS.A62 != null ? this.data_number(INCOME_DETAILS.A62.toString(), INCOME_DETAILS.key, "A62") : this.data_number("", INCOME_DETAILS.key, "A62");
          INCOME_DETAILS.A63 != null ? this.data_number(INCOME_DETAILS.A63.toString(), INCOME_DETAILS.key, "A63") : this.data_number("", INCOME_DETAILS.key, "A63");
          INCOME_DETAILS.A64 != null ? this.data_number(INCOME_DETAILS.A64.toString(), INCOME_DETAILS.key, "A64") : this.data_number("", INCOME_DETAILS.key, "A64");
          INCOME_DETAILS.A65 != null ? this.data_number(INCOME_DETAILS.A65.toString(), INCOME_DETAILS.key, "A65") : this.data_number("", INCOME_DETAILS.key, "A65");
          INCOME_DETAILS.A66 != null ? this.data_number(INCOME_DETAILS.A66.toString(), INCOME_DETAILS.key, "A66") : this.data_number("", INCOME_DETAILS.key, "A66");
        }
        if (data.A8 != null) {
          let strArray = data.A8.split('_');
          INCOME_DETAILS.A81 = strArray[0];
          INCOME_DETAILS.A82 = strArray[1];
          INCOME_DETAILS.A83 = strArray[2];
          //觸發資料計算 BCD
          INCOME_DETAILS.A81 != null ? this.data_number(INCOME_DETAILS.A81.toString(), INCOME_DETAILS.key, "A81") : this.data_number("", INCOME_DETAILS.key, "A81");
          INCOME_DETAILS.A82 != null ? this.data_number(INCOME_DETAILS.A82.toString(), INCOME_DETAILS.key, "A82") : this.data_number("", INCOME_DETAILS.key, "A82");
          INCOME_DETAILS.A83 != null ? this.data_number(INCOME_DETAILS.A83.toString(), INCOME_DETAILS.key, "A83") : this.data_number("", INCOME_DETAILS.key, "A83");

        }
      }
      INCOME_DETAILS.A1 = (data.A1 != null) ? this.toCurrency(data.A1.toString()) : INCOME_DETAILS.A1;
      INCOME_DETAILS.A2 = (data.A2 != null) ? this.toCurrency(data.A2.toString()) : INCOME_DETAILS.A2;
      INCOME_DETAILS.A3 = (data.A3 != null) ? this.toCurrency(data.A3.toString()) : INCOME_DETAILS.A3;
      INCOME_DETAILS.A4 = (data.A4 != null) ? this.toCurrency(data.A4.toString()) : INCOME_DETAILS.A4;
      INCOME_DETAILS.A5 = (data.A5 != null) ? this.toCurrency(data.A5.toString()) : INCOME_DETAILS.A5;
      INCOME_DETAILS.A6 = (data.A6 != null) ? this.toCurrency(data.A6.toString()) : INCOME_DETAILS.A6;
      INCOME_DETAILS.A7 = (data.A7 != null) ? this.toCurrency(data.A7.toString()) : INCOME_DETAILS.A7;
      INCOME_DETAILS.A8 = (data.A8 != null) ? this.toCurrency(data.A8.toString()) : INCOME_DETAILS.A8;

      INCOME_DETAILS.B1 = (data.B1 != null) ? this.toCurrency(data.B1.toString()) : INCOME_DETAILS.B1;
      INCOME_DETAILS.B2 = (data.B2 != null) ? this.toCurrency(data.B2.toString()) : INCOME_DETAILS.B2;
      INCOME_DETAILS.B3 = (data.B3 != null) ? this.toCurrency(data.B3.toString()) : INCOME_DETAILS.B3;
      INCOME_DETAILS.B4 = (data.B4 != null) ? this.toCurrency(data.B4.toString()) : INCOME_DETAILS.B4;
      INCOME_DETAILS.B5 = (data.B5 != null) ? this.toCurrency(data.B5.toString()) : INCOME_DETAILS.B5;
      INCOME_DETAILS.B6 = (data.B6 != null) ? this.toCurrency(data.B6.toString()) : INCOME_DETAILS.B6;

      INCOME_DETAILS.C1 = (data.C1 != null) ? this.toCurrency(data.C1.toString()) : INCOME_DETAILS.C1;
      INCOME_DETAILS.C2 = (data.C2 != null) ? this.toCurrency(data.C2.toString()) : INCOME_DETAILS.C2;
      INCOME_DETAILS.C3 = (data.C3 != null) ? this.toCurrency(data.C3.toString()) : INCOME_DETAILS.C3;
      INCOME_DETAILS.C4 = (data.C4 != null) ? this.toCurrency(data.C4.toString()) : INCOME_DETAILS.C4;
      INCOME_DETAILS.C5 = (data.C5 != null) ? this.toCurrency(data.C5.toString()) : INCOME_DETAILS.C5;
      INCOME_DETAILS.C6 = (data.C6 != null) ? this.toCurrency(data.C6.toString()) : INCOME_DETAILS.C6;
      INCOME_DETAILS.C7 = (data.C7 != null) ? this.toCurrency(data.C7.toString()) : INCOME_DETAILS.C7;
      INCOME_DETAILS.C8 = (data.C8 != null) ? this.toCurrency(data.C8.toString()) : INCOME_DETAILS.C8;

      INCOME_DETAILS.D1 = (data.D1 != null) ? this.toCurrency(data.D1.toString()) : INCOME_DETAILS.D1;
      INCOME_DETAILS.D2 = (data.D2 != null) ? this.toCurrency(data.D2.toString()) : INCOME_DETAILS.D2;
      INCOME_DETAILS.D3 = (data.D3 != null) ? this.toCurrency(data.D3.toString()) : INCOME_DETAILS.D3;
      INCOME_DETAILS.D4 = (data.D4 != null) ? this.toCurrency(data.D4.toString()) : INCOME_DETAILS.D4;
      INCOME_DETAILS.D5 = (data.D5 != null) ? this.toCurrency(data.D5.toString()) : INCOME_DETAILS.D5;
      INCOME_DETAILS.D6 = (data.D6 != null) ? this.toCurrency(data.D6.toString()) : INCOME_DETAILS.D6;
      INCOME_DETAILS.D7 = (data.D7 != null) ? this.toCurrency(data.D7.toString()) : INCOME_DETAILS.D7;
      INCOME_DETAILS.D8 = (data.D8 != null) ? this.toCurrency(data.D8.toString()) : INCOME_DETAILS.D8;

      INCOME_DETAILS.C = (data.C != null) ? this.toCurrency(data.C.toString()) : INCOME_DETAILS.C;
      INCOME_DETAILS.Z1 = (data.Z1 != null) ? data.Z1 : INCOME_DETAILS.Z1;

      INCOME_DETAILS.P1 = (data.P1 != null) ? this.toCurrency(data.P1.toString()) : INCOME_DETAILS.P1;
      //表12 P1給預設
      if (INCOME_DETAILS.key == "incomeAndTaxList" || INCOME_DETAILS.key == "withholdingList") {
        INCOME_DETAILS.P1 = (data.P1 != null) ? this.toCurrency(data.P1.toString()) : "1";
        data.B1 != null ? this.data_number(data.B1.toString(), INCOME_DETAILS.key, "B1") : this.data_number("", INCOME_DETAILS.key, "B1")
      }



      // 後端沒存 載入自行計算
      //觸發資料計算 Ctotal/Dtotal/B/D
      data.A3 != null ? this.data_number(data.A3, INCOME_DETAILS.key, "A3") : this.data_number("", INCOME_DETAILS.key, "A3");
      if (INCOME_DETAILS.key == "salaryTransferList" || INCOME_DETAILS.key == "paySlipList") {
        //觸發資料計算 P1/P2/P3/P4/P5/P6/P7/P8

        data.P1 != null ? this.data_number(data.P1.toString(), INCOME_DETAILS.key, "P1") : x = 0;
        data.P2 != null ? this.data_number(data.P2.toString(), INCOME_DETAILS.key, "P2") : x = 0;
        data.P3 != null ? this.data_number(data.P3.toString(), INCOME_DETAILS.key, "P3") : x = 0;
        data.P4 != null ? this.data_number(data.P4.toString(), INCOME_DETAILS.key, "P4") : x = 0;
        data.P5 != null ? this.data_number(data.P5.toString(), INCOME_DETAILS.key, "P5") : x = 0;
        data.P6 != null ? this.data_number(data.P6.toString(), INCOME_DETAILS.key, "P6") : x = 0;
        data.P7 != null ? this.data_number(data.P7.toString(), INCOME_DETAILS.key, "P7") : x = 0;
        data.P8 != null ? this.data_number(data.P8.toString(), INCOME_DETAILS.key, "P8") : x = 0;
      }

      if (INCOME_DETAILS.key == "bankerList") {
        data.C1 != null ? this.data_number(data.C1.toString(), INCOME_DETAILS.key, "C1") : x = 0;
        data.C2 != null ? this.data_number(data.C2.toString(), INCOME_DETAILS.key, "C2") : x = 0;
        data.C3 != null ? this.data_number(data.C3.toString(), INCOME_DETAILS.key, "C3") : x = 0;
      }


    }
  }

  save_income() {
    if (this.EL_INCOME_Source.data != null) {
      let check = "";
      for (const chk of this.chkArray) {
        if (check == "") {
          check = chk.completed ? check + chk.value : check;
        } else {
          check = chk.completed ? check + "_" + chk.value : check;
        }
      }
      if (check == "") {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請勾選徵審確認後年收入" }
        });
        return;
      };
      const baseUrl = 'f01/childscn12action2';
      let jsonObject: any = {};
      let msg = "";
      jsonObject['applno'] = this.applno
      jsonObject['income'] = this.toNumber(this.EL_INCOME_Source.data[6].income);
      jsonObject['check'] = check
      jsonObject['mark'] = this.EL_INCOME_Source.data[6].mark
      this.childscn12Service.postJson(baseUrl, jsonObject).subscribe(data => {
        msg = data.rspMsg == "success" ? "儲存成功!" : "儲存失敗";
        if (data.rspMsg.indexOf('未通過資安風險驗證：') != -1) { msg = data.rspMsg; }
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: msg }
        });
      });
    }
  }
  save2() {

    this.INCOME_DETAILS_List[2].A1 = this.toNumber(this.INCOME_DETAILS_List[2].A11) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A12) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A13) + "_" +
      this.toNumber(this.INCOME_DETAILS_List[2].A14) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A15) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A16);
    this.INCOME_DETAILS_List[2].A1 = this.INCOME_DETAILS_List[2].A1 == "_____" ? "" : this.INCOME_DETAILS_List[2].A1

    this.INCOME_DETAILS_List[2].A2 = this.toNumber(this.INCOME_DETAILS_List[2].A21) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A22) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A23) + "_" +
      this.toNumber(this.INCOME_DETAILS_List[2].A24) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A25) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A26);
    this.INCOME_DETAILS_List[2].A2 = this.INCOME_DETAILS_List[2].A2 == "_____" ? "" : this.INCOME_DETAILS_List[2].A2

    this.INCOME_DETAILS_List[2].A4 = this.toNumber(this.INCOME_DETAILS_List[2].A41) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A42) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A43);
    this.INCOME_DETAILS_List[2].A4 = this.INCOME_DETAILS_List[2].A4 == "__" ? "" : this.INCOME_DETAILS_List[2].A4

    this.INCOME_DETAILS_List[2].A5 = this.toNumber(this.INCOME_DETAILS_List[2].A51) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A52) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A53) + "_" +
      this.toNumber(this.INCOME_DETAILS_List[2].A54) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A55) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A56);
    this.INCOME_DETAILS_List[2].A5 = this.INCOME_DETAILS_List[2].A5 == "_____" ? "" : this.INCOME_DETAILS_List[2].A5

    this.INCOME_DETAILS_List[2].A6 = this.toNumber(this.INCOME_DETAILS_List[2].A61) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A62) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A63) + "_" +
      this.toNumber(this.INCOME_DETAILS_List[2].A64) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A65) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A66);
    this.INCOME_DETAILS_List[2].A6 = this.INCOME_DETAILS_List[2].A6 == "_____" ? "" : this.INCOME_DETAILS_List[2].A6

    this.INCOME_DETAILS_List[2].A8 = this.toNumber(this.INCOME_DETAILS_List[2].A81) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A82) + "_" + this.toNumber(this.INCOME_DETAILS_List[2].A83);
    this.INCOME_DETAILS_List[2].A8 = this.INCOME_DETAILS_List[2].A8 == "__" ? "" : this.INCOME_DETAILS_List[2].A8


    this.INCOME_DETAILS_List[3].A1 = this.toNumber(this.INCOME_DETAILS_List[3].A11) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A12) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A13) + "_" +
      this.toNumber(this.INCOME_DETAILS_List[3].A14) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A15) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A16);
    this.INCOME_DETAILS_List[3].A1 = this.INCOME_DETAILS_List[3].A1 == "_____" ? "" : this.INCOME_DETAILS_List[3].A1

    this.INCOME_DETAILS_List[3].A2 = this.toNumber(this.INCOME_DETAILS_List[3].A21) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A22) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A23) + "_" +
      this.toNumber(this.INCOME_DETAILS_List[3].A24) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A25) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A26);
    this.INCOME_DETAILS_List[3].A2 = this.INCOME_DETAILS_List[3].A2 == "_____" ? "" : this.INCOME_DETAILS_List[3].A2

    this.INCOME_DETAILS_List[3].A5 = this.toNumber(this.INCOME_DETAILS_List[3].A51) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A52) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A53) + "_" +
      this.toNumber(this.INCOME_DETAILS_List[3].A54) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A55) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A56);
    this.INCOME_DETAILS_List[3].A5 = this.INCOME_DETAILS_List[3].A5 == "_____" ? "" : this.INCOME_DETAILS_List[3].A5

    this.INCOME_DETAILS_List[3].A6 = this.toNumber(this.INCOME_DETAILS_List[3].A61) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A62) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A63) + "_" +
      this.toNumber(this.INCOME_DETAILS_List[3].A64) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A65) + "_" + this.toNumber(this.INCOME_DETAILS_List[3].A66);
    this.INCOME_DETAILS_List[3].A6 = this.INCOME_DETAILS_List[3].A6 == "_____" ? "" : this.INCOME_DETAILS_List[3].A6




    if (!this.loading6) {
      let save_INCOME_DETAILS_List: INCOME_DETAILS[] = []
      save_INCOME_DETAILS_List = JSON.parse(JSON.stringify(this.INCOME_DETAILS_List))
      for (const INCOME_DETAILS of save_INCOME_DETAILS_List) {
        this.save_data(INCOME_DETAILS);
      }
      const baseUrl = 'f01/childscn12action1';
      let jsonObject: any = {};
      let msg = "";
      jsonObject['applno'] = this.applno
      jsonObject['incomeAndTaxList'] = save_INCOME_DETAILS_List[0];
      jsonObject['withholdingList'] = save_INCOME_DETAILS_List[1];
      jsonObject['salaryTransferList'] = save_INCOME_DETAILS_List[2];
      jsonObject['paySlipList'] = save_INCOME_DETAILS_List[3];
      jsonObject['laborDetailsList'] = save_INCOME_DETAILS_List[4];
      jsonObject['bankerList'] = save_INCOME_DETAILS_List[5];
      this.loading6 = true
      this.childscn12Service.postJson(baseUrl, jsonObject).subscribe(data => {
        this.loading6 = false
        if (data.rspMsg == "success") {
          msg = "儲存成功!";
          this.getData();
          for (const chk of this.chkArray) {
            chk.completed = false;
          }
        } else {
          msg = "儲存失敗";
        }
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: msg }
        });
      });
    }
  }

  //去除符號中文 並更新小計欄位
  //參數 data:需轉換的"數字" key:哪一張table value:哪個欄位
  //只傳第一個參數就只做 資料格式轉換
  data_number(data: string, key?: string, value?: string) {
    if (data != null) {
      data = this.toNumber(data);//去中英文符號
      data = parseInt(data.toString()).toString() == 'NaN' ? '' : parseInt(data.toString()).toString();//去掉數字前面的0
      data = this.toCurrency(data);//加逗號
    }
    if (key != null && value != null) {
      let total_INCOME_DETAILS: INCOME_DETAILS[] = null;
      let total = 0;//小計
      let x: number
      let value1 = value.substring(0, 1);//判斷欄位用 A12 -> A
      let value2 = value.substring(2, 1);//判斷欄位用 A12 -> 1
      let P1 = 1;
      total_INCOME_DETAILS = this.INCOME_DETAILS_List.filter(i => i.key == key);
      if (total_INCOME_DETAILS != null) {
        for (const INCOME_DETAILS of total_INCOME_DETAILS) {
          //如果要做計算需先覆蓋自己欄位的值
          switch (value) {
            case "A1":
              INCOME_DETAILS.A1 = data;
              break;
            case "A2":
              INCOME_DETAILS.A2 = data;
              break;
            case "A3":
              INCOME_DETAILS.A3 = data;
              break;
            case "A4":
              INCOME_DETAILS.A4 = data;
              break;
            case "A5":
              INCOME_DETAILS.A5 = data;
              break;
            case "A6":
              INCOME_DETAILS.A6 = data;
              break;
            case "A7":
              INCOME_DETAILS.A7 = data;
              break;
            case "A8":
              INCOME_DETAILS.A8 = data;
              break;
            case "A11":
              INCOME_DETAILS.A11 = data;
              break;
            case "A12":
              INCOME_DETAILS.A12 = data;
              break;
            case "A13":
              INCOME_DETAILS.A13 = data;
              break;
            case "A14":
              INCOME_DETAILS.A14 = data;
              break;
            case "A15":
              INCOME_DETAILS.A15 = data;
              break;
            case "A16":
              INCOME_DETAILS.A16 = data;
              break;
            case "A21":
              INCOME_DETAILS.A21 = data;
              break;
            case "A22":
              INCOME_DETAILS.A22 = data;
              break;
            case "A23":
              INCOME_DETAILS.A23 = data;
              break;
            case "A24":
              INCOME_DETAILS.A24 = data;
              break;
            case "A25":
              INCOME_DETAILS.A25 = data;
              break;
            case "A26":
              INCOME_DETAILS.A26 = data;
              break;
            case "A41":
              INCOME_DETAILS.A41 = data;
              break;
            case "A42":
              INCOME_DETAILS.A42 = data;
              break;
            case "A43":
              INCOME_DETAILS.A43 = data;
              break;
            case "A51":
              INCOME_DETAILS.A51 = data;
              break;
            case "A52":
              INCOME_DETAILS.A52 = data;
              break;
            case "A53":
              INCOME_DETAILS.A53 = data;
              break;
            case "A54":
              INCOME_DETAILS.A54 = data;
              break;
            case "A55":
              INCOME_DETAILS.A55 = data;
              break;
            case "A56":
              INCOME_DETAILS.A56 = data;
              break;
            case "A61":
              INCOME_DETAILS.A61 = data;
              break;
            case "A62":
              INCOME_DETAILS.A62 = data;
              break;
            case "A63":
              INCOME_DETAILS.A63 = data;
              break;
            case "A64":
              INCOME_DETAILS.A64 = data;
              break;
            case "A65":
              INCOME_DETAILS.A65 = data;
              break;
            case "A66":
              INCOME_DETAILS.A66 = data;
              break;
            case "A81":
              INCOME_DETAILS.A81 = data;
              break;
            case "A82":
              INCOME_DETAILS.A82 = data;
              break;
            case "A83":
              INCOME_DETAILS.A83 = data;
              break;
            case "B1":
              INCOME_DETAILS.B1 = data;
              break;
            case "B2":
              INCOME_DETAILS.B2 = data;
              break;
            case "B3":
              INCOME_DETAILS.B3 = data;
              break;
            case "B4":
              INCOME_DETAILS.B4 = data;
              break;
            case "B5":
              INCOME_DETAILS.B5 = data;
              break;
            case "B6":
              INCOME_DETAILS.B6 = data;
              break;
            case "P1":
              INCOME_DETAILS.P1 = data;
              break;
            default:
              break;
          }


          if (key == "incomeAndTaxList" || key == "withholdingList") {
            if (value1 == "B") {
              //計算B //如果是數字就加總  (數字或字串)轉字串去中英文符號再轉數字後加總
              total = ((!isNaN(x = parseInt(this.toNumber(INCOME_DETAILS.B1.toString())))) ? total + x : total);
              total = ((!isNaN(x = parseInt(this.toNumber(INCOME_DETAILS.B2.toString())))) ? total + x : total);
              total = ((!isNaN(x = parseInt(this.toNumber(INCOME_DETAILS.B3.toString())))) ? total + x : total);
              total = ((!isNaN(x = parseInt(this.toNumber(INCOME_DETAILS.B4.toString())))) ? total + x : total);
              total = ((!isNaN(x = parseInt(this.toNumber(INCOME_DETAILS.B5.toString())))) ? total + x : total);
              total = ((!isNaN(x = parseInt(this.toNumber(INCOME_DETAILS.B6.toString())))) ? total + x : total);
              INCOME_DETAILS.B = this.toCurrency(total.toString());
              this.getD(total_INCOME_DETAILS);
            } else {//A1~A8,P1
              //P1最小數為1
              if (value == "P1" && (isNaN(P1 = (parseInt(INCOME_DETAILS.P1))) || P1 < 1)) {
                P1 = 1;
                INCOME_DETAILS.P1 = "1";
                data = "1";
              }
              //P1最小數為1
              INCOME_DETAILS.P1 = (value == "A3" && (isNaN(P1 = (parseInt(INCOME_DETAILS.P1))) || P1 < 1)) ? "1" : INCOME_DETAILS.P1;

              this.A1_A8_P1(value, total_INCOME_DETAILS);
            }
          }
          if (key == "salaryTransferList" || key == "paySlipList") {
            //計算 系統計算/認列年收入
            this.A11_A83(value2, total_INCOME_DETAILS);
          }
          if (key == "laborDetailsList") {
            this.A1_A4(value, total_INCOME_DETAILS);
          }
          //計算總total bankerList table另計
          if (key != "bankerList") {
            this.getTotal(key, total_INCOME_DETAILS);
          }
          else {
            switch (value) {
              case "C1":
                INCOME_DETAILS.Ctotal = data;
                INCOME_DETAILS.C2 = "";
                INCOME_DETAILS.C3 = "";
                break;
              case "C2":
                INCOME_DETAILS.Ctotal = data;
                INCOME_DETAILS.C1 = "";
                INCOME_DETAILS.C3 = "";
                break;
              case "C3":
                INCOME_DETAILS.Ctotal = data;
                INCOME_DETAILS.C1 = "";
                INCOME_DETAILS.C2 = "";
                break;
              default:
                break;
            }
          }

        }
      }
    }
    return data
  }

  //第一二張table處理 計算A1_A8  incomeAndTaxList/withholdingList
  A1_A8_P1(value: string, total_INCOME_DETAILS: INCOME_DETAILS[]) {
    for (const INCOME_DETAILS of total_INCOME_DETAILS) {
      let data = 0//輸入金額
      let P1 = 0;//職業人數 /被除數
      let A5 = 700000;// min(data,A5)
      let CB = true//判斷C欄位是否要帶預設值
      switch (value) {
        case "A1":
          CB = INCOME_DETAILS.C1 == "" || INCOME_DETAILS.C1 == INCOME_DETAILS.D1 ? true : false;
          INCOME_DETAILS.D1 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A1.toString())))) ? this.toCurrency(this.toINT(data * 7 / 10).toString()) : INCOME_DETAILS.D1);
          INCOME_DETAILS.C1 = CB ? INCOME_DETAILS.D1 : INCOME_DETAILS.C1;
          this.getD(total_INCOME_DETAILS);
          if (INCOME_DETAILS.A1 == "") {
            INCOME_DETAILS.D1 = "";
            INCOME_DETAILS.C1 = "";
          }
          break;
        case "A2":
          CB = INCOME_DETAILS.C2 == "" || INCOME_DETAILS.C2 == INCOME_DETAILS.D2 ? true : false;
          INCOME_DETAILS.D2 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A2.toString())))) ? this.toCurrency(data.toString()) : INCOME_DETAILS.D2);
          INCOME_DETAILS.C2 = CB ? INCOME_DETAILS.D2 : INCOME_DETAILS.C2;
          this.getD(total_INCOME_DETAILS);
          if (INCOME_DETAILS.A2 == "") {
            INCOME_DETAILS.D2 = "";
            INCOME_DETAILS.C2 = "";
          }
          break;
        case "A3":
          CB = INCOME_DETAILS.C3 == "" || INCOME_DETAILS.C3 == INCOME_DETAILS.D3 ? true : false;
          P1 = !isNaN(P1 = (parseInt(INCOME_DETAILS.P1))) ? P1 : 1;
          INCOME_DETAILS.D3 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A3.toString())))) ? this.toCurrency(this.toINT(this.toINT(data * 7 / 10) / P1).toString()) : INCOME_DETAILS.D3);
          INCOME_DETAILS.C3 = CB ? INCOME_DETAILS.D3 : INCOME_DETAILS.C3;
          if (INCOME_DETAILS.A3 == "") {
            INCOME_DETAILS.D3 = "";
            INCOME_DETAILS.C3 = "";
          }
          break;
        case "A4":
          CB = INCOME_DETAILS.C4 == "" || INCOME_DETAILS.C4 == INCOME_DETAILS.D4 ? true : false;
          INCOME_DETAILS.D4 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A4.toString())))) ? this.toCurrency(this.toINT(data * 7 / 10).toString()) : INCOME_DETAILS.D4);
          INCOME_DETAILS.C4 = CB ? INCOME_DETAILS.D4 : INCOME_DETAILS.C4;
          if (INCOME_DETAILS.A4 == "") {
            INCOME_DETAILS.D4 = "";
            INCOME_DETAILS.C4 = "";
          }
          break;
        case "A5":
          CB = INCOME_DETAILS.C5 == "" || INCOME_DETAILS.C5 == INCOME_DETAILS.D5 ? true : false;
          INCOME_DETAILS.D5 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A5.toString())))) ? data * 5 / 10 < A5 ?
            this.toCurrency(this.toINT(data * 5 / 10).toString()) : this.toCurrency(A5.toString()) : INCOME_DETAILS.D5);
          INCOME_DETAILS.C5 = CB ? INCOME_DETAILS.D5 : INCOME_DETAILS.C5;
          if (INCOME_DETAILS.A5 == "") {
            INCOME_DETAILS.D5 = "";
            INCOME_DETAILS.C5 = "";
          }
          break;
        case "A6":
          CB = INCOME_DETAILS.C6 == "" || INCOME_DETAILS.C6 == INCOME_DETAILS.D6 ? true : false;
          INCOME_DETAILS.D6 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A6.toString())))) ? this.toCurrency(data.toString()) : INCOME_DETAILS.D6);
          INCOME_DETAILS.C6 = CB ? INCOME_DETAILS.D6 : INCOME_DETAILS.C6;
          if (INCOME_DETAILS.A6 == "") {
            INCOME_DETAILS.D6 = "";
            INCOME_DETAILS.C6 = "";
          }
          break;
        case "A7":
          CB = INCOME_DETAILS.C7 == "" || INCOME_DETAILS.C7 == INCOME_DETAILS.D7 ? true : false;
          INCOME_DETAILS.D7 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A7.toString())))) ? this.toCurrency(data.toString()) : INCOME_DETAILS.D7);
          INCOME_DETAILS.C7 = CB ? INCOME_DETAILS.D7 : INCOME_DETAILS.C7;
          if (INCOME_DETAILS.A7 == "") {
            INCOME_DETAILS.D7 = "";
            INCOME_DETAILS.C7 = "";
          }
          break;
        case "A8":
          CB = INCOME_DETAILS.C8 == "" || INCOME_DETAILS.C8 == INCOME_DETAILS.D8 ? true : false;
          INCOME_DETAILS.D8 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A8.toString())))) ? this.toCurrency(data.toString()) : INCOME_DETAILS.D8);
          INCOME_DETAILS.C8 = CB ? INCOME_DETAILS.D8 : INCOME_DETAILS.C8;
          if (INCOME_DETAILS.A8 == "") {
            INCOME_DETAILS.D8 = "";
            INCOME_DETAILS.C8 = "";
          }
          break;
        case "P1":
          CB = INCOME_DETAILS.C3 == "" || INCOME_DETAILS.C3 == INCOME_DETAILS.D3 ? true : false;
          P1 = !isNaN(P1 = (parseInt(INCOME_DETAILS.P1))) ? P1 : 1;
          INCOME_DETAILS.D3 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A3.toString())))) ? this.toCurrency(this.toINT(this.toINT(data * 7 / 10) / P1).toString()) : INCOME_DETAILS.D3);
          INCOME_DETAILS.C3 = CB ? INCOME_DETAILS.D3 : INCOME_DETAILS.C3;
          this.getD(total_INCOME_DETAILS);
          break;
        default:
          break;
      }
    }
  }

  //第一二表單計算D incomeAndTaxList/withholdingList
  getD(total_INCOME_DETAILS: INCOME_DETAILS[]) {
    let A1 = 0//A1金額
    let A2 = 0//B1金額
    let B = 0//特殊欄位計算金額
    let A1_A2 = 0;//A1A2加總
    let A1B = false;//查看A1是否有值
    let A2B = false;//查看A2是否有值
    let BB = false;//查看Btotal是否有值
    let CB = true//判斷C欄位是否要帶預設值
    for (const INCOME_DETAILS of total_INCOME_DETAILS) {

      CB = INCOME_DETAILS.C == "" || INCOME_DETAILS.C == INCOME_DETAILS.D ? true : false;


      A1B = (!isNaN(A1 = parseInt(this.toNumber(INCOME_DETAILS.A1.toString())))) ? true : A1B;
      A2B = (!isNaN(A2 = parseInt(this.toNumber(INCOME_DETAILS.A2.toString())))) ? true : A2B;
      BB = (!isNaN(B = parseInt(this.toNumber(INCOME_DETAILS.B.toString())))) ? true : BB;

      A1_A2 = A1B ? A1_A2 + A1 : A1_A2;
      A1_A2 = A2B ? A1_A2 + A2 : A1_A2;

      //(A1+A2)*0.5跟Btotal比較 選最小
      INCOME_DETAILS.D = BB ? (A1_A2 * 5 / 10) > B ? this.toCurrency(this.toINT(B).toString()) :
        this.toCurrency(this.toINT(A1_A2 * 5 / 10).toString()) :
        INCOME_DETAILS.D;

      INCOME_DETAILS.C = CB ? INCOME_DETAILS.D : INCOME_DETAILS.C;
    }
  }

  //第三四張table處理 計算A11_A83欄位  salaryTransferList/paySlipList
  A11_A83(value2: string, total_INCOME_DETAILS: INCOME_DETAILS[]) {
    let intData = 0;//計算區間總資料數int
    let total = 0;//小計
    let data = 0//資料轉換裝資料用 number
    let avg = 0//D1數字型態
    let CB = true//判斷C欄位是否要帶預設值

    for (const INCOME_DETAILS of total_INCOME_DETAILS) {
      switch (value2) {
        case "1":
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A11.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A12.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A13.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A14.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A15.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A16.toString())))) {
            intData += 1; total += data;
          }
          CB = INCOME_DETAILS.C1 == "" || INCOME_DETAILS.C1 == INCOME_DETAILS.D1 ? true : false;
          avg = this.toINT(total / intData);
          INCOME_DETAILS.P1 = intData != 0 ? this.toCurrency(avg.toString()) : "";
          INCOME_DETAILS.D1 = intData != 0 ? this.toCurrency((avg * 14).toString()) : "";
          INCOME_DETAILS.C1 = CB ? INCOME_DETAILS.D1 : INCOME_DETAILS.C1;
          INCOME_DETAILS.A1 = this.toNumber(INCOME_DETAILS.A11) + "_" + this.toNumber(INCOME_DETAILS.A12) + "_" + this.toNumber(INCOME_DETAILS.A13) + "_" +
            this.toNumber(INCOME_DETAILS.A14) + "_" + this.toNumber(INCOME_DETAILS.A15) + "_" + this.toNumber(INCOME_DETAILS.A16);
          break;
        case "2":
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A21.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A22.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A23.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A24.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A25.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A26.toString())))) {
            intData += 1; total += data;
          }
          CB = INCOME_DETAILS.C2 == "" || INCOME_DETAILS.C2 == INCOME_DETAILS.D2 ? true : false;
          avg = this.toINT(total / intData);
          INCOME_DETAILS.P2 = intData != 0 ? this.toCurrency(avg.toString()) : "";
          INCOME_DETAILS.D2 = intData != 0 ? this.toCurrency((this.toINT(avg * 7 / 10 * 14)).toString()) : "";
          INCOME_DETAILS.C2 = CB ? INCOME_DETAILS.D2 : INCOME_DETAILS.C2;
          INCOME_DETAILS.A2 = this.toNumber(INCOME_DETAILS.A21) + "_" + this.toNumber(INCOME_DETAILS.A22) + "_" + this.toNumber(INCOME_DETAILS.A23) + "_" +
            this.toNumber(INCOME_DETAILS.A24) + "_" + this.toNumber(INCOME_DETAILS.A25) + "_" + this.toNumber(INCOME_DETAILS.A26);
          break;
        case "3":
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A3.toString())))) {
            CB = INCOME_DETAILS.C3 == "" || INCOME_DETAILS.C3 == INCOME_DETAILS.D3 ? true : false;
            INCOME_DETAILS.D3 = this.toCurrency(data.toString());
            INCOME_DETAILS.C3 = CB ? INCOME_DETAILS.D3 : INCOME_DETAILS.C3;
          } else {
            INCOME_DETAILS.D3 = ""; INCOME_DETAILS.C3 = "";
          }
          break;
        case "4":
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A41.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A42.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A43.toString())))) {
            intData += 1; total += data;
          }
          CB = INCOME_DETAILS.C4 == "" || INCOME_DETAILS.C4 == INCOME_DETAILS.D4 ? true : false;
          avg = this.toINT(total / intData);
          INCOME_DETAILS.P4 = intData != 0 ? this.toCurrency(avg.toString()) : "";
          INCOME_DETAILS.D4 = intData != 0 ? this.toCurrency((avg * 12).toString()) : "";
          INCOME_DETAILS.C4 = CB ? INCOME_DETAILS.D4 : INCOME_DETAILS.C4;
          INCOME_DETAILS.A4 = this.toNumber(INCOME_DETAILS.A41) + "_" + this.toNumber(INCOME_DETAILS.A42) + "_" + this.toNumber(INCOME_DETAILS.A43);
          break;
        case "5":
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A51.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A52.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A53.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A54.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A55.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A56.toString())))) {
            intData += 1; total += data;
          }
          CB = INCOME_DETAILS.C5 == "" || INCOME_DETAILS.C5 == INCOME_DETAILS.D5 ? true : false;
          avg = this.toINT(total / intData);
          INCOME_DETAILS.P5 = intData != 0 ? this.toCurrency(avg.toString()) : "";
          INCOME_DETAILS.D5 = intData != 0 ? this.toCurrency((this.toINT(avg * 7 / 10 * 14)).toString()) : "";
          INCOME_DETAILS.C5 = CB ? INCOME_DETAILS.D5 : INCOME_DETAILS.C5;
          INCOME_DETAILS.A5 = this.toNumber(INCOME_DETAILS.A51) + "_" + this.toNumber(INCOME_DETAILS.A52) + "_" + this.toNumber(INCOME_DETAILS.A53) + "_" +
            this.toNumber(INCOME_DETAILS.A54) + "_" + this.toNumber(INCOME_DETAILS.A55) + "_" + this.toNumber(INCOME_DETAILS.A56);
          break;
        case "6":
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A61.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A62.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A63.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A64.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A65.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A66.toString())))) {
            intData += 1; total += data;
          }
          CB = INCOME_DETAILS.C6 == "" || INCOME_DETAILS.C6 == INCOME_DETAILS.D6 ? true : false;
          avg = this.toINT(total / intData);
          INCOME_DETAILS.P6 = intData != 0 ? this.toCurrency(avg.toString()) : "";
          INCOME_DETAILS.D6 = intData != 0 ? this.toCurrency((this.toINT(avg * 7 / 10 * 14)).toString()) : "";
          INCOME_DETAILS.C6 = CB ? INCOME_DETAILS.D6 : INCOME_DETAILS.C6;
          INCOME_DETAILS.A6 = this.toNumber(INCOME_DETAILS.A61) + "_" + this.toNumber(INCOME_DETAILS.A62) + "_" + this.toNumber(INCOME_DETAILS.A63) + "_" +
            this.toNumber(INCOME_DETAILS.A64) + "_" + this.toNumber(INCOME_DETAILS.A65) + "_" + this.toNumber(INCOME_DETAILS.A66);
          break;
        case "7":
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A7.toString())))) {
            CB = INCOME_DETAILS.C7 == "" || INCOME_DETAILS.C7 == INCOME_DETAILS.D7 ? true : false;
            INCOME_DETAILS.D7 = this.toCurrency(data.toString());
            INCOME_DETAILS.C7 = CB ? INCOME_DETAILS.D7 : INCOME_DETAILS.C7;
          } else {
            INCOME_DETAILS.D7 = ""; INCOME_DETAILS.C7 = "";
          }
          break;
        case "8":
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A81.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A82.toString())))) {
            intData += 1; total += data;
          }
          if (!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A83.toString())))) {
            intData += 1; total += data;
          }
          CB = INCOME_DETAILS.C8 == "" || INCOME_DETAILS.C8 == INCOME_DETAILS.D8 ? true : false;
          avg = this.toINT(total / intData);
          INCOME_DETAILS.P8 = intData != 0 ? this.toCurrency(avg.toString()) : "";
          INCOME_DETAILS.D8 = intData != 0 ? this.toCurrency((avg * 12).toString()) : "";
          INCOME_DETAILS.C8 = CB ? INCOME_DETAILS.D8 : INCOME_DETAILS.C8;
          INCOME_DETAILS.A8 = this.toNumber(INCOME_DETAILS.A81) + "_" + this.toNumber(INCOME_DETAILS.A82) + "_" + this.toNumber(INCOME_DETAILS.A83);
          break;
        default:
          break;
      }

    }
    return intData
  }

  //第五張table處理 計算A1_A4  laborDetailsList
  A1_A4(value: string, total_INCOME_DETAILS: INCOME_DETAILS[]) {
    for (const INCOME_DETAILS of total_INCOME_DETAILS) {
      let data = 0//輸入金額
      let CB = true//判斷C欄位是否要帶預設值
      switch (value) {
        case "A1":
          CB = INCOME_DETAILS.C1 == "" || INCOME_DETAILS.C1 == INCOME_DETAILS.D1 ? true : false;
          INCOME_DETAILS.D1 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A1.toString())))) ? this.toCurrency((data * 12).toString()) : INCOME_DETAILS.D1);
          INCOME_DETAILS.C1 = CB ? INCOME_DETAILS.D1 : INCOME_DETAILS.C1;
          if (INCOME_DETAILS.A1 == "") {
            INCOME_DETAILS.D1 = "";
            INCOME_DETAILS.C1 = "";
          }
          break;
        case "A2":
          CB = INCOME_DETAILS.C2 == "" || INCOME_DETAILS.C2 == INCOME_DETAILS.D2 ? true : false;
          INCOME_DETAILS.D2 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A2.toString())))) ? this.toCurrency((data * 12).toString()) : INCOME_DETAILS.D2);
          INCOME_DETAILS.C2 = CB ? INCOME_DETAILS.D2 : INCOME_DETAILS.C2;
          if (INCOME_DETAILS.A2 == "") {
            INCOME_DETAILS.D2 = "";
            INCOME_DETAILS.C2 = "";
          }
          break;
        case "A3":
          CB = INCOME_DETAILS.C3 == "" || INCOME_DETAILS.C3 == INCOME_DETAILS.D3 ? true : false;
          INCOME_DETAILS.D3 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A3.toString())))) ? this.toCurrency(this.toINT(data * 7 / 10 * 12).toString()) : INCOME_DETAILS.D3);
          INCOME_DETAILS.C3 = CB ? INCOME_DETAILS.D3 : INCOME_DETAILS.C3;
          if (INCOME_DETAILS.A3 == "") {
            INCOME_DETAILS.D3 = "";
            INCOME_DETAILS.C3 = "";
          }
          break;
        case "A4":
          CB = INCOME_DETAILS.C4 == "" || INCOME_DETAILS.C4 == INCOME_DETAILS.D4 ? true : false;
          INCOME_DETAILS.D4 = ((!isNaN(data = parseInt(this.toNumber(INCOME_DETAILS.A4.toString())))) ? this.toCurrency(this.toINT(data * 7 / 10 * 12).toString()) : INCOME_DETAILS.D4);
          INCOME_DETAILS.C4 = CB ? INCOME_DETAILS.D4 : INCOME_DETAILS.C4;
          if (INCOME_DETAILS.A4 == "") {
            INCOME_DETAILS.D4 = "";
            INCOME_DETAILS.C4 = "";
          }
          break;
        default:
          break;
      }
    }
  }

  //計算總Total
  getTotal(key: string, total_INCOME_DETAILS: INCOME_DETAILS[]) {
    let Dvalue = 0;
    let Cvalue = 0;
    let Dtotal = 0;
    let Ctotal = 0;
    for (const INCOME_DETAILS of total_INCOME_DETAILS) {

      Dtotal = (!isNaN(Dvalue = parseInt(this.toNumber(INCOME_DETAILS.D1.toString())))) ? Dtotal + Dvalue : Dtotal
      Dtotal = (!isNaN(Dvalue = parseInt(this.toNumber(INCOME_DETAILS.D2.toString())))) ? Dtotal + Dvalue : Dtotal
      Dtotal = (!isNaN(Dvalue = parseInt(this.toNumber(INCOME_DETAILS.D3.toString())))) ? Dtotal + Dvalue : Dtotal

      Ctotal = (!isNaN(Cvalue = parseInt(this.toNumber(INCOME_DETAILS.C1.toString())))) ? Ctotal + Cvalue : Ctotal
      Ctotal = (!isNaN(Cvalue = parseInt(this.toNumber(INCOME_DETAILS.C2.toString())))) ? Ctotal + Cvalue : Ctotal
      Ctotal = (!isNaN(Cvalue = parseInt(this.toNumber(INCOME_DETAILS.C3.toString())))) ? Ctotal + Cvalue : Ctotal


      if (key == "incomeAndTaxList" || key == "withholdingList") {
        Dtotal = (!isNaN(Dvalue = parseInt(this.toNumber(INCOME_DETAILS.D.toString())))) ? Dtotal + Dvalue : Dtotal
        Ctotal = (!isNaN(Cvalue = parseInt(this.toNumber(INCOME_DETAILS.C.toString())))) ? Ctotal + Cvalue : Ctotal
      }

      if (key != "paySlipList") {
        Dtotal = (!isNaN(Dvalue = parseInt(this.toNumber(INCOME_DETAILS.D4.toString())))) ? Dtotal + Dvalue : Dtotal
        Ctotal = (!isNaN(Cvalue = parseInt(this.toNumber(INCOME_DETAILS.C4.toString())))) ? Ctotal + Cvalue : Ctotal
      }

      if (key != "withholdingList" && key != "laborDetailsList") {
        Dtotal = (!isNaN(Dvalue = parseInt(this.toNumber(INCOME_DETAILS.D6.toString())))) ? Dtotal + Dvalue : Dtotal
        Ctotal = (!isNaN(Cvalue = parseInt(this.toNumber(INCOME_DETAILS.C6.toString())))) ? Ctotal + Cvalue : Ctotal
      }

      if (key != "paySlipList" && key != "laborDetailsList") {
        Dtotal = (!isNaN(Dvalue = parseInt(this.toNumber(INCOME_DETAILS.D8.toString())))) ? Dtotal + Dvalue : Dtotal
        Ctotal = (!isNaN(Cvalue = parseInt(this.toNumber(INCOME_DETAILS.C8.toString())))) ? Ctotal + Cvalue : Ctotal
      }
      if (key != "laborDetailsList") {
        Dtotal = (!isNaN(Dvalue = parseInt(this.toNumber(INCOME_DETAILS.D5.toString())))) ? Dtotal + Dvalue : Dtotal
        Dtotal = (!isNaN(Dvalue = parseInt(this.toNumber(INCOME_DETAILS.D7.toString())))) ? Dtotal + Dvalue : Dtotal

        Ctotal = (!isNaN(Cvalue = parseInt(this.toNumber(INCOME_DETAILS.C5.toString())))) ? Ctotal + Cvalue : Ctotal
        Ctotal = (!isNaN(Cvalue = parseInt(this.toNumber(INCOME_DETAILS.C7.toString())))) ? Ctotal + Cvalue : Ctotal
      }

      INCOME_DETAILS.Dtotal = this.toCurrency(Dtotal.toString());
      INCOME_DETAILS.Ctotal = this.toCurrency(Ctotal.toString());
    }
  }

  //轉整數 無條件捨去
  toINT(data: number) {
    return data != null ? parseInt(data.toString()) : data;
  }
  //+逗號
  toCurrency(data: string) {
    return data != null ? data.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : data;
  }

  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\d]/g, '') : data;
  }

  save_data(data: INCOME_DETAILS) {
    if (data.key != "salaryTransferList" && data.key != "paySlipList") {
      data.A1 = this.toNumber(data.A1); data.A2 = this.toNumber(data.A2); data.A4 = this.toNumber(data.A4);
      data.A5 = this.toNumber(data.A5); data.A6 = this.toNumber(data.A6); data.A8 = this.toNumber(data.A8);
    }
    data.A3 = this.toNumber(data.A3); data.A7 = this.toNumber(data.A7);
    data.B1 = this.toNumber(data.B1); data.B2 = this.toNumber(data.B2); data.B3 = this.toNumber(data.B3); data.B4 = this.toNumber(data.B4);
    data.B5 = this.toNumber(data.B5); data.B6 = this.toNumber(data.B6);
    data.C1 = this.toNumber(data.C1); data.C2 = this.toNumber(data.C2); data.C3 = this.toNumber(data.C3); data.C4 = this.toNumber(data.C4);
    data.C5 = this.toNumber(data.C5); data.C6 = this.toNumber(data.C6); data.C7 = this.toNumber(data.C7); data.C8 = this.toNumber(data.C8);
    data.D1 = this.toNumber(data.D1); data.D2 = this.toNumber(data.D2); data.D3 = this.toNumber(data.D3); data.D4 = this.toNumber(data.D4);
    data.D5 = this.toNumber(data.D5); data.D7 = this.toNumber(data.D6); data.D7 = this.toNumber(data.D7); data.D8 = this.toNumber(data.D8);
    data.C = this.toNumber(data.C);

    data.B = this.toNumber(data.B);
    data.D = this.toNumber(data.D);
    data.D6 = this.toNumber(data.D6);
    data.Ctotal = this.toNumber(data.Ctotal);
    data.Dtotal = this.toNumber(data.Dtotal);
    data.P1 = this.toNumber(data.P1);
    data.P2 = this.toNumber(data.P2);
    data.P3 = this.toNumber(data.P3);
    data.P4 = this.toNumber(data.P4);
    data.P5 = this.toNumber(data.P5);
    data.P6 = this.toNumber(data.P6);
    data.P7 = this.toNumber(data.P7);
    data.P8 = this.toNumber(data.P8);

    data.A11 = this.toNumber(data.A11);
    data.A12 = this.toNumber(data.A12);
    data.A13 = this.toNumber(data.A13);
    data.A14 = this.toNumber(data.A14);
    data.A15 = this.toNumber(data.A15);
    data.A16 = this.toNumber(data.A16);
    data.A21 = this.toNumber(data.A21);
    data.A22 = this.toNumber(data.A22);
    data.A23 = this.toNumber(data.A23);
    data.A24 = this.toNumber(data.A24);
    data.A25 = this.toNumber(data.A25);
    data.A26 = this.toNumber(data.A26);
    data.A41 = this.toNumber(data.A41);
    data.A42 = this.toNumber(data.A42);
    data.A43 = this.toNumber(data.A43);
    data.A51 = this.toNumber(data.A51);
    data.A52 = this.toNumber(data.A52);
    data.A53 = this.toNumber(data.A53);
    data.A54 = this.toNumber(data.A54);
    data.A55 = this.toNumber(data.A55);
    data.A56 = this.toNumber(data.A56);
    data.A61 = this.toNumber(data.A61);
    data.A62 = this.toNumber(data.A62);
    data.A63 = this.toNumber(data.A63);
    data.A64 = this.toNumber(data.A64);
    data.A65 = this.toNumber(data.A65);
    data.A66 = this.toNumber(data.A66);
    data.A81 = this.toNumber(data.A81);
    data.A82 = this.toNumber(data.A82);
    data.A83 = this.toNumber(data.A83);

  }
  getBlueClass()//class
  {
    return 'ngtbody'
  }

  //加總  	徵審後確認合計(打勾)
  calculate(completed: boolean, value: number) {
    let data: number;
    if (!isNaN(data = parseInt(value.toString()))) { //判斷是不是數字
      if (completed) {
        this.checkTotal = this.checkTotal + parseInt(this.toNumber(value.toString()));
        this.checkTotaltring = this.toCurrency(this.checkTotal + '');
      } else {
        this.checkTotal = this.checkTotal - parseInt(this.toNumber(value.toString()));
        this.checkTotaltring = this.toCurrency(this.checkTotal + '');
      }
    }
  }
}
