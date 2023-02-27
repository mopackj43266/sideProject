import { Component, Inject, OnInit } from '@angular/core';
import { F03014Service } from '../f03014.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
interface sysCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f03014upload',
  templateUrl: './f03014upload.component.html',
  styleUrls: ['./f03014upload.component.css','../../../assets/css/f03.css']
})

export class F03014uploadComponent implements OnInit {
  constructor(private f03014Service: F03014Service,
    private fb: FormBuilder,
    public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<F03014uploadComponent>
    ) { }

  inputdata = []
  rspMsg: string;
  test: sysCode;
  jsonObject: any = {};
  Custlist: any = [];
  Filename:string;
  private formData = new FormData();
  isExcelFile: boolean;
  fileToUpload: File | null = null;
  ngOnInit(): void {
  }
  uploadForm: FormGroup = this.fb.group({
    ERROR_MESSAGE: [this.data.errorMessage]
  });
  // openup(files: FileList) {

  //   this.fileToUpload = files.item(0);

  //   // const formData = new FormData();
  //   this.rspMsg = '';
  //   this.Filename = this.fileToUpload.name
  //   this.formData.append('file',this.fileToUpload,this.fileToUpload.name)

  // }

  // seve()
  // {
  //   this.Filename = '';
  //   const url = 'f03/f03014action05'
  //   this.f03014Service.postExcel(url,this.formData).subscribe(data=>{
  //         this.rspMsg = data.rspMsg

  //       })

  // }
  public async confirmAdd(): Promise<void> {

    if(this.fileToUpload !=null)
    {
      const formdata: FormData = new FormData();
      formdata.append('file', this.fileToUpload);
      let msgStr: string = "";
      let baseUrl = 'f03/f03014action05';
      this.f03014Service.postExcel(baseUrl,this.fileToUpload).subscribe(data => {
        this.uploadForm.patchValue({ ERROR_MESSAGE: data.rspMsg });
      });
    }
    else
    {
      this.uploadForm.patchValue({ ERROR_MESSAGE:"上傳檔案不能空的"});
    }

  }
  //檢查上傳檔案格式
  onChange(evt) {
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
  onNoClick(): void {
    this.dialogRef.close({ event:'' });
  }


}
