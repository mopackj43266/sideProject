import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { OptionsCode } from 'src/app/interface/base'
import { F03012Service } from '../f03012.service'
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { FADE_CLASS_NAME_MAP } from 'ng-zorro-antd/modal'
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component'
@Component({
  selector: 'app-f03012add',
  templateUrl: './f03012add.component.html',
  styleUrls: ['./f03012add.component.css', '../../../assets/css/f03.css'],
})
export class F03012addComponent implements OnInit {
  selectedValue1: string = ""
  selectedValue2: string = ""

  error: string
  low_disabled: boolean = true //最低門檻是否啟動判斷
  hight_disabled: boolean = true //最高門檻是否啟動判斷
  //下拉
  selectedColumn: OptionsCode[] = []
  setValueHight: string = ''
  compareType: string = ""
  setValueLow: string = ''
  valueHigh: number;
  valueLow: number;
  compareTableCode: OptionsCode[] = []
  compareColumnCode: OptionsCode[] = []
  maxlength: number;
  submitted = false
  // compareTableSetForm: FormGroup = this.fb.group({
  // 	compareTable: ['', [Validators.required]],
  // 	compareColumn: ['', [Validators.required]],
  // 	compareType: ['', [Validators.required]],
  // 	setValueHight: ['', [Validators.required]],
  // 	setValueLow: ['', [Validators.required]],
  // })

  constructor(
    public dialogRef: MatDialogRef<F03012addComponent>,
    private fb: FormBuilder,
    private f03012Service: F03012Service,
    public dialog: MatDialog,
    private alert: NzAlertModule) { }

