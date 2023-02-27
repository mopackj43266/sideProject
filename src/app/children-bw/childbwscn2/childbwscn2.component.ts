import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { OptionsCode } from 'src/app/interface/base';
import { Childbwscn2Service } from './childbwscn2.service';
import { childbwscn2page1Component } from './childbwscn2page1/childbwscn2page1.component';
import { childbwscn2page2Component } from './childbwscn2page2/childbwscn2page2.component';

enum Page {
  Page1,
  Page2,
  Page3,
  Page4
}

@Component({
  selector: 'app-childbwscn2',
  templateUrl: './childbwscn2.component.html',
  styleUrls: ['./childbwscn2.component.css']
})
export class Childbwscn2Component implements OnInit {

  constructor(
    private Childbwscn2Service: Childbwscn2Service,
    private componenFactoryResolver: ComponentFactoryResolver
  )
   { }
   @ViewChild(DynamicDirective) appDynamic: DynamicDirective;
   dateCode: OptionsCode[] = [];
   dateValue: string;

   private applno: string;
   private cuid: string;
   private level: string;
   rskmdl: boolean = false; //判斷是否有風險模型權限

   component = new Map<Page, any>(
     [
       [Page.Page1, childbwscn2page1Component],
       [Page.Page2, childbwscn2page2Component],
     ]
   );
   nowPage = Page.Page1;
   readonly Page = Page;

  ngOnInit(): void {
    this.checkRskmdl();
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.level = sessionStorage.getItem('level');
    const url = 'f01/childscn10';
    const formdata: FormData = new FormData();
    formdata.append('applno', this.applno);
    formdata.append('cuid', this.cuid);
  }
  //判斷等級是否顯示 授信 高階主管才可顯示 風險模型資訊
  getLevel() {
    let YN = "N";
    if(this.level=="1"||this.level=="2"){YN="Y"}
    return YN;
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
      this.Childbwscn2Service.getDate_Json(url, jsonObject).subscribe(data => {
        if (data.rspBody != null && data.rspBody > 0) { this.rskmdl = true; }
      });
    }

}
