import { BlockModule } from './../block/block.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgZorroAntdModule } from './../ngzorro/ng-zorro-antd.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChildrenRoutingModule } from '../routing/children-routing.module';
import { Childscn2Component } from "./childscn2/childscn2.component";
import { Childscn2page1Component } from "./childscn2/childscn2page1/childscn2page1.component";
import { Childscn3Component } from './childscn3/childscn3.component';
import { Childscn4Component } from './childscn4/childscn4.component';
import { Childscn5Component } from './childscn5/childscn5.component';
import { Childscn6Component } from './childscn6/childscn6.component';
import { Childscn6page1Component } from './childscn6/childscn6page1/childscn6page1.component';
import { Childscn7Component } from './childscn7/childscn7.component';
import { Childscn8Component } from './childscn8/childscn8.component';
import { Childscn8addComponent } from './childscn8/childscn8add/childscn8add.component';
import { Childscn8editComponent } from './childscn8/childscn8edit/childscn8edit.component';
import { Childscn9Component } from './childscn9/childscn9.component';
import { Childscn9page1Component } from './childscn9/childscn9page1/childscn9page1.component';
import { Childscn9page2Component } from './childscn9/childscn9page2/childscn9page2.component';
import { Childscn9page3Component } from './childscn9/childscn9page3/childscn9page3.component';
import { Childscn9page4Component } from './childscn9/childscn9page4/childscn9page4.component';
import { Childscn10Component } from './childscn10/childscn10.component';
import { Childscn10page1Component } from './childscn10/childscn10page1/childscn10page1.component';
import { Childscn10page2Component } from './childscn10/childscn10page2/childscn10page2.component';
import { Childscn10page3Component } from './childscn10/childscn10page3/childscn10page3.component';
import { Childscn10page4Component } from './childscn10/childscn10page4/childscn10page4.component';
import { Childscn11Component } from './childscn11/childscn11.component';
import { Childscn11page1Component } from './childscn11/childscn11page1/childscn11page1.component';
import { Childscn11page2Component } from './childscn11/childscn11page2/childscn11page2.component';
import { Childscn11page3Component } from './childscn11/childscn11page3/childscn11page3.component';
import { Childscn11page4Component } from './childscn11/childscn11page4/childscn11page4.component';
import { Childscn11page5Component } from './childscn11/childscn11page5/childscn11page5.component';
import { Childscn12Component } from './childscn12/childscn12.component';
import { Childscn12addComponent } from './childscn12/childscn12add/childscn12add.component';
import { Childscn12deleteComponent } from './childscn12/childscn12delete/childscn12delete.component';
import { Childscn12editComponent } from './childscn12/childscn12edit/childscn12edit.component';
import { Childscn13Component } from './childscn13/childscn13.component';
import { Childscn13addComponent } from './childscn13/childscn13add/childscn13add.component';
import { Childscn13deleteComponent } from './childscn13/childscn13delete/childscn13delete.component';
import { Childscn13editComponent } from './childscn13/childscn13edit/childscn13edit.component';
import { Childscn13showComponent } from './childscn13/childscn13show/childscn13show.component';
import { Childscn14Component } from './childscn14/childscn14.component';
import { Childscn14page1Component } from './childscn14/childscn14page1/childscn14page1.component';
import { Childscn14page2Component } from './childscn14/childscn14page2/childscn14page2.component';
import { Childscn14page3Component } from './childscn14/childscn14page3/childscn14page3.component';
import { Childscn15Component } from './childscn15/childscn15.component';
import { CommonLibModule } from '../common-lib/common-lib.module';
import { Childscn16Component } from './childscn16/childscn16.component';
import { Childscn17Component } from './childscn17/childscn17.component';
import { Childscn8deleteComponent } from './childscn8/childscn8delete/childscn8delete.component';
import { Childscn1Component } from './childscn1/childscn1.component';
import { Childscn18Component } from './childscn18/childscn18.component';
import { Childscn19Component } from './childscn19/childscn19.component';
import { Childscn20Component } from './childscn20/childscn20.component';
import { Childscn21Component } from './childscn21/childscn21.component';
import { NgxWatermarkModule } from 'ngx-watermark';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FontAwesomeModule,FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faImage,faFolderOpen,faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import { Childscn22Component } from './childscn22/childscn22.component';
import { Childscn23Component } from './childscn23/childscn23.component';
import { JcictableComponent } from './childscn6/childscn6page1/jcictable/jcictable.component';
import { Childscn23addComponent } from './childscn23/childscn23add/childscn23add.component';
import { FormatNumberPipe, ToNumberPipe } from '../pipe/customFormatterPipe';
import { Childscn8itemsComponent } from './childscn8/childscn8items/childscn8items.component';
import { Childscn24Component } from './childscn24/childscn24.component';
import { Childscn25Component } from './childscn25/childscn25.component';
import { Childscn26Component } from './childscn26/childscn26.component';
import { Childscn27Component } from './childscn27/childscn27.component';
import { Childscn28Component } from './childscn28/childscn28.component';
import { Childscn29Component } from './childscn29/childscn29.component';
import { Childscn30Component } from './childscn30/childscn30.component';
import { Childscn11page6Component } from './childscn11/childscn11page6/childscn11page6.component';
import { Childscn31Component } from './childscn31/childscn31.component';
import { Childscn31editComponent } from './childscn31/childscn31edit/childscn31edit.component';
import { Childscn32Component } from './childscn32/childscn32.component';
import { Childscn10page5Component } from './childscn10/childscn10page5/childscn10page5.component';
import { Childscn5editComponent } from './childscn5/childscn5edit/childscn5edit.component';



