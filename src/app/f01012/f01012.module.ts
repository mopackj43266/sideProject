import { BlockModule } from '../block/block.module';
import { ChildrenModule } from '../children/children.module';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import zh from '@angular/common/locales/zh';
import { CommonLibModule } from '../common-lib/common-lib.module';
import { F01012RoutingModule } from '../routing/f01012-routing.module';
registerLocaleData(zh);
@NgModule({
  declarations: [

  ],
  imports: [
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01012RoutingModule,
    NgZorroAntdModule,
    ChildrenModule,
    NzTableModule,
    CommonLibModule,
    BlockModule
  ],
  exports: [
  ]
})
export class F01012Module { }
