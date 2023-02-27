import { Component, OnInit } from '@angular/core';
import { Data } from '@angular/router';
import { Childbwscn5Service } from '../childbwscn5/childbwscn5.service';

// 貸後異常名單比對 Jay
@Component({
  selector: 'app-childbwscn5',
  templateUrl: './childbwscn5.component.html',
  styleUrls: ['./childbwscn5.component.css']
})
export class Childbwscn5Component implements OnInit {

  constructor(  private Childbwscn5Service: Childbwscn5Service,
    )
    {

  }
  applno: string;
  materialSource: readonly Data[] = [];
  total = 1;
  pageIndex = 1;
  pageSize= 50;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.set()
  }
  set()
  {
    let jsonObject: any = {}
    jsonObject['applno'] = this.applno
    this.Childbwscn5Service.getmaterial(jsonObject).subscribe(data=>{

      if(data.rspMsg == "success")
      {
        this.materialSource = data.rspBody
      }
    })

  }

}
