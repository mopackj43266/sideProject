import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F03015Service } from '../f03015.service';

@Component({
  selector: 'app-f03015upload',
  templateUrl: './f03015upload.component.html',
  styleUrls: ['./f03015upload.component.css','../../../assets/css/f03.css']
})
export class F03015uploadComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<F03015uploadComponent>,private fb: FormBuilder, private f03015Service: F03015Service, public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any) { }
  isExcelFile: boolean;
  fileToUpload: File | null = null;
  ngOnInit(): void {
  }

  uploadForm: FormGroup = this.fb.group({
    ERROR_MESSAGE: [this.data.errorMessage]
  });

  public async confirmAdd(): Promise<void> {
    let hasErrorMsg = this.uploadForm.value.ERROR_MESSAGE != null && this.uploadForm.value.ERROR_MESSAGE != '';
    if(!hasErrorMsg) {
      const formdata: FormData = new FormData();
      formdata.append('file', this.fileToUpload);
      let baseUrl = 'f03/f03015action4';
      this.f03015Service.uploadExcel(baseUrl, this.fileToUpload).subscribe(data => {
        this.uploadForm.patchValue({ ERROR_MESSAGE: data.rspMsg });
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
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
      this.uploadForm.patchValue({ ERROR_MESSAGE: "非excel檔，請檢查檔案格式重新上傳" });
    }
  }
}
