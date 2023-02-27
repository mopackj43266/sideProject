import { BlockModule } from './../block/block.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { F01014RoutingModule } from '../routing/f01014-routing.module';
import { F01014Component } from './f01014.component';
import { F01014scn1Component } from './f01014scn1/f01014scn1.component';

@NgModule({
  declarations: [
    F01014Component,
    F01014scn1Component
  ],
  imports: [
    NzTableModule,
    NgZorroAntdModule,
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01014RoutingModule,
    BlockModule
  ]
})
export class F01014Module { }
