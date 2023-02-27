import { BlockModule } from './../block/block.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ChildrenModule } from './../children/children.module';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F01002RoutingModule } from '../routing/f01002-routing.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import zh from '@angular/common/locales/zh';
import { CommonLibModule } from '../common-lib/common-lib.module';
import { F01005Component } from './f01005.component';
import { F01005page1Component } from './f01005page1/f01005page1.component';
import { F01005page2Component } from './f01005page2/f01005page2.component';
import { F01005scn1Component } from './f01005scn1/f01005scn1.component';
import { F01005RoutingModule } from '../routing/f01005-routing.module';
registerLocaleData(zh);
@NgModule({
  declarations: [
    F01005Component,
    F01005scn1Component,
    F01005page1Component,
    F01005page2Component,
  ],
  imports: [
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01005RoutingModule,
    NgZorroAntdModule,
    ChildrenModule,
    NzTableModule,
    CommonLibModule,
    BlockModule
  ]
})
export class F01005Module { }
