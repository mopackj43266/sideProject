import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F01010Service } from '../f01010.service';

@Component({
  selector: 'app-f01010scn2',
  templateUrl: './f01010scn2.component.html',
  styleUrls: ['./f01010scn2.component.css', '../../../assets/css/f01.css']
})
export class F01010scn2Component implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public f01010Service: F01010Service,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<F01010scn2Component>,)
  { }
  applno: string;     // 案件編號
  level: string;   // 目前關卡
  stepName: string;
  content: string; //退件原因
  empNo: string//員編

  block: boolean = false;
  ngOnInit(): void {
  }


  confirm()
  {
    let url = 'f01/childbwscn0action2';
    let jsonObject: any = {};
    jsonObject['applno'] = this.data.applno;
    jsonObject['level'] =  this.data.level;
    jsonObject['content'] = this.content;
    jsonObject['empno'] = BaseService.userId;
    this.f01010Service.postJson(url,jsonObject).subscribe(data=>
      {


        if (data.rspCode === '0000' && data.rspMsg=='success')
         {
          this.dialog.open(ConfirmComponent, { data: { msgStr: "退件完成" } });
          setTimeout(() => {
            this.dialog.closeAll();
            this.dialogRef.close({ event: 'success' });
          }, 1000);
        }
        else
        {
          this.dialog.open(ConfirmComponent, { data: { msgStr: data.rspMsg } });
        }
      })
  }

  cancel()//離開
  {
    this.dialogRef.close({ event: '' });
  }
}
