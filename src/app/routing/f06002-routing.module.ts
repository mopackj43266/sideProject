import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F06002scn1Component } from '../f06002/f06002scn1/f06002scn1.component';

//outbound查詢畫面至提取頁面中繼站 <勿刪>
const routes: Routes = [
  {
    path: 'F06002SCN1',
    component: F06002scn1Component,
    // canActivate: [AuthGuard], // 守衛路由
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class F06002RoutingModule { }
