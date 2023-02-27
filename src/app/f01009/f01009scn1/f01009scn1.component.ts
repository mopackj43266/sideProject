import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Childbwscn12Component } from 'src/app/children-bw/childbwscn12/childbwscn12.component';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01009Service } from '../f01009.service';
import { Router } from '@angular/router';
import { Childscn27Component } from 'src/app/children/childscn27/childscn27.component';
import { Childscn28Component } from 'src/app/children/childscn28/childscn28.component';
import { Childscn22Component } from 'src/app/children/childscn22/childscn22.component';
import { Childscn10Service } from 'src/app/children/childscn10/childscn10.service';

@Component({
  selector: 'app-f01009scn1',
  templateUrl: './f01009scn1.component.html',
  styleUrls: ['./f01009scn1.component.css', '../../../assets/css/f01.css']
})
export class F01009scn1Component implements OnInit {

  constructor(
    public dialog: MatDialog,
    public f01009Service: F01009Service,
    private childscn10Service: Childscn10Service,
    private router: Router,
  ) { }

  private applno: string;
  private search: string;
  private swcNationalId: string;
  private fds: string
  private page: string
  private winClose: string = '';
  creditlevel = "";
  creditaction: string;

  changeValue: boolean = true;
  block: boolean = false;

  rskmdl: boolean = false; //判斷是否有風險模型權限

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.swcNationalId = sessionStorage.getItem('nationalId');
    this.fds = sessionStorage.getItem('fds');
    this.page = sessionStorage.getItem('page');
    this.winClose = sessionStorage.getItem('winClose');
    this.creditlevel = this.page == "9" ? "L4" : this.creditlevel;
    this.creditlevel = this.page == "10" ? "L3" : this.creditlevel;
    this.checkRskmdl();
  }

  ngAfterViewInit() {
    let element: HTMLElement = document.getElementById('firstBtn') as HTMLElement;
    element.click();
  }

  getSearch(): String {
    return this.search;
  }
  getWinClose(): String {
    return this.winClose;
  }
  reSearch() {
    const dialogRef = this.dialog.open(Childbwscn12Component, {
      width: "80vw",
      panelClass: 'mat-dialog-transparent',
      data: {
        applno: this.applno,
        cuid: this.swcNationalId,
        page: this.page
      }
    });
  }
  recalculate() {
    const dialogRef = this.dialog.open(Childscn22Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        applno: this.applno,
        cuid: this.swcNationalId,
        page: this.page
      }
    });
  }
  // finish() {
  //   if (sessionStorage.getItem('BW_creditResult') == null) {
  //     const childernDialogRef = this.dialog.open(ConfirmComponent, {
  //       data: { msgStr: '請選取審核結果' }
  //     });
  //   }
  //   // else {
  //   //   alert(this.BW_creditResult);
  //   // }
  //   // alert(sessionStorage.getItem('BW_creditResult'));

  // }

  //儲存
  save() {
    if (this.creditaction == "" || this.creditaction == null) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請輸入審核意見' }
      });
      return;
    }
    // let msg = "";
    const url = 'f01/childbwscn1action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['creditaction'] = this.creditaction;
    jsonObject['creditlevel'] = this.creditlevel;
    this.block = true;
    this.f01009Service.postJson(url, jsonObject).subscribe(data => {
      this.block = false;
      // if(data.rspMsg=="儲存成功!"){this.getCreditmemo(this.pageIndex, this.pageSize);}
      // msg = data.rspMsg ;
      // const childernDialogRef = this.dialog.open(ConfirmComponent, {
      //   data: { msgStr: msg }
      // });
    });
  }

  finish() {
    if (sessionStorage.getItem('BW_creditResult') == null || sessionStorage.getItem('BW_creditResult') == "" || sessionStorage.getItem('BW_creditResult')=="undefined") {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請選取審核結果' }
      });
      return;
    }
    if(sessionStorage.getItem('BW_creditResult') == "FRZ"||sessionStorage.getItem('BW_creditResult') == "DWN"||sessionStorage.getItem('BW_creditResult') == "HLD")
    {
      if(sessionStorage.getItem('BW_reasonCode')!="")
      {
        if(sessionStorage.getItem('BW_reasondetail')!="")
        {
          if(sessionStorage.getItem('BW_limit')!="")
          {
            if(sessionStorage.getItem('BW_creditResult') == "DWN")
            {

            }
          }
          else
          {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: '額度號必填' }
            });
            return;
          }
        }
        else
        {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: '本次執行原因細項必填' }
          });
          return;
        }
      }
      else
      {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: '本次執行原因必填' }
        });
        return;
      }
      // this.verify(sessionStorage.getItem('BW_reasonCode'),'本次執行原因')
      // this.verify(sessionStorage.getItem('BW_reasondetail'),'本次執行原因細項')
      // this.verify(sessionStorage.getItem('BW_limit'),'額度號')
      // this.verify(sessionStorage.getItem('BW_preempt'),'預佔額度')

    }

    const url = 'f01/childbwscn0';
    let msg = '';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['level'] = this.creditlevel;
    jsonObject['creditResult'] = sessionStorage.getItem('BW_creditResult');//結果
    jsonObject['reasonCode'] = sessionStorage.getItem('BW_reasonCode');//本次執行原因
    jsonObject['reasondetail'] = sessionStorage.getItem('BW_reasondetail');//本次執行原因細項
    jsonObject['limit'] = sessionStorage.getItem('BW_limit');//額度號
    jsonObject['preempt'] = sessionStorage.getItem('BW_preempt');//預佔額度
    this.block = true;
    this.f01009Service.postJson(url, jsonObject).subscribe(data => {
      // if(data.rspMsg=="儲存成功!"){this.getCreditmemo(this.pageIndex, this.pageSize);}
      let childernDialogRef: any;
      if (data.rspMsg != null && data.rspMsg != '') {
        childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
      }
      if (data.rspMsg.includes('處理案件異常')) { } else {
        sessionStorage.removeItem('BW_creditResult');
        sessionStorage.removeItem('BW_reasonCode');
        sessionStorage.removeItem('BW_reasondetail');
        sessionStorage.removeItem('BW_limit');
        sessionStorage.removeItem('BW_preempt');
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['./F01009']);
        }, 1500);
      }
      this.block = false;
    });
  }



  reSMS() {
    const dialogRef = this.dialog.open(Childscn27Component, {
      panelClass: 'mat-dialog-transparent',
      height: '100%',
      width: '70%',
      data: {
        applno: this.applno,
        cuid: this.swcNationalId,
        checkpoint: "L2"
      }
    });
  }

  reMail() {
    const dialogRef = this.dialog.open(Childscn28Component, {
      panelClass: 'mat-dialog-transparent',
      height: '100%',
      width: '70%',
      data: {
        applno: this.applno,
        cuid: this.swcNationalId,
        checkpoint: "L2"
      }
    });
  }
  //判斷是否需要顯示案件完成列
  changeRoute(route: boolean) {
    this.changeValue = route;
  }

  scrollToTop(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  leave()//離開
   {
    window.close();
  }
  temporarily()//暫存
  {
    if (sessionStorage.getItem('BW_creditResult') == null || sessionStorage.getItem('BW_creditResult') == "" || sessionStorage.getItem('BW_creditResult')=="undefined") {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '請選取審核結果' }
      });
      return;
    }

    const url = 'f01/childbwscn0action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['level'] = this.creditlevel;
    jsonObject['creditResult'] = sessionStorage.getItem('BW_creditResult');//結果
    jsonObject['reasonCode'] = sessionStorage.getItem('BW_reasonCode');//本次執行原因
    jsonObject['reasondetail'] = sessionStorage.getItem('BW_reasondetail');//本次執行原因細項
    jsonObject['limit'] = sessionStorage.getItem('BW_limit');//額度號
    jsonObject['preempt'] = sessionStorage.getItem('BW_preempt');//預佔額度
    this.f01009Service.postJson(url,jsonObject).subscribe(data=>{
      if(data.rspCode=="0000")
      {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "暫存成功" }
        })
      }
      else
      {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "暫存失敗" }
        })
      }
    })
  }

  getPage(): string {
    return this.page;
  }

  //確認User是否有風險模型權限
  checkRskmdl() {
    const url = 'f01/childscn10action8';
    let jsonObject: any = {};
    this.childscn10Service.getDate_Json(url, jsonObject).subscribe(data => {
      if (data.rspBody != null && data.rspBody > 0) { this.rskmdl = true; }
    });
  }
}
