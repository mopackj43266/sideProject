import { F01003scn1Component } from './../f01003/f01003scn1/f01003scn1.component';
import { F01003Component } from './../f01003/f01003.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: F01003Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01003SCN1',
    component: F01003scn1Component,
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
export class F01003RoutingModule { }
