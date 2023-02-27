import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { HandleSubscribeService } from 'src/app/services/handle-subscribe.service';
import { F01005Service } from '../f01005.service';



@Component({
  selector: 'app-f01005page2',
  templateUrl: './f01005page2.component.html',
  styleUrls: ['./f01005page2.component.css']
})
export class F01005page2Component implements OnInit {
  callOutDataSource = [];  // 照會提醒清單
  total = 1;
  loading = true;
  pageSize = 50;
  pageIndex = 1;
  extendTimeValue: string;
  empNo:string
  constructor(
    private f01005Service: F01005Service,
    public dialog: MatDialog,
    private router: Router,
    private handleSubscribeService: HandleSubscribeService

  ) { }

  @Input() update: (event: number) => {};
  @Output() update2 = new EventEmitter<number>();

  ngOnInit(): void {
    this.getCalloutList(this.pageIndex, this.pageSize);
    this.empNo=BaseService.userId
  }

  onclick() {
    // this.update();
    this.update2.emit();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    if(this.pageIndex !==pageIndex){// 判斷是否為第一次進頁面
      const { pageSize, pageIndex } = params;
      this.getCalloutList(pageIndex, pageSize);
    }
  }

  // 照會提醒清單
  getCalloutList(pageIndex: number, pageSize: number) {
    let jsonObject: any = {};
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.loading = false;
    this.f01005Service.getCalloutList(jsonObject).subscribe(data => {
      this.total = data.rspBody.length;
      this.callOutDataSource = data.rspBody;
      this.update(this.total);
      // this.update2.emit( this.total);
    });
  }

   //透過案編跳轉至偉茂案件處理
   toCalloutPage(applno:string,nationalId:string) {
     sessionStorage.setItem('applno',applno)
     sessionStorage.setItem('nationalId',nationalId)
     sessionStorage.setItem('empNo',this.empNo)
     sessionStorage.setItem('search','N')
     sessionStorage.setItem('winClose', 'N');
     sessionStorage.setItem('f01005', 'N');
     sessionStorage.setItem('level', '3');
     sessionStorage.setItem('stepName', 'FraudList');
     // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
     sessionStorage.setItem('page', '5');
     sessionStorage.setItem('raudKey', '2');//讓案件完成判定是從哪裡進去 1案件清單 2徵信通報
    this.router.navigate(['./F01005/F01005SCN1/CHILDSCN15']);
  }

  refreshTable() {
    this.getCalloutList(this.pageIndex, this.pageSize);
  }
}
