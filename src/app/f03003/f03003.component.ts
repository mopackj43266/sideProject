import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { OptionsCode } from '../interface/base';
import { F03003Service } from './f03003.service';

interface productImfor {
  name: string;
  code: string;
  check: boolean;

}

@Component({
  selector: 'app-f03003',
  templateUrl: './f03003.component.html',
  styleUrls: ['./f03003.component.css', '../../assets/css/f03.css']
})
export class F03003Component implements OnInit {

  selectedValue: string;
  sysCode: OptionsCode[] = [{ value: 'Staging', viewValue: '分期型信貸' }, { value: 'Cyclic', viewValue: '循環型信貸' }];
  backgroundSearch: productImfor[] = [
    { name: "黑名單查詢", code: "BLACKSEARCH", check: false },
    { name: "歷史資料", code: "HISTORY", check: false },
    { name: "利害人查詢", code: "STAKEHOLDER", check: false },
    { name: "AML查詢", code: "AML", check: false },
    { name: "JCIC查詢", code: "JCIC", check: false }
  ];

  backgroundClass: productImfor[] = [
    { name: "資料加工", code: "PROCESS", check: false },
    { name: "信用評等", code: "RATING", check: false },
    { name: "條件比對", code: "COMPARISON", check: false },
    { name: "徵信分派案", code: "ASSIGNMENT_CASE", check: false },
    { name: "審核分派案", code: "REVIEW_ASSIGNMENT", check: false }
  ];

  persons: productImfor[] = [
    { name: "徵信", code: "CREDIT", check: false },
    { name: "審核", code: "AUDIT_NOR", check: false },
    { name: "審核主管", code: "AUDIT_SUP", check: false }
  ];

  constructor(private f03003Service: F03003Service, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  async changeSelect() {
    // const baseUrl = 'productSetting?name=' + this.selectedValue;
    // this.f03003Service.getLine(baseUrl).subscribe(data => {
    //   for (let i = 0; i < this.backgroundSearch.length; i++) { this.backgroundSearch[i].check = false; }
    //   for (let i = 0; i < this.backgroundClass.length; i++) { this.backgroundClass[i].check = false; }
    //   for (let i = 0; i < this.persons.length; i++) { this.persons[i].check = false; }
    //   if (data.items[0].BLACKSEARCH == "Y") { this.backgroundSearch[0].check = true };
    //   if (data.items[0].HISTORY == "Y") { this.backgroundSearch[1].check = true };
    //   if (data.items[0].STAKEHOLDER == "Y") { this.backgroundSearch[2].check = true };
    //   if (data.items[0].AML == "Y") { this.backgroundSearch[3].check = true };
    //   if (data.items[0].JCIC == "Y") { this.backgroundSearch[4].check = true };
    //   if (data.items[0].PROCESS == "Y") { this.backgroundClass[0].check = true };
    //   if (data.items[0].RATING == "Y") { this.backgroundClass[1].check = true };
    //   if (data.items[0].COMPARISON == "Y") { this.backgroundClass[2].check = true };
    //   if (data.items[0].ASSIGNMENT_CASE == "Y") { this.backgroundClass[3].check = true };
    //   if (data.items[0].REVIEW_ASSIGNMENT == "Y") { this.backgroundClass[4].check = true };
    //   if (data.items[0].CREDIT == "Y") { this.persons[0].check = true };
    //   if (data.items[0].AUDIT_NOR == "Y") { this.persons[1].check = true };
    //   if (data.items[0].AUDIT_SUP == "Y") { this.persons[2].check = true };
    // });

    const baseUrl = 'f03/f03003?name=' + this.selectedValue;
    this.f03003Service.getLine(baseUrl).subscribe(data => {
      for (let i = 0; i < this.backgroundSearch.length; i++) { this.backgroundSearch[i].check = false; }
      for (let i = 0; i < this.backgroundClass.length; i++) { this.backgroundClass[i].check = false; }
      for (let i = 0; i < this.persons.length; i++) { this.persons[i].check = false; }
      if (data.rspBody[0].blacksearch == "Y") { this.backgroundSearch[0].check = true };
      if (data.rspBody[0].history == "Y") { this.backgroundSearch[1].check = true };
      if (data.rspBody[0].stakeholder == "Y") { this.backgroundSearch[2].check = true };
      if (data.rspBody[0].aml == "Y") { this.backgroundSearch[3].check = true };
      if (data.rspBody[0].jcic == "Y") { this.backgroundSearch[4].check = true };
      if (data.rspBody[0].process == "Y") { this.backgroundClass[0].check = true };
      if (data.rspBody[0].rating == "Y") { this.backgroundClass[1].check = true };
      if (data.rspBody[0].comparison == "Y") { this.backgroundClass[2].check = true };
      if (data.rspBody[0].assignmentCase == "Y") { this.backgroundClass[3].check = true };
      if (data.rspBody[0].reviewAssignment == "Y") { this.backgroundClass[4].check = true };
      if (data.rspBody[0].credit == "Y") { this.persons[0].check = true };
      if (data.rspBody[0].auditNor == "Y") { this.persons[1].check = true };
      if (data.rspBody[0].auditSup == "Y") { this.persons[2].check = true };
    });
  }

  save() {
    var valArrayY: string[] = new Array;
    var valArrayN: string[] = new Array;
    for (const obj of this.backgroundSearch) {
      if (obj.check) { valArrayY.push(obj.code); } else { valArrayN.push(obj.code);}
    }
    for (const obj of this.backgroundClass) {
      if (obj.check) { valArrayY.push(obj.code); } else { valArrayN.push(obj.code);}
    }
    for (const obj of this.persons) {
      if (obj.check) { valArrayY.push(obj.code); } else { valArrayN.push(obj.code);}
    }
    const formData: FormData = new FormData();
    formData.append("name", this.selectedValue);
    formData.append("setY", valArrayY.toString());
    formData.append("setN", valArrayN.toString());
    const baseUrl = 'f03/f03003action1';
    this.f03003Service.setProduct(baseUrl, formData).subscribe(data => {
      const childernDialogRef = this.dialog.open(ConfirmComponent, {
        data: { msgStr: data.rspMsg }
      });
    });
  }
}
