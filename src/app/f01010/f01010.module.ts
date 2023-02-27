import { BlockModule } from './../block/block.module';
import { F01010RoutingModule } from './../routing/f01010-routing.module';
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
import { F01010Component } from './f01010.component';
import { F01010scn1Component } from './f01010scn1/f01010scn1.component';
import { F01010scn2Component } from './f01010scn2/f01010scn2.component';
registerLocaleData(zh);
@NgModule({
  declarations: [
    F01010Component,
    F01010scn1Component,
    F01010scn2Component
  ],
  imports: [
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01010RoutingModule,
    NgZorroAntdModule,
    ChildrenModule,
    NzTableModule,
    CommonLibModule,
    BlockModule
  ]
})
export class F01010Module { }
