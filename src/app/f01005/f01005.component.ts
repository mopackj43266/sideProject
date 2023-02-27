import { Component, ComponentFactoryResolver, OnInit, ViewChild, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { DynamicDirective } from '../common-lib/directive/dynamic.directive';
import { HandleSubscribeService } from '../services/handle-subscribe.service';
import { F01005page1Component } from './f01005page1/f01005page1.component';
import { F01005page2Component } from './f01005page2/f01005page2.component';
import { F01005Service } from './f01005.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

enum Page {
  Page1,
  Page2
}

@Component({
  selector: 'app-f01005',
  templateUrl: './f01005.component.html',
  styleUrls: ['./f01005.component.css', '../../assets/css/f01.css']
})
export class F01005Component implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private componenFactoryResolver: ComponentFactoryResolver,
    private handleSubscribeS: HandleSubscribeService,
    private f01005Service: F01005Service,
    private router: Router,

  ) {
    this.calloutSource$ = this.handleSubscribeS.calloutSource$.subscribe(() => {
      this.getCalloutList(this.pageIndex, this.pageSize);
    });
  }

  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;
  component = new Map<Page, any>(
    [
      [Page.Page1, F01005page1Component],
      [Page.Page2, F01005page2Component]
    ]
  );
  nowPage = Page.Page1;
  readonly Page = Page;
  num: string;
  total: string;
  calloutSource$: Subscription;
  pageSize = 10;
  pageIndex = 1;


  ngOnInit(): void {
    this.changePage(this.nowPage);
    this.getCalloutList(this.pageIndex, this.pageSize);
    if (sessionStorage.getItem('bell') == 'Y') {
      this.nowPage = Page.Page2;
      sessionStorage.setItem('bell', '');

    }
  }

  ngAfterViewInit() {
    this.getCalloutList(this.pageIndex, this.pageSize);
    if (sessionStorage.getItem('bell') == 'Y') {
      this.nowPage = Page.Page2;
      sessionStorage.setItem('bell', '');

    }
    this.changePage(this.nowPage);
  }
  ngOnDestroy() {
    this.calloutSource$.unsubscribe();
  }

  changePage(page: Page): void {
    this.nowPage = page;
    const componentFactory = this.componenFactoryResolver.resolveComponentFactory(this.component.get(this.nowPage));
    const viewContainerRef = this.appDynamic.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);

    const instance: any = componentRef.instance;
    instance.update = (num) => {
      this.num = num
    }
  }
  getCalloutList(pageIndex: number, pageSize: number) {
    let jsonObject: any = {};
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.f01005Service.getCalloutList(jsonObject).subscribe(data => {
      this.total = data.rspBody.length;
      // this.changePage(this.nowPage);
    });
  }
}
