import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { DynamicDirective } from './directive/dynamic.directive';
import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
import { NgZorroAntdModule } from '../ngzorro/ng-zorro-antd.module';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { ObHistoryComponent } from './ob-history/ob-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgxWatermarkModule } from 'ngx-watermark';
import { BlockModule } from '../block/block.module';
import { MaterialModule } from '../material/material.module';
import { ChildrenRoutingModule } from '../routing/children-routing.module';


@NgModule({
  declarations: [
    ConfirmComponent,
    DynamicDirective,
    DeleteConfirmComponent,
    DatePickerComponent,
    ObHistoryComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ChildrenRoutingModule,
    GoogleMapsModule,
    NgxWatermarkModule,
    NzTableModule,
    FontAwesomeModule,
    BlockModule
  ],
  exports: [
    DynamicDirective,
    DatePickerComponent,
    ObHistoryComponent
  ]
})
export class CommonLibModule { }
