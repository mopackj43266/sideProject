import { logging } from 'protractor';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Childscn1Service } from '../../childscn1/childscn1.service';
import { Childscn6Service } from '../../childscn6/childscn6.service';
import { Childscn14Service } from '../childscn14.service';

interface sysCode {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-childscn14page3',
  templateUrl: './childscn14page3.component.html',
  styleUrls: ['./childscn14page3.component.css','../../../../assets/css/child.css']
})
export class Childscn14page3Component implements OnInit {
  imageTypeCode: sysCode[] = []; //文件類別下拉
  imageTypeValue: string;  //文件類別選擇

  constructor(
    public dialogRef: MatDialogRef<Childscn14page3Component>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private childscn14Service: Childscn14Service,
    private childscn1Service: Childscn1Service,
    private childscn6Service: Childscn6Service,
    ) { }
  fileToUpload: File | null = null;
  private applno: string;
  private cuId: string;
  private cuNm: string;
  isValidFile: boolean;
  word:string = '' ;
  p=50;
  ngOnInit(): void {

    this.word= this.childscn14Service.getWord();
    this.applno = sessionStorage.getItem('applno');
    this.cuId = sessionStorage.getItem('nationalId');
    if(this.word.length>0)
    {
      this.p = this.p - this.word.length - 2
    }



    this.childscn1Service.getSysTypeCode('DOC_TYPE').subscribe(data => {        //文件類型下拉選單
      for (const jsonObj of data.rspBody.mappingList) {
        const codeNo = jsonObj.codeNo;
        const desc = jsonObj.codeDesc;
        this.imageTypeCode.push({ value: codeNo, viewValue: desc })
      }
    });

    const baseUrl = 'f01/childscn6action2';
    let jsonObject: any = {};
    this.childscn6Service.getDate(baseUrl, jsonObject).subscribe(data => {
      this.cuId = data.rspBody[0].empNo;
      this.cuNm = data.rspBody[0].empName;
    });

  }
  uploadForm: FormGroup = this.fb.group({
    DOC_ID: [this.data.DOC_ID, []],
    REMARK: [this.data.REMARK, []],
    ERROR_MESSAGE: []
  });

  public async upload(): Promise<void> {
    let docId = this.uploadForm.value.DOC_ID;
    if (docId != "" && docId != null) {
      const formdata: FormData = new FormData();
      formdata.append('file', this.fileToUpload, this.fileToUpload.name);
      formdata.append('applno', this.applno);
      formdata.append('cuId', this.cuId);
      formdata.append('cuNm', this.cuNm);
      if(this.word!='')
      {
        formdata.append('remark', this.uploadForm.value.REMARK+"("+this.word+")");
      }
      else
      {
        formdata.append('remark', this.uploadForm.value.REMARK);
      }
      formdata.append('docId', this.uploadForm.value.DOC_ID);


      let baseUrl = 'f01/childscn14action2';

      this.childscn14Service.childscn14Action2(baseUrl, formdata).then((data: any) => {
        if (data.rspMsg != '文件上傳成功')
        {
        this.uploadForm.patchValue({ ERROR_MESSAGE: data.rspMsg });
        alert(data.rspMsg);
        } else {
          alert(data.rspMsg);
          this.dialogRef.close({ event: 'success' });
        }
      });

    } else {
      alert("請選擇文件類型");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  //檢查上傳檔案格式
  onChange(evt) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isValidFile = !!target.files[0].name.match(/(.jpg|.jpeg|.png|.JPG|.JPEG|.PNG|.xls|.xlsx|.doc|.docx|.XLS|.DOC|.DOCX|.PDF|.pdf|.txt|.TXT)/);
    if (this.isValidFile) {
      this.fileToUpload = target.files.item(0);
    } else {
      this.uploadForm.patchValue({ ERROR_MESSAGE: "非合法圖檔，請檢查檔案格式重新上傳" });
      alert(this.uploadForm.value.ERROR_MESSAGE);
    }
  }
}
