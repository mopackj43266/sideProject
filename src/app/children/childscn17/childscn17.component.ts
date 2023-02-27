import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChildrenService } from '../children.service';
import { Childscn17Service } from './childscn17.service';

//20210929 alvin.lee 申覆資料檔

@Component({
  selector: 'app-childscn17',
  templateUrl: './childscn17.component.html',
  styleUrls: ['./childscn17.component.css']
})
export class Childscn17Component implements OnInit {
  applno: string;
  restartDataSource = [];
  constructor(
    public childService: ChildrenService,
    public childscn17Service: Childscn17Service) { }

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.getRestartList();
  }

  getRestartList() {
    this.childscn17Service.getRestartList(this.applno).subscribe(data => {
      if (Object.keys(data.rspBody.items).length > 0) {
        this.restartDataSource = data.rspBody.items;
      }
    });
  }
}
