import { OptionsCode } from 'src/app/interface/base';
import { F06001Service } from './f06001.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';

/**
 * 客服人員進件作業
 * Omar
 * 2022/03/31
 */
interface fileInterFace {
  fileNum: number,
  fileName: string,
  fileToUpload: File | null,
  fileType: string
}

interface fileArray {
  fileNum: string,
  fileType: string
}

@Component({
  selector: 'app-f06001',
  templateUrl: './f06001.component.html',
  styleUrls: ['./f06001.component.css', '../../assets/css/f03.css']
})
export class F06001Component implements OnInit {

  constructor(
    private f06001Service: F06001Service,
    public dialog: MatDialog,
  ) { }

  applyTypeCode: OptionsCode[] = [];
  applyType: string;
  applyProcessCode: OptionsCode[] = [
    { value: "申請", viewValue: "申請" },
    { value: "提額", viewValue: "提額" },
    { value: "寬緩", viewValue: "寬緩" }
  ];
  applyProcess: string;
  custName: string;
  custId: string;
  nationalId: string;
  loanAmount: string;
  income: string;
  educationCode: OptionsCode[] = [];
  education: string;
  loanPurposeCode: OptionsCode[] = [];
  loanPurpose: string;
  level1Code: OptionsCode[] = [];
  inducLevel1: string;
  level2Code: OptionsCode[] = [];
  inducLevel2: string;
  jobCode: OptionsCode[] = [];
  jobValue: string;
  fileList: fileInterFace[] = []; //裝全部圖檔用
  fileUploadList: [] = []; //上傳圖檔用
  fileNum: number = 0;
  isPicFile: boolean;
  msg: string = "請選擇檔案";
  image: any;
  fileTypeCode: OptionsCode[] = [];
  fileType: string;


  jsonstr: string;

