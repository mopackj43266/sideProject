import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn32Service } from './childscn32.service';

@Component({
  selector: 'app-childscn32',
  templateUrl: './childscn32.component.html',
  styleUrls: ['./childscn32.component.css','../../../assets/css/child.css']
})

//信保發查 jay
export class Childscn32Component implements OnInit {

  constructor(
    private childscn32Service: Childscn32Service,
    public dialogRef: MatDialogRef<Childscn32Component>,
    public dialog: MatDialog,
  ) { }

  newData:any[] = [];
  wlfeedback:any[] = [];//勞工紓困申請書回饋檔
  wlfbrslt:any[] = [];//勞工紓困申請書核保情形回饋檔
  nt145feedback:any[] = [];//勞工紓困通知單回饋檔
  ma:string;//審核註記
  applno:string='';//案件編號
  nationalId:string='';//身分證字號
  bailoutmemo:any[] = [];//審核註記
  level:string;//層級

  private search: string;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.nationalId = sessionStorage.getItem('nationalId');
    this.level = sessionStorage.getItem('stepName').split('t')[1];
    this.search = sessionStorage.getItem('search');
    this.searchTable();
  }

  //審核註記
  macr()
  {
    let url = "f01/childscn32action1";
    let jsonObject: any = {};
    jsonObject['applno'] =  this.applno;
    jsonObject['bailoutaction'] = this.ma;
    jsonObject['bailoutlevel'] = this.level;
    this.childscn32Service.postJson(url,jsonObject).subscribe(data=>{
      if(data.rspCode =='0000')
      {
        this.searchTable();
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspBody }
        });

      }
      else
      {
        this.searchTable();
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspBody }
        });
      }
    })
  }

  //查詢
  searchTable()
  {
    let url = "f01/childscn32";
    let jsonObject: any = {};
    jsonObject['applno'] =  this.applno;
    jsonObject['nationalId'] = this.nationalId;
    this.childscn32Service.postJson(url,jsonObject).subscribe(data=>{
      this.bailoutmemo = data.rspBody.EL_BailOutMEMO;
      this.wlfeedback = data.rspBody.EL_WLFEEDBACK;
      this.wlfbrslt = data.rspBody.EL_WLFBRSLT;
      this.nt145feedback = data.rspBody.EL_NT145FEEDBACK;
      for(let t of this.bailoutmemo)
      {
        this.ma = t.bailoutaction;
      }

    })
  }

  getSearch() {
    return this.search;
  }

}
