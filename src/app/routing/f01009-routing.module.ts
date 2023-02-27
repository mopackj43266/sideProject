import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01009Component } from '../f01009/f01009.component';
import { F01009scn1Component } from '../f01009/f01009scn1/f01009scn1.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: F01009Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01009SCN1',
    component: F01009scn1Component,
    // canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: '',
        loadChildren: () => import ('../children-bw/children-bw.module').then(m => m.ChildrenBwModule),
        // canActivate: [AuthGuard], // 守衛路由
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class F01009RoutingModule { }
