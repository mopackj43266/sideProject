import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { OptionsCode } from 'src/app/interface/base';
import { Childscn9Service } from './childscn9.service';
import { Childscn9page1Component } from './childscn9page1/childscn9page1.component';
import { Childscn9page2Component } from './childscn9page2/childscn9page2.component';
import { Childscn9page3Component } from './childscn9page3/childscn9page3.component';
import { Childscn9page4Component } from './childscn9page4/childscn9page4.component';

enum Page {
  Page1,
  Page2,
  Page3,
  Page4
}

@Component({
  selector: 'app-childscn9',
  templateUrl: './childscn9.component.html',
  styleUrls: ['./childscn9.component.css','../../../assets/css/child.css']
})
export class Childscn9Component implements OnInit {

  queryDate:string //查詢時間
  constructor(
    private childscn9Service: Childscn9Service,
    private componenFactoryResolver: ComponentFactoryResolver,
  ) { }

  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;
  dateCode: OptionsCode[] = [];
  dateValue: string;

  private applno: string;
  private cuid: string;
  component = new Map<Page, any>(
    [
      [Page.Page1, Childscn9page1Component],
      [Page.Page2, Childscn9page2Component],
      [Page.Page3, Childscn9page3Component],
      [Page.Page4, Childscn9page4Component]
    ]
  );
  nowPage = Page.Page1;
  readonly Page = Page;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    const baseUrl = 'f01/childscn9action2';
    let jsonObject: any = {}; 
    jsonObject['applno'] = this.applno;
    this.childscn9Service.getDate(baseUrl, jsonObject).subscribe(data => {
      this.queryDate = data.rspBody.queryDate;
      this.childscn9Service.setQueryDate(this.queryDate)
    });
  }

  ngAfterViewInit() {
    this.changePage(this.nowPage);
  }

  changePage( page: Page ): void {
    this.nowPage = page;
    const componentFactory = this.componenFactoryResolver.resolveComponentFactory( this.component.get(this.nowPage));
    const viewContainerRef = this.appDynamic.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
  }
}
