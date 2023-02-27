import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { ChildrenService } from '../children.service';
import { Childscn11page1Component } from './childscn11page1/childscn11page1.component';
import { Childscn11page2Component } from './childscn11page2/childscn11page2.component';
import { Childscn11page3Component } from './childscn11page3/childscn11page3.component';
import { Childscn11page4Component } from './childscn11page4/childscn11page4.component';
import { Childscn11page5Component } from './childscn11page5/childscn11page5.component';

enum Page {
  Page1,
  Page2,
  Page3,
  Page4,
  Page5
}

@Component({
  selector: 'app-childscn11',
  templateUrl: './childscn11.component.html',
  styleUrls: ['./childscn11.component.css','../../../assets/css/child.css']
})
export class Childscn11Component implements OnInit {

  constructor(
    private componenFactoryResolver: ComponentFactoryResolver
  ) { }

  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;
  private applno: string;
  private search: string;
  private cuid: string;
  private routerCase: string;
  private fds: string
  component = new Map<Page, any>(
    [
      [Page.Page1, Childscn11page1Component],
      [Page.Page2, Childscn11page2Component],
      [Page.Page3, Childscn11page3Component],
      [Page.Page4, Childscn11page4Component],
      [Page.Page5, Childscn11page5Component],
    ]
  );
  nowPage = Page.Page2;
  readonly Page = Page;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.search = sessionStorage.getItem('search');
    this.fds = sessionStorage.getItem('fds');
    // this.router.navigate(['./'+this.routerCase+'/CHILDSCN11/CHILDSCN11PAGE1'], { queryParams: { applno: this.applno, cuid: this.cuid , search: this.search, routerCase: this.routerCase, fds: this.fds } });
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
