import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01002Component } from '../f01002/f01002.component';
import { F01002scn1Component } from '../f01002/f01002scn1/f01002scn1.component';
import { AuthGuard } from '../auth/auth.guard';
import { F01002scn2Component } from '../f01002/f01002scn2/f01002scn2.component';
import { Childscn1Component } from '../children/childscn1/childscn1.component';

const routes: Routes = [
  {
    path: '',
    component: F01002Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01002SCN1',
    component: F01002scn1Component,
    //canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: 'CHILDSCN100',
        component: Childscn1Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: '',
        loadChildren: () => import ('../children/children.module').then(m => m.ChildrenModule),
        //canActivate: [AuthGuard], // 守衛路由
      }
    ]
  },
  {
    path: 'F01002SCN2',
    component: F01002scn2Component,
    // canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: '',
        loadChildren: () => import ('../children/children.module').then(m => m.ChildrenModule),
        //canActivate: [AuthGuard], // 守衛路由
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class F01002RoutingModule { }
