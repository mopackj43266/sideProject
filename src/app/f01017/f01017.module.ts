import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F01017Component } from './f01017.component';
import { F01017scn1Component } from './f01017scn1/f01017scn1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BlockModule } from '../block/block.module';
import { ChildrenModule } from '../children/children.module';
import { CommonLibModule } from '../common-lib/common-lib.module';
import { MaterialModule } from '../material/material.module';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { F01017RoutingModule } from '../routing/f01017-routing.module';



@NgModule({
  declarations: [
    F01017Component,
    F01017scn1Component
  ],
  imports: [
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01017RoutingModule,
    NgZorroAntdModule,
    ChildrenModule,
    NzTableModule,
    CommonLibModule,
    BlockModule
  ]
})
export class F01017Module { }
