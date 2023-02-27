import { F06003Component } from './../f06003/f06003.component';
import { F06002page3Component } from './../f06002/f06002page3/f06002page3.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Childscn1Component } from '../children/childscn1/childscn1.component';
import { Childscn10Component } from '../children/childscn10/childscn10.component';
import { Childscn10page1Component } from '../children/childscn10/childscn10page1/childscn10page1.component';
import { Childscn10page2Component } from '../children/childscn10/childscn10page2/childscn10page2.component';
import { Childscn10page3Component } from '../children/childscn10/childscn10page3/childscn10page3.component';
import { Childscn10page4Component } from '../children/childscn10/childscn10page4/childscn10page4.component';
import { Childscn11Component } from '../children/childscn11/childscn11.component';
import { Childscn11page1Component } from '../children/childscn11/childscn11page1/childscn11page1.component';
import { Childscn11page2Component } from '../children/childscn11/childscn11page2/childscn11page2.component';
import { Childscn11page3Component } from '../children/childscn11/childscn11page3/childscn11page3.component';
import { Childscn11page4Component } from '../children/childscn11/childscn11page4/childscn11page4.component';
import { Childscn11page5Component } from '../children/childscn11/childscn11page5/childscn11page5.component';
import { Childscn12Component } from '../children/childscn12/childscn12.component';
import { Childscn13Component } from '../children/childscn13/childscn13.component';
import { Childscn14Component } from '../children/childscn14/childscn14.component';
import { Childscn14page1Component } from '../children/childscn14/childscn14page1/childscn14page1.component';
import { Childscn14page2Component } from '../children/childscn14/childscn14page2/childscn14page2.component';
import { Childscn14page3Component } from '../children/childscn14/childscn14page3/childscn14page3.component';
import { Childscn15Component } from '../children/childscn15/childscn15.component';
import { Childscn16Component } from '../children/childscn16/childscn16.component';
import { Childscn17Component } from '../children/childscn17/childscn17.component';
import { Childscn2Component } from '../children/childscn2/childscn2.component';
import { Childscn2page1Component } from '../children/childscn2/childscn2page1/childscn2page1.component';
import { Childscn3Component } from '../children/childscn3/childscn3.component';
import { Childscn4Component } from '../children/childscn4/childscn4.component';
import { Childscn5Component } from '../children/childscn5/childscn5.component';
import { Childscn6Component } from '../children/childscn6/childscn6.component';
import { Childscn6page1Component } from '../children/childscn6/childscn6page1/childscn6page1.component';
import { Childscn7Component } from '../children/childscn7/childscn7.component';
import { Childscn8Component } from '../children/childscn8/childscn8.component';
import { Childscn9Component } from '../children/childscn9/childscn9.component';
import { Childscn9page1Component } from '../children/childscn9/childscn9page1/childscn9page1.component';
import { Childscn9page2Component } from '../children/childscn9/childscn9page2/childscn9page2.component';
import { Childscn9page3Component } from '../children/childscn9/childscn9page3/childscn9page3.component';
import { Childscn9page4Component } from '../children/childscn9/childscn9page4/childscn9page4.component';
import { Childscn21Component } from '../children/childscn21/childscn21.component';
import { Childscn22Component } from '../children/childscn22/childscn22.component';
import { Childscn23Component } from '../children/childscn23/childscn23.component';
import { Childscn25Component } from '../children/childscn25/childscn25.component';
import { AuthGuard } from '../auth/auth.guard';
import { Childscn29Component } from '../children/childscn29/childscn29.component';
import { F01008scn4Component } from '../f01008/f01008scn4/f01008scn4.component';
import { Childscn31Component } from '../children/childscn31/childscn31.component';
import { Childscn32Component } from '../children/childscn32/childscn32.component';

const routes: Routes = [
  {
    path: 'CHILDSCN1',
    component: Childscn1Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN2',
    component: Childscn2Component,
    //canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: 'CHILDSCN2PAGE1',
        component: Childscn2page1Component,
        //canActivate: [AuthGuard], // 守衛路由
      }
    ]
  },
  {
    path: 'CHILDSCN3',
    component: Childscn3Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'F06002PAGE3',
    component: F06002page3Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN4',
    component: Childscn4Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN5',
    component: Childscn5Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN6',
    component: Childscn6Component,
    //canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: 'CHILDSCN6PAGE1',
        component: Childscn6page1Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
    ]
  },
  {
    path: 'CHILDSCN7',
    component: Childscn7Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN8',
    component: Childscn8Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN9',
    component: Childscn9Component,
    //canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: 'CHILDSCN9PAGE1',
        component: Childscn9page1Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN9PAGE2',
        component: Childscn9page2Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN9PAGE3',
        component: Childscn9page3Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN9PAGE4',
        component: Childscn9page4Component,
        //canActivate: [AuthGuard], // 守衛路由
      }
    ]
  },
  {
    path: 'CHILDSCN10',
    component: Childscn10Component,
    //canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: 'CHILDSCN10PAGE1',
        component: Childscn10page1Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN10PAGE2',
        component: Childscn10page2Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN10PAGE3',
        component: Childscn10page3Component,
        //canActivate: [AuthGuard], // 守衛路由
      }
      ,
      {
        path: 'CHILDSCN10PAGE4',
        component: Childscn10page4Component,
        //canActivate: [AuthGuard], // 守衛路由
      }
    ]
  },
  {
    path: 'CHILDSCN11',
    component: Childscn11Component,
    //canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: 'CHILDSCN11PAGE1',
        component: Childscn11page1Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN11PAGE2',
        component: Childscn11page2Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN11PAGE3',
        component: Childscn11page3Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN11PAGE4',
        component: Childscn11page4Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN11PAGE5',
        component: Childscn11page5Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
    ]
  },
  {
    path: 'CHILDSCN12',
    component: Childscn12Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN13',
    component: Childscn13Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN14',
    component: Childscn14Component,
    //canActivate: [AuthGuard], // 守衛路由
    children: [
      {
        path: 'CHILDSCN14PAGE1',
        component: Childscn14page1Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN14PAGE2',
        component: Childscn14page2Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
      {
        path: 'CHILDSCN14PAGE3',
        component: Childscn14page3Component,
        //canActivate: [AuthGuard], // 守衛路由
      },
    ]
  },
  {
    path: 'CHILDSCN15',
    component: Childscn15Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN16',
    component: Childscn16Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN17',
    component: Childscn17Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN21',
    component: Childscn21Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN23',
    component: Childscn23Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN25',
    component: Childscn25Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN29',
    component: Childscn29Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN31',
    component: Childscn31Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: 'CHILDSCN32',
    component: Childscn32Component,
    //canActivate: [AuthGuard], // 守衛路由
  },
  {
    path: '',
    redirectTo: 'CHILDSCN1',
    pathMatch: 'full'
  },
  {
    path: 'F01008SCN4',
    component: F01008scn4Component,
    // canActivate: [AuthGuard], // 守衛路由
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildrenRoutingModule { }
