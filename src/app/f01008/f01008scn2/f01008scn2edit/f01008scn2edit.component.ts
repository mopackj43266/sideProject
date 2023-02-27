import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { F01008Service } from '../../f01008.service';
@Component({
  selector: 'app-f01008scn2edit',
  templateUrl: './f01008scn2edit.component.html',
  styleUrls: ['./f01008scn2edit.component.css', '../../../../assets/css/f01.css']
})
export class F01008scn2editComponent implements OnInit {

  constructor(
    private f01008Service: F01008Service,
    public dialogRef: MatDialogRef<F01008scn2editComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  block: boolean = false;

  //欄位驗證
  formControl = new FormControl('', [
    Validators.required
  ]);

  //欄位驗證
  getErrorMessage() {
    return this.formControl.hasError('required') ? '此欄位必填' : '';
  }

  ngOnInit(): void {
  }
  save()//儲存
  {
    let jsonObject: any = {};
    let url = 'f01/f01008scn2action4';
    jsonObject['applno'] = this.data.applno;
    jsonObject['userId'] = this.data.empNo;
    jsonObject['creditaction'] = this.data.creditaction;
    jsonObject['creditlevel'] = 'D2';
    this.block = true;
    this.f01008Service.f01008scn2(jsonObject, url).subscribe(data => {
      if (data.rspCode === '0000' || data.rspMsg === '儲存成功')
      {
        this.block = false;
        this.dialogRef.close({ event: 'success' });
        // window.location.reload();

      }
    })
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
