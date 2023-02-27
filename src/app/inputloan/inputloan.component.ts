import { Inputloanpage1Component } from './inputloanpage1/inputloanpage1.component';
import { Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Inputloanpage5Component } from './inputloanpage5/inputloanpage5.component';
import { DynamicDirective } from '../common-lib/directive/dynamic.directive';
import { Inputloanpage2Component } from './inputloanpage2/inputloanpage2.component';
import { Inputloanpage3Component } from './inputloanpage3/inputloanpage3.component';
import { Inputloanpage4Component } from './inputloanpage4/inputloanpage4.component';

enum Page {
  Page1,
  Page2,
  Page3,
  Page4,
  Page5
}

@Component({
  selector: 'app-inputloan',
  templateUrl: './inputloan.component.html',
  styleUrls: ['./inputloan.component.css', '../../assets/css/child.css']
})
export class InputloanComponent implements OnInit {

  constructor(
    private router: Router,
    private componenFactoryResolver: ComponentFactoryResolver
  ) { }

  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;
  current = 0;

  component = new Map<Page, any>(
    [
      [Page.Page1, Inputloanpage1Component],
      [Page.Page2, Inputloanpage2Component],
      [Page.Page3, Inputloanpage3Component],
      [Page.Page4, Inputloanpage4Component],
      [Page.Page5, Inputloanpage5Component],
    ]
  );

  nowPage = Page.Page1;
  readonly Page = Page;

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.nowPage = this.Page.Page1;
        break;
      }
      case 1: {
        this.nowPage = this.Page.Page2;
        break;
      }
      case 2: {
        this.nowPage = this.Page.Page3;
        break;
      }
      case 3: {
        this.nowPage = this.Page.Page4;
        break;
      }
      case 4: {
        this.nowPage = this.Page.Page5;
        break;
      }
    }
  }
}
