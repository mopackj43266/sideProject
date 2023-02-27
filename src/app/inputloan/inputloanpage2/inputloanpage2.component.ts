import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inputloanpage2',
  templateUrl: './inputloanpage2.component.html',
  styleUrls: ['./inputloanpage2.component.css', '../../../assets/css/child.css']
})
export class Inputloanpage2Component implements OnInit {

  constructor() { }

  first: boolean = true;
  ngOnInit(): void {
  }

  edit() {
    this.first = !this.first;
  }
}
