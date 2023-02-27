import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Childscn28Service } from './childscn28.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';

interface sysCode {
  value: string;
  viewValue: string;
}
//Nick mail
@Component({
  selector: 'app-childscn28',
  templateUrl: './childscn28.component.html',
  styleUrls: ['./childscn28.component.css', '../../../assets/css/f01.css']
})
export class Childscn28Component implements OnInit {

  constructor(
    private childscn28Service: Childscn28Service,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Childscn28Component>,
  ) { }

  private applno: string;     //案編
  email: string;              //EMAIL
  emailCode: sysCode[] = [];  //EMAIL模板下拉
  emailSet: string;           //EMAIL設定值
  emailTitle: string = 'LINE Bank 貸款申請補件通知';         //主旨
  content: string;            //E-MAIL內容
  stepName: string;
  BW_creditResult: string; //審核結果

  emailDataSource = new MatTableDataSource<any>();    //email資訊檔
  email_M_Code = new MatTableDataSource<any>();    //email mappingcode

  page: string;

  ngOnInit(): void {
    //取案編
    this.applno = sessionStorage.getItem('applno');
    this.page = sessionStorage.getItem('page');
    this.BW_creditResult = sessionStorage.getItem('BW_creditResult');
    // if (this.page == '9' || this.page == '10') {
    //   this.childscn28Service.getSysTypeCode('BW_EMAIL').subscribe(data => {
    //     for (const jsonObj of data.rspBody.mappingList) {
    //       const codeNo = jsonObj.codeNo;
    //       const desc = jsonObj.codeDesc;
    //       this.emailCode.push({ value: codeNo, viewValue: desc })
    //     }
    //     this.email_M_Code.data = data.rspBody.mappingList;
    //   });
    //   this.emailTitle = 'LINE Bank 貸款額度管控通知'
    // } else {
      this.childscn28Service.getSysTypeCode('EMAIL').subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.emailCode.push({ value: codeNo, viewValue: desc })
        }
        this.email_M_Code.data = data.rspBody.mappingList;
      });
    // }

    this.getEmailList();
  }

  // 離開該彈窗
  cancel(): void {
    this.dialogRef.close();
  }

  // 選取EMAIL模板後會將內容代入EMAIL內容
  changeSelect(emailSet: string) {
    for (const jsonObj of this.email_M_Code.data) {
      this.content = jsonObj.codeNo == emailSet ? jsonObj.codeTag : this.content;
    }
  };

  //取該案件email發送資訊
  getEmailList() {
    const baseUrl = 'f01/childscn28';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childscn28Service.postJson(baseUrl, jsonObject).subscribe(data => {
      this.emailDataSource = data.rspBody.items;
      if (this.email == null || this.email == "") {
        this.email = data.rspBody.email;
      }
    });
  };


  addMail() {
      if (this.email == null || this.email == "") {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請輸入EMAIL" }
        });
      }
      else if (this.emailSet == null || this.emailSet == "") {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請選擇E-MAIL字串" }
        });
      }
      else if (this.content == null || this.content == "") {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "EMAIL內容異常" }
        });
      }
      else {
        let msgStr: string = "";
        const baseUrl = 'f01/childscn28action1';
        let jsonObject: any = {};
        jsonObject['applno'] = this.applno;
        jsonObject['email'] = this.email;
        jsonObject['emailSet'] = this.emailSet;
        jsonObject['emailTitle'] = this.emailTitle;
        jsonObject['messageContent'] = this.content;
        this.childscn28Service.postJson(baseUrl, jsonObject).subscribe(data => {
          if (data.rspCode == '9999') {
            msgStr = data.rspMsg;
          } else {
            msgStr = data.rspMsg == "success" ? "傳送成功!" : "傳送失敗!"
          }
          this.dialog.open(ConfirmComponent, {
            data: { msgStr: msgStr }
          });
          if (data.rspMsg == "success" && data.rspCode === '0000') {
            this.getEmailList();
          }
        });
      }

  }

  getPage(): string {
    return this.page;
  }
}
