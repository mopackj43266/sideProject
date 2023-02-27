import { BlockModule } from './../block/block.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F01001RoutingModule } from '../routing/f01001-routing.module';
import { F01001Component } from './f01001.component';
import { F01001scn1Component } from './f01001scn1/f01001scn1.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ChildrenModule } from '../children/children.module';
import { CommonLibModule } from '../common-lib/common-lib.module';

@NgModule({
  declarations: [
    F01001Component,
    F01001scn1Component
  ],
  imports: [
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01001RoutingModule,
    NgZorroAntdModule,
    ChildrenModule,
    NzTableModule,
    CommonLibModule,
    BlockModule
  ]
})
export class F01001Module { }
