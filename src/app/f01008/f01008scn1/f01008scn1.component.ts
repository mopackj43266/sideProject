import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Childscn24Component } from 'src/app/children/childscn24/childscn24.component';
import { Childscn26Component } from 'src/app/children/childscn26/childscn26.component';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01008Service } from '../f01008.service';
import { F01008scn2Component } from '../f01008scn2/f01008scn2.component';

//Jay 產生合約前覆核清單
@Component({
  selector: 'app-f01008scn1',
  templateUrl: './f01008scn1.component.html',
  styleUrls: ['./f01008scn1.component.css', '../../../assets/css/f01.css']
})
export class F01008scn1Component implements OnInit {

  constructor(
    private f01008Service: F01008Service,
    public dialog: MatDialog,
    private router: Router) {
    this.JCICAddSource$ = this.f01008Service.JCICAddSource$.subscribe((data) => {
      this.addData = data;
      this.isShowAdd = data.show;
    });
    this.JCICSource$ = this.f01008Service.JCICSource$.subscribe((data) => {
      this.editData = data;
      this.isShowEdit = data.show;
    });
    this.JCICSource$ = this.f01008Service.JCICItemsSource$.subscribe((data) => {
      this.f01008Service = data.show;
      this.isShowdel = data.show;
    });
  }

  JCICSource$: Subscription;
  JCICAddSource$: Subscription;
  isShowAdd: boolean;
  isShowEdit: boolean;
  isShowdel: boolean;
  addData: any;
  editData: any;
  deltData: any;
  block: boolean = false;
  private search: string;
  applno: string;
  custId: string;
  jcicNumb: number;
  afterResult: string;
  level: string;
  ngOnInit(): void {
    this.level = sessionStorage.getItem('level');
    this.search = sessionStorage.getItem('search');
    this.applno = sessionStorage.getItem('applno');
    this.custId = sessionStorage.getItem('custId');
    this.jcicNumb = parseInt(sessionStorage.getItem('jcicNumb'));

  }

  ngAfterViewInit() {
    let element: HTMLElement = document.getElementById('firstBtn') as HTMLElement;
    element.click();
  }

