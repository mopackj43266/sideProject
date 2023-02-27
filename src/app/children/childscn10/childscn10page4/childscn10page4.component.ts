import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Childscn10Service } from '../childscn10.service';
import { MatTableDataSource } from '@angular/material/table';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n'

//Nick 風險模型資訊
@Component({
  selector: 'app-childscn10page4',
  templateUrl: './childscn10page4.component.html',
  styleUrls: ['./childscn10page4.component.css', '../../../../assets/css/child.css']
})
export class Childscn10page4Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private childscn10Service: Childscn10Service,
    private nzI18nService: NzI18nService) {
    this.nzI18nService.setLocale(zh_TW)
  }

  private applno: string;
  //total = 1;
  loading = true;

  DSS1_DataSource = new MatTableDataSource<any>();//風險模型資訊
  EL_DSS1_RISKDSUB = new MatTableDataSource<any>();//風險模型變數資訊
  DSS2_DataSource = new MatTableDataSource<any>();//風險模型資訊
  EL_DSS2_RISKDSUB = new MatTableDataSource<any>();//風險模型變數資訊

  DSS1DataForm: FormGroup = this.fb.group({
    RISKMDSUB_A0: ['', []],//風險模型子模型代碼
    RISKMDSUB_A0_DESC: ['', []],//風險模型子模型說明
    RISKMDSCORE_A0: ['', []],//風險模型分數
    RISKMDGRADE_A0: ['', []],//風險模型等級
    RISKMDGRADE_A0_GP: ['', []],//風險模型等級分群
    RISKMDGRADE_A0_ADJ: ['', []],//風險模型等級(策略調整後)
    RISKMDGRADE_A0_GP_ADJ: ['', []],//風險模型等級分群(策略調整後)
  })

  DSS2DataForm: FormGroup = this.fb.group({
    RISKMDSUB_A1: ['', []],//風險模型子模型代碼
    RISKMDSUB_A1_DESC: ['', []],//風險模型子模型說明
    RISKMDSCORE_A1: ['', []],//風險模型分數
    RISKMDGRADE_A1: ['', []],//風險模型等級
    RISKMDGRADE_A1_GP: ['', []],//風險模型等級分群
    RISKMDGRADE_A1_ADJ: ['', []],//風險模型等級(策略調整後)
    RISKMDGRADE_A1_GP_ADJ: ['', []],//風險模型等級分群(策略調整後)
  })

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.getData();
  }

  //取Table
  getData() {

    const url = 'f01/childscn10action2';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['strgy'] = '1';
    this.childscn10Service.getDate_Json(url, jsonObject).subscribe(data => {
      if (data.rspBody.DSS1LIST.length > 0) {
        this.DSS1_DataSource.data = data.rspBody.DSS1LIST
        //系統決策
        this.DSS1DataForm.patchValue({ RISKMDSUB_A0: data.rspBody.DSS1LIST[0].RISKMDSUB_A0 })//風險模型子模型代碼
        this.DSS1DataForm.patchValue({ RISKMDSUB_A0_DESC: data.rspBody.DSS1LIST[0].RISKMDSUB_A0_DESC })//風險模型子模型說明
        this.DSS1DataForm.patchValue({ RISKMDSCORE_A0: data.rspBody.DSS1LIST[0].RISKMDSCORE_A0 })//風險模型分數
        this.DSS1DataForm.patchValue({ RISKMDGRADE_A0: data.rspBody.DSS1LIST[0].RISKMDGRADE_A0 })//風險模型等級
        this.DSS1DataForm.patchValue({ RISKMDGRADE_A0_GP: data.rspBody.DSS1LIST[0].RISKMDGRADE_A0_GP })//風險模型等級分群
        this.DSS1DataForm.patchValue({ RISKMDGRADE_A0_ADJ: data.rspBody.DSS1LIST[0].RISKMDGRADE_A0_ADJ })//風險模型等級(策略調整後)
        this.DSS1DataForm.patchValue({ RISKMDGRADE_A0_GP_ADJ: data.rspBody.DSS1LIST[0].RISKMDGRADE_A0_GP_ADJ })//風險模型等級分群(策略調整後)
      }
      this.EL_DSS1_RISKDSUB.data = data.rspBody.DSS1RISKDSUB;
      //this.total = data.rspBody.DSS1RISKDSUB.size;

      this.DSS2_DataSource.data = data.rspBody.DSS2LIST
      if (data.rspBody.DSS2LIST.length > 0) {
        //系統決策
        this.DSS2DataForm.patchValue({ RISKMDSUB_A1: data.rspBody.DSS2LIST[0].RISKMDSUB_A1 })//風險模型子模型代碼
        this.DSS2DataForm.patchValue({ RISKMDSUB_A1_DESC: data.rspBody.DSS2LIST[0].RISKMDSUB_A1_DESC })//風險模型子模型說明
        this.DSS2DataForm.patchValue({ RISKMDSCORE_A1: data.rspBody.DSS2LIST[0].RISKMDSCORE_A1 })//風險模型分數
        this.DSS2DataForm.patchValue({ RISKMDGRADE_A1: data.rspBody.DSS2LIST[0].RISKMDGRADE_A1 })//風險模型等級
        this.DSS2DataForm.patchValue({ RISKMDGRADE_A1_GP: data.rspBody.DSS2LIST[0].RISKMDGRADE_A1_GP })//風險模型等級分群
        this.DSS2DataForm.patchValue({ RISKMDGRADE_A1_ADJ: data.rspBody.DSS2LIST[0].RISKMDGRADE_A1_ADJ })//風險模型等級(策略調整後)
        this.DSS2DataForm.patchValue({ RISKMDGRADE_A1_GP_ADJ: data.rspBody.DSS2LIST[0].RISKMDGRADE_A1_GP_ADJ })//風險模型等級分群(策略調整後)
      }
      this.EL_DSS2_RISKDSUB.data = data.rspBody.DSS2RISKDSUB;
    });
  }


}
