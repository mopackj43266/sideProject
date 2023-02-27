import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.css', '../../../assets/css/f01.css']
})
export class DeleteConfirmComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  confirm(value: string) {
    this.dialogRef.close({ value: value });
  }

  cancel(value: string) {
    this.dialogRef.close({ value: value });
  }

  close() {
    this.dialogRef.close();
  }
}
