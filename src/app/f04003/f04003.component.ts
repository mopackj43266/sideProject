import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { time } from 'console';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { F02001Service } from '../f02001/f02001.service';
import { F04003Service } from './f04003.service';

// Jay 案件重新指派
interface sysCode {
  value: string;
  viewValue: string;
}
interface checkBox {
  value: string;
  completed: boolean;
  empNo: string;
}
interface assign {
  F_WobNum: string;
  swcApplno: string;
  empNo: string;
  swcNationalId: string;
}
@Component({
  selector: 'app-f04003',
  templateUrl: './f04003.component.html',
  styleUrls: ['./f04003.component.css', '../../assets/css/f04.css']
})
export class F04003Component implements OnInit {

  test123 = true;

  constructor(
    private f04003Service: F04003Service,
    private f02001Service: F02001Service,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    let url1 = 'f04/f04003action0'
    let LeveJson: any = {};
    this.f04003Service.Set(url1, LeveJson).subscribe(data => {
      console.log(data)
      for (const jsonObj of data.rspBody[0]) {
        const id = jsonObj['ROLE_LEVEL'];
        const name = jsonObj['ROLE_LEVEL_DESC'];
        this.LevelCode.push({ value: id, viewValue: id + '-' + name })
      }
      for (const jsonObj of data.rspBody[1]) {
        const id = jsonObj['CODE_NO'];
        this.cust_FLAG.push({ value: id, viewValue: id })
      }
    })
    this.personnel = '';
    this.cust_FLAG.push({ value: '', viewValue: '請選擇' })
    this.prodList.push({ value: '', viewValue: '請選擇' });
    this.prodList.push({ value: 'I', viewValue: '分期型' });
    this.prodList.push({ value: 'R', viewValue: '循環型' });
    this.bo = false;
  }
  LevelCode: any[] = [];
  setDataSource: readonly Data[] = [];
  Level: string = ''//層級
  personnelCode: sysCode[] = [];;
  personnel: string = ''//人員
  chkArray: any[] = [];
  checkboxArray: checkBox[] = [];
  assignArray: assign[] = [];
  i = 0;
  isAllCheck: boolean = false;
  Transfer: string = '';//轉件
  TransferCode: sysCode[] = [];
  prodList: sysCode[] = [];//產品類型
  pord: string = '';
  // s:string = '';
  total = 1;
  pageSize = 20;
  locknumber: boolean = false;
  bo: boolean //判斷第二層是否顯示
  pageIndex = 1;
  newData: any[] = [];
  newsetDataSource: any;
  onesetDataSource: any[] = [];
  cust_FLAG: sysCode[] = []; //客群標籤
  cust_FLAG_Value: string = '';//客群標籤值
  sortArry = ['ascend', 'descend']
  order: string;
  sor: string;
  h:boolean =false;

