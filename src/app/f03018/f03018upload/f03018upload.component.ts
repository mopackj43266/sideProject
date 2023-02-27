import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F03018Service } from '../f03018.service';

@Component({
  selector: 'app-f03018upload',
  templateUrl: './f03018upload.component.html',
  styleUrls: ['./f03018upload.component.css', '../../../assets/css/f03.css']
})
export class F03018uploadComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<F03018uploadComponent>,
    private fb: FormBuilder,
    private F03018Service: F03018Service,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  isExcelFile: boolean;
  fileToUpload: File | null = null;
  block: boolean = false;

  ngOnInit(): void {
  }

  uploadForm: FormGroup = this.fb.group({
    ERROR_MESSAGE: [this.data.errorMessage]
  });

   confirmAdd(): void {
    this.block = true;
    const formdata: FormData = new FormData();
    formdata.append('file', this.fileToUpload);
    let msgStr: string = "";
    let baseUrl = 'f03/f03018action2';
    // const childernDialogRef = this.dialog.open(ConfirmComponent, {
    //   data: { msgStr: "傳送" }
    // });
    // if (msgStr === '上傳成功!!') { this.dialogRef.close({ event: 'success' }); }

    this.F03018Service.uploadExcel(baseUrl, this.fileToUpload).subscribe(data => {

      this.uploadForm.patchValue({ ERROR_MESSAGE: data.rspMsg });
      this.block = false;
      // const childernDialogRef = this.dialog.open(ConfirmComponent, {
      //     data: { msgStr: data.msg }
      //   });
      // }, error => {
    });
  }

  onNoClick(): void {

    this.dialogRef.close({ event: 'success' });
  }

  submit() {
  }

  //檢查上傳檔案格式
  onChange(evt) {
    this.uploadForm.patchValue({ ERROR_MESSAGE: "" });
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
