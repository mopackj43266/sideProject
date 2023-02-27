import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Childbwscn12Component } from 'src/app/children-bw/childbwscn12/childbwscn12.component';
import { Childscn24Component } from 'src/app/children/childscn24/childscn24.component';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01010Service } from '../f01010.service';
import { F01010scn2Component } from '../f01010scn2/f01010scn2.component';
import { Childscn27Component } from 'src/app/children/childscn27/childscn27.component';
import { Childscn28Component } from 'src/app/children/childscn28/childscn28.component';

@Component({
  selector: 'app-f01010scn1',
  templateUrl: './f01010scn1.component.html',
  styleUrls: ['./f01010scn1.component.css', '../../../assets/css/f01.css']
})
export class F01010scn1Component implements OnInit {

  constructor(
    public dialog: MatDialog,
    public f01010Service: F01010Service,
    private router: Router,
  ) { }

  private applno: string;
  private search: string;
  private cuid: string;
  private fds: string
  private page: string
  private swcNationalId: string;
  creditlevel = "";
  creditaction: string;

  changeValue: boolean = true;
  block: boolean = false;
  content: string; //退件原因
  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.cuid = sessionStorage.getItem('nationalId');
    this.fds = sessionStorage.getItem('fds');
    this.page = sessionStorage.getItem('page');
    this.swcNationalId = sessionStorage.getItem('nationalId');
    this.creditlevel = this.page == "9" ? "L4" : this.creditlevel;
    this.creditlevel = this.page == "10" ? "L3" : this.creditlevel;
  }

  ngAfterViewInit() {
    let element: HTMLElement = document.getElementById('firstBtn') as HTMLElement;
    element.click();
  }

  getSearch(): String {
    return this.search;
  }

  reSearch() {
    const dialogRef = this.dialog.open(Childbwscn12Component, {
      width: "60vw",
      data: {
        applno: this.applno,
        cuid: this.cuid
      }
    });
  }



  //儲存
  save() {
    if (this.creditaction == "" || this.creditaction == null || this.creditaction == undefined) {
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
    this.f01010Service.postJson(url, jsonObject).subscribe(data => {
      this.block = false;

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
    }

    const url = 'f01/childbwscn0';
    let msg = '';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['level'] = this.creditlevel;
    jsonObject['creditResult'] = sessionStorage.getItem('BW_creditResult');
    jsonObject['reasonCode'] = sessionStorage.getItem('BW_reasonCode');//本次執行原因
    jsonObject['reasondetail'] = sessionStorage.getItem('BW_reasondetail');//本次執行原因細項
    jsonObject['limit'] = sessionStorage.getItem('BW_limit');//額度號
    jsonObject['preempt'] = sessionStorage.getItem('BW_preempt');//預佔額度
    this.block = true;
    this.f01010Service.postJson(url, jsonObject).subscribe(data => {
      let childernDialogRef: any;
      if (data.rspMsg != null && data.rspMsg != '') {
        childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        });
      }
      if (data.rspMsg.includes('處理案件異常')) { }
      else if(data.rspMsg.includes('該案客戶已取消'))
      {
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['./F01010']);
        }, 1500);
      }else {
      sessionStorage.removeItem('BW_creditResult');
      sessionStorage.removeItem('BW_reasonCode');
      sessionStorage.removeItem('BW_reasondetail');
      sessionStorage.removeItem('BW_limit');
      sessionStorage.removeItem('BW_preempt');
        setTimeout(() => {
          childernDialogRef.close();
        }, 1000);
        setTimeout(() => {
          this.router.navigate(['./F01010']);
        }, 1500);
      }
      this.block = false;
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
    this.f01010Service.postJson(url,jsonObject).subscribe(data=>{
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

  return()//退件
  {
    const dialogRef = this.dialog.open(F01010scn2Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        applno: this.applno,
        level: "L3",
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'success')
      {
            this.router.navigate(['./F01010']);

      }
      else
      {
        if(result.event!='')
        {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: result.event }
          })
        }

      }
    });
  }
}
