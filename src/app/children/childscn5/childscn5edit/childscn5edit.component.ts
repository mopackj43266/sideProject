import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn5Service } from '../childscn5.service';
interface checkBox {
  value: string;
  completed: boolean;
}
@Component({
  selector: 'app-childscn5edit',
  templateUrl: './childscn5edit.component.html',
  styleUrls: ['./childscn5edit.component.css', '../../../../assets/css/child.css']
})
export class Childscn5editComponent implements OnInit {
  cuCpNameCa: string = ''//公司名稱
  companyData: []; //公司資料
  id: number;
  checked = false;
  loading = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  chkArray: checkBox[] = [];
  radioValue: any
  constructor(
    public dialogRef: MatDialogRef<Childscn5editComponent>,
        private childscn5Service: Childscn5Service,
        public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }
  search() {
    let jsonObject: any = {};
    const baseUrl = "f01/childscn5action2";
    if(this.cuCpNameCa==''||this.cuCpNameCa==null){
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請輸入公司名稱" }
      })
    }else{

      jsonObject['cuCpNameCa'] = this.cuCpNameCa;
      
    }
    this.childscn5Service.getData(baseUrl, jsonObject).subscribe(data => {
      this.loading=true
      if(data.rspBody.conunt==0||data.rspCode!='0000'){
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "查無資料" }
        })
        this.loading=false
      }else{ 
        this.companyData = data.rspBody.list
        this.loading=false
      }
    })
  }
  save(company: string, id: string) {
 
    this.childscn5Service.resetfn(company,id);
  
    this.dialogRef.close();

  }
  checkedCheck(company: string, id: string) {

  }
}