  Dispatch()//搜尋派件人員是否有產品類別
  {
    this.Transfer = '';
    this.i = 0;
    this.personnel = '';
    this.pord = '';
    this.bo = false;
    this.newData = [];
    this.personnelCode = [];
    let LevelJson: any = {};
    let url = 'f04/f04003action1'
    LevelJson['level'] = this.Level;
    this.f04003Service.Set(url, LevelJson).subscribe(data => {
      this.personnelCode.push({ value: '', viewValue: '請選擇' })
      if (data.rspMsg == "open") {
        this.personnelCode.push({ value: '', viewValue: '請選擇' })
        this.bo = true;
      }
      else if (data.rspMsg != "該層級查無人員") {
        this.pord = '';
        for (const jsonObj of data.rspBody) {
          const id = jsonObj['EMP_NO'];
          const name = jsonObj['EMP_NAME'];
          this.personnelCode.push({ value: id, viewValue: id + name })
        }
      }
      else {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        })
        this.bo = false;
      }

    })
  }

  Dispatch2()//產品類別搜尋員編
  {
    this.Transfer = '';
    this.i = 0;
    let url = 'f04/f04003action1'
    this.personnelCode = [];
    this.personnel = '';
    this.newData = [];
    let LevelJson: any = {};
    LevelJson['level'] = this.Level;
    LevelJson['type'] = this.pord;
    this.f04003Service.Set(url, LevelJson).subscribe(data => {
      this.personnelCode.push({ value: '', viewValue: '請選擇' })
      if (data.rspMsg != "該層級查無人員") {
        for (const jsonObj of data.rspBody) {
          const id = jsonObj['EMP_NO'];
          const name = jsonObj['EMP_NAME'];
          this.personnelCode.push({ value: id, viewValue: id + name })
        }
      }
      else {
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: data.rspMsg }
        })
      }

    })
  }
  test()
  {
    console.log(this.bo)
    console.log(this.prodList)
  }
  //查詢
  Search() {
    this.checkboxArray = [];
    this.setDataSource = [];
    this.TransferCode = [];
    this.onesetDataSource = [];
    this.newData = [];
    this.Transfer = '';
    this.total = 1;
    this.locknumber = false;
    this.pageSize = 20;
    this.pageIndex = 1;
    this.h = true;
    this.Inquire(this.pageIndex, this.pageSize)
  }

  Inquire(pageIndex: number, pageSize: number)//查詢
  {
    this.isAllCheck = false;
    if (this.Level != '')
    {
      if(this.bo)
      {
        if(this.pord!='')
        {
          this.i = 0;
          let url = 'f04/f04003action2'
          let personnelJson: any = {};
          personnelJson['level'] = this.Level;
          personnelJson['empNo'] = this.personnel;
          personnelJson['custTag'] = this.cust_FLAG_Value;
          personnelJson['pageIndex'] = pageIndex;
          personnelJson['pageSize'] = pageSize;
          if (this.pord != '') {
            personnelJson['type'] = this.pord;
          }
          this.f04003Service.Set(url, personnelJson).subscribe(data => {
            this.total = data.rspBody.totalPage;
            if (data.rspBody.empList.length > 0) {
              for (const obj of data.rspBody.empList) {
                const id = obj['EMP_NO'];
                const name = obj['EMP_NAME'];
                this.TransferCode.push({ value: id, viewValue: id + name })
              }
            }

            if (data.rspBody.dataList.length > 0) {
              this.setDataSource = data.rspBody.dataList;
              for (const jsonObj of data.rspBody.dataList) {
                const id = jsonObj['empNo'];
                const member = jsonObj['F_WobNum'];
                this.newsetDataSource = { bool: false, rid: jsonObj.F_WobNum, empName: this.convert(jsonObj.empNo),custTag:jsonObj.custTag,swcApplno: jsonObj.swcApplno, swcNationalId: jsonObj.swcNationalId, empNo: jsonObj.empNo, swcCompany: jsonObj.swcCompany, swcName: jsonObj.swcName }
                this.onesetDataSource.push(this.newsetDataSource)

                this.checkboxArray.push({ value: member, completed: false, empNo: id })
              }
              this.newData = this.f02001Service.getTableDate(pageIndex, this.pageSize, this.onesetDataSource);
              this.i = 1;
              this.h=false;
            }
            else {
              this.dialog.open(ConfirmComponent, {
                data: { msgStr: "查無案件" }
              });
              this.h=false;
            }
          })
        }
        else
        {
          this.dialog.open(ConfirmComponent, {
            data: { msgStr: "請選擇產品名稱" }
          });
          this.h=false;
        }
      }
      else
      {
        this.i = 0;
        let url = 'f04/f04003action2'
        let personnelJson: any = {};
        personnelJson['level'] = this.Level;
        personnelJson['empNo'] = this.personnel;
        personnelJson['custTag'] = this.cust_FLAG_Value;
        personnelJson['pageIndex'] = pageIndex;
        personnelJson['pageSize'] = pageSize;
        if (this.pord != '') {
          personnelJson['type'] = this.pord;
        }
        this.f04003Service.Set(url, personnelJson).subscribe(data => {
          this.total = data.rspBody.totalPage;
          if (data.rspBody.empList.length > 0) {
            for (const obj of data.rspBody.empList) {
              const id = obj['EMP_NO'];
              const name = obj['EMP_NAME'];
              this.TransferCode.push({ value: id, viewValue: id + name })
            }
          }

          if (data.rspBody.dataList.length > 0) {
            this.setDataSource = data.rspBody.dataList;
            for (const jsonObj of data.rspBody.dataList) {
              const id = jsonObj['empNo'];
              const member = jsonObj['F_WobNum'];
              this.newsetDataSource = { bool: false, rid: jsonObj.F_WobNum, empName:this.convert(jsonObj.empNo),custTag:jsonObj.custTag, swcApplno: jsonObj.swcApplno, swcNationalId: jsonObj.swcNationalId, empNo: jsonObj.empNo, swcCompany: jsonObj.swcCompany, swcName: jsonObj.swcName }
              this.onesetDataSource.push(this.newsetDataSource)

              this.checkboxArray.push({ value: member, completed: false, empNo: id })
            }
            this.newData = this.f02001Service.getTableDate(pageIndex, this.pageSize, this.onesetDataSource);
            this.i = 1;
            this.h=false;
          }
          else {
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: "查無案件" }
            });
            this.h=false;

          }
        })
      }

    }
    else {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請選擇派件層級" }
      });
      this.h=false;
    }

  }

  setAll(completed: boolean) //全選
  {
    this.chkArray = [];
    // if (this.Transfer == '') {
    //   this.isAllCheck = false;
    //   this.dialog.open(
    //     ConfirmComponent, {
    //     data: { msgStr: "請選擇轉件人員" }
    //   });

    // }
    if (completed == true) {
      for (const obj of this.newData) {
        if (this.Transfer != obj.empNo) {
          this.chkArray.push(obj.swcApplno)
          obj.bool = completed;
        }
      }
    }
    else {
      for (const i of this.newData) {
        this.chkArray.splice(this.chkArray.indexOf(i.swcApplno), 1)
        i.bool = false;

      }

    }
  }
  change()//轉件
  {
    if (this.Transfer == '') {
      this.dialog.open(ConfirmComponent, {
        data: { msgStr: "請填轉件人員" }
      });
    }
    else {
      for (const obj of this.chkArray) {
        for (const jsonObj of this.setDataSource) {
          if (obj == jsonObj.swcApplno) {
            this.assignArray.push({
              F_WobNum: jsonObj['F_WobNum'],
              swcApplno: jsonObj['swcApplno'],
              empNo: jsonObj['empNo'],
              swcNationalId: jsonObj['swcNationalId']
            })

          }
        }
      }

      if (this.assignArray.length > 0) {
        let url = 'f04/f04003action3'
        let changeJson: any = {};
        changeJson['level'] = this.Level;
        changeJson['roleNo'] = this.Transfer;
        changeJson['assign'] = this.assignArray;
        if (this.pord != '') {
          changeJson['type'] = this.pord;
        }
        this.f04003Service.Set(url, changeJson).subscribe(data => {
          if (data.rspCode == '0000') {
            this.Search();
            this.assignArray = []
            // this.s="轉件成功";
            this.chkArray = [];
            this.dialog.open(ConfirmComponent, {
              data: { msgStr: data.rspMsg }
            });
          }

        })
      }
      else {
        this.dialog.open(ConfirmComponent, {
          data: { msgStr: "請勾選案件" }
        });
      }
    }
  }
  Select() {
    // for(const o of this.newData)
    for (const obj of this.newData) {
      if (obj.empNo == this.Transfer) {
        this.locknumber = true;
      } else {
        this.locknumber = false;
      }
      obj.completed = false;
      this.isAllCheck = false;
      this.chkArray.splice(this.chkArray.indexOf(obj.swcApplno), 1)
      obj.bool = false;


    }
  }
  lock() {

  }

  sortChange(e: string, param: string) {
    if (e === 'ascend') {
      this.order = param;
      this.sor = 'DESC';
    }
    else {
      this.order = param;
      this.sor = '';
    }
    switch (param)
    {
      case "empNo":
        this.onesetDataSource = e === 'ascend' ? this.onesetDataSource.sort((a, b) => a.empNo.localeCompare(b.empNo))
          : this.onesetDataSource.sort((a, b) => b.empNo.localeCompare(a.empNo));
        this.newData = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.onesetDataSource);
        break;
        case "empName":
        this.onesetDataSource = e === 'ascend' ? this.onesetDataSource.sort((a, b) => a.empName.localeCompare(b.empName))
          : this.onesetDataSource.sort((a, b) => b.empName.localeCompare(a.empName));
        this.newData = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.onesetDataSource);
        break;
        case "custTag":
        this.onesetDataSource = e === 'ascend' ? this.onesetDataSource.sort((a, b) => a.custTag.localeCompare(b.custTag))
          : this.onesetDataSource.sort((a, b) => b.custTag.localeCompare(a.custTag));
        this.newData = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.onesetDataSource);
        break;
        case "swcApplno":
        this.onesetDataSource = e === 'ascend' ? this.onesetDataSource.sort((a, b) => a.swcApplno.localeCompare(b.swcApplno))
          : this.onesetDataSource.sort((a, b) => b.swcApplno.localeCompare(a.swcApplno));
        this.newData = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.onesetDataSource);
        break;
        case "swcCompany":
        this.onesetDataSource = e === 'ascend' ? this.onesetDataSource.sort((a, b) => a.swcCompany.localeCompare(b.swcCompany))
          : this.onesetDataSource.sort((a, b) => b.swcCompany.localeCompare(a.swcCompany));
        this.newData = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.onesetDataSource);
        break;
      // case "APPLYEND_TIME":
      //   if (e === 'ascend') {
      //     this.order = param;
      //     this.sor = 'DESC';
      //   }
      //   else {
      //     this.order = param;
      //     this.sor = '';
      //   }
      //   this.resultData = e === 'ascend' ? this.resultData.sort((a, b) => a.APPLYEND_TIME.localeCompare(b.APPLYEND_TIME))
      //     : this.resultData.sort((a, b) => b.APPLYEND_TIME.localeCompare(a.APPLYEND_TIME));
      //   this.newData = this.f02001Service.getTableDate(this.pageIndex, this.pageSize, this.resultData);
      //   break;
    }
  }
  // //Level轉換 代碼 + 中文
  // changeLevel(level: string) {
  //   if (level == 'L4') {
  //     return "L4 文審"
  //   } else if (level == 'L2') {
  //     return "L2 授信"
  //   } else if (level == 'L3') {
  //     return "L3 徵信"
  //   } else if (level == 'L1') {
  //     return "L1 授信覆核"
  //   } else if (level == 'L0') {
  //     return "L0 主管"
  //   } else if (level == 'D2') {
  //     return "D2 產生合約前回查"
  //   } else if (level == 'D1') {
  //     return "D1 產生合約前覆核"
  //   } else if (level == 'S2') {
  //     return "S2 風管處處長"
  //   } else if (level == 'S1') {
  //     return "S1 總經理"
  //   }
  // }
  //分頁
  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.i > 0) {
      this.chkArray = [];
      this.isAllCheck = false;
      const { pageIndex } = params;

      this.pageIndex = pageIndex;
      for (const obj of this.newData) {
        if (this.Transfer != obj.empNo) {
          obj.bool = false;
        }
      }
      this.newData = this.f02001Service.getTableDate(pageIndex, this.pageSize, this.onesetDataSource);
    }
  }

  //checkbox勾選
  addchkArray(check: boolean, applno: string) {


    if (this.Transfer == '') {
      this.isAllCheck = false;
      this.dialog.open(
        ConfirmComponent, {
        data: { msgStr: "請選擇轉件人員" }
      });
      return;
    }

    if (check) {
      this.chkArray.push(applno)
    }
    else {
      this.chkArray.splice(this.chkArray.indexOf(applno), 1)
    }

  }

  convert(i:string)//員編轉換姓名
  {
    for(var k of this.personnelCode)
    {
      if(i==k.value)
      {
        return k.viewValue
      }
    }
    return
  }
}
