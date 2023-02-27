import { BlockModule } from './../block/block.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { F01016RoutingModule } from '../routing/f01016-routing.module';
import { F01016Component } from './f01016.component';
import { F01016scn1Component } from './f01016scn1/f01016scn1.component';

@NgModule({
  declarations: [
    F01016Component,
    F01016scn1Component
  ],
  imports: [
    NzTableModule,
    NgZorroAntdModule,
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01016RoutingModule,
    BlockModule
  ]
})
export class F01016Module { }
