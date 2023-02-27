import { DatePipe, formatDate } from '@angular/common'
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core'
import { Validators } from '@angular/forms'
import { FormControl } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component'
import { OptionsCode } from 'src/app/interface/base'
import { F06002Service } from '../f06002.service'

interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f06002edit',
  templateUrl: './f06002edit.component.html',
  styleUrls: ['./f06002edit.component.css', '../../../assets/css/f03.css']
})
export class F06002editComponent implements OnInit {
  hour = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
  isConnectCode: sysCode[] = [];//是否接通下拉
  isConnectValue: string;//是否接通
  notConnectCode: sysCode[] = [];//未接通原因下拉
  notConnectValue: string;//未接通原因
  isContactNextCode: sysCode[] = [];//是否需再次聯繫下拉
  isContactNextValue: string;//是否需再次聯繫
  custReasonCode: sysCode[] = [];//客戶原因下拉
  nextContactTime:string
  custReasonValue: string;//客戶原因
  nextContactTimeHour: string//預計下次聯繫時間 小時
  constructor(
    public dialogRef: MatDialogRef<F06002editComponent>,
    private F06002Service: F06002Service,
    public dialog: MatDialog,
    private pipe: DatePipe,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  formControl = new FormControl('', [
    Validators.required,
    // Validators.email,
  ])
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  ngOnInit(): void {
    console.log(this.data)
    if(this.data.isContactNext==null){
      this.isContactNextValue=''
    }else{
      this.isContactNextValue=this.data.isContactNext
    }
    this.custReasonValue = this.data.custType
    //客戶原因
    this.custTypeChange()
    this.nextContactTime=this.data.nextContactTime
    console.log(this.nextContactTime)

  this.data.nextContactTime!=null? this.nextContactTimeHour = (this.pipe.transform(new Date(this.data.nextContactTime), 'yyyyMMdd HH:mm:ss')).substring(9, 11):'00'
    this.notConnectValue = this.data.codeDesc
    this.custReasonValue = this.data.custReasonDesc
    this.isConnectValue = this.data.isConnect
    if (this.data.isContactNext == 'N') {
      this.data.nextContactTime = null
      this.nextContactTimeHour = ''
    }
    //是否接通
    this.F06002Service.getSysTypeCode('YN')
    .subscribe(data => {
      this.isConnectCode.push({ value: '', viewValue: "請選擇" })
   
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.isConnectCode.push({ value: codeNo, viewValue: desc })
        }

      });
    //未接通原因
    this.F06002Service.getSysTypeCode('OUTBOUND_NOT_CONNECT_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.notConnectCode.push({ value: codeNo, viewValue: desc })
        }

      });

    //是否需再次聯繫
    this.F06002Service.getSysTypeCode('YN')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.isContactNextCode.push({ value: codeNo, viewValue: desc })
        }
      });


  }
  //客戶原因判斷
  custTypeChange() {
    if (this.custReasonValue == 'O1') {
      this.F06002Service.getSysTypeCode('OUTBOUND_O1_CUST_REASON')
        .subscribe(data => {
          this.custReasonCode.push({ value: "", viewValue: "請選擇" })
          for (const jsonObj of data.rspBody.mappingList) {
            const codeNo = jsonObj.codeNo;
            const desc = jsonObj.codeDesc;
            this.custReasonCode.push({ value: codeNo, viewValue: desc })
          }
        });
    } else if (this.custReasonValue == 'O2') {

      this.F06002Service.getSysTypeCode('OUTBOUND_O2_CUST_REASON')
        .subscribe(data => {
          this.custReasonCode.push({ value: "", viewValue: "請選擇" })
          for (const jsonObj of data.rspBody.mappingList) {
            const codeNo = jsonObj.codeNo;
            const desc = jsonObj.codeDesc;
            this.custReasonCode.push({ value: codeNo, viewValue: desc })
          }
        });
    }
  }

  save() {
    const baseUrl = "f06/f06002action3";
    let jsonObject: any = {};
    jsonObject['notConnectCode'] = this.notConnectValue;
    jsonObject['isConnect'] = this.isConnectValue
    jsonObject['notConnectMemo'] = this.data.notConnectMemo
    jsonObject['isContactNext'] = this.isContactNextValue
    jsonObject['custType'] = this.data.custType
    jsonObject['applno'] = this.data.applno
    if (this.isContactNextValue == 'Y') {
      //判斷日期時間是否在現在以前
      console.log(this.data.nextContactTime);
      console.log(this.data.nextContactTimeHour);
      var date = this.pipe.transform(this.data.nextContactTime, 'yyyy-MM-dd ') + this.nextContactTimeHour + ":00" + ":00";
      var newDate = date.replace(/-/g, '/'); // 變成"2012/01/01 12:30:10";
      var keyDate = new Date(newDate)
      if (keyDate.getTime() < Date.now()) {
        const confirmDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請選擇大於現在時間" }
        });
        return;
      }
      jsonObject['nextContactTime'] = this.pipe.transform(new Date(this.data.nextContactTime), 'yyyy-MM-dd') + ' ' + this.nextContactTimeHour + ":00" + ":00"
    }
    else if (this.isContactNextValue == 'N') {
      jsonObject['nextContactTime'] = null
    }

    jsonObject['custReason'] = this.custReasonValue
    jsonObject['custReasonMemo'] = this.data.custReasonMemo
    jsonObject['rowId'] = this.data.rowId
    this.F06002Service.inquiry(baseUrl, jsonObject).subscribe(data => {
      if (data.msgStr == '更新成功' || data.rspCode == '0000') {
        data.msgStr = '更新成功'
        // this.f06002.pickup(this.data.applno,this.data.custType,this.data.recordTime);
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.msgStr }
        });
        this.F06002Service.resetfn();
        this.onNoClick()
      }
      else {
        data.msgStr = '更新失敗'
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.msgStr }
        });
        return
      }
    })


  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onChange(result: Date): void {

    console.log(this.data.nextContactTime)
    console.log(this.pipe.transform(new Date(result), 'yyyy-MM-dd HH:mm:ss'));
  }

  onOk(result: string): void {
    this.data.nextContactTime = result
    console.log('onOk', result);
  }
  cleanDate(value: string) {
    if (value == 'N') {
      this.data.nextContactTime = ''
      this.nextContactTimeHour = ''
    }
  }
  cleanReason(value: string) {
    if (value == 'N') {
      this.custReasonValue = ''
    } else {
      this.data.notConnectMemo = ''
      this.notConnectValue = ''
    }
  }
}
