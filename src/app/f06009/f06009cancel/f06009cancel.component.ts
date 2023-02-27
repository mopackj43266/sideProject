import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OptionsCode } from 'src/app/interface/base';
import { F06009Service } from '../f06009.service';

@Component({
  selector: 'app-f06009cancel',
  templateUrl: './f06009cancel.component.html',
  styleUrls: ['./f06009cancel.component.css', '../../../assets/css/f02.css']
})
export class F06009cancelComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<F06009cancelComponent>,
    private f06009Service: F06009Service,
  ) { }

  cancelReason: string = "";
  cancelOtherReason: string = "";
  aprvReason: string = "";
  applno: string = "";
  block: boolean = false;
  cancelReasonCode: OptionsCode[] = [];

  ngOnInit(): void {
    this.applno = this.data.applno;
    this.f06009Service.getSysTypeCode('CANCEL_REASON').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.cancelReasonCode.push({ value: codeNo, viewValue: desc });
      }
    });
    this.getCancelReason(this.applno);
  }

  ngAfterViewInit(): void {
    const t = document.getElementById('top');
    t.scrollIntoView();
  }

  getCancelReason(applno: string) {
    let url = "f06/f06009";
    let jsonObject: any = {};
    jsonObject['applno'] = applno;
    this.f06009Service.getData(url, jsonObject).subscribe(data => {
      this.cancelReason = this.getCancelText(data.rspBody[0].cancelCode);
      this.cancelOtherReason = data.rspBody[0].cancelReason;
    });
  }

  agree() {
    let url = "f06/f06009action2";
    let jsonObject: any = {};
    let jsonWebCancelCase: any = {};
    jsonWebCancelCase['aprvReason'] = this.aprvReason;
    jsonObject['applno'] = this.applno;
    jsonObject['elWebCancelCase'] = jsonWebCancelCase;

    const checkCancelComponent = this.f06009Service.confrimComCancel("f06008");
    checkCancelComponent.afterClosed().subscribe(result => {
      if (result.value == 'cancel') {
        this.block = true;
        this.f06009Service.getData(url, jsonObject).subscribe(data => {
          this.f06009Service.confrimCom(data.rspMsg);
          this.f06009Service.getChildernDialogRef().afterClosed().subscribe(result => {
            this.dialogRef.close();
          });
        });
      }
    })
  }

  reject() {
    let url = "f06/f06009action3";
    let jsonObject: any = {};
    let jsonWebCancelCase: any = {};
    jsonWebCancelCase['aprvReason'] = this.aprvReason;
    jsonObject['applno'] = this.applno;
    jsonObject['elWebCancelCase'] = jsonWebCancelCase;
    this.f06009Service.getData(url, jsonObject).subscribe(data => {
      this.f06009Service.confrimCom("拒絕取消!");
      this.f06009Service.getChildernDialogRef().afterClosed().subscribe(result => {
        this.dialogRef.close();
      });
    });
  }

  getCancelText(codeVal: string): string {
    for (const data of this.cancelReasonCode) {
      if (data.value == codeVal) {
        return data.viewValue;
      }
    }
    return codeVal;
  }
}
