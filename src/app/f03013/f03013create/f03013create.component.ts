import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/common-lib/confirm/confirm.component';
import { F03013Service } from '../f03013.service';

@Component({
  selector: 'app-f03013create',
  templateUrl: './f03013create.component.html',
  styleUrls: ['./f03013create.component.css']
})
export class F03013createComponent implements OnInit {
  loading: boolean;
  confirm: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<F03013createComponent>,
    public dialog: MatDialog,
    private f03013Service: F03013Service
  ) { }

  ngOnInit(): void {
  }

  public async createCalendar(): Promise<void> {
    this.confirm = true;
    this.loading = true;
    let jsonObject: any = {};
    jsonObject['year'] = this.data.value;
    let msgStr: string = '';
    msgStr = await this.f03013Service.createCalendar(jsonObject);
    const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msgStr } });
    this.loading = false;
    setTimeout(() => {
      this.dialog.closeAll();
    },1500);
  }


  



  onNoClick() {
    this.dialogRef.close();
  }
}
