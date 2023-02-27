import { Childscn6page1Component } from './childscn6page1/childscn6page1.component';
import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { Childscn6Service } from './childscn6.service';
import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { NgxWatermarkOptions } from 'ngx-watermark';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { MenuListService } from 'src/app/menu-list/menu-list.service';
interface dateCode {
  value: string;
  viewValue: string;
}
enum Page {
  Page1,
  Page2
}

@Component({
  selector: 'app-childscn6',
  templateUrl: './childscn6.component.html',
  styleUrls: ['./childscn6.component.css', '../../../assets/css/f01.css']
})
export class Childscn6Component implements OnInit {
  total: string;
  constructor(
    private componenFactoryResolver: ComponentFactoryResolver,
    private menuListService: MenuListService
  ) {
    this.menuListService.setWaterMarkSource({
      show: true
    })
  }

  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;
  dateCode: dateCode[] = [];
  dateValue: string;
  toggle = true;

  calloutSource$: Subscription;

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.resetPage();
  }

  changeDate() {
    this.resetPage();
    sessionStorage.setItem('queryDate', this.dateValue);
  }

  resetPage() {
    const componentFactory = this.componenFactoryResolver.resolveComponentFactory(Childscn6page1Component);
    const viewContainerRef = this.appDynamic.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
  }
}
