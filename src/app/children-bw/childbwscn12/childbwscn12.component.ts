import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childbwscn12Service } from './childbwscn12.service';
@Component({
  selector: 'app-childbwscn12',
  templateUrl: './childbwscn12.component.html',
  styleUrls: ['./childbwscn12.component.css', '../../../assets/css/child.css']
})
//Jay 重查
export class Childbwscn12Component implements OnInit {

  constructor(public dialog: MatDialog,
    public childbwscn12Service: Childbwscn12Service,
    private router: Router,
    public dialogRef: MatDialogRef<Childbwscn12Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {

  }
  empNo: string;
  userId: string;//使用者
  swcCustId:string;
  swcApplno: string;//案件編號
  swcID: string;//客戶編號
  search: any[] = [];
  chk :string[] = [];
  page:string;
  k=false
  block: boolean = false;
  newData=[];
  ngOnInit(): void {
    this.swcID = this.data.cuid;
    this.swcApplno = this.data.applno;
    this.empNo = BaseService.userId;
    this.swcCustId = sessionStorage.getItem('swcCustId');
    this.page = this.data.page;
    this.gethistory()
  }
  closure() //關閉
  {
    this.dialog.closeAll()
  }
  chkArray(check: boolean, value: string)
  {
    if (check) {
      this.chk.push(value)
    }
    else
    {
      this.chk.splice(this.chk.indexOf(value), 1)
    }
  }
  recheck()
  {
    let Url = 'f01/childBwScn12action'
    let jsonObject: any = {}
    jsonObject['swcNationalId'] = this.swcID;
    jsonObject['applno'] = this.swcApplno;
    jsonObject['search'] = this.chk.toString();
    jsonObject['swcCustId'] = this.swcCustId;
    jsonObject['userId'] = this.empNo;

    this.block = true;
    this.childbwscn12Service.selectCustomer(Url,jsonObject).subscribe(data=>{
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: data.rspMsg }
      });
      this.block = false;
      if(this.page=='9')
      {
        this.router.navigate(['./F01009']);
        this.dialogRef.close();
      }
      else
      {
        this.router.navigate(['./F01010']);
        this.dialogRef.close();
      }

    });
  }
   //案件重查歷程
   gethistory()
   {
     const baseUrl = 'f01/childBwScn12action2';
     let jsonObject: any = {};
     jsonObject['applno'] = this.swcApplno;
     this.childbwscn12Service.selectCustomer(baseUrl, jsonObject).subscribe(data => {
       this.newData = data.rspBody;
     });
   }
   //歷程開關
   course(i:boolean)
   {
     if(!i)
     {
       this.k=true;
     }
     else
     {
       this.k =false;
     }
   }

}
