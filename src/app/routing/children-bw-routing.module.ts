import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Childbwscn1Component } from '../children-bw/childbwscn1/childbwscn1.component';
import { Childbwscn2Component } from '../children-bw/childbwscn2/childbwscn2.component';
import { Childbwscn3Component } from '../children-bw/childbwscn3/childbwscn3.component';
import { Childbwscn4Component } from '../children-bw/childbwscn4/childbwscn4.component';
import { Childbwscn5Component } from '../children-bw/childbwscn5/childbwscn5.component';
import { Childbwscn6Component } from '../children-bw/childbwscn6/childbwscn6.component';
import { Childbwscn7Component } from '../children-bw/childbwscn7/childbwscn7.component';
import { Childbwscn8Component } from '../children-bw/childbwscn8/childbwscn8.component';
import { AuthGuard } from '../auth/auth.guard';
import { Childbwscn13Component } from '../children-bw/childbwscn13/childbwscn13.component';
import { Childbwscn14Component } from '../children-bw/childbwscn14/childbwscn14.component';
import { childbwscn2page2Component } from '../children-bw/childbwscn2/childbwscn2page2/childbwscn2page2.component';

const routes: Routes = [
  // {
  //   path: 'CHILDBWSCN1',
  //   component: Childbwscn1Component,
  //canActivate: [AuthGuard], // 守衛路由
  // },
  {
    path: 'CHILDBWSCN2',
    component: Childbwscn2Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDBWSCN3',
    component: Childbwscn3Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDBWSCN4',
    component: Childbwscn4Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDBWSCN5',
    component: Childbwscn5Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDBWSCN6',
    component: Childbwscn6Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDBWSCN7',
    component: Childbwscn7Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDBWSCN8',
    component: Childbwscn8Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDBWSCN13',
    component: Childbwscn13Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDBWSCN14',
    component: Childbwscn14Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDBWSCN2PAGE2',
    component: childbwscn2page2Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: '',
    redirectTo: 'CHILDBWSCN1',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildrenBwRoutingModule { }
