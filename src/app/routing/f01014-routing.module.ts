import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01014Component } from '../f01014/f01014.component';
import { F01014scn1Component } from '../f01014/f01014scn1/f01014scn1.component';

const routes: Routes = [
  {
    path: '',
    component: F01014Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01014SCN1',
    component: F01014scn1Component,
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
export class F01014RoutingModule { }
