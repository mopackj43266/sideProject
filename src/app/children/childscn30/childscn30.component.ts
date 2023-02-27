import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Childscn19Component } from '../childscn19/childscn19.component';
import { Childscn19Service } from '../childscn19/childscn19.service';
import { Childscn28Service } from '../childscn28/childscn28.service';

@Component({
  selector: 'app-childscn30',
  templateUrl: './childscn30.component.html',
  styleUrls: ['./childscn30.component.css','../../../assets/css/child.css']
})
export class Childscn30Component implements OnInit {

  constructor(
    private childscn19Service: Childscn19Service,
    private childscn28Service: Childscn28Service,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  rescanDataSource = []; //補件資訊檔
  rescanData = []; //補件資訊檔Y
  smsDataSource = [];    //簡訊資訊檔
  emailDataSource = [];  //email發送檔
  ii = [];
  remarkContent: string = "";
  private applno: string;
  swcApplno: string;
  email: string;              //EMAIL
  ngOnInit(): void {
    this.swcApplno = this.data.swcApplno;
    this.getRescanList();
    this.getSmsList();
    this.getEmailList();
  }


  getRescanList() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.swcApplno;
    this.childscn19Service.getRescanSearch(jsonObject).subscribe(data => {
      this.rescanDataSource = data.rspBody.items;
      for(const data of this.rescanDataSource){
        if(data.RESCAN_FLAG == 'Y'){
          this.rescanData.push(data);
        }
      }
    })
  };
  getSmsList() {
    const baseUrl = 'f01/childscn27';
    let jsonObject: any = {};
    jsonObject['applno'] = this.swcApplno;
    this.childscn19Service.postJson(baseUrl, jsonObject).subscribe(data => {
      this.smsDataSource = data.rspBody.items;
    });
  };
  getEmailList() {
    const baseUrl = 'f01/childscn28';
    let jsonObject: any = {};
    jsonObject['applno'] = this.swcApplno;
    this.childscn28Service.postJson(baseUrl, jsonObject).subscribe(data => {
      this.emailDataSource = data.rspBody.items;
      if (this.email == null || this.email == "") {
        this.email = data.rspBody.email;
      }
    });
  };

}
