import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01007Component } from '../f01007/f01007.component';
import { F01007scn1Component } from '../f01007/f01007scn1/f01007scn1.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: F01007Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01007SCN1',
    component: F01007scn1Component,
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
export class F01007RoutingModule { }
