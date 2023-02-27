import { BlockModule } from './../block/block.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F01004RoutingModule } from '../routing/f01004-routing.module';

import { F01004Component } from './f01004.component';
import { F01004scn1Component } from './f01004scn1/f01004scn1.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';

@NgModule({
  declarations: [
    F01004Component,
    F01004scn1Component
  ],
  imports: [
    NzTableModule,
    NgZorroAntdModule,
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01004RoutingModule,
    BlockModule
  ]
})
export class F01004Module { }
