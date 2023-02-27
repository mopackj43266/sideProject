import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface date {
  day: string;
  dayNumber: number;
  dis: boolean;
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})

export class DatePickerComponent implements OnInit {

  constructor(
    private pipe: DatePipe
  ) { }

  @Input() chooseDate: string;
  @Input() showDate: number[];
  @Output() chooseDateChange = new EventEmitter();
  firstMonthRange: date[] = [];
  secondMonthRange: date[] = [];
  month: number;
  year: number;

  ngOnInit(): void {
    let dateArray = this.chooseDate.split('/');
    this.year = Number(dateArray[0]);
    this.month = Number(dateArray[1]) - 1;
    this.calculateMonth((Number(dateArray[1]) - 1).toString(), true);
  }

  ngAfterContentInit(): void {
  }

  calculateMonth(mo: string, first?: boolean) {
    if (!first) {
      if (mo == "add") {
        this.month = this.month + 2;
      } else {
        this.month = this.month - 2;
      }
    }

    this.firstMonthRange = [];
    this.secondMonthRange = [];

    if (this.month > 11) {
      this.year = this.year + 1;
      this.month = this.month - 12;
    }

    if (this.month < 0) {
      this.year = this.year - 1;
      this.month = this.month + 12;
    }

    let number = 1;
    let firstDay = new Date(this.year, this.month, number);

    //第一個月
    for (let i = 0; i < firstDay.getDay(); i++) {
      this.firstMonthRange.push({
        day: "",
        dayNumber: i,
        dis: true
      });
    }

    while ((firstDay.getMonth()) == this.month) {
      this.firstMonthRange.push({
        day: this.pipe.transform(new Date(this.year, this.month, number), 'dd'),
        dayNumber: firstDay.getDay() == 0 ? 7 : firstDay.getDay(),
        dis: !(this.showDate.includes(new Date(this.pipe.transform(new Date(this.year, this.month, number), 'yyyy/MM/dd')).getTime()))
      });
      number = number + 1;
      firstDay = new Date(this.year, this.month, number);
    }

    if (this.month % 2 == 1) {
      if (this.month == 11) {
        this.year = this.year + 1;
        this.month = -1;
      }

      if (this.month == 0) {
        this.year = this.year - 1;
        this.month = 10;
      }
    }

    number = 1
    firstDay = new Date(this.year, this.month + 1, number);
    //第二個月
    for (let i = 0; i < firstDay.getDay(); i++) {
      this.secondMonthRange.push({
        day: "",
        dayNumber: i,
        dis: true
      });
    }

    while ((firstDay.getMonth()) == this.month + 1) {
      this.secondMonthRange.push({
        day: this.pipe.transform(new Date(this.year, this.month + 1, number), 'dd'),
        dayNumber: firstDay.getDay() == 0 ? 7 : firstDay.getDay(),
        dis: !(this.showDate.includes(new Date(this.pipe.transform(new Date(this.year, this.month + 1, number), 'yyyy/MM/dd')).getTime()))
      });
      number = number + 1;
      firstDay = new Date(this.year, this.month + 1, number);
    }
  }

  chooseDateFunction(value: string, month: number) {
    console.log("選擇日期:" + this.year + (month == 12 || month == 11 ? "" : "/0") + month + '/' + value);
    this.chooseDate = this.year + (month == 12 || month == 11 ? "" : "/0") + month + '/' + value;
    this.chooseDateChange.emit(this.chooseDate);
  }

  disColor(value: string, month: number): boolean {
    return (this.year + (month == 12 || month == 11 ? "" : "/0") + month + '/' + value) == this.chooseDate;
  }

}
