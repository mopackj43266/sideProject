import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BaseService } from 'src/app/base.service';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { Childscn13Service } from '../childscn13.service';

@Component({
  selector: 'app-childscn13edit',
  templateUrl: './childscn13edit.component.html',
  styleUrls: ['./childscn13edit.component.css','../../../../assets/css/child.css']
})
export class Childscn13editComponent implements OnInit {

  accept: string = "image/*";
  fileControl: FormControl;
  public files: any;
  maxSize: number = 16;
  imageSrc: string;
  rowId: string;
  msg: string = "";
  applno: string;

  constructor(public dialogRef: MatDialogRef<Childscn13editComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public childscn13Service: Childscn13Service, public dialog: MatDialog) {
    this.fileControl = new FormControl(this.files, [
      Validators.required,
      MaxSizeValidator(this.maxSize * 1024)
    ])
  }

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.rowId = this.data.rowId;
    this.imageSrc = 'data:image/png;base64,' + this.data.base64;
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
    this.data.webAddrUrl = this.data.webAddrValue.split(',')[1];
  }

  onAddImage(event: any) {
    if (this.files != null) {
      var mimeType = this.files.type;
      if (mimeType.match(/(.jpg|.jpeg|.png|.JPG|.JPEG|.PNG)/) == null) {
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
    let msgStr: string = "";
    let codeStr: string = "";
    const formdata = new FormData();
    const baseUrl = 'f01/childscn13action2';
    if (this.files != null) {
      var mimeType = this.files.type;
      if (mimeType.match(/(.jpg|.jpeg|.png|.JPG|.JPEG|.PNG)/) == null) {
        this.msg = "檔案非圖片類型!";
        return;
      } else {
        formdata.append('applno', this.applno);
        formdata.append('web', this.data.webAddrValue.split(',')[0]);
        formdata.append('webAddr', this.data.webAddrUrl);
        formdata.append('messageContent', this.data.webInfoContent);
        formdata.append('empno',BaseService.userId);
        formdata.append('rowid', this.data.rowId);
        formdata.append('file', this.files);
        formdata.append('userId',BaseService.userId );
      }
    } else {
      formdata.append('applno', this.applno);
      formdata.append('web', this.data.webAddrValue.split(',')[0]);
      formdata.append('webAddr', this.data.webAddrUrl);
      formdata.append('messageContent', this.data.webInfoContent);
      formdata.append('empno', BaseService.userId);
      formdata.append('rowid', this.rowId);
      formdata.append('userId',BaseService.userId );
    }

    await this.childscn13Service.childscn13Action(baseUrl, formdata).then((data: any) => {
      codeStr = data.rspCode;
      msgStr = data.rspMsg;
    });

    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msgStr }
    });

    if (msgStr === '修改成功' && codeStr === '0000') { this.dialogRef.close({ event: 'success' }); }
  }

    //關閉
    onNoClick(): void {
      this.dialogRef.close();
    }

}
