import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01010Component } from '../f01010/f01010.component';
import { F01010scn1Component } from '../f01010/f01010scn1/f01010scn1.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: F01010Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01010SCN1',
    component: F01010scn1Component,
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
export class F01010RoutingModule { }
