import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChildrenService } from '../../children.service';
import { Childscn14Service } from '../childscn14.service';
interface dateCode {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-childscn14page2',
  templateUrl: './childscn14page2.component.html',
  styleUrls: ['./childscn14page2.component.css', '../../../../assets/css/child.css']
})
export class Childscn14page2Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private childscn14Service: Childscn14Service,
    public childService: ChildrenService
  ) { }

  private applno: string;
  private cuid: string;

  ngOnInit(): void {

  }

}
