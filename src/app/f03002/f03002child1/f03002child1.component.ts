import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
interface COMB {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-f03002child1',
  templateUrl: './f03002child1.component.html',
  styleUrls: ['./f03002child1.component.css', '../../../assets/css/f03.css']
})
export class F03002child1Component implements OnInit {

  busTypeCode: COMB[] = [{ value: 'A', viewValue: '小額信貸' }, { value: 'B', viewValue: '撥貸' }];

  constructor(private fb: FormBuilder) { }

  inseetProject: FormGroup = this.fb.group({
    busType: ['', [Validators.required]],
    prjCode: ['', [Validators.required]]
  });

  ngOnInit(): void {
  }

  formControl = new FormControl('', [
    Validators.required
  ]);
}
