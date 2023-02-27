import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-f02008return2',
  templateUrl: './f02008return2.component.html',
  styleUrls: ['./f02008return2.component.css','../../../../assets/css/f02.css']
})
export class F02008return2Component implements OnInit {

  constructor(public dialogRef: MatDialogRef<F02008return2Component>,) { }

  ngOnInit(): void {
  }

  confirm(value: string)//確定
  {
    this.dialogRef.close({ value: value });
  }
  cancel(value: string)//離開
  {
    this.dialogRef.close({ value: value });
  }
}