  ngOnInit(): void {
    this.getData()
    // this.f03012Service.getSysTypeCode('COMPARE_TABLE').subscribe(data => {
    // 	for (const jsonObj of data.rspBody.mappingList) {
    // 		const codeNo = jsonObj.codeNo
    // 		const desc = jsonObj.codeDesc
    // 		this.compareTableCode.push({value: codeNo, viewValue: desc})
    // 	}
    // 	for (let i = 0; i < this.compareTableCode.length; i++) {
    // 		this.f03012Service.getSysTypeCode(this.compareTableCode[i].value).subscribe(data => {
    // 			for (const jsonObj of data.rspBody.mappingList) {
    // 				const codeNo = jsonObj.codeNo
    // 				const desc = jsonObj.codeDesc
    // 				this.compareColumnCode.push({value: codeNo, viewValue: desc})
    // 			}
    // 		})
    // 	}
    // })
    this.valueHigh = this.convertStringToNumber(this.setValueHight);
    this.valueLow = this.convertStringToNumber(this.setValueLow);
  }
  formControl = new FormControl('', [
    Validators.required
  ]);
  //欄位驗證
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  getData() {
    this.f03012Service.getSysTypeCode('COMPARE_TABLE').subscribe(data => {
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo
        const desc = jsonObj.codeDesc
        this.compareTableCode.push({ value: codeNo, viewValue: desc })
      }
      for (let i = 0; i < this.compareTableCode.length; i++) {
        this.f03012Service.getSysTypeCode(this.compareTableCode[i].value).subscribe(data => {

          for (const jsonObj of data.rspBody.mappingList) {
            const codeNo = jsonObj.codeNo
            const desc = jsonObj.codeDesc
            this.compareColumnCode.push({ value: codeNo, viewValue: desc })
          }
        })
      }
    })
  }

  changeSelect() {
    let jsonObject: any = {};
    jsonObject['compareTable'] = this.selectedValue1;
    this.f03012Service.getColumn(jsonObject)
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.selectedColumn.push({ value: codeNo, viewValue: desc })
        }
      })
    this.selectedColumn = []
    // this.f03012Service.getSysTypeCode(this.selectedValue1).subscribe(data => {
    // 	for (const jsonObj of data.rspBody.mappingList) {
    // 		const codeNo = jsonObj.codeNo
    // 		const desc = jsonObj.codeDesc
    // 		this.selectedColumn.push({value: codeNo, viewValue: desc})
    // 	}
    // })
  }

  //儲存前處理千分位
  Cut(s: string) {
    if (s != null) {
      s = s.replace(/,/g, "")
    }

    return s
  }

  add() {

    let msg = ''
    this.submitted = true
    // if (!this.compareTableSetForm.valid) {
    //   msg = '資料格式有誤，請修正!';
    // } else {
    const url = 'f03/f03012action5'

    let jsonObject: any = {}
    jsonObject['compareTable'] = this.selectedValue1
    jsonObject['compareColumn'] = this.selectedValue2
    jsonObject['compareType'] = this.compareType

    if (this.compareType == '2') {
      if (Number(this.setValueLow) > 1) {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "不可以大於1" }
        });

        return;
      }

      if (!(this.setValueLow.includes('.'))) {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請填小數點" }
        });
        return;
      }
      if ((this.setValueLow.length < 4)) {
        this.setValueLow.concat('0')
      }
      if (this.setValueLow.trim() == '') {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "欄位不可為空" }
        });
        return;
      } else {
        if (this.setValueLow.length < 5) {
          jsonObject['setValueLow'] = this.setValueLow != '' ? Number(this.setValueLow).toString() : "0";
        } else {

          this.dialog.open(ConfirmComponent, {
            data: { msgStr: "格式不符請重新輸入!" }
          });
          return this.setValueLow = ''
        }
      }

    }
    else if (this.compareType == '1')
      if (this.setValueLow.length != 0 || this.setValueHight.length != 0) {

        {
          if ((this.setValueLow.includes('.'))) {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: "請填整數" }
            });
            return;
          }
          else if (Number(this.setValueHight) < Number(this.setValueLow)) {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: '設定最高門檻需大於設定最低門檻!!' }
            });

            return
          }
          else if (Number(this.setValueHight) == Number(this.setValueLow)) {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: '設定最高門檻不能等於設定最低門檻!!' }
            });

            return
          }
          else if (this.setValueHight.trim() == '' || this.setValueLow.trim() == '') {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: '欄位不可為空!!' }
            });

            return
          }
          else if (this.setValueHight == '' || Number(this.setValueHight) == null || this.setValueLow == '' || Number(this.setValueLow) == null || this.setValueLow.length == 0 || this.setValueHight.length == 0) {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: '欄位不可為空!!' }
            });

            return
          }
          else {
            jsonObject['setValueLow'] = this.setValueLow != " " && this.setValueLow != '' ? Number(this.setValueLow).toString() : "0";
            jsonObject['setValueHight'] = this.setValueHight != '' && this.setValueLow != " " ? Number(this.setValueHight).toString() : "0";
          }
        }
      }

    this.error = 'test'

    this.f03012Service.submit(url, jsonObject).subscribe(data => {
      // alert((msg = data.rspMsg))
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: data.rspMsg }
      });
      // this.getData()
      this.error = data.rspMsg
      if (data.rspMsg == 'success') {
        this.dialogRef.close({ event: 'success' }
        );

      }
      this.f03012Service.resetfn();

      // 儲存成功後通知f03012頁面啟動呼叫table function
      // if (data.rspMsg == '成功新增') {

      //   this.dialog.closeAll();
      // }

    })
    // const formdata: FormData = new FormData();
    // formdata.append('elCompareDataSet[0].compareTable', this.compareTableSetForm.value.compareTable);
    // formdata.append('elCompareDataSet[0].compareColumn', this.compareTableSetForm.value.compareColumn);
    // formdata.append('elCompareDataSet[0].compareType', this.compareTableSetForm.value.compareType);
    // formdata.append('elCompareDataSet[0].setValueHight', this.compareTableSetForm.value.setValueHight);
    // formdata.append('elCompareDataSet[0].setValueLow', this.compareTableSetForm.value.setValueLow);
    // formdata.append('setValue', this.compareTableSetForm.value.setValue);
    // this.f03012Service.saveComePareDataSetList(url, formdata).subscribe(data => {
    //  alert(msg = data.rspMsg)
    //  window.location.reload();
    // });
    // }
    // setTimeout(() => {
    //   const DialogRef = this.dialog.open(F03012confirmComponent, { data: { msgStr: msg } });
    //   window.location.reload();
    // }, 1500);
  }

  clear() {
    this.dialog.closeAll();
  }
  isNumber(value: any) { return /^-?[\d.]+(?:e-?\d+)?$/.test(value); }

  //去除符號/中英文
  toNumber(data: string) {
    return data != null ? data.replace(/[^\w\s]|_/g, '.') : data;

  }

  // 只允許輸入小數點
  numberOnly(i: string) {
    this.setValueLow = i;
    var num = 0;
    num = Number(i);
    // if(num>1)
    // {
    //   this.setValueLow='';
    //   this.dialog.open(ConfirmComponent, {
    //     data: { msgStr: "最大值1" },
    //   })
    // }
  }
  //最高
  numberhingt(i: string) {
    this.setValueHight = i;
    var num = 0;
    num = Number(i);
    // if(num>99)
    // {
    //   this.setValueHight='';
    //   this.dialog.open(ConfirmComponent, {
    //     data: { msgStr: "最大值99" },
    //   })
    // }
  }

  //+逗號
  toCurrency(amount: string) {
    return amount != null ? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
  }
  // 判斷比對方式來去鎖住最高門檻
  test123(a) {
    if (a == 2) {
      this.low_disabled = false
      this.hight_disabled = true
      this.maxlength =4

    }
    else {
      this.low_disabled = false
      this.hight_disabled = false
      this.maxlength = 10

    }
  }
  ngAfterViewInit(): void {

  }

  convertStringToNumber(input: string) {
    var numeric = Number(input);
    return numeric;
  }
  // test(compareType) {
  //   this.compareType=compareType
  //   if (compareType == "2") {
  //     this.maxlength = 10
  //   } else if (compareType == "1") {
  //     this.maxlength = 4
  //   }
  // }

}
