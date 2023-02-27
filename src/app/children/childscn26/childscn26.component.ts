import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-childscn26',
  templateUrl: './childscn26.component.html',
  styleUrls: ['./childscn26.component.css', '../../../assets/css/f01.css']
})
export class Childscn26Component implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childscn26Component>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  confirm(value: string) {
    this.dialogRef.close({ value: value });
  }

  cancel(value: string) {
    this.dialogRef.close();
  }

}
