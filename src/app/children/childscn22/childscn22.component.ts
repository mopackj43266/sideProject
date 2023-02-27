import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn22Service } from './childscn22.service';

@Component({
  selector: 'app-childscn22',
  templateUrl: './childscn22.component.html',
  styleUrls: ['./childscn22.component.css', '../../../assets/css/f01.css']
})
export class Childscn22Component implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childscn22Component>,
    public dialog: MatDialog,
    private childsnc22Service: Childscn22Service,
    private router: Router,
  ) { }

  applno: string;     // 案件編號
  cuid: string;       // 身分證字號
  stepName: string;   // 目前關卡
  page: string;   // 分頁
  empNo: string = BaseService.userId;

  block: boolean = false;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.stepName = sessionStorage.getItem('stepName');
    this.page = sessionStorage.getItem('page');
  }

  cancel(): void {
    this.dialogRef.close();
  }

  public async confirm(): Promise<void> {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['empno'] = this.empNo;
    let msgStr: string = '';
    this.block = true;
    if (this.stepName == 'APPLCreditL3') {
      msgStr = await this.childsnc22Service.doDss1Search(jsonObject);
      this.block = false;
      const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msgStr } });
      setTimeout(() => {
        this.dialog.closeAll();
      }, 2000);
      window.location.reload();
      // let currentUrl = this.router.url;
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.router.navigate([currentUrl]);
      // });
    } else if (this.stepName == 'APPLCreditL2') {
      msgStr = await this.childsnc22Service.doDss2Search(jsonObject);
      this.block = false;
      const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msgStr } });
      setTimeout(() => {
        this.dialog.closeAll();
      }, 2000);
      window.location.reload();
      // let currentUrl = this.router.url;
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.router.navigate([currentUrl]);
      // });
    }
    else if (this.stepName == 'BwCredit1') {
      msgStr = await this.childsnc22Service.doDss4Search(jsonObject);
      this.block = false;
      const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msgStr } });
      setTimeout(() => {
        this.dialog.closeAll();
      }, 2000);
      window.location.reload();
      // let currentUrl = this.router.url;
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this.router.navigate([currentUrl]);
      // });
    }
  }
}