@NgModule({
  declarations: [
    Childscn2Component,
    Childscn2page1Component,
    Childscn3Component,
    Childscn4Component,
    Childscn5Component,
    Childscn6Component,
    Childscn6page1Component,
    Childscn7Component,
    Childscn8Component,
    Childscn8addComponent,
    Childscn8editComponent,
    Childscn9Component,
    Childscn9page1Component,
    Childscn9page2Component,
    Childscn9page3Component,
    Childscn9page4Component,
    Childscn10Component,
    Childscn10page1Component,
    Childscn10page2Component,
    Childscn10page3Component,
    Childscn11Component,
    Childscn11page1Component,
    Childscn11page2Component,
    Childscn11page3Component,
    Childscn11page4Component,
    Childscn11page5Component,
    Childscn12Component,
    Childscn12addComponent,
    Childscn12deleteComponent,
    Childscn12editComponent,
    Childscn13Component,
    Childscn13addComponent,
    Childscn13deleteComponent,
    Childscn13editComponent,
    Childscn13showComponent,
    Childscn14Component,
    Childscn14page1Component,
    Childscn14page2Component,
    Childscn14page3Component,
    Childscn15Component,
    Childscn16Component,
    Childscn17Component,
    Childscn8deleteComponent,
    Childscn1Component,
    Childscn18Component,
    Childscn19Component,
    Childscn20Component,
    Childscn21Component,
    Childscn10page4Component,
    Childscn22Component,
    Childscn23Component,
    JcictableComponent,
    Childscn23addComponent,
    FormatNumberPipe,
    ToNumberPipe,
    Childscn8itemsComponent,
    Childscn24Component,
    Childscn25Component,
    Childscn26Component,
    Childscn27Component,
    Childscn28Component,
    Childscn29Component,
    Childscn30Component,
    Childscn11page6Component,
    Childscn31Component,
    Childscn31editComponent,
    Childscn32Component,
    Childscn10page5Component,
    Childscn5editComponent
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
    BlockModule
  ],
  exports: [
    Childscn8addComponent,
    Childscn8editComponent,
    Childscn8itemsComponent,
    Childscn14Component
  ]
})
export class ChildrenModule {
  constructor(library:FaIconLibrary){
    library.addIcons(faImage);
    library.addIcons(faFolderOpen);
    library.addIcons(faCloudUploadAlt);
  }
 }
