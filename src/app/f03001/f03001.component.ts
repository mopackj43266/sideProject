import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { F03001Service } from './f03001.service';
import { dataList } from './data-list.const';
import { OptionsCode } from '../interface/base';
interface sysTable {
  BUS_TYPECode: string;
  PRJ_CODE: string;
  PRJ_START_DATE: string;
}

interface sysAPI {
  codE_NO: string;
  codE_DESC: string;

}

@Component({
  selector: 'app-f03001',
  templateUrl: './f03001.component.html',
  styleUrls: ['./f03001.component.css', '../../assets/css/f03.css']
})
export class F03001Component implements OnInit {

  //表單資料
  list = dataList;
  displayedColumns: string[] = ['BUS_TYPECode', 'PRJ_CODE', 'PRJ_START_DATE'];
  dataSource = this.list;

  //表單顯示
  tableBOOL: boolean = false;

  AddData: any;

  BUS_TYPECode_Selected: string = '';
  BUS_TYPECode: any[] = [];
  BusType: OptionsCode[] = [{ value: '小額信貸', viewValue: '小額信貸' }];
  ParmType: OptionsCode[] = [];
  ParmDim: OptionsCode[] = [];
  ParmClass: OptionsCode[] = [];
  Condition: OptionsCode[] = [];
  RuleCode: sysAPI = {
    codE_NO: '',
    codE_DESC: ''
  }
  BusTypeValue: string = ''

  //專案代號
  PRJ_CODE!: string;
  //專案起始日期
  PRJ_START_DATE!: Date
  //產品性質
  PRD_TYPE: OptionsCode[] = [{ value: '001', viewValue: '001_產品性質' }, { value: '002', viewValue: '002_產品性質' }, { value: '003', viewValue: '003_產品性質' }];
  //是否啟用
  Enable: OptionsCode[] = [{ value: 'Y', viewValue: '是' }, { value: 'N', viewValue: '否' }];
  //專案起始日期
  PRJ_END_DATE!: Date
  //專案群組
  PRJ_ITEM: OptionsCode[] = [{ value: '1', viewValue: '1_群組1' }, { value: '2', viewValue: '2_群組2' }];
  //BT專案代號
  BTPRJ_CODE!: string

  data: any;


  constructor(private http: HttpClient, private f03001Service: F03001Service) {
  }


  ngOnInit(): void {
    //呼叫下拉選單值
    //業務別
    // this.f03001Service.tttt('BUS_TYPE').subscribe(data => {
    //   for (const jsonObj of data.rspBody) {
    //     const codeNo = jsonObj['codE_NO'];
    //     const desc = jsonObj['codE_DESC'];
    //     this.BusType.push({ value: codeNo, viewValue: desc })
    //   }
    // })

  }

  //搜尋
  onSearch(): void {
    if (this.BUS_TYPECode_Selected != "") {
      //是否顯示
      this.tableBOOL = true;
      this.dataSource = this.list.filter(i => i.BUS_TYPECode == this.BUS_TYPECode_Selected)
    }
    else {
      alert('業務別為必填');
    }
  }

  xxx: any;
  yyy: any;
  //複製
  Add(value: sysTable): void {
    this.xxx = value.PRJ_CODE.split("_")
    this.yyy = parseInt(this.xxx[1]) + 1
    this.AddData = { BUS_TYPECode: value.BUS_TYPECode, PRJ_CODE: this.xxx[0] + '_' + this.yyy, PRJ_START_DATE: value.PRJ_START_DATE };
    this.list.push(this.AddData);
    //刷新畫面
    this.onSearch()
  }


}
