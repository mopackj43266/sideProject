import { F01004scn1Component } from './../f01004/f01004scn1/f01004scn1.component';
import { F01004Component } from './../f01004/f01004.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: F01004Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01004SCN1',
    component: F01004scn1Component,
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
export class F01004RoutingModule { }
