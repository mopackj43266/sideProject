import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childbwscn13Service } from '../childbwscn13.service';

@Component({
  selector: 'app-childbwscn13add',
  templateUrl: './childbwscn13add.component.html',
  styleUrls: ['./childbwscn13add.component.css', '../../../../assets/css/child.css']
})
export class Childbwscn13addComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childbwscn13addComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public childbwscn13Service: Childbwscn13Service,
    public dialog: MatDialog
  ) {
    this.fileControl = new FormControl(this.files, [
      Validators.required,
      MaxSizeValidator(this.maxSize * 1024)
    ])
  }

  accept: string = "image/*";
  fileControl: FormControl;
  public files: any;
  maxSize: number = 16;
  imageSrc: string;
  webAddrValue: string;
  webAddrUrl: string;
  webInfoContent: string;
  msg: string = "";

  ngOnInit(): void {
    this.fileControl.valueChanges.subscribe((files: any) => {
      this.files = files;
    });
  }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填!' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  changeSelect() {
    sessionStorage.setItem('searchUserId', BaseService.userId);
    sessionStorage.setItem('searchEmpName', BaseService.empName);
    sessionStorage.setItem('searchEmpId', BaseService.empId);

    this.webAddrUrl = this.webAddrValue.split(',')[1];
    window.open(this.webAddrUrl, "_blank");

    sessionStorage.removeItem('searchUserId');
    sessionStorage.removeItem('searchEmpName');
    sessionStorage.removeItem('searchEmpId');
  }

  onAddImage(event: any) {
    if (this.files != null) {
      var mimeType = this.files.type;
      if (mimeType.match(/image\/*/) == null) {
        this.msg = "檔案非圖片類型!";
        this.imageSrc = '';
      } else {
        this.msg = '';
        const reader = new FileReader();
        reader.readAsDataURL(this.files);
        reader.onload = () => { this.imageSrc = reader.result as string; };
      }
    }
  }

  async uploadFile() {
    if (this.files != null) {
      var mimeType = this.files.type;
      if (mimeType.match(/image\/*/) == null) {
        this.msg = "檔案非圖片類型!";
      } else {
        const formdata = new FormData();
        formdata.append('applno', this.data.applno);
        formdata.append('web', this.webAddrValue.split(',')[0]);
        formdata.append('webAddr', this.webAddrUrl);
        formdata.append('messageContent', this.webInfoContent);
        formdata.append('empno', BaseService.userId);
        formdata.append('file', this.files);
        formdata.append('userId', BaseService.userId);
        const baseUrl = 'f01/childbwscn13action1';
        let msgStr: string = "";
        let codeStr: string = "";
        await this.childbwscn13Service.childbwscn13Action(baseUrl, formdata).then((data: any) => {
          codeStr = data.rspCode;
          msgStr = data.rspMsg;
        });
        const childernDialogRef = this.dialog.open(ConfirmComponent, {
          data: { msgStr: msgStr }
        });
        if (msgStr === '新增成功' && codeStr === '0000') { this.dialogRef.close({ event: 'success' }); }
      }
    } else {
      this.msg = '請至少選擇1個圖檔!';
    }
  }

  //關閉
  onNoClick(): void {
    this.dialogRef.close();
  }
}
