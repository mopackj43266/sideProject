import { BlockModule } from './../block/block.module';
import { F01009Component } from './f01009.component';
import { ChildrenModule } from './../children/children.module';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import zh from '@angular/common/locales/zh';
import { CommonLibModule } from '../common-lib/common-lib.module';
import { F01009RoutingModule } from '../routing/f01009-routing.module';
import { F01009scn1Component } from './f01009scn1/f01009scn1.component';
registerLocaleData(zh);
@NgModule({
  declarations: [
    F01009Component,
    F01009scn1Component
  ],
  imports: [
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01009RoutingModule,
    NgZorroAntdModule,
    ChildrenModule,
    NzTableModule,
    CommonLibModule,
    BlockModule
  ]
})
export class F01009Module { }
