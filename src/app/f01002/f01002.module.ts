import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ChildrenModule } from './../children/children.module';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { F01002RoutingModule } from '../routing/f01002-routing.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { F01002Component } from './f01002.component';
import { F01002scn1Component } from './f01002scn1/f01002scn1.component';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import zh from '@angular/common/locales/zh';
import { F01002page1Component } from './f01002page1/f01002page1.component';
import { F01002page2Component } from './f01002page2/f01002page2.component';
import { CommonLibModule } from '../common-lib/common-lib.module';
import { F01002page2updateComponent } from './f01002page2/f01002page2update/f01002page2update.component';
import { BlockModule } from '../block/block.module';
import { F01002scn2Component } from './f01002scn2/f01002scn2.component';
registerLocaleData(zh);
@NgModule({
  declarations: [
    F01002Component,
    F01002scn1Component,
    F01002page1Component,
    F01002page2Component,
    F01002page2updateComponent,
    F01002scn2Component,
  ],
  imports: [
    NzButtonModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    F01002RoutingModule,
    NgZorroAntdModule,
    ChildrenModule,
    NzTableModule,
    CommonLibModule,
    BlockModule
  ]
})
export class F01002Module { }
