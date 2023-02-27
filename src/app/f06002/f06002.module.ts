import { BlockModule } from './../block/block.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgZorroAntdModule } from './../ngzorro/ng-zorro-antd.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChildrenRoutingModule } from '../routing/children-routing.module';
import { CommonLibModule } from '../common-lib/common-lib.module';
import { NgxWatermarkModule } from 'ngx-watermark';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faImage, faFolderOpen, faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { F06002page2Component } from './f06002page2/f06002page2.component';
import { F06002RoutingModule } from '../routing/f06002-routing.module';
import { F06002Component } from './f06002.component';
import { F06002page2step1Component } from './f06002page2/f06002page2step1/f06002page2step1.component';
import { F06002page2step2Component } from './f06002page2/f06002page2step2/f06002page2step2.component';
import { F06002page2step3Component } from './f06002page2/f06002page2step3/f06002page2step3.component';
import { F06002page2step4Component } from './f06002page2/f06002page2step4/f06002page2step4.component';
import { F06002scn1Component } from './f06002scn1/f06002scn1.component';
import { F06004Component } from '../f06004/f06004.component';
import { F06002page3Component } from './f06002page3/f06002page3.component';
import { F06002page2step5Component } from './f06002page2/f06002page2step5/f06002page2step5.component';
import { F06002page2step6Component } from './f06002page2/f06002page2step6/f06002page2step6.component';
import { F06002page1Component } from './f06002page1/f06002page1.component';



@NgModule({
  declarations: [
    F06002Component,
    F06002page1Component,
    F06002page2Component,
    F06002scn1Component,
    F06002page2step1Component,
    F06002page2step2Component,
    F06002page2step3Component,
    F06002page2step4Component,
    F06002page3Component,
    F06002page2step5Component,
    F06002page2step6Component
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ChildrenRoutingModule,
    CommonLibModule,
    NgZorroAntdModule,
    GoogleMapsModule,
    NgxWatermarkModule,
    NzTableModule,
    FontAwesomeModule,
    BlockModule,
    F06002RoutingModule,
  ]
})
export class F06002Module {
  constructor(library: FaIconLibrary) {
    library.addIcons(faImage);
    library.addIcons(faFolderOpen);
    library.addIcons(faCloudUploadAlt);
  }
}
