import { Component, ComponentFactoryResolver, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { Childscn2page1Component } from './childscn2page1/childscn2page1.component';

enum Page {
  Page1,
}

@Component({
  selector: 'app-childscn2',
  templateUrl: './childscn2.component.html',
  styleUrls: ['./childscn2.component.css','../../../assets/css/child.css']
})
export class Childscn2Component implements OnInit, AfterViewInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
      [Page.Page1, Childscn2page1Component],
    ]
  );
  nowPage = Page.Page1;
  readonly Page = Page;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.cuid = sessionStorage.getItem('nationalId');
    this.fds = sessionStorage.getItem('fds');
    // const 請勿使用這個方法來取得URL...資安弱掃會掃到不安全 = window.location.href.split("/");
    // this.router.navigate(['./'+url[4]+'/'+url[5]+'/CHILDSCN2/CHILDSCN2PAGE1'], { queryParams: { applno: this.applno , cuid: this.cuid , search: this.search, routerCase: this.routerCase , fds: this.fds } });
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

  getApplno(): String {
    return this.applno;
  }

  getSearch() :string {
    return this.search;
  }

  getCuid() :string {
    return this.cuid;
  }

  getRouterCase(): string {
    return this.routerCase;
  }

  getFds(): string {
    return this.fds;
  }
}
