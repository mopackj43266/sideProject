import { BaseService } from 'src/app/base.service';
import { OptionsCode } from './../../interface/base';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F06008Service } from '../f06008.service';

@Component({
  selector: 'app-f06008cancel',
  templateUrl: './f06008cancel.component.html',
  styleUrls: ['./f06008cancel.component.css', '../../../assets/css/f02.css']
})
export class F06008cancelComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<F06008cancelComponent>,
    private f06008Service: F06008Service,
  ) { }

  cancelReasonCode: OptionsCode[] = [];
  cancelReason: string = "";
  cancelOtherReason: string = "";
  applno: string = "";
  block: boolean = false;

  ngOnInit(): void {
    this.applno = this.data.applno;
    this.cancelReasonCode = [];
    this.cancelReasonCode.push({ value: "請選擇", viewValue: "" });
    this.f06008Service.getSysTypeCode('CANCEL_REASON').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.cancelReasonCode.push({ value: codeNo, viewValue: desc });
      }
    });
  }

  ngAfterViewInit(): void {
    const t = document.getElementById('top');
    t.scrollIntoView();
  }

  cancel() {
    if (this.cancelReason == "" || this.cancelReason.split(',')[1] == "") {
      this.f06008Service.confrimCom("請填寫取消原因!");
      return;
    } else {
      if (this.cancelOtherReason == "") {
        this.f06008Service.confrimCom("請填寫其他原因!");
        return;
      } else {
        let url = "f06/f06008action2";
        let jsonObject: any = {};
        let jsonWebCancelCase: any = {};
        jsonWebCancelCase['applno'] = this.applno;
        jsonWebCancelCase['cancelUser'] = BaseService.userId;
        jsonWebCancelCase['cancelCode'] = this.cancelReason.split(',')[0];
        jsonWebCancelCase['cancelReason'] = this.cancelOtherReason;
        jsonObject['applno'] = this.applno;
        jsonObject['elWebCancelCase'] = jsonWebCancelCase;

        const checkCancelComponent = this.f06008Service.confrimComCancel("f06008");
        checkCancelComponent.afterClosed().subscribe(result => {
          if (result.value == 'cancel') {
            this.block = true;
            this.f06008Service.getData(url, jsonObject).subscribe(data => {
              this.f06008Service.confrimCom(data.rspMsg);
              if (data.rspMsg == '案件不可取消!') {
                this.block = false;
              } else {
                this.block = false;
                this.dialogRef.close();
              }
            })
          }
        })
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
