import { BlockModule } from './../block/block.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { F01013Component } from './f01013.component';
import { F01013scn1Component } from './f01013scn1/f01013scn1.component';
import { F01013RoutingModule } from '../routing/f01013-routing.module';

@NgModule({
  declarations: [
    F01013Component,
    F01013scn1Component
  ],
  imports: [
    NzTableModule,
    NgZorroAntdModule,
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01013RoutingModule,
    BlockModule
  ]
})
export class F01013Module { }
