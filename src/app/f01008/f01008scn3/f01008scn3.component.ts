import { F01008scn3page1Component } from './f01008scn3page1/f01008scn3page1.component';
import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { F01008scn3Service } from './f01008scn3.service';
import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { NgxWatermarkOptions } from 'ngx-watermark';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
interface dateCode {
  value: string;
  viewValue: string;
}
enum Page {
  Page1,
  Page2
}
@Component({
  selector: 'app-f01008scn3',
  templateUrl: './f01008scn3.component.html',
  styleUrls: ['./f01008scn3.component.css', '../../../assets/css/f01.css']
})
export class F01008scn3Component implements OnInit {
  total: string;
  constructor(
    private F01008scn3Service: F01008scn3Service,
    private componenFactoryResolver: ComponentFactoryResolver,
    private pipe: DatePipe
  ) { }
  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;
  dateCode: dateCode[] = [];
  dateValue: string;
  toggle = true;
  private applno: string;
  private cuid: string;
  today: string;

  calloutSource$: Subscription;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
  }
  ngAfterViewInit() {
    this.resetPage();
    // const url = 'f01/childscn6';
    // let jsonObject: any = {};
    // jsonObject['applno'] = this.applno;
    // jsonObject['cuid'] = this.cuid;
    // jsonObject['code'] = 'MASTER';
    // this.childscn6Service.getDate(url, jsonObject).subscribe(data => {
    //   if (data.rspBody.items.length > 0) {
    //     for (let i = 0; i < data.rspBody.items.length; i++) {
    //       this.dateCode.push({ value: data.rspBody.items[i].QUERYDATE, viewValue: data.rspBody.items[i].QUERYDATE })
    //     }
    //     this.dateValue = data.rspBody.items[0].QUERYDATE
    //     sessionStorage.setItem('queryDate', this.dateValue);
    //     this.resetPage();
    //     //this.router.navigate(['./'+this.routerCase+'/CHILDSCN6/CHILDSCN6PAGE1'], { queryParams: { applno: this.applno , cuid: this.cuid , search: this.search , queryDate: this.dateValue, routerCase: this.routerCase, fds: this.fds} });
    //   }
    // });
  }
  changeDate() {
    this.resetPage();
    sessionStorage.setItem('queryDate', this.dateValue);
    //this.router.navigate(['./'+this.routerCase+'/CHILDSCN6/CHILDSCN6PAGE1'], { queryParams: { applno: this.applno , cuid: this.cuid , search: this.search , queryDate: this.dateValue, routerCase: this.routerCase } });
  }

  resetPage() {
    const componentFactory = this.componenFactoryResolver.resolveComponentFactory(F01008scn3page1Component);
    const viewContainerRef = this.appDynamic.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
  }
}
