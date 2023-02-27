import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F01018Component } from './f01018.component';
import { F01018scn1Component } from './f01018scn1/f01018scn1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BlockModule } from '../block/block.module';
import { ChildrenModule } from '../children/children.module';
import { CommonLibModule } from '../common-lib/common-lib.module';
import { MaterialModule } from '../material/material.module';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { F01018RoutingModule } from '../routing/f01018-routing.module';



@NgModule({
  declarations: [
    F01018Component,
    F01018scn1Component
  ],
  imports: [
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01018RoutingModule,
    NgZorroAntdModule,
    ChildrenModule,
    NzTableModule,
    CommonLibModule,
    BlockModule
  ]
})
export class F01018Module { }
