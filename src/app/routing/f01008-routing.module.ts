
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01008Component } from '../f01008/f01008.component';
import { F01008scn1Component } from '../f01008/f01008scn1/f01008scn1.component';
import { F01008scn2Component } from '../f01008/f01008scn2/f01008scn2.component';
import { F01008scn3Component } from '../f01008/f01008scn3/f01008scn3.component';
import { F01008scn4Component } from '../f01008/f01008scn4/f01008scn4.component';
import { AuthGuard } from '../auth/auth.guard';
import { Childscn14Component } from '../children/childscn14/childscn14.component';

const routes: Routes = [
  {
    path: '',
    component: F01008Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01008SCN1',
    component: F01008scn1Component,
    // canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: 'F01008SCN2',
        component: F01008scn2Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01008SCN3',
        component: F01008scn3Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01008SCN4',
        component: F01008scn4Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN14',
        component: Childscn14Component,
        // canActivate: [AuthGuard], // 守衛路由
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class F01008RoutingModule { }
