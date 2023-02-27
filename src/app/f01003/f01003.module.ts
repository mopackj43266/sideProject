import { BlockModule } from './../block/block.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F01003RoutingModule } from '../routing/f01003-routing.module';

import { F01003Component } from './f01003.component';
import { F01003scn1Component } from './f01003scn1/f01003scn1.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';

@NgModule({
  declarations: [
    F01003Component,
    F01003scn1Component
  ],
  imports: [
    NzTableModule,
    NgZorroAntdModule,
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01003RoutingModule,
    BlockModule
  ]
})
export class F01003Module { }
