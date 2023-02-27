import { BlockModule } from './../block/block.module';
import { F01007Component } from './f01007.component';
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
import { F01007scn1Component } from './f01007scn1/f01007scn1.component';
import { F01007RoutingModule } from '../routing/f01007-routing.module';
registerLocaleData(zh);
@NgModule({
  declarations: [
    F01007Component,
    F01007scn1Component
  ],
  imports: [
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01007RoutingModule,
    NgZorroAntdModule,
    ChildrenModule,
    NzTableModule,
    CommonLibModule,
    BlockModule
  ]
})
export class F01007Module { }
