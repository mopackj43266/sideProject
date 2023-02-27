import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { OptionsCode } from 'src/app/interface/base';
import { Childbwscn4Service } from './childbwscn4.service';
import { Childbwscn4page1Component } from '../childbwscn4/childbwscn4page1/childbwscn4page1.component'
import { Childbwscn4page2Component } from '../childbwscn4/childbwscn4page2/childbwscn4page2.component'
import { Childbwscn4page3Component } from '../childbwscn4/childbwscn4page3/childbwscn4page3.component'
import { Childbwscn4page4Component } from '../childbwscn4/childbwscn4page4/childbwscn4page4.component'
import { Childbwscn4page5Component } from '../childbwscn4/childbwscn4page5/childbwscn4page5.component'


enum Page {
  Page1,
  Page2,
  Page3,
  Page4,
  Page5
}

@Component({
  selector: 'app-childbwscn4',
  templateUrl: './childbwscn4.component.html',
  styleUrls: ['./childbwscn4.component.css', '../../../assets/css/f01.css']
})
export class Childbwscn4Component implements OnInit {
  queryDate: string //查詢時間
  constructor(
    private Childbwscn4Service: Childbwscn4Service,
    private componenFactoryResolver: ComponentFactoryResolver,
  ) { }

  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;
  dateCode: OptionsCode[] = [];
  dateValue: string;

  private applno: string;
  private cuid: string;
  hidden: boolean = true;
  component = new Map<Page, any>(
    [
      [Page.Page1, Childbwscn4page1Component],
      [Page.Page2, Childbwscn4page2Component],
      [Page.Page3, Childbwscn4page3Component],
      [Page.Page4, Childbwscn4page4Component],
      [Page.Page5, Childbwscn4page5Component],

    ]
  );
  nowPage = Page.Page1;
  readonly Page = Page;


  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    const baseUrl = 'f01/childBwScn4action2';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.Childbwscn4Service.getDate(baseUrl, jsonObject).subscribe(data => {
      this.queryDate = data.rspBody.queryDate;
    });
    // this.Childbwscn4Service.getDate(baseUrl, jsonObject).subscribe(data => {
    //   this.queryDate = data.rspBody.queryDate;
    // });
    //this.router.navigate(['./'+this.routerCase+'/CHILDSCN9/CHILDSCN9PAGE1'], { queryParams: { applno: this.applno , cuid: this.cuid , search: this.search, routerCase: this.routerCase, fds: this.fds } });
  }
  ngAfterViewInit() {
    this.changePage(this.nowPage);
  }
  changePage(page: Page): void {
    this.hidden = page.toString() == '4' ? true : false;
    this.nowPage = page;
    const componentFactory = this.componenFactoryResolver.resolveComponentFactory(this.component.get(this.nowPage));
    const viewContainerRef = this.appDynamic.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
  }
}
