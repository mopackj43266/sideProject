import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-childbwscn13show',
  templateUrl: './childbwscn13show.component.html',
  styleUrls: ['./childbwscn13show.component.css']
})
export class Childbwscn13showComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<Childbwscn13showComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
