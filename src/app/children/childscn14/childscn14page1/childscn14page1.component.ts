import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Childscn14Service } from '../childscn14.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChildrenService } from '../../children.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-childscn14page1',
  templateUrl: './childscn14page1.component.html',
  styleUrls: ['./childscn14page1.component.css', '../../../../assets/css/child.css']
})
export class Childscn14page1Component implements OnInit {

  constructor(public dialogRef: MatDialogRef<Childscn14page1Component>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
