import { NgxWatermarkModule } from 'ngx-watermark';
import { NgZorroAntdModule } from './../ngzorro/ng-zorro-antd.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuListComponent } from './menu-list.component';
import { AppRoutingModule } from '../routing/app-routing.module';
import { MaterialModule } from '../material/material.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FontAwesomeModule,FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEllipsisH,faEyeSlash,faEye,faUser,faTimes,faSearch,faChartBar,faSyncAlt,faUserCog,faShareSquare } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
@NgModule({
  declarations: [MenuListComponent],
  exports: [MenuListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    NzCardModule,
    NzAvatarModule,
    NzIconModule,
    NgZorroAntdModule,
    FontAwesomeModule,
    NgxWatermarkModule
  ]
})
export class MenuListModule {
  constructor(library:FaIconLibrary){
    library.addIcons(faTimes);
    library.addIcons(faUser);
    library.addIcons(faSearch);
    library.addIcons(faChartBar);
    library.addIcons(faSyncAlt);
    library.addIcons(faUserCog);
    library.addIcons(faShareSquare);
    library.addIcons(faEye);
    library.addIcons(faEyeSlash);
    library.addIcons(faEllipsisH);
    library.addIcons(faBell);
  }
 }
