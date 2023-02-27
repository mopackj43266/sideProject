import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { JCICCode } from 'src/app/interface/base';
import { MenuListService } from 'src/app/menu-list/menu-list.service';
// import { ChildrenService } from '../../children.service';
import { F01008scn3Service } from '../f01008scn3.service';
@Component({
  selector: 'app-f01008scn3page1',
  templateUrl: './f01008scn3page1.component.html',
  styleUrls: ['./f01008scn3page1.component.css', '../../../../assets/css/child.css']
})
export class F01008scn3page1Component implements OnInit, AfterViewInit {

  constructor(
    private childscn6Service: F01008scn3Service,
    private router: Router,
    private pipe: DatePipe,
    private menuListService: MenuListService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getJcicList()
        this.getJcicMultiple();
        this.setBooleanFalse();
        this.list = [];

        // when onSameUrlNavigation: 'reload'，會重新觸發 router event
      }
    });
  }
  AAS003: any[] = [];
  JAS002: any[] = [];
  APS001: any[] = [];
  ACI001: any[] = [];
  BAI001: any[] = [];
  KRI001: any[] = [];
  BAI004: any[] = [];
  KRI002: any[] = [];
  BAS008: any[] = [];
  BAS006: any[] = [];
  STS007: any[] = [];

  list: any[] = [];

  hideJCIC = true;
  hideAll = false;
  hideJCICMASTER = false;
  hideBAM061 = false;
  hideKRM043 = false;
  hideBAM062 = false;

  hideBAM032 = false;
  hideBAM033 = false;
  hideBAM034 = false;
  hideBAS010 = false;

  hideSTM022 = false;
  hideSTM008 = false;
  hideSTM025 = false;
  hideBAM421 = false;
  hideBAM101 = false;
  hideBAM305 = false;
  hideBAM306 = false;
  hideBAM307 = false;
  hideBAM067 = false;
  hideBAM070 = false;
  hideKRM046 = false;
  hideKRM048 = false;

  hideKCM012 = false;
  hideDAM001 = false;
  hideVAM020 = false;
  hideVAM201 = false;
  hideBAM501 = false;
  hideBAM502 = false;
  hideBAM504 = false;
  hideBAM505 = false;
  hideBAM029 = false;
  hideVAM106 = false;
  hideVAM107 = false;
  hideVAM108 = false;
  // hideBAM608 = false;



  private applno: string;
  private cuid: string;
  queryDate: string;

  listSource: any = []
  total = 1
  pageIndex = 1
  pageSize = 50
  index: any

  watermark: string;

  readonly JCICCode = JCICCode;
  ngOnInit(): void {
    this.menuListService.setWaterMarkSource({
      show: true
    })
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    // this.queryDate = sessionStorage.getItem('queryDate');

    this.getQueryDate();
    this.getJcicMultiple();
    this.setBooleanFalse();
    this.getJcicList()
  }
  ngAfterViewInit() {

  }
  getQueryDate() {
    const url = 'f01/f01008scn3';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['cuid'] = this.cuid;
    jsonObject['code'] = 'MASTER';
    this.childscn6Service.getDate(url, jsonObject).subscribe(data => {
      if (data.rspBody != null && data.rspBody != '') {
        // for (let i = 0; i < data.rspBody.items.length; i++) {
        //   this.dateCode.push({ value: data.rspBody.items[i].QUERYDATE, viewValue: data.rspBody.items[i].QUERYDATE })
        // }
        // this.dateValue = data.rspBody.items[0].QUERYDATE
        // sessionStorage.setItem('queryDate', this.dateValue);
        // this.queryDate = data.rspBody.items[0].QUERYDATE;
        this.queryDate = this.pipe.transform(new Date(data.rspBody), 'yyyy-MM-dd HH:mm:ss');
        //this.router.navigate(['./'+this.routerCase+'/CHILDSCN6/CHILDSCN6PAGE1'], { queryParams: { applno: this.applno , cuid: this.cuid , search: this.search , queryDate: this.dateValue, routerCase: this.routerCase, fds: this.fds} });
      }
    });
  }

  // 取得聯徵彙整清單
  getJcicList() {
    let jsonObject: any = {}
    jsonObject['applno'] = this.applno
    // jsonObject['queryDate'] = this.queryDate
    this.childscn6Service.getMASTERJCICList(jsonObject).subscribe(data => {
      // if(data.rspCode!='0000')
      // { this.listSource.push('')}
      // else{
      this.listSource = data.rspBody;
      // }
    })
  }

  getJcicMultiple() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.cuid;
    jsonObject['code'] = 'BAI001,BAI004,KRI002,BAS006';
    // jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getMASTERJCICSearch(jsonObject).subscribe(data => {
      if (Object.keys(data.rspBody[0]).length === 0) {
        this.BAI001.push('');
        this.BAI004.push('');
        this.KRI002.push('');
        this.BAS006.push('');
      } else {
        // if ( data.rspBody[0].AAS003.length == 0 ) { this.AAS003.push(''); } else { this.AAS003 = data.rspBody[0].AAS003; };
        // if ( data.rspBody[0].JAS002.length == 0 ) { this.JAS002.push(''); } else { this.JAS002 = data.rspBody[0].JAS002; };
        // if ( data.rspBody[0].APS001.length == 0 ) { this.APS001.push(''); } else { this.APS001 = data.rspBody[0].APS001; };
        // if ( data.rspBody[0].ACI001.length == 0 ) { this.ACI001.push(''); } else { this.ACI001 = data.rspBody[0].ACI001; };
        // if ( data.rspBody[0].KRI001.length == 0 ) { this.KRI001.push(''); } else { this.KRI001 = data.rspBody[0].KRI001; };
        if (data.rspBody[0].BAI001.length == 0) { this.BAI001.push(''); } else { this.BAI001 = data.rspBody[0].BAI001; };
        if (data.rspBody[0].BAI004.length == 0) { this.BAI004.push(''); } else { this.BAI004 = data.rspBody[0].BAI004; };
        if (data.rspBody[0].KRI002.length == 0) { this.KRI002.push(''); } else { this.KRI002 = data.rspBody[0].KRI002; };
        // if ( data.rspBody[0].BAS008.length == 0 ) { this.BAS008.push(''); } else { this.BAS008 = data.rspBody[0].BAS008; };
        if (data.rspBody[0].BAS006.length == 0) { this.BAS006.push(''); } else { this.BAS006 = data.rspBody[0].BAS006; };
        // if ( data.rspBody[0].STS007.length == 0 ) { this.STS007.push(''); } else { this.STS007 = data.rspBody[0].STS007; };
        // if ( data.rspBody[0].STS007.length == 0 ) { this.STS007.push(''); } else { this.STS007 = data.rspBody[0].STS007; };
      }
    });
  }


  setBooleanTrue() {
    this.hideJCICMASTER = true;

    this.hideBAM501 = true;
    this.hideBAM502 = true;
    this.hideBAM504 = true;
    this.hideBAM505 = true;
    this.hideBAM029 = true;
    this.hideVAM106 = true;
    this.hideVAM107 = true;
    this.hideVAM108 = true;
    // this.hideBAM608 = true;
  }

  setBooleanFalse() {
    this.hideJCICMASTER = false;


    this.hideBAM032 = false;
    this.hideBAM033 = false;
    this.hideBAM034 = false;
    this.hideBAS010 = false;

    this.hideSTM022 = false;
    this.hideSTM008 = false;
    this.hideSTM025 = false;
    this.hideBAM421 = false;
    this.hideBAM101 = false;
    this.hideBAM305 = false;
    this.hideBAM306 = false;
    this.hideBAM307 = false;
    this.hideBAM067 = false;
    this.hideBAM070 = false;
    this.hideKRM046 = false;
    this.hideKRM048 = false;

    this.hideKCM012 = false;
    this.hideDAM001 = false;
    this.hideVAM020 = false;
    this.hideVAM201 = false;
    this.hideBAM501 = false;
    this.hideBAM502 = false;
    this.hideBAM504 = false;
    this.hideBAM505 = false;
    this.hideBAM029 = false;
    this.hideVAM106 = false;
    this.hideVAM107 = false;
    this.hideVAM108 = false;
    // this.hideBAM608 = false;
  }

  exist() {
    for (let index = 0; index < this.list.length; index++) {
      if (this.list[index] == "JCICMASTER") { this.hideJCICMASTER = !this.hideJCICMASTER; }

      if (this.list[index] == "BAM501") { this.hideBAM501 = !this.hideBAM501; }
      if (this.list[index] == "BAM502") { this.hideBAM502 = !this.hideBAM502; }
      if (this.list[index] == "BAM504") { this.hideBAM504 = !this.hideBAM504; }
      if (this.list[index] == "BAM505") { this.hideBAM505 = !this.hideBAM505; }
      if (this.list[index] == "BAM029") { this.hideBAM029 = !this.hideBAM029; }
      if (this.list[index] == "VAM106") { this.hideVAM106 = !this.hideVAM106; }
      if (this.list[index] == "VAM107") { this.hideVAM107 = !this.hideVAM107; }
      if (this.list[index] == "VAM108") { this.hideVAM108 = !this.hideVAM108; }

    }
  }

  showJCIC() {
    this.setBooleanTrue();
    this.hideAll = true;
    this.list = [];
    this.hideJCIC = !this.hideJCIC;
    if (this.hideJCIC === true) {
      this.setBooleanFalse();
      this.hideAll = false;
    }
  }

  show(who: string) {
    this.hideJCIC = true;
    if (this.list.indexOf(who) !== -1) {
      const index: number = this.list.indexOf(who);
      this.list.splice(index, 1);
    } else {
      this.list.push(who);
    }

    if (this.list.length == 0) {
      this.setBooleanFalse();
    } else if (this.list.length == 8) {
      this.setBooleanFalse();
      this.list = [];
    } else {
      this.setBooleanTrue();
      this.exist();
      // if ( who == "KRI002") { this.hideKRI002 = !this.hideKRI002; this.getKRI002(); }
    }
  }

  all() {
    this.hideAll = false;
    this.hideJCIC = true;
    this.setBooleanFalse();
    this.list = [];
  }

  ngOnDestroy() {
    this.menuListService.setWaterMarkSource({
      show: false
    })
  }
}
