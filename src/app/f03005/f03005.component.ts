import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { OptionsCode } from '../interface/base';
import { F03005Service } from './f03005.service';
import { F03005addComponent } from './f03005add/f03005add.component';
import { F03005editComponent } from './f03005edit/f03005edit.component';

@Component({
  selector: 'app-f03005',
  templateUrl: './f03005.component.html',
  styleUrls: ['./f03005.component.css', '../../assets/css/f03.css']
})
export class F03005Component implements OnInit {

  constructor(
    private f03005Service: F03005Service,
    public dialog: MatDialog
  ) { }

  adrCodeSource: readonly Data[] = [];
  total = 1;
  loading = true;
  pageIndex = 1;
  pageSize = 50;

  adrType: OptionsCode[] = [];  //最上層下拉
  secondType: OptionsCode[] = [];  //第二層下拉
  thirdType: OptionsCode[] = [];  //第三層下拉
  selectedAdrValue: string;  //最上層
  selectedSecondValue: string;  //第二層選擇
  selectedThirdValue: string;  //第三層選擇
  level: string;
  selectedValue: string;

  ngOnInit(): void {
    this.f03005Service.getSysTypeCode('ADR_CODE').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.adrType.push({ value: codeNo, viewValue: desc })
      }
    });
  }

  ngAfterViewInit() {
    this.getAdrCode(null, null, this.pageIndex, this.pageSize);
  }

  changeSort(sortInfo: Sort) {
    this.getAdrCode(null, null, this.pageIndex, this.pageSize);
  }

  changePage() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 1;
  }

  changeSelect() {
    this.secondType = [];
    this.thirdType = [];
    this.selectedSecondValue = "";
    this.selectedThirdValue = "";
    this.selectedValue = "Z01";
    this.level = "1"
    this.changePage();
    this.getAdrCode(this.selectedValue, this.level, this.pageIndex, this.pageSize);
  }

  changeSelectSecond() {
    this.thirdType = [];
    this.selectedThirdValue = "";
    this.selectedValue = this.selectedSecondValue;
    this.level = "2"
    this.changePage();
    this.getAdrCode(this.selectedValue, this.level, this.pageIndex, this.pageSize);
  }

  changeSelectThird() {
    this.selectedValue = this.selectedThirdValue;
    this.level = "3"
    this.changePage();
    this.getAdrCode(this.selectedValue, this.level, this.pageIndex, this.pageSize);
  }

  getAdrCode(selectType: string, level: string, pageIndex: number, pageSize: number) {
    const baseUrl = 'f03/f03005action1';
    let jsonObject: any = {};
    jsonObject['reasonKind'] = this.selectedAdrValue != null ? this.selectedAdrValue : '';
    jsonObject['upReasonCode'] = selectType != null ? selectType : '';
    jsonObject['level'] = level;
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.f03005Service.getAdrCodeList(baseUrl, jsonObject).subscribe(data => {
      this.total = data.rspBody.size;
      this.adrCodeSource = data.rspBody.items;
      this.loading = false;
      if (data.rspBody.items.length > 0) {
        if (data.rspBody.items[0].upReasonCode == 'Z01') {
          for (let i = 0; i < data.rspBody.items.length; i++) {
            this.secondType.push({ value: data.rspBody.items[i].reasonCode, viewValue: data.rspBody.items[i].reasonDesc });
          }
        }
        if (data.rspBody.items[0].reasonLevel == '2' && data.rspBody.items[0].reasonKind == 'FM') {
          this.thirdType = [];
          for (let i = 0; i < data.rspBody.items.length; i++) {
            this.thirdType.push({ value: data.rspBody.items[i].reasonCode, viewValue: data.rspBody.items[i].reasonDesc });
          }
        }
      }
    });
  }

  addNew() {
    if (this.selectedAdrValue == null || this.selectedAdrValue == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
				data: { msgStr: "請選擇建檔項目" }
			});
    } else if (this.selectedSecondValue == '' && this.selectedThirdValue == '') {
      this.openInsertWindow('Z01', '1');
    } else if (this.selectedSecondValue != '' && this.selectedThirdValue == '') {
      this.openInsertWindow(this.selectedSecondValue, '2');
    } else {
      this.openInsertWindow(this.selectedThirdValue, '3');
    }
  }

  openInsertWindow(upReasonCode: string, reasonLevel: string) {
    const dialogRef = this.dialog.open(F03005addComponent, {
      minHeight: '70vh',
      width: '50%',
      panelClass: 'mat-dialog-transparent',
      data: {
        reasonKind: this.selectedAdrValue,
        upReasonCode: upReasonCode,
        reasonCode: '',
        reasonDesc: '',
        reasonSort: '',
        reasonFlag: 'N',
        reasonLevel: reasonLevel
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        if (reasonLevel == '1') { this.secondType = []; this.thirdType = []; this.selectedSecondValue = ""; this.selectedThirdValue = ""; }
        if (reasonLevel == '2') { this.thirdType = []; this.selectedThirdValue = ""; }
        this.getAdrCode(upReasonCode, reasonLevel, this.pageIndex, this.pageSize);
      }
    });
  }

  startEdit(
    reasonKind: string, upReasonCode: string, reasonCode: string,
    reasonDesc: string, reasonSort: string, reasonFlag: string) {
    let reasonLevel: string = '';
    if (this.selectedSecondValue == '' && this.selectedThirdValue == '') {
      reasonLevel = '1';
    } else if (this.selectedSecondValue != '' && this.selectedThirdValue == '') {
      reasonLevel = '2';
    } else {
      reasonLevel = '3';
    }

    const dialogRef = this.dialog.open(F03005editComponent, {
      minHeight: '70vh',
      width: '50%',
      panelClass: 'mat-dialog-transparent',
      data: {
        reasonKind: reasonKind,
        upReasonCode: upReasonCode,
        reasonCode: reasonCode,
        reasonDesc: reasonDesc,
        reasonSort: reasonSort,
        reasonFlag: reasonFlag,
        reasonLevel: reasonLevel
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        if (reasonLevel == '1') { this.secondType = []; this.thirdType = []; this.selectedSecondValue = ""; this.selectedThirdValue = ""; }
        if (reasonLevel == '2') { this.thirdType = []; this.selectedThirdValue = ""; }
        this.getAdrCode(upReasonCode, reasonLevel, this.pageIndex, this.pageSize);
      }
    });
  }

  private refreshTable() {
    //this.paginator._changePageSize(this.paginator.pageSize);
  }

  Clear() {
    this.selectedAdrValue = '';
    this.selectedSecondValue = '';
    this.selectedThirdValue = '';
    this.adrCodeSource = null;
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getAdrCode(this.selectedValue, this.level, pageIndex, pageSize);
  }
}
