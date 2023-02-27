import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-f03015confirm',
  templateUrl: './f03015confirm.component.html',
  styleUrls: ['./f03015confirm.component.css']
})
export class F03015confirmComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<F03015confirmComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
