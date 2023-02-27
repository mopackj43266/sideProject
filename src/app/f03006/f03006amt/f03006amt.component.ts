import { Component, Inject, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component'
import { F03006Service } from '../f03006.service'

//角色checkBox框架
interface checkBox {
  value: string
  completed: boolean
}
//Nick 組織人員維護-儲存角色設定
@Component({
  selector: 'app-f03006amt',
  templateUrl: './f03006amt.component.html',
  styleUrls: ['./f03006amt.component.css', '../../../assets/css/f03.css'],
})
export class F03006amtComponent {
  checked = [] //存取被選到的物件
  check: boolean = false
  one: any[] = [] //裝一開始的資料表
  x: string
  constructor(public dialogRef: MatDialogRef<F03006amtComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, public f03006Service: F03006Service) { }
  submit() { }
  ngOnInit(): void {
    for (const obj of this.data.SOURCE) {
      obj.MAX_APPROVE_AMT = this.limit(obj.MAX_APPROVE_AMT);
    }
    this.getCheckList()
  }

  limit(x: string) {
    if (x != null) {
      x=x.toString();
      x = x.replace(/[^\d]/g, '');
      x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return x

  }

  // 	limit(x: string, id: string, name: string) {
  // 		x = x.replace(/\D/g, '')
  // 		if (x.length > 0) {
  // 			x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // 		}
  // 		for (const item of this.data.SOURCE) {

  // 			if (item.PROD_CODE == id) {

  // 				switch (name) {
  // 					case "02010010023":
  // 						item.MAX_APPROVE_AMT = x;
  // 						break;
  // 				}
  // 				switch (name) {
  // 					case "02010020006":
  // 						item.MAX_APPROVE_AMT = x;
  // 						break;
  // 				}
  // 				// switch (name) {
  // 				// 	case "PLI":
  // 				// 		item.MAX_APPROVE_AMT = x;
  // 				// 		break;
  // 				// }
  // 				// switch (name) {
  // 				// 	case "PLR":
  // 				// 		item.MAX_APPROVE_AMT = x;
  // 				// 		break;
  // 				// }

  // 			}
  // 		}
  // 	}

  //儲存前處理千分位
  Cut(s: string) {
    if (s != null) {
      this.x = (s + "")
      this.x = this.x.replace(/,/g, "")
    }

    return s
  }


  //載入選項
  setAll(completed: boolean) {
    for (const obj of this.data.CHECKBOX) {
      obj.completed = completed
    }
  }

  //取消
  onNoClick(): void {
    this.dialogRef.close()
  }

  // 如果該row的isChk屬性為true就存入陣列
  test: any
  getCheckList() {
    this.checked = this.data.SOURCE.filter(data => data.MAX_APPROVE_AMT <= this.test)


  }
  data_number(p: number) {
    this.x = '';
    this.x = (p + "")
    if (this.x != null) {
      this.x = this.x.replace(/,/g, "");
    }
    return this.x
  }
  //儲存角色設定
  public async confirmAdd(): Promise<void> {
    const baseUrl = 'f03/f03006action9'
    var valArray: string[] = []
    let jsonObject: any = {}
    // let jsonObjects: any = [];
    // let array: [];
    jsonObject['empNo'] = this.data.empNo
    const array = this.data.SOURCE.filter(item => item.MAX_APPROVE_AMT != '' && item.MAX_APPROVE_AMT != undefined).map(item => ({

      empNo: this.data.empNo,
      prodType: item.PROD_CODE,
      maxApproveAmt: (item.MAX_APPROVE_AMT + "").replace(/,/g, ""),

    }))
    let msgStr = ''
    this.f03006Service.saveEmployeeRole(baseUrl, array).subscribe(data => {
      msgStr = data.rspCode === '0000' && data.rspMsg === '成功' ? '儲存成功！' : '儲存失敗！'
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: msgStr },
      })
      if (msgStr === '儲存成功！') {
        this.dialogRef.close({ event: 'success' })
      }
    })
  }

}
