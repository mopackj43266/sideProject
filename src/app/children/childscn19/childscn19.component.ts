import { logging } from 'protractor';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NzI18nService, zh_TW } from 'ng-zorro-antd/i18n';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { ChildrenService } from '../children.service';
import { Childscn5Service } from '../childscn5/childscn5.service';
import { Childscn19Service } from './childscn19.service';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/base.service';
//alvin.lee 20210915 補件/發簡訊
//Nick SMS簡訊
interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-childscn19',
  templateUrl: './childscn19.component.html',
  styleUrls: ['./childscn19.component.css', '../../../assets/css/f01.css']
})
export class Childscn19Component implements OnInit {

  constructor(
    private childscn19Service: Childscn19Service,
    private childscn5Service: Childscn5Service,
    public childrenService: ChildrenService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<Childscn19Component>,
    private pipe: DatePipe,
    private nzI18nService: NzI18nService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.nzI18nService.setLocale(zh_TW) //元件簡體字轉繁體字
  }

  disabledHours(): number[] {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 21, 22, 23];
  }

  private applno: string;                           //案編
  private cuid: string;                             //客編
  restartDate: Date;                                //待補文件日期
  restartDateValue: Date;                           //待補文件日期類型
  rescanTypeCode: sysCode[] = [];                   //補件原因下拉
  rescanType: string;                               //補件原因
  rescanItemCode: sysCode[] = [];                   //補件項目下拉
  rescanItem: string;                               //補件項目
  rescanContent: string;                            //徵審註記
  remarkContent: string = "";
  mobile: string;                                   //客戶手機
  smsSetCode: sysCode[] = [];                       //sms模板下拉
  smsSet: string;                                   //sms模板
  content: string;                                  //sms內容
  messageContent: string;                           //由sms模板代入sms內容
  realSmsTime: string;                              //預計發送時間(日期)
  realSmsTimeValue: Date;                           //預計發送時間類型
  mytime: Date | null = null;                       //預計發送時間(時分)
  rescanDataSource = new MatTableDataSource<any>(); //補件資訊檔
  smsDataSource = new MatTableDataSource<any>();    //簡訊資訊檔
  sms_M_Code = new MatTableDataSource<any>();    //sms mappingcode
  Number: string;
  swcApplno: string;
  newdata= [];//授信補件
  ii = [];
  // flag = this.data.flag;
  // boo :boolean = true ;
  block: boolean = false;
  send: boolean = true;//案件送出判斷是否鎖起來
  variable=0;
  page: string;
  checkpoint: string;
  ngOnInit(): void {
    this.swcApplno = this.data.swcApplno;
    this.rescanType = '';
    this.rescanItem = '';
    this.restartDate = this.dealwithData3(new Date());
    //取案編,客編,客戶手機
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.checkpoint = sessionStorage.getItem('checkpoint');
    this.page = sessionStorage.getItem('page');
    // this.queryCusMobile();
    //取sms樣板下拉
    this.childscn19Service.getSysTypeCode('SMS_SET').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.smsSetCode.push({ value: codeNo, viewValue: desc })
      }
      this.sms_M_Code.data = data.rspBody.mappingList;
    });

    //取補件項目下拉
    this.childscn19Service.getSysTypeCode('RESCAN_ITEM').subscribe(data => {
      this.rescanItemCode.push({ value: '', viewValue: '請選擇', })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.rescanItemCode.push({ value: codeNo, viewValue: desc, })
      }
    });

    //取補件原因下拉
    this.childscn19Service.getSysTypeCode('RESCAN_TYPE').subscribe(data => {
      this.rescanTypeCode.push({ value: '', viewValue: '請選擇', })
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.rescanTypeCode.push({ value: codeNo, viewValue: desc })
      }
    });

    this.getRescanList();         //取該案件補件資訊

    this.getSmsList(); //取該案件簡訊發送資訊

  }

  //新增補件資訊
  public async rescan(): Promise<void> {

   if (this.rescanType == null || this.rescanType == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請輸入補件原因" }
      });
    } else if (this.rescanItem == null || this.rescanItem == '') {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請輸入補件項目" }
      });
    } else {
      let jsonObject: any = {};
      jsonObject['applno'] = this.applno;
      jsonObject['rescanType'] = this.rescanType;
      jsonObject['rescanContent'] = this.rescanContent;
      jsonObject['rescanItem'] = this.rescanItem;
      // jsonObject['restartDate'] = this.pipe.transform(new Date(), 'yyyy-MM-dd-HH:mm');
      let msgStr: string = "";
      msgStr = await this.childscn19Service.addRescan(jsonObject);
      if (msgStr == 'success') {
        msgStr = '儲存成功！';

        this.rescanType = '';
        this.rescanItem = '';
        this.rescanContent = '';
      }
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr }
      });
      this.getRescanList();
    }
    return;
  }

  //發送簡訊
  async addSms() {


    this.messageContent = this.content;
    // if (this.realSmsTime == null) {
    //   const confirmDialogRef = this.dialog.open(ConfirmComponent, {
    //     data: { msgStr: "請輸入日期" }
    //   });
    // } else if (this.realSmsTime != null && this.mytime == null) {
      // const confirmDialogRef = this.dialog.open(ConfirmComponent, {
      //   data: { msgStr: "請輸入時間" }
      // });
    // } else
    if (this.mobile == null || this.mobile == "" || this.mobile.length != 10) {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請輸入手機號碼" }
      });
    } else if (this.smsSet == null || this.smsSet == "") {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇SMS樣板" }
      });
    } else if (this.content == null || this.content == "") {
      const confirmDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "SMS內容異常" }
      });
    }
    else {//判斷日期時間是否在現在以前
      var date = this.pipe.transform(this.realSmsTime, 'yyyy-MM-dd') + this.pipe.transform(this.mytime, ' HH:mm') + ":00";
      var newDate = date.replace(/-/g, '/'); // 變成"2012/01/01 12:30:10";
      var keyDate = new Date(newDate)
      if (keyDate.getTime() < Date.now()) {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請輸入正確日期時間" }
        });
        return;
      }
      let msgStr: string = "";
      const baseUrl = 'f01/childscn27action1';
      let jsonObject: any = {};
      jsonObject['applno'] = this.applno;
      jsonObject['empno'] = BaseService.userId;
      jsonObject['mobile'] = this.mobile;
      jsonObject['realSmsTime'] = this.pipe.transform(this.realSmsTime, 'yyyyMMdd') + this.pipe.transform(this.mytime, 'HHmm');
      jsonObject['smsSet'] = this.smsSet;
      await this.childscn19Service.postJson(baseUrl, jsonObject).subscribe(data => {
        if (data.rspCode == '9999') {
          msgStr = data.rspMsg;
        } else {
          msgStr = data.rspMsg == "success" ? "傳送成功!" : "傳送失敗!"
        }
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: msgStr }
        });
        if (data.rspMsg == "success" && data.rspCode === '0000') {
          this.getSmsList();
          this.realSmsTime = null;
          this.mytime = null;
          this.content = null;
          this.smsSet = null;
        }
      });
    }
  }


  //取該案件補件資訊
 getRescanList() {
    this.ii = [];
    this.send = true;
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childscn19Service.getRescanSearch(jsonObject).subscribe(data => {
      this.remarkContent = '';
      if (data.rspBody.items.length > 0) {
        for (var i of data.rspBody.items)
        {
          if (i.IMAGE_DATE != null) {
            this.ii.push(i.IMAGE_DATE)
          }

          if (i.RESCAN_FLAG == 'N')
          {
           this.send = false;
          }
        }



        for (let index = 0; index < data.rspBody.items.length; index++) {
          if (data.rspBody.items[index].RESCAN_FLAG == 'N') {
            if (index == data.rspBody.items.length - 1) {
              this.remarkContent = this.remarkContent + data.rspBody.items[index].RESCAN_ITEM + '(' + data.rspBody.items[index].RESCAN_TYPE + ')。';
            } else {
              this.remarkContent = this.remarkContent + data.rspBody.items[index].RESCAN_ITEM + '(' + data.rspBody.items[index].RESCAN_TYPE + ')、';
            }
          }

        }
      }
      else {
        this.send = true;
      }
      this.rescanDataSource = data.rspBody.items;
      if(this.rescanDataSource !=null)
      {
        for(var t of data.rspBody.items)
        {
          if(t.RESCAN_FLAG=='Y')
          {
            this.newdata.push(t)
          }
        }
      }

    })
  };



  //取該案件簡訊發送資訊/從客戶資訊查詢客戶手機
  getSmsList() {
    const baseUrl = 'f01/childscn27';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    this.childscn19Service.postJson(baseUrl, jsonObject).subscribe(data => {
      this.smsDataSource = data.rspBody.items;
      if (this.mobile == null || this.mobile == "") {
        this.mobile = data.rspBody.phone;
      }
    });

  };

  //刪除該案件補件資訊
  public async delRescan(ID: string): Promise<void> {
    let jsonObject: any = {};
    jsonObject['rowID'] = ID;
    let msgStr: string = "";
    msgStr = await this.childscn19Service.deleteRescanByRowid(jsonObject);
    if (msgStr == '刪除成功') {
      this.dialog.open(ConfirmComponent, { data: { msgStr: msgStr } });
      this.getRescanList();
    }
  }

  // 選取sms模板後會將內容代入sms內容
  changeSelect(smsSet: string) {
    for (const jsonObj of this.sms_M_Code.data) {
      this.content = jsonObj.codeNo == smsSet ? jsonObj.codeTag : this.content;
    }

  };

  // 離開該彈窗
  cancel(): void {
    this.dialogRef.close();
  }

  repair()//補件送出
  {
    if (this.remarkContent.length > 30) {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: '補充文件項目數超出限制(補件文件字數不大於30字)．補件送出失敗。' }
      });
      return;
    } else {
      let u = 'f02/f02002action6';
      let url = 'f01/childscn19action7';
      let jsonObject: any = {};
      jsonObject['applno'] = this.data.applno;
      jsonObject['swcCreditLevel'] = this.data.checkpoint;
      let jsonObject2: any = {};
      jsonObject2['applno'] = this.data.applno;
      this.childscn19Service.setrepair(url, jsonObject).subscribe(data => {
        this.block = true;
        if (data.rspMsg == '成功') {
          this.childscn19Service.setrepair(u, jsonObject2).subscribe(data => {
            const childernDialogRef = this.dialog.open(ConfirmComponent, {
              data: { msgStr: data.rspMsg }
            });
          })
          this.block = false;
          if (this.page == '1') {
            this.router.navigate(['./F01001']);
          } else {
            this.router.navigate(['./F01002']);
          }
          this.dialogRef.close();
        }
        else {
          const childernDialogRef = this.dialog.open(ConfirmComponent, {
            data: { msgStr: data.rspMsg }
          });
          this.block = false;
          if (this.page == '1') {
            this.router.navigate(['./F01001']);
          } else {
            this.router.navigate(['./F01002']);
          }
          this.dialogRef.close();
        }
      })
    }
  }

  disabledDate(time) {
    return time.getTime() < Date.now() - 8.64e7;
  }

  //只能數字
  data_number(x: string) {
    if (x != null) {
      x = x.replace(/[^\d]/g, '');
    }
    return x
  }

  dealwithData3(time: Date) {
    return new Date(Date.now() + (3 * 24 * 60 * 60 * 1000));
  }

  getPage(): string {
    return this.page;
  }
   //轉換中文
   changeLevel(code: string) {
    if (code == 'N') {
      return "未補"
    } else if (code == 'Y') {
      return "已補"
   }
  }
}

