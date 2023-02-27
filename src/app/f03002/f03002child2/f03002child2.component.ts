import { Component, OnInit } from '@angular/core';
import { F03002child201Component } from './f03002child201/f03002child201.component';
import { F03002child202Component } from './f03002child202/f03002child202.component';
import { F03002child203Component } from './f03002child203/f03002child203.component';

@Component({
  selector: 'app-f03002child2',
  templateUrl: './f03002child2.component.html',
  styleUrls: ['./f03002child2.component.css', '../../../assets/css/f03.css']
})
export class F03002child2Component implements OnInit {

  chooseForm!: string;
  mapping = new Map<string, any>(
    [
      ['A', F03002child201Component],
      ['B', F03002child202Component],
      ['C', F03002child203Component]
    ]
  );

  constructor() { }

  ngOnInit(): void {
    this.chooseForm = 'A';
  }

  insert(choose: string) {
    this.chooseForm = choose;
  }
}
