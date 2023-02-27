import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { OptionsCode } from 'src/app/interface/base';
import { Childscn10Service } from './childscn10.service';
import { Childscn10page1Component } from './childscn10page1/childscn10page1.component';
import { Childscn10page2Component } from './childscn10page2/childscn10page2.component';
import { Childscn10page3Component } from './childscn10page3/childscn10page3.component';
import { Childscn10page4Component } from './childscn10page4/childscn10page4.component';
import { Childscn10page5Component } from './childscn10page5/childscn10page5.component';

enum Page {
  Page1,
  Page2,
  Page3,
  Page4,
  Page5
}

@Component({
  selector: 'app-childscn10',
  templateUrl: './childscn10.component.html',
  styleUrls: ['./childscn10.component.css', '../../../assets/css/child.css']
})
export class Childscn10Component implements OnInit {

  constructor(
    private childscn10Service: Childscn10Service,
    private componenFactoryResolver: ComponentFactoryResolver
  ) { }

  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;
  dateCode: OptionsCode[] = [];
  dateValue: string;

  private applno: string;
  private cuid: string;
  private routerCase: string;
  rskmdl: boolean = false; //判斷是否有風險模型權限
  private page: string;
  private search: string;
  private param: string;
  official:boolean = false;//判斷是否顯示官署資料決策
  officialList : any[] = [];
  component = new Map<Page, any>(
    [
      [Page.Page1, Childscn10page1Component],
      [Page.Page2, Childscn10page2Component],
      [Page.Page3, Childscn10page3Component],
      [Page.Page4, Childscn10page4Component],
      [Page.Page5, Childscn10page5Component]
    ]
  );
  nowPage = Page.Page1;
  readonly Page = Page;

  ngOnInit(): void {
    this.checkRskmdl();
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.page = sessionStorage.getItem('page');
    this.search = sessionStorage.getItem('search');
    this.param = sessionStorage.getItem('param');
    this.officialoffice();
    // 20220421 從F02010導來判斷的參數
    if(this.param =='Y'){
      this.nowPage = Page.Page4;
    }
    const url = 'f01/childscn10';
    const formdata: FormData = new FormData();
    formdata.append('applno', this.applno);
    formdata.append('cuid', this.cuid);
    if(this.page=='3'){this.nowPage = Page.Page2;};
  }

  //判斷頁面是否顯示
   // 1文審 2徵信 3授信 4主管 5Fraud 7授信複合 8徵審後落人 9複審人員 10複審主管  12產生合約前覆核 0申請查詢 02補件資訊查詢 03複審案件查詢 05歷史案件查詢 07客戶案件查詢
  getPage() {
    return this.page;
  }

  getSearch() {
    return this.search;
  }

  ngAfterViewInit() {
    this.changePage(this.nowPage);
  }

  changePage(page: Page): void {
    this.nowPage = page;
    const componentFactory = this.componenFactoryResolver.resolveComponentFactory(this.component.get(this.nowPage));
    const viewContainerRef = this.appDynamic.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
  }

  //確認User是否有風險模型權限
  checkRskmdl() {
    const url = 'f01/childscn10action8';
    let jsonObject: any = {};
    this.childscn10Service.getDate_Json(url, jsonObject).subscribe(data => {
      if (data.rspBody != null && data.rspBody > 0) { this.rskmdl = true; }
    });
  }

  //判斷官署資料決策
  officialoffice()
  {
    const url = 'f01/childscn10action10';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childscn10Service.getDate_Json(url, jsonObject).subscribe(data => {

     if(data.rspBody.c3Flag=='Y')
     {
      this.official=true;
      for(const jsonObj of data.rspBody.option.split(','))
      {
        this.officialList.push({ value: jsonObj, viewValue: jsonObj })
      }
      this.childscn10Service.setOfficialList(this.officialList);
     }
    });
  }
}
