import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01001scn1Component } from '../f01001/f01001scn1/f01001scn1.component';
import { F01001Component } from './../f01001/f01001.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: F01001Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01001SCN1',
    component: F01001scn1Component,
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
export class F01001RoutingModule { }
