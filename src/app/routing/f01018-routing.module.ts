import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01018Component } from '../f01018/f01018.component';
import { F01018scn1Component } from '../f01018/f01018scn1/f01018scn1.component';

const routes: Routes = [
  {
    path: '',
    component: F01018Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01018SCN1',
    component: F01018scn1Component,
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
export class F01018RoutingModule { }
