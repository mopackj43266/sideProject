import { F01011Service } from './f01011.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-f01011',
  templateUrl: './f01011.component.html',
  styleUrls: ['./f01011.component.css', '../../assets/css/f01.css']
})
export class F01011Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private f01011Service: F01011Service,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  uploadForm: FormGroup = this.fb.group({
    ERROR_MESSAGE: [this.data.errorMessage]
  });

  isExcelFile: boolean;
  fileToUpload: File | null = null;

  empNo: string;
  JsonBool = false;
  ExcelSource: any;

  block: boolean = false;

  ngOnInit(): void {
    this.empNo = BaseService.userId;
  }

  public async confirmAdd(): Promise<void> {

    if (this.fileToUpload == null) {
      this.uploadForm.patchValue({ ERROR_MESSAGE: "請上傳正確檔案!!" });
    } else {
      const formdata: FormData = new FormData();
      formdata.append('file', this.fileToUpload);
      let msgStr: string = "";
      let baseUrl = 'f01/f01011action1';
      this.block = true;
      this.f01011Service.uploadExcel(baseUrl, this.fileToUpload, this.empNo).subscribe(data => {
        let msg = "";
        let errorMsg = "";
        if (data.rspCode == "C1001" || data.rspCode == "C1002") {
          msg = data.rspMsg;
        } else {
          if (data.rspBody.length > 0) {
            msg = "\n 錯誤清單：\n";
            for (let i = 0; i < data.rspBody.length; i++) {
              errorMsg += "第" + data.rspBody[i].index + "筆,身分證字號：" + data.rspBody[i].nationalId + ",客戶ID：" + data.rspBody[i].custId + " 匯入失敗, 錯誤訊息：" + data.rspBody[i].errorMsg + "\n";
            }
            msg = msg + errorMsg;
          } else {
            msg = data.rspMsg;
          }
        }
        this.block = false;
        this.uploadForm.patchValue({ ERROR_MESSAGE: msg });
      });
    }
  }

  //檢查上傳檔案格式
  onChange(evt) {
    this.uploadForm.patchValue({ ERROR_MESSAGE: '' });
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if (this.isExcelFile) {
      this.fileToUpload = target.files.item(0);
    } else {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: "非excel檔，請檢查檔案格式重新上傳" }
      });
    }
  }
}
