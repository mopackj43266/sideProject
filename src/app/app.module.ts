import { F01008Module } from './f01008/f01008.module';
import { childbwscn2page1Component } from './children-bw/childbwscn2/childbwscn2page1/childbwscn2page1.component';
import { childbwscn2page2Component } from './children-bw/childbwscn2/childbwscn2page2/childbwscn2page2.component';
import { F02003Component } from './f02003/f02003.component';
//import { NgZorroAntdModule } from './ngzorro/ng-zorro-antd.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MenuListModule } from './menu-list/menu-list.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BnNgIdleService } from 'bn-ng-idle';
import { MaterialModule } from './material/material.module';
import { F02001Component } from './f02001/f02001.component';
import { F03001Component } from './f03001/f03001.component';
import { F03002Component } from './f03002/f03002.component';
import { F03003Component } from './f03003/f03003.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F03005Component } from './f03005/f03005.component';
import { F03006Component } from './f03006/f03006.component';
import { F03007Component } from './f03007/f03007.component';
import { F03006addComponent } from './f03006/f03006add/f03006add.component';
import { F03006editComponent } from './f03006/f03006edit/f03006edit.component';
import { F03005editComponent } from './f03005/f03005edit/f03005edit.component';
import { F03005addComponent } from './f03005/f03005add/f03005add.component';
import { F03006roleComponent } from './f03006/f03006role/f03006role.component';
import { F03004Component } from './f03004/f03004.component';
import { F03004addComponent } from './f03004/f03004add/f03004add.component';
import { F03004editComponent } from './f03004/f03004edit/f03004edit.component';
import { F03008Component } from './f03008/f03008.component';
import { F03002child1Component } from './f03002/f03002child1/f03002child1.component';
import { F03002child2Component } from './f03002/f03002child2/f03002child2.component';
import { F03002child201Component } from './f03002/f03002child2/f03002child201/f03002child201.component';
import { F03002child202Component } from './f03002/f03002child2/f03002child202/f03002child202.component';
import { F03002child203Component } from './f03002/f03002child2/f03002child203/f03002child203.component';
import { TokenInterceptor } from './token.interceptor';
import { F03009Component } from './f03009/f03009.component';
import { F03010Component } from './f03010/f03010.component';
import { F03011Component } from './f03011/f03011.component';
import { F03012Component } from './f03012/f03012.component';
import { F03012editComponent } from './f03012/f03012edit/f03012edit.component';
import { F03011editComponent } from './f03011/f03011edit/f03011edit.component';
import { F03010editComponent } from './f03010/f03010edit/f03010edit.component';
import { F04001Component } from './f04001/f04001.component';
import { F04002Component } from './f04002/f04002.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { DatePipe, CommonModule, registerLocaleData } from '@angular/common';
import { F03011addComponent } from './f03011/f03011add/f03011add.component';
import { F03010addComponent } from './f03010/f03010add/f03010add.component';
import { F03012addComponent } from './f03012/f03012add/f03012add.component';
import { F03008editComponent } from './f03008/f03008edit/f03008edit.component';
import { F03008uploadComponent } from './f03008/f03008upload/f03008upload.component';
import { AppRoutingModule } from './routing/app-routing.module';
import { F03013Component } from './f03013/f03013.component';
import { F03014Component } from './f03014/f03014.component';
import { F03014editComponent } from './f03014/f03014edit/f03014edit.component';
import { F03014uploadComponent } from './f03014/f03014upload/f03014upload.component';
import { F03015Component } from './f03015/f03015.component';
import { F03015editComponent } from './f03015/f03015edit/f03015edit.component';
import { F03015uploadComponent } from './f03015/f03015upload/f03015upload.component';
import { F03016Component } from './f03016/f03016.component';
import { F03014addComponent } from './f03014/f03014add/f03014add.component';
import { F01006Component } from './f01006/f01006.component';
import { F01006restartComponent } from './f01006/f01006restart/f01006restart.component';
import { F03008deleteComponent } from './f03008/f03008delete/f03008delete.component';
import { F03011deleteComponent } from './f03011/f03011delete/f03011delete.component';
import { F03010deleteComponent } from './f03010/f03010delete/f03010delete.component';
import { NgZorroAntdModule } from './ngzorro/ng-zorro-antd.module';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import zh from '@angular/common/locales/zh';
import { F03017Component } from './f03017/f03017.component';
import { F03017editComponent } from './f03017/f03017edit/f03017edit.component';
import { F03017uploadComponent } from './f03017/f03017upload/f03017upload.component';
import { F02002Component } from './f02002/f02002.component';
import { F01008Component } from './f01008/f01008.component';
import { NZ_I18N, zh_TW } from 'ng-zorro-antd/i18n';
import { F03006amtComponent } from './f03006/f03006amt/f03006amt.component';
import { F03006prjComponent } from './f03006/f03006prj/f03006prj.component';
import { F03013createComponent } from './f03013/f03013create/f03013create.component';
import { InputloanComponent } from './inputloan/inputloan.component';
import { Inputloanpage1Component } from './inputloan/inputloanpage1/inputloanpage1.component';
import { Inputloanpage2Component } from './inputloan/inputloanpage2/inputloanpage2.component';
import { Inputloanpage3Component } from './inputloan/inputloanpage3/inputloanpage3.component';
import { Inputloanpage4Component } from './inputloan/inputloanpage4/inputloanpage4.component';
import { Inputloanpage5Component } from './inputloan/inputloanpage5/inputloanpage5.component';
import { F02004Component } from './f02004/f02004.component';
import { F01011Component } from './f01011/f01011.component';
import { FontAwesomeModule,FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import { F04003Component } from './f04003/f04003.component';
import { F02005Component } from './f02005/f02005.component';
import { F02006Component } from './f02006/f02006.component';
import { F02007Component } from './f02007/f02007.component';
import { RouterModule } from '@angular/router';
import { F02002returnComponent } from './f02002/f02002return/f02002return.component';
import { F02008return2Component } from './f02002/f02002return/f02008return2/f02008return2.component';
import { F03018Component } from './f03018/f03018.component';
import { F03018uploadComponent } from './f03018/f03018upload/f03018upload.component';
import { F03018editComponent } from './f03018/f03018edit/f03018edit.component';
import { F03018addComponent } from './f03018/f03018add/f03018add.component';
import { F01012Component } from './f01012/f01012.component';
import { BlockModule } from './block/block.module';
import { F01015Component } from './f01015/f01015.component';
import { F04004Component } from './f04004/f04004.component';
import { F02008Component } from './f02008/f02008.component';
import { F06001Component } from './f06001/f06001.component';
import { F02009Component } from './f02009/f02009.component';
import { F03019Component } from './f03019/f03019.component';
import { F03019amtComponent } from './f03019/f03019amt/f03019amt.component';
import { F03019editComponent } from './f03019/f03019edit/f03019edit.component';
import { F03019prjComponent } from './f03019/f03019prj/f03019prj.component';
import { F03019roleComponent } from './f03019/f03019role/f03019role.component';
import { F06002pickupComponent } from './f06002/f06002pickup/f06002pickup.component';
import { F06003Component } from './f06003/f06003.component';
import { F02010Component } from './f02010/f02010.component';
import { F06004Component } from './f06004/f06004.component';
import { F06004editComponent } from './f06004/f06004edit/f06004edit.component';
import { F06002editComponent } from './f06002/f06002edit/f06002edit.component';
import { F06004debtComponent } from './f06004/f06004debt/f06004debt.component';
import { F06005Component } from './f06005/f06005.component';
import { F06005pickupComponent } from './f06005/f06005pickup/f06005pickup.component';
import { F06006Component } from './f06006/f06006.component';
import { F06006editComponent } from './f06006/f06006edit/f06006edit.component';
import { F06006splitComponent } from './f06006/f06006split/f06006split.component';
import { F02011Component } from './f02011/f02011.component';
import { F06002Module } from './f06002/f06002.module';
import { F02012Component } from './f02012/f02012.component';
import { CommonLibModule } from './common-lib/common-lib.module';
import { F06006ConfirmComponent } from './f06006/f06006-confirm/f06006-confirm.component';
import { F06007Component } from './f06007/f06007.component';
import { ChildrenModule } from './children/children.module';
import { F06008Component } from './f06008/f06008.component';
import { F06008cancelComponent } from './f06008/f06008cancel/f06008cancel.component';
import { F06009Component } from './f06009/f06009.component';
import { F06009cancelComponent } from './f06009/f06009cancel/f06009cancel.component';




registerLocaleData(zh);
export const TW_FORMATS = {
  parse: {
    dateInput: 'YYYY/MM/DD'
  },
  display: {
    dateInput: 'YYYY/MM/DD',
    monthYearLabel: 'YYYY MMM',
    dateA11yLabel: 'YYYY/MM/DD',
    monthYearA11yLabel: 'YYYY MMM'
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    F02001Component,
    F03001Component,
    F03002Component,
    F03003Component,
    F03005Component,
    F03006Component,
    F03007Component,
    F03006addComponent,
    F03006editComponent,
    F03005editComponent,
    F03005addComponent,
    F03006roleComponent,
    F03004Component,
    F03004addComponent,
    F03004editComponent,
    F03008Component,
    F03002child1Component,
    F03002child2Component,
    F03002child201Component,
    F03002child202Component,
    F03002child203Component,
    F03009Component,
    F03010Component,
    F03011Component,
    F03012Component,
    F03012editComponent,
    F03011editComponent,
    F03010editComponent,
    F04001Component,
    F04002Component,
    F03011addComponent,
    F03010addComponent,
    F03012addComponent,
    F03008editComponent,
    F03008uploadComponent,
    F03013Component,
    F03014Component,
    F03014editComponent,
    F03014uploadComponent,
    F03015Component,
    F03015editComponent,
    F03015uploadComponent,
    F03016Component,
    F03014addComponent,
    F01006Component,
    F01006restartComponent,
    F03008deleteComponent,
    F03011deleteComponent,
    F03010deleteComponent,
    F03017Component,
    F03017editComponent,
    F03017uploadComponent,
    F02002Component,
    F01008Component,
    F03006amtComponent,
    F03006prjComponent,
    F02003Component,
    F03013createComponent,
    InputloanComponent,
    Inputloanpage1Component,
    Inputloanpage2Component,
    Inputloanpage3Component,
    Inputloanpage4Component,
    Inputloanpage5Component,
    F02004Component,
    F01011Component,
    childbwscn2page1Component,
    childbwscn2page2Component,
    F04003Component,
    F02005Component,
    F02006Component,
    F02007Component,
    F02002returnComponent,
    F02008return2Component,
    F03018Component,
    F03018uploadComponent,
    F03018editComponent,
    F03018addComponent,
    F01012Component,
    F01015Component,
    F04004Component,
    F02008Component,
    F06001Component,
    F02009Component,
    F03019Component,
    F03019amtComponent,
    F03019editComponent,
    F03019prjComponent,
    F03019roleComponent,
    F06002pickupComponent,
    F06003Component,
    F02010Component,
    F06004Component,
    F06004editComponent,
    F06002editComponent,
    F06004debtComponent,
    F06005Component,
    F06005pickupComponent,
    F06006Component,
    F06006editComponent,
    F06006splitComponent,
    F02011Component,
    F02012Component,
    F06006ConfirmComponent,
    F06007Component,
    F06008Component,
    F06008cancelComponent,
    F06009Component,
    F06009cancelComponent,
  ],
  imports: [
    NzIconModule,
    BrowserModule,
    MenuListModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientJsonpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    CommonModule,
    NgZorroAntdModule,
    NzButtonModule,
    GoogleMapsModule,
    FontAwesomeModule,
    BlockModule,
    F01008Module,
    F06002Module,
    CommonLibModule,
    ChildrenModule
    // RouterModule.forRoot([
    //   { path : '*', component : HomeComponent }
    // ], { enableTracing : false })
  ],
  providers: [
    BnNgIdleService,
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' },
    { provide: MAT_DATE_FORMATS, useValue: TW_FORMATS },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    DatePipe,
    {
      provide: NZ_I18N,
      useFactory: () => zh_TW,
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(library:FaIconLibrary){
    library.addIcons(faFolderOpen);
  }
}