  save(result: string) //完成
  {
    let jsonObject: any = {};
    const dialogRef = this.dialog.open(Childscn26Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        value: result
      }
    });
    this.block = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result != 'undefined' && result != undefined && result.value != null) {
        if (this.level == 'D2') {
          this.afterResult = sessionStorage.getItem('afterResult');
          if (this.afterResult != '' && this.afterResult != 'null') {
            let url = 'f01/f01008scn0scn1';
            jsonObject['applno'] = this.applno;
            jsonObject['level'] = this.level;
            jsonObject['custId'] = this.custId;
            jsonObject['afterResult'] = this.afterResult;
            console.log(sessionStorage.getItem('choose'))
            if(sessionStorage.getItem('choose')!='' && sessionStorage.getItem('choose')!=null && sessionStorage.getItem('choose') != 'null')
            {
              jsonObject['setD1empno'] = sessionStorage.getItem('choose');
            }
            this.f01008Service.f01008scn2(jsonObject, url).subscribe(data => {
              if (data.rspCode === '0000') {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: data.rspMsg }
                })
                if (data.rspMsg.includes('處理案件異常')) {

                }
                else if (data.rspMsg.includes('該案客戶已取消')) {
                  setTimeout(() => {
                    childernDialogRef.close();
                  }, 1000);
                  setTimeout(() => {
                    sessionStorage.removeItem('level');
                    this.router.navigate(['./F01008']);
                  }, 1500);
                }
                else {
                  setTimeout(() => {
                    childernDialogRef.close();
                  }, 1000);
                  setTimeout(() => {
                    sessionStorage.removeItem('level');
                    this.router.navigate(['./F01008']);
                  }, 1500);
                }
              }
              else {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: data.rspMsg }

                })
                setTimeout(() => {
                  childernDialogRef.close();
                }, 1000);
                setTimeout(() => {
                  sessionStorage.removeItem('level');
                  this.router.navigate(['./F01008']);
                }, 1500);
              }
              this.block = false;
            })

          }
          else {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: "請選擇徵審後處理審核結果" }
            });
            this.router.navigate(['./F01008/F01008SCN1/F01008SCN2']);
            this.block = false;
          }
        }
        else {
          this.afterResult = sessionStorage.getItem('afterResult');
          if (this.afterResult != '' && this.afterResult != 'null') {
            let url = 'f01/f01008scn0scn1';
            jsonObject['applno'] = this.applno;
            jsonObject['level'] = this.level;
            jsonObject['custId'] = this.custId;
            jsonObject['afterResult'] = this.afterResult;
            this.f01008Service.f01008scn2(jsonObject, url).subscribe(data => {
              if (data.rspCode === '0000') {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: data.rspMsg }
                })
                if (data.rspMsg.includes('處理案件異常')) {
                  this.block = false;
                } else {
                  setTimeout(() => {
                    childernDialogRef.close();
                  }, 1000);
                  setTimeout(() => {
                    sessionStorage.removeItem('level');
                    this.router.navigate(['./F01012']);
                    this.block = false;
                  }, 1500);
                }
              }
              else {
                const childernDialogRef = this.dialog.open(ConfirmComponent, {
                  data: { msgStr: data.rspMsg }
                })
                this.block = false;
                setTimeout(() => {
                  childernDialogRef.close();
                }, 1000);
                setTimeout(() => {
                  sessionStorage.removeItem('level');
                  this.router.navigate(['./F01012']);
                  this.block = false;
                }, 1500);
              }
            })
          }
          else {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: "請選擇徵審後處理審核結果" }
            });
            this.router.navigate(['./F01012/F01008SCN1/F01008SCN2']);
            this.block = false;

          }
        }
        // this.block = false;
      }
      else {
        this.block = false;
      }
    })
  }

  getSearch(): String {
    return this.search;
  }

  return()//退件
  {
    const dialogRef = this.dialog.open(Childscn24Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        applno: this.applno,
        level: 'D1',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.router.navigate(['./F01012']);
      }
    });
  }
  reScan(result: string)//重算
  {
    const dialogRef = this.dialog.open(Childscn26Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        value: result
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result.value == 'confirm') {
        let url = 'f01/f01008scn0action2'
        let jsonObject: any = {};
        jsonObject['applno'] = this.applno;
        jsonObject['custId'] = this.custId;
        this.f01008Service.f01008scn2(jsonObject, url).subscribe(data => {
          let childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: data.rspMsg }
          });
          window.location.reload();
          // let currentUrl = this.router.url;
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          //   this.router.navigate([currentUrl]);
          // });
        })
      }
    })


  }

  reSearch(result: string)//立即重查
  {
    this.jcicNumb = parseInt(sessionStorage.getItem('jcicNumb'));
    const dialogRef = this.dialog.open(Childscn26Component, {
      panelClass: 'mat-dialog-transparent',
      minHeight: '50%',
      width: '30%',
      data: {
        value: result
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.value == 'confirm') {
        let jsonObject: any = {};
        let url = 'f01/f01008scn0';
        jsonObject['applno'] = this.applno;
        jsonObject['custId'] = this.custId;
        this.block = true;
        this.f01008Service.f01008scn2(jsonObject, url).subscribe(data => {
          data.rspCode === '9999'
          {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: data.rspMsg }

            })

            setTimeout(() => {
              childernDialogRef.close();
            }, 1000);
            setTimeout(() => {
              this.router.navigate(['./F01008']);
            }, 1500);
          }

          this.router.navigate(['./F01008']);
          this.block = false;
        })
      }
    })
  }
  temporarily()//暫存
  {
    let url = 'f01/f01008scn0action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['afterResult'] = sessionStorage.getItem('afterResult').length > 2 ? '' : sessionStorage.getItem('afterResult');
    jsonObject['researchDate'] = sessionStorage.getItem('researchDate');
    console.log(sessionStorage.getItem('level'))
    if(sessionStorage.getItem('level')=='D2')
    {
      jsonObject['setD1empno'] = sessionStorage.getItem('choose');
    }
    this.f01008Service.f01008scn2(jsonObject, url).subscribe(data => {
      let childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: data.rspMsg }
      });
    })
  }

  scrollToTop(event: any) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  leave() {
    window.close();
  }
}
