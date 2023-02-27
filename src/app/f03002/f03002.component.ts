import { Component, OnInit } from '@angular/core';
import { F03002child1Component } from './f03002child1/f03002child1.component';
import { F03002child2Component } from './f03002child2/f03002child2.component';

@Component({
  selector: 'app-f03002',
  templateUrl: './f03002.component.html',
  styleUrls: ['./f03002.component.css', '../../assets/css/f03.css']
})
export class F03002Component implements OnInit {

  chooseForm!: string;
  mapping = new Map<string, any>(
    [
      ['A', F03002child1Component],
      ['B', F03002child2Component]
    ]
  );

  constructor() { }

  ngOnInit(): void {
    this.chooseForm = 'A';
  }

  async insert(choose: string) {
    this.chooseForm = choose;
  }
}
