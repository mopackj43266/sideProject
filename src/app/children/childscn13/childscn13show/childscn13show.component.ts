import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-show',
  templateUrl: './childscn13show.component.html',
  styleUrls: ['./childscn13show.component.css']
})
export class Childscn13showComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<Childscn13showComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
