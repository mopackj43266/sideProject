import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { F01002Service } from './f01002.service';
import { MatDialog } from '@angular/material/dialog';
import { OptionsCode } from '../interface/base';
import { DynamicDirective } from '../common-lib/directive/dynamic.directive';
import { F01002page1Component } from './f01002page1/f01002page1.component';
import { F01002page2Component } from './f01002page2/f01002page2.component';
import { HandleSubscribeService } from '../services/handle-subscribe.service';
import { Subscription } from 'rxjs';
import { BaseService } from '../base.service';

enum Page {
  Page1,
  Page2
}

@Component({
  selector: 'app-f01002',
  templateUrl: './f01002.component.html',
  styleUrls: ['./f01002.component.css', '../../assets/css/f01.css']
})

export class F01002Component implements OnInit, AfterViewInit, OnDestroy {
  total: string;
  intervalRef: any;
  constructor(
    private componenFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private f01002Service: F01002Service,
    public dialog: MatDialog,
    private handleSubscribeS: HandleSubscribeService
  ) {
    this.calloutSource$ = this.handleSubscribeS.calloutSource$.subscribe(() => {
      this.getCalloutList();
    });
  }


  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;

  component = new Map<Page, any>(
    [
      [Page.Page1, F01002page1Component],
      [Page.Page2, F01002page2Component]
    ]
  );
  nowPage = Page.Page1;
  readonly Page = Page;
  calloutSource$: Subscription;

  changePage(page: Page): void {
    this.nowPage = page;
    const componentFactory = this.componenFactoryResolver.resolveComponentFactory(this.component.get(this.nowPage));
    const viewContainerRef = this.appDynamic.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
  }

  // swcID: string;                                      // 身分證字號
  // swcApplno: string;                                  // 案件編號
  // caseType: string;                                   // 案件分類
  // caseTypeCode: OptionsCode[] = [];                   // 案件分類下拉
  // agentEmpNo: string;                                 // 代理人
  // agentEmpNoCode: OptionsCode[] = [];                 // 代理人下拉
  // callOutDataSource = new MatTableDataSource<any>();  // 照會提醒清單


  ngOnInit(): void {
    if (sessionStorage.getItem('bell') == 'Y') {
      this.nowPage = Page.Page2;
      sessionStorage.setItem('bell','');
    }
    this.intervalRef = setInterval(
      () => {
        this.getCalloutList();
      }, 5 * 60 * 1000);

  }

  ngOnDestroy() {
    this.calloutSource$.unsubscribe();
  }

  ngAfterViewInit() {
    this.getCalloutList();
    this.changePage(this.nowPage);
  }

  getCalloutList() {
    let jsonObject: any = {};
    jsonObject['swcL3EmpNo'] = BaseService.userId;
    this.f01002Service.getCalloutList(jsonObject).subscribe(data => {
      this.total = data.rspBody.size;
    });
  }

}
