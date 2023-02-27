import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01017Component } from '../f01017/f01017.component';
import { F01017scn1Component } from '../f01017/f01017scn1/f01017scn1.component';

const routes: Routes = [
  {
    path: '',
    component: F01017Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01017SCN1',
    component: F01017scn1Component,
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
export class F01017RoutingModule { }
