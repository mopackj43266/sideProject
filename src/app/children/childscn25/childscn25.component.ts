import { Component, OnInit } from '@angular/core';
import { Childscn25Service } from './childscn25.service';

@Component({
  selector: 'app-childscn25',
  templateUrl: './childscn25.component.html',
  styleUrls: ['./childscn25.component.css']
})
export class Childscn25Component implements OnInit {

  constructor(
    private childscn25Service: Childscn25Service,
  ) { }

  private applno: string;

  RPMSource: any;
  SRPSource: any;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.get();
  }

  private async get() {
    const baseUrl = 'f01/childscn25';
    this.childscn25Service.getRpmAndSrp(baseUrl, this.applno).subscribe(data => {
      this.RPMSource = data.rspBody.rpmList;//RPM資料
      this.SRPSource = data.rspBody.srpList;//SRP同一關係人
    });
  }
}
