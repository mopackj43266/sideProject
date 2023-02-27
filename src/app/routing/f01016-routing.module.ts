import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F01016Component } from '../f01016/f01016.component';
import { F01016scn1Component } from '../f01016/f01016scn1/f01016scn1.component';
// import { F01014scn1Component } from '../f01014/f01014scn1/f01014scn1.component';

const routes: Routes = [
  {
    path: '',
    component: F01016Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F01016SCN1',
    component: F01016scn1Component,
    // canActivate: [AuthGuard], // 守衛路由
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class F01016RoutingModule { }
