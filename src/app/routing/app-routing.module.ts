import { InputloanComponent } from './../inputloan/inputloan.component';
import { F03016Component } from './../f03016/f03016.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { F03013Component } from '../f03013/f03013.component';
import { F03014Component } from '../f03014/f03014.component';
import { F02001Component } from './../f02001/f02001.component';
import { F03001Component } from './../f03001/f03001.component';
import { F03002Component } from './../f03002/f03002.component';
import { F03004Component } from './../f03004/f03004.component';
import { F03005Component } from './../f03005/f03005.component';
import { F03006Component } from './../f03006/f03006.component';
import { F03007Component } from './../f03007/f03007.component';
import { F03008Component } from './../f03008/f03008.component';
import { F03009Component } from './../f03009/f03009.component';
import { F03010Component } from './../f03010/f03010.component';
import { F03011Component } from './../f03011/f03011.component';
import { F03012Component } from './../f03012/f03012.component';
import { F03015Component } from './../f03015/f03015.component';
import { F04001Component } from './../f04001/f04001.component';
import { F04002Component } from './../f04002/f04002.component';
import { HomeComponent } from './../home/home.component';
import { LoginComponent } from './../login/login.component';
import { MenuListComponent } from './../menu-list/menu-list.component';
import { F01006Component } from '../f01006/f01006.component';
import { F03017Component } from '../f03017/f03017.component';
import { F02002Component } from '../f02002/f02002.component';
import { F02003Component } from '../f02003/f02003.component';
import { Inputloanpage1Component } from '../inputloan/inputloanpage1/inputloanpage1.component';
import { Inputloanpage2Component } from '../inputloan/inputloanpage2/inputloanpage2.component';
import { Inputloanpage3Component } from '../inputloan/inputloanpage3/inputloanpage3.component';
import { Inputloanpage4Component } from '../inputloan/inputloanpage4/inputloanpage4.component';
import { Inputloanpage5Component } from '../inputloan/inputloanpage5/inputloanpage5.component';
import { F02004Component } from '../f02004/f02004.component';
import { F02005Component } from '../f02005/f02005.component';
import { F02006Component } from '../f02006/f02006.component';
import { F02007Component } from '../f02007/f02007.component';
import { F02009Component } from '../f02009/f02009.component';
import { F01011Component } from '../f01011/f01011.component';
import { F04003Component } from '../f04003/f04003.component';
import { F03003Component } from '../f03003/f03003.component';
import { F03018Component } from '../f03018/f03018.component';
import { F03019Component } from '../f03019/f03019.component';
import { F01015Component } from '../f01015/f01015.component';
import { F04004Component } from '../f04004/f04004.component';
import { F02008Component } from '../f02008/f02008.component';
import { F06001Component } from '../f06001/f06001.component';
import { F06002Component } from '../f06002/f06002.component';
import { F06003Component } from '../f06003/f06003.component';
import { F02010Component } from '../f02010/f02010.component';
import { F06004Component } from '../f06004/f06004.component';
import { F06005Component } from '../f06005/f06005.component';
import { F06006Component } from '../f06006/f06006.component';
import { F02011Component } from '../f02011/f02011.component';
import { F06002scn1Component } from '../f06002/f06002scn1/f06002scn1.component';
import { F02012Component } from '../f02012/f02012.component';
import { F06007Component } from '../f06007/f06007.component';
import { F06008Component } from '../f06008/f06008.component';
import { F06009Component } from '../f06009/f06009.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'logIn',
    component: LoginComponent
  },
  {
    path: 'logOut',
    component: LoginComponent
  },
  {
    path: '',
    component: MenuListComponent,
    children: [
      {
        path: 'input',
        component: InputloanComponent,
        children: [
          {
            path: 'INPUTLOANPAGE1',
            component: Inputloanpage1Component
          },
          {
            path: 'INPUTLOANPAGE2',
            component: Inputloanpage2Component
          },
          {
            path: 'INPUTLOANPAGE3',
            component: Inputloanpage3Component
          },
          {
            path: 'INPUTLOANPAGE4',
            component: Inputloanpage4Component
          },
          {
            path: 'INPUTLOANPAGE5',
            component: Inputloanpage5Component
          },
        ]
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01001',
        loadChildren: () => import('../f01001/f01001.module').then(m => m.F01001Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01002',
        loadChildren: () => import('../f01002/f01002.module').then(m => m.F01002Module),
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01003',
        loadChildren: () => import('../f01003/f01003.module').then(m => m.F01003Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01004',
        loadChildren: () => import('../f01004/f01004.module').then(m => m.F01004Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01005',
        loadChildren: () => import('../f01005/f01005.module').then(m => m.F01005Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01006',
        component: F01006Component
      },
      {
        path: 'F01007',
        loadChildren: () => import('../f01007/f01007.module').then(m => m.F01007Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01008',
        loadChildren: () => import('../f01008/f01008.module').then(m => m.F01008Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01009',
        loadChildren: () => import('../f01009/f01009.module').then(m => m.F01009Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01010',
        loadChildren: () => import('../f01010/f01010.module').then(m => m.F01010Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01011',
        component: F01011Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01012',
        loadChildren: () => import('../f01012/f01012.module').then(m => m.F01012Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01013',
        loadChildren: () => import('../f01013/f01013.module').then(m => m.F01013Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01014',
        loadChildren: () => import('../f01014/f01014.module').then(m => m.F01014Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01015',
        component: F01015Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01016',
        loadChildren: () => import('../f01016/f01016.module').then(m => m.F01016Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01017',
        loadChildren: () => import('../f01017/f01017.module').then(m => m.F01017Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F01018',
        loadChildren: () => import('../f01018/f01018.module').then(m => m.F01018Module),
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02001',
        component: F02001Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02002',
        component: F02002Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02003',
        component: F02003Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02004',
        component: F02004Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02005',
        component: F02005Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02006',
        component: F02006Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02007',
        component: F02007Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02008',
        component: F02008Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02009',
        component: F02009Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02010',
        component: F02010Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F02011',
        component: F02011Component,
      },
      {
        path: 'F02012',
        component: F02012Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03001',
        component: F03001Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03002',
        component: F03002Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03003',
        component: F03003Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03004',
        component: F03004Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03005',
        component: F03005Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03006',
        component: F03006Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03007',
        component: F03007Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03008',
        component: F03008Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03009',
        component: F03009Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03010',
        component: F03010Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03011',
        component: F03011Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03012',
        component: F03012Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03013',
        component: F03013Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03014',
        component: F03014Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03015',
        component: F03015Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03016',
        component: F03016Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03017',
        component: F03017Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03018',
        component: F03018Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F03019',
        component: F03019Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F04001',
        component: F04001Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F04002',
        component: F04002Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F04003',
        component: F04003Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F04004',
        component: F04004Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F06001',
        component: F06001Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F06002',
        component: F06002Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F06002SCN1',
        component: F06002scn1Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F06003',
        component: F06003Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F06004',
        component: F06004Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F06005',
        component: F06005Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F06006',
        component: F06006Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F06007',
        component: F06007Component,
        // canActivate: [AuthGuard], // 守衛路由
        children: [
          {
            path: 'F06002SCN1',
            loadChildren: () => import('../f06002/f06002.module').then(m => m.F06002Module),
          }
        ]
      },
      {
        path: 'F06008',
        component: F06008Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'F06009',
        component: F06009Component,
        // canActivate: [AuthGuard], // 守衛路由
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: true,
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
