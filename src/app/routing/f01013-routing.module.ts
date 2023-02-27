import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01013Component } from '../f01013/f01013.component';
import { F01013scn1Component } from '../f01013/f01013scn1/f01013scn1.component';

const routes: Routes = [
  {
    path: '',
    component: F01013Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01013SCN1',
    component: F01013scn1Component,
    // canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: '',
        loadChildren: () => import ('../children/children.module').then(m => m.ChildrenModule),
        // canActivate: [AuthGuard], // 守衛路由
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class F01013RoutingModule { }
