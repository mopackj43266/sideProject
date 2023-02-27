import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-f06006-confirm',
  templateUrl: './f06006-confirm.component.html',
  styleUrls: ['./f06006-confirm.component.css','../../../assets/css/child.css']
})
export class F06006ConfirmComponent implements OnInit {

  title:string = this.data.i;
  constructor(
    public dialogRef: MatDialogRef<F06006ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }
  confirm(value: string) {
    this.dialogRef.close({ value: value });
  }

  cancel(value: string) {
    this.dialogRef.close({ value: value });
  }
}
