import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn24Service } from './childscn24.service';

@Component({
  selector: 'app-childscn24',
  templateUrl: './childscn24.component.html',
  styleUrls: ['./childscn24.component.css',]
})
export class Childscn24Component implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childscn24Component>,
    public dialog: MatDialog,
    private childsnc24Service: Childscn24Service,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  applno: string;     // 案件編號
  level: string;   // 目前關卡
  stepName: string;
  content: string; //退件原因
  empNo: string//員編

  block: boolean = false;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.level = this.data.level;
    this.stepName = sessionStorage.getItem('stepName');
    this.empNo = BaseService.userId;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  formControl = new FormControl('', [
    Validators.required
  ]);
  //欄位驗證
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  // 授信案件退回徵信
  public async confirm(): Promise<void> {
    let jsonObject: any = {};
    let url = 'f01/childscn0action2';
    jsonObject['applno'] = this.applno;
    jsonObject['empno'] = this.empNo;
    jsonObject['level'] = this.stepName.substring(10);
    jsonObject['reject'] = 'L3';
    jsonObject['content'] = this.content;
    let msgStr: string = '';
    if (this.stepName.substring(10) == 'L2') {
      this.block = true;
      // msgStr = await this.childsnc24Service.doDssBack(jsonObject);
      this.childsnc24Service.postJson(url, jsonObject).subscribe(data => {
        if (data.rspCode === '0000' && data.rspMsg == 'success') {
          this.dialog.open(ConfirmComponent, { data: { msgStr: "退件完成" } });
          setTimeout(() => {
            this.dialog.closeAll();
            this.dialogRef.close({ event: 'success' });
          }, 1000);
          this.block = false;
        } else {
          setTimeout(() => {
            this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
          }, 1000);
          this.block = false;
        }
      })

      // this.block = false;
      // const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msgStr } });
      // const Dialog = this.dialog.open(ConfirmComponent, { data: { msgStr: " 查無資料" } });
      // this.dialogRef.close({ event: 'success' });
    }
  }

  // 主管案件退回徵信
  public async L0sendbackL3(): Promise<void> {
    let jsonObject: any = {};
    let url = 'f01/childscn0action2';
    jsonObject['applno'] = this.applno;
    jsonObject['empno'] = this.empNo;
    jsonObject['level'] = this.stepName.substring(10);
    jsonObject['reject'] = 'L3';
    jsonObject['content'] = this.content;

    let msgStr: string = '';
    if (this.stepName.substring(10) == 'L0') {
      this.block = true;
      // msgStr = await this.childsnc24Service.doDssBack(jsonObject);
      this.childsnc24Service.postJson(url, jsonObject).subscribe(data => {
        if (data.rspCode === '0000' && data.rspMsg == 'success') {
          this.dialog.open(ConfirmComponent, { data: { msgStr: "退件完成" } });
          setTimeout(() => {
            this.dialog.closeAll();
            this.dialogRef.close({ event: 'success' });
          }, 1000);
          this.block = false;
        } else {
          setTimeout(() => {
            this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
          }, 1000);
          this.block = false;
        }
      })
    }
  }

  // 主管案件退回授信
  public async L0sendbackL2(): Promise<void> {
    let jsonObject: any = {};
    let url = 'f01/childscn0action2';

    jsonObject['applno'] = this.applno;
    jsonObject['level'] = this.stepName.substring(10);
    jsonObject['empno'] = this.empNo;
    jsonObject['reject'] = 'L2';
    jsonObject['content'] = this.content;

    let msgStr: string = '';
    if (this.stepName.substring(10) == 'L0') {
      this.block = true;
      this.childsnc24Service.postJson(url, jsonObject).subscribe(data => {
        if (data.rspCode === '0000' && data.rspMsg == 'success') {
          this.dialog.open(ConfirmComponent, { data: { msgStr: "退件完成" } });
          setTimeout(() => {
            this.dialog.closeAll();
            this.dialogRef.close({ event: 'success' });
          }, 1000);
          this.block = false;
        } else {
          setTimeout(() => {
            this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
          }, 1000);
          this.block = false;          }
      })
    }
  }

  // 授信覆核退回徵信
  public async L1sendbackL3(): Promise<void> {
    let jsonObject: any = {};
    let url = 'f01/childscn0action2';

    jsonObject['applno'] = this.applno;
    jsonObject['level'] = this.stepName.substring(10);
    jsonObject['reject'] = 'L3';
    jsonObject['empno'] = this.empNo;
    jsonObject['content'] = this.content;

    let msgStr: string = '';
    if (this.stepName.substring(10) == 'L1') {
      this.childsnc24Service.postJson(url, jsonObject).subscribe(data => {
        if (data.rspCode === '0000' && data.rspMsg == 'success') {
          this.dialog.open(ConfirmComponent, { data: { msgStr: "退件完成" } });
          setTimeout(() => {
            this.dialog.closeAll();
            this.dialogRef.close({ event: 'success' });
          }, 1000);
          this.block = false;
        } else {
          setTimeout(() => {
            this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
          }, 1000);
          this.block = false;        }
      })
    }
  }

  // 授信覆核退回授信
  public async L1sendbackL2(): Promise<void> {
    let jsonObject: any = {};
    let url = 'f01/childscn0action2';

    jsonObject['applno'] = this.applno;
    jsonObject['level'] = this.stepName.substring(10);
    jsonObject['reject'] = 'L2';
    jsonObject['empno'] = this.empNo;
    jsonObject['content'] = this.content;

    let msgStr: string = '';
    if (this.stepName.substring(10) == 'L1') {
      this.block = true;
      this.childsnc24Service.postJson(url, jsonObject).subscribe(data => {
        if (data.rspCode === '0000' && data.rspMsg == 'success') {
          this.dialog.open(ConfirmComponent, { data: { msgStr: "退件完成" } });
          setTimeout(() => {
            this.dialog.closeAll();
            this.dialogRef.close({ event: 'success' });
          }, 1000);
          this.block = false;
        }
        else {
          setTimeout(() => {
            this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
          }, 1000);
          this.block = false;        }
      })
    }
  }

  // 處長&總經理退回授信or上一關
  public async sendbackS1S2(where: string): Promise<void> {
    let jsonObject: any = {};
    let url = 'f01/childscn0action2';

    jsonObject['applno'] = this.applno;
    jsonObject['level'] = this.level;
    jsonObject['empno'] = this.empNo;
    jsonObject['reject'] = where;
    jsonObject['content'] = this.content;
    this.block = true;
    this.childsnc24Service.postJson(url, jsonObject).subscribe(data => {
      if (data.rspCode === '0000' && data.rspMsg == 'success') {
        this.dialog.open(ConfirmComponent, { data: { msgStr: "退件完成" } });
        setTimeout(() => {
          this.dialog.closeAll();
          this.dialogRef.close({ event: 'success' });
        }, 1000);
        this.block = false;
      } else {
        setTimeout(() => {
          this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
        }, 1000);
        this.block = false;      }
    })
  }

  //無擔放款部主管&產品處處長退回授信
  sendBackS3S4(where: string) { //last 退回上一關 L2 退回授信
    let jsonObject: any = {};
    let url = 'f01/childscn0action2';
    jsonObject['applno'] = this.applno;
    jsonObject['level'] = this.level;
    jsonObject['empno'] = this.empNo;
    jsonObject['reject'] = where;
    jsonObject['content'] = this.content;
    this.block = true;
    this.childsnc24Service.postJson(url, jsonObject).subscribe(data => {
      if (data.rspCode === '0000' && data.rspMsg == 'success') {
        this.dialog.open(ConfirmComponent, { data: { msgStr: "退件完成" } });
        setTimeout(() => {
          this.dialog.closeAll();
          this.dialogRef.close({ event: 'success' });
        }, 1000);
        this.block = false;
      } else {
        setTimeout(() => {
          this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
        }, 1000);
        this.block = false;      }
    })
  }

  //合約主管複審退件
  public async contract(): Promise<void> {
    let jsonObject: any = {};
    let url = 'f01/f01008scn0action3';

    jsonObject['applno'] = this.applno;
    jsonObject['empno'] = this.empNo;
    jsonObject['content'] = this.content;
    let msgStr: string = '';
    this.block = true;
    this.childsnc24Service.postJson(url, jsonObject).subscribe(data => {
      if (data.rspCode === '0000' && data.rspMsg == 'success') {
        this.dialog.open(ConfirmComponent, { data: { msgStr: "退件完成" } });
        setTimeout(() => {
          this.dialog.closeAll();
          this.dialogRef.close({ event: 'success' });
        }, 1000);
        this.block = false;
      } else {
        setTimeout(() => {
          this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
        }, 1000);
        this.block = false;      }
    })
  }
}
