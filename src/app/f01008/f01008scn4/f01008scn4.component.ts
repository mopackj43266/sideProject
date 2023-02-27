import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { F01008scn4Service } from './f01008scn4.service';
import { F01008scn4page1Component } from './f01008scn4page1/f01008scn4page1.component';
import { F01008scn4page2Component } from './f01008scn4page2/f01008scn4page2.component';

enum Page {
  Page1,
  Page2,
}
//Nick
@Component({
  selector: 'app-f01008scn4',
  templateUrl: './f01008scn4.component.html',
  styleUrls: ['./f01008scn4.component.css', '../../../assets/css/child.css']
})
export class F01008scn4Component implements OnInit {

  constructor(private f01008scn4Service: F01008scn4Service,
    private componenFactoryResolver: ComponentFactoryResolver
  ) { }

  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;

  rskmdl: boolean = false; //判斷是否有風險模型權限
  // private pagekey: string;
  component = new Map<Page, any>(
    [
      [Page.Page1, F01008scn4page1Component],
      [Page.Page2, F01008scn4page2Component],
    ]
  );
  nowPage = Page.Page1;
  readonly Page = Page;


  ngOnInit(): void {
    this.checkRskmdl();
  }

  //確認User是否有風險模型權限
  checkRskmdl() {
    const url = 'f01/childscn10action8';
    let jsonObject: any = {};
    this.f01008scn4Service.postJson(url, jsonObject).subscribe(data => {
      if (data.rspBody != null && data.rspBody > 0) { this.rskmdl = true; }
    });
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


}