  ngOnInit(): void {
    let jsonObject: any = {};
    const baseUrl = "f06/f06001";
    this.f06001Service.getData(baseUrl, jsonObject).subscribe(data => {
      //進件類別
      for (const jsonObj of data.rspBody.channelType) {
        this.applyTypeCode.push({
          value: jsonObj['prodCode'],
          viewValue: jsonObj['prodCode'] + ":" + jsonObj['ProdName']
        });
      }

      for (const jsonObj of data.rspBody.InducLevel1) {
        this.level1Code.push({
          value: jsonObj['inducLevel1'],
          viewValue: jsonObj['inducLevel1'] + ":" + jsonObj['inducLevel1Desc']
        });
      }

      for (const jsonObj of data.rspBody.eIducationInfo) {
        this.educationCode.push({
          value: jsonObj['codeNo'],
          viewValue: jsonObj['codeDesc']
        })
      }

      for (const jsonObj of data.rspBody.purposeInfo) {
        this.loanPurposeCode.push({
          value: jsonObj['codeNo'],
          viewValue: jsonObj['codeDesc']
        })
      }
    });

    this.f06001Service.getSysTypeCode('DOC_TYPE').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const id = jsonObj['codeNo'];
        const name = jsonObj['codeDesc'];
        this.fileTypeCode.push({ value: id, viewValue: name })
      }
    })
  }

  //取行業level2下拉(透過level11)
  selectChangeLevel1() {
    this.setInitValue("level1");
    const baseUrl = "f06/f06001"
    let jsonObject: any = {};
    jsonObject["inducLevel1"] = this.inducLevel1;
    this.f06001Service.getData(baseUrl, jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody) {
        this.level2Code.push({
          value: jsonObj['inducLevel2'],
          viewValue: jsonObj['inducLevel2'] + ":" + jsonObj['inducLevel2Desc']
        });
      }
    });
  }

  selectChangeLevel2() {
    this.setInitValue("level2");
    const baseUrl = "f06/f06001";
    let jsonObject: any = {};
    jsonObject["inducLevel1"] = this.inducLevel1;
    jsonObject["inducLevel2"] = this.inducLevel2;
    this.f06001Service.getData(baseUrl, jsonObject).subscribe(data => {
      for (const jsonObj of data.rspBody) {
        this.jobCode.push({
          value: jsonObj['jobCode'],
          viewValue: jsonObj['jobCode'] + ":" + jsonObj['jobCodeDesc']
        });
      }
    });
  }

  setInitValue(level: string) {
    this.jobCode = [];
    this.jobValue = "";
    if (level == "level1") {
      this.level2Code = [];
      this.inducLevel2 = "";
    }
  }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage(value: string) {
    if (value == "loanAmount" || value == "income") {
      return this.formControl.hasError('required') ? '此欄位必填或不可以為0!' : '';
    } else if (value == "nationalId") {
      return this.formControl.hasError('required') ? '身分證格式不正確!' : '';
    }
    return this.formControl.hasError('required') ? '此欄位必填!' : '';
  }

  checkId(id: string): boolean {
    return this.f06001Service.checkIdNumberIsValid(id);
  }

  //檢查上傳檔案格式
  onChange(evt) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isPicFile = !!target.files[0].name.match(/(.jpg|.jpeg|.png|.JPG|.JPEG|.PNG)/);
    if (this.isPicFile) {
      this.fileNum = this.fileNum + 1;
      this.fileList.push({
        fileNum: this.fileNum,
        fileName: target.files[0].name,
        fileToUpload: target.files.item(0),
        fileType: this.fileType
      });
      this.fileType = "";
    } else {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "非JPG、PNG檔，請檢查檔案格式重新上傳" }
      });
      return;
    }
  }

  async start() {
    if (this.fileList.length == 0) {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "至少上傳一張財力證明!" }
      });
      return;
    } else {
      if (this.applyType == null || this.applyType == "" || this.applyProcess == null || this.applyProcess == "") {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "進件類別及流程需填寫!" }
        });
        return;
      }
    }

    const baseUrl = "f06/f06001action1";
    const formData = new FormData();
    formData.append("applyType", this.applyType);
    formData.append("applyProcess", this.applyProcess);
    formData.append("custName", this.custName);
    formData.append("custId", this.custId);
    formData.append("nationalId", this.nationalId);
    formData.append("education", this.education);
    formData.append("loanAmount", this.toNumber(this.loanAmount));
    formData.append("loanPurpose", this.loanPurpose);
    formData.append("inducLevel1", this.inducLevel1);
    formData.append("inducLevel2", this.inducLevel2);
    formData.append("jobCode", this.jobValue);
    formData.append("income", this.toNumber(this.income));

    let list: fileArray[] = [];
    let jsonarry: string[] = []
    for (let i = 0; i < this.fileList.length; i++) {
      list = [];
      list.push({ fileNum: this.fileList[i].fileNum.toString(), fileType: this.fileList[i].fileType });
      this.jsonstr = JSON.stringify(list);
      jsonarry.push(this.jsonstr);
      formData.append("files", this.fileList[i].fileToUpload);
    }
    formData.append('jsonArray', jsonarry.toString());
    await this.f06001Service.start(baseUrl, formData).then((data: any) => {
      if (data.rspCode == "0000") {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
        this.afterApply();
      }
    });
  }

  delete(fileNum: number) {
    this.fileList.forEach((value, index) => {
      if (value.fileNum == fileNum) this.fileList.splice(index, 1);
    });
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
      return true;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.dialog.open(ConfirmComponent, {
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

  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\w\s]|_/g, '') : data;
  }

  //字串轉數字
  stringToNumber(value: string): number {
    return Number(this.toNumber(value));
  }

  showPic(pic: any) {
    this.image = null;
    const reader = new FileReader();
    reader.readAsDataURL(pic);
    reader.onload = e => this.image = reader.result;
  }

  //進件完後清除表單資料
  afterApply() {
    this.custName = "";
    this.custId = "";
    this.nationalId = "";
    this.education = "";
    this.loanAmount = "";
    this.loanPurpose = "";
    this.inducLevel1 = "";
    this.inducLevel2 = "";
    this.level2Code = [];
    this.jobValue = "";
    this.jobCode = [];
    this.income = "";
    this.fileList = [];
  }
}
