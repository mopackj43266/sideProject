import { Component, ComponentFactoryResolver, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { environment } from 'src/environments/environment';
import { F06002Service } from '../f06002.service';
import { F06002page2Component } from '../f06002page2/f06002page2.component';
import { F06002page3Component } from '../f06002page3/f06002page3.component';
import { F06002pickupComponent } from '../f06002pickup/f06002pickup.component';

enum Page {
  Page1,
  Page2,
  Page3

}

@Component({
  selector: 'app-f06002scn1',
  templateUrl: './f06002scn1.component.html',
  styleUrls: ['./f06002scn1.component.css']
})
export class F06002scn1Component implements OnInit {
  opidreset$: Subscription //opid rxjs訂閱者
  constructor(
    private route: ActivatedRoute,
    private componenFactoryResolver: ComponentFactoryResolver,
    private f06002Service: F06002Service,
    private router: Router,
    public dialog: MatDialog
  ) {

  }
  applno: string = sessionStorage.getItem('applno');
  page:string
  opidCheck: number = Number(sessionStorage.getItem('opidCheck'))
  opidPage: string
  pageHidden: boolean = false
  environment: string = environment.from
  custType: string = '';
  recordTime: string = '';
  ctrtMaxPrd: string = '';
  ctrtMinPrd: string = '';
  flag: boolean = true;
  statusCode: string;
  data: any;
  statusCodePage: string
  ststusCodeHidden: boolean = false
  statusCodeList = ['V090','V091', 'C100', 'R100', 'B100']

  firstFlag: number = this.f06002Service.getFirstFlag();
  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;

  component = new Map<Page, any>(
    [
      [Page.Page1, F06002pickupComponent],
      [Page.Page2, F06002page2Component],
      [Page.Page3, F06002page3Component]
    ]
  );
  nowPage = Page.Page1;
  readonly Page = Page;
  ngOnInit(): void {
    this.page=sessionStorage.getItem('page')
    this.checkStatusCode()
    this.opidreset$ = this.f06002Service.opidreset$.subscribe(data => {
      this.opidCheck = Number(data)
      if(data!=null||data!=''){
        this.checkStatusCode()
      }
    })

    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.f06002Service.getCreditmainInfo(jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        this.statusCode = data.rspBody.statusCode;
        if (this.opidCheck >= 2700 && this.opidCheck <= 2940) {
          this.flag = false;
        }
      }
    });
  }

  ngAfterViewInit() {
    if (2700 <= Number(this.opidCheck) && Number(this.opidCheck) <= 2940) {
      this.changePage(this.nowPage);
    } else {
      const componentFactory = this.componenFactoryResolver.resolveComponentFactory(this.component.get(this.nowPage));
      const viewContainerRef = this.appDynamic.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
    }
  }
  //頁面離開時觸發
  ngOnDestroy() {
    this.opidreset$.unsubscribe();
    this.f06002Service.setFirstFlag(0);
  }
  async changePage(page: Page): Promise<any> {
    await this.getCheckOpid()
    if (2700 <= Number(this.opidPage) && Number(this.opidPage) <= 2940) {
      this.nowPage = page;
      const componentFactory = this.componenFactoryResolver.resolveComponentFactory(this.component.get(this.nowPage));
      const viewContainerRef = this.appDynamic.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
    } else {
      if (this.firstFlag == 1) {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "該案件已在關卡" + this.opidPage }
        });
        this.nowPage = Page.Page1;
        const componentFactory = this.componenFactoryResolver.resolveComponentFactory(this.component.get(this.nowPage));
        const viewContainerRef = this.appDynamic.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        // this.f06002Service.setFirstFlag(this.firstFlag+1)
        this.firstFlag = 2;
      } else {
        this.nowPage = page;
        const componentFactory = this.componenFactoryResolver.resolveComponentFactory(this.component.get(this.nowPage));
        const viewContainerRef = this.appDynamic.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
      }
    }
  }
  async getCheckOpid(): Promise<any> {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    await this.f06002Service.getOpid(jsonObject).then((data: any) => {
      if (data.rspCode == '0000') {
        this.opidPage = data.rspBody;
        if (Number(this.opidPage) > 2940) {
          this.pageHidden = true;
        } else {
          this.pageHidden = false;
        }
      }
      return this.opidPage;
    });
  }

  //判斷statusCode是否符合
  async checkStatusCode(): Promise<any> {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    await this.f06002Service.getStatusCode(jsonObject).then((data: any) => {
      console.log(data)
      if (data.rspCode == '0000') {
        this.statusCodePage = data.rspBody;
        var a = this.statusCodeList.indexOf(this.statusCodePage)
        if (a == -1) {
          this.ststusCodeHidden = true
        } else{
          this.ststusCodeHidden=false
        }
      }
    });

  }
}
