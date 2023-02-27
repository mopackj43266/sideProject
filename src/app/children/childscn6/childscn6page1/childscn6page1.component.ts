import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { JCICCode } from 'src/app/interface/base';
import { MenuListService } from 'src/app/menu-list/menu-list.service';
import { ChildrenService } from '../../children.service';
import { Childscn6Service } from '../childscn6.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-childscn6page1',
  templateUrl: './childscn6page1.component.html',
  styleUrls: ['./childscn6page1.component.css', '../../../../assets/css/child.css']
})
export class Childscn6page1Component implements OnInit, AfterViewInit {

  constructor(
    private childscn6Service: Childscn6Service,
    private router: Router,
    public childService: ChildrenService,
    private pipe: DatePipe,
    private NzIconModule: NzIconModule,
    private menuListService: MenuListService

  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // this.getJcicList()
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
  sc1Html: string = null;
  sc2Html: string = null;

  list: any[] = [];

  hideJCIC = true;
  hideAll = false;
  hideJCICMASTER = false;
  hideBAM061 = false;
  hideKRM043 = false;
  hideBAM062 = false;
  hideBAM501 = false;
  hideBAM502 = false;
  hideBAM504 = false;
  hideBAM505 = false;
  hideBAM032 = false;
  hideBAM033 = false;
  hideBAM034 = false;
  hideBAS010 = false;
  hideBAM029 = false;
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

  hideSTM007 = false;
  hideSTM015 = false;
  hideKCM012 = false;
  hideDAM001 = false;
  hideVAM020 = false;
  hideVAM201 = false;
  hideVAM106 = false;
  hideVAM107 = false;
  hideVAM108 = false;
  hideBAM608 = false;
  hideR20 = false;
  hideD10 = false;

  private applno: string;
  private nationalId: string;
  queryDate: string;

  listSource: any = []
  //R20
  AAS008Source: Data[] = []
  VAM020Source: Data[] = []
  RAS020Source: Data[] = []
  BAS020Source: Data[] = []
  RAM020Source: Data[] = []
  //D10
  AAS005Source: Data[] = []
  AAS006Source: Data[] = []
  VAM020D10Source: Data[] = []
  DAI002Source: Data[] = []
  DAM003Source: Data[] = []
  total = 1
  pageIndex = 1
  pageSize = 50
  index: any

  watermark: string;

  readonly JCICCode = JCICCode;
  //20220509 SC1 SC2 HTML
  hideSC1 = false;
  hideSC2 = false;
  existSC1 = true;
  existSC2 = true;

  //20220913 T5
  hideT5 = false;
  newExistMasterT5Value: boolean = false
  existT50 = true;
  existT51 = true;
  existT52 = true;
  existT53 = true;
  existT54 = true;

  T5Value: string
  newInnerMasterT5Value: string
  t50Html: string = null;
  t51Html: string = null;
  t52Html: string = null;
  t53Html: string = null;
  t54Html: string = null;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.nationalId = sessionStorage.getItem('nationalId');
    // this.queryDate = sessionStorage.getItem('queryDate');


    this.getQueryDate();
    this.getJcicMultiple();
    this.setBooleanFalse();
    this.getJcicList()

  }

  ngAfterViewInit() {

  }
  //20220914切換官署資料頁籤
  changePage(value: string) {
    switch (value) {
      case "T50":
        this.newExistMasterT5Value = this.existT50
        this.T5Value = 'T50'
       return this.newInnerMasterT5Value = this.t50Html
      case "T51":
        this.newExistMasterT5Value = this.existT51
        this.T5Value = 'T51'
        return this.newInnerMasterT5Value = this.t51Html
      case "T52":
        this.newExistMasterT5Value = this.existT52
        this.T5Value = 'T52'
        return this.newInnerMasterT5Value = this.t52Html
      case "T53":
        this.newExistMasterT5Value = this.existT53
        this.T5Value = 'T53'
        return  this.newInnerMasterT5Value = this.t53Html
      case "T54":
        this.newExistMasterT5Value = this.existT54
        this.T5Value = 'T54'
        return  this.newInnerMasterT5Value = this.t54Html
    }
  }
  getQueryDate() {
    const url = 'f01/childscn6';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
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
        this.getAAS008List()
        this.getAAS008List();
        this.getVAM020List();
        this.getRAS020List();
        this.getBAS020List();
        this.getRAM020List();
        this.getAAS005List();
        this.getAAS006List();
        this.getVAM020D10List();
        this.getDAI002List();
        this.getDAM003List();
        //this.router.navigate(['./'+this.routerCase+'/CHILDSCN6/CHILDSCN6PAGE1'], { queryParams: { applno: this.applno , cuid: this.cuid , search: this.search , queryDate: this.dateValue, routerCase: this.routerCase, fds: this.fds} });
      }
    });
  }

  // 取得聯徵彙整清單
  getJcicList() {
    let jsonObject: any = {}
    jsonObject['applno'] = this.applno
    this.childscn6Service.getMASTERJCICList(jsonObject).subscribe(data => {
      if (data.rspBody != null && data.rspBody.length > 0) {
        this.listSource = data.rspBody[0];

      }
    })
  }
  getAAS008List() {
    let jsonObject: any = {};
    const baseUrl = 'f01/childscn6action4';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['queryDate'] = this.queryDate;

    this.childscn6Service.getR20List(baseUrl, jsonObject).subscribe(data => {
      this.AAS008Source = data.rspBody
    })
  }
  getVAM020List() {
    let jsonObject: any = {};
    const baseUrl = 'f01/childscn6action5';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getR20List(baseUrl, jsonObject).subscribe(data => {
      this.VAM020Source = data.rspBody
    })
  }
  getRAS020List() {
    let jsonObject: any = {};
    const baseUrl = 'f01/childscn6action6';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getR20List(baseUrl, jsonObject).subscribe(data => {
      this.RAS020Source = data.rspBody
    })
  }
  getBAS020List() {
    let jsonObject: any = {};
    const baseUrl = 'f01/childscn6action7';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getR20List(baseUrl, jsonObject).subscribe(data => {
      this.BAS020Source = data.rspBody
    })
  }
  getRAM020List() {
    let jsonObject: any = {};
    const baseUrl = 'f01/childscn6action8';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getR20List(baseUrl, jsonObject).subscribe(data => {
      this.RAM020Source = data.rspBody
    })
  }
  getAAS005List() {
    let jsonObject: any = {};
    const baseUrl = 'f01/childscn6action9';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getR20List(baseUrl, jsonObject).subscribe(data => {
      this.AAS005Source = data.rspBody

    })
  }

  getAAS006List() {
    let jsonObject: any = {};
    const baseUrl = 'f01/childscn6action10';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getR20List(baseUrl, jsonObject).subscribe(data => {
      this.AAS006Source = data.rspBody

    })
  }
  getVAM020D10List() {
    let jsonObject: any = {};
    const baseUrl = 'f01/childscn6action11';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getR20List(baseUrl, jsonObject).subscribe(data => {
      this.VAM020D10Source = data.rspBody
    })
  }
  getDAI002List() {
    let jsonObject: any = {};
    const baseUrl = 'f01/childscn6action12';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getR20List(baseUrl, jsonObject).subscribe(data => {
      this.DAI002Source = data.rspBody
    })
  }
  getDAM003List() {
    let jsonObject: any = {};
    const baseUrl = 'f01/childscn6action13';
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getR20List(baseUrl, jsonObject).subscribe(data => {
      this.DAM003Source = data.rspBody
    })
  }

  getJcicMultiple() {
    this.sc1Html = "";
    this.sc2Html = "";
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.nationalId;
    jsonObject['code'] = 'AAS003,JAS002,APS001,ACI001,BAI001,KRI001,BAI004,KRI002,BAS008,BAS006,STS007';
    // jsonObject['queryDate'] = this.queryDate;
    this.childscn6Service.getMASTERJCICSearch(jsonObject).subscribe(data => {
      if (Object.keys(data.rspBody[0]).length === 0) {
        this.AAS003.push('');
        this.APS001.push('');
        this.JAS002.push('');
        this.ACI001.push('');
        this.BAI001.push('');
        this.KRI001.push('');
        this.BAI004.push('');
        this.KRI002.push('');
        this.BAS008.push('');
        this.BAS006.push('');
        this.STS007.push('');
      } else {
        if (data.rspBody[0].AAS003.length == 0) { this.AAS003.push(''); } else { this.AAS003 = data.rspBody[0].AAS003; };
        if (data.rspBody[0].JAS002.length == 0) { this.JAS002.push(''); } else { this.JAS002 = data.rspBody[0].JAS002; };
        if (data.rspBody[0].APS001.length == 0) { this.APS001.push(''); } else { this.APS001 = data.rspBody[0].APS001; };
        if (data.rspBody[0].ACI001.length == 0) { this.ACI001.push(''); } else { this.ACI001 = data.rspBody[0].ACI001; };
        if (data.rspBody[0].BAI001.length == 0) { this.BAI001.push(''); } else { this.BAI001 = data.rspBody[0].BAI001; };
        if (data.rspBody[0].KRI001.length == 0) { this.KRI001.push(''); } else { this.KRI001 = data.rspBody[0].KRI001; };
        if (data.rspBody[0].BAI004.length == 0) { this.BAI004.push(''); } else { this.BAI004 = data.rspBody[0].BAI004; };
        if (data.rspBody[0].KRI002.length == 0) { this.KRI002.push(''); } else { this.KRI002 = data.rspBody[0].KRI002; };
        if (data.rspBody[0].BAS008.length == 0) { this.BAS008.push(''); } else { this.BAS008 = data.rspBody[0].BAS008; };
        if (data.rspBody[0].BAS006.length == 0) { this.BAS006.push(''); } else { this.BAS006 = data.rspBody[0].BAS006; };
        if (data.rspBody[0].STS007.length == 0) { this.STS007.push(''); } else { this.STS007 = data.rspBody[0].STS007; };
      }

      data.rspBody[1].SC1 != '' ? this.sc1Html = data.rspBody[1].SC1 : this.existSC1 = false;
      data.rspBody[1].SC2 != '' ? this.sc2Html = data.rspBody[1].SC2 : this.existSC2 = false;

      //20220913 T5
      data.rspBody[2].T50 != '' ? this.t50Html = data.rspBody[2].T50 : this.existT50 = false;
      data.rspBody[2].T51 != '' ? this.t51Html = data.rspBody[2].T51 : this.existT51 = false;
      data.rspBody[2].T52 != '' ? this.t52Html = data.rspBody[2].T52 : this.existT52 = false;
      data.rspBody[2].T53 != '' ? this.t53Html = data.rspBody[2].T53 : this.existT53 = false;
      data.rspBody[2].T54 != '' ? this.t54Html = data.rspBody[2].T54 : this.existT54 = false;

      this.changePage("T50");
    });
  }

  // getJCIC( pageIndex: number, pageSize: number, code: string ) {
  //   let jsonObject: any = {};
  //   jsonObject['applno'] = this.applno;
  //   jsonObject['nationalId'] = this.cuid;
  //   jsonObject['code'] = code;
  //   jsonObject['queryDate'] = this.queryDate;
  //   jsonObject['page'] = pageIndex;
  //   jsonObject['per_page'] = pageSize;
  //   this.childscn6Service.getJCICSearch(jsonObject).subscribe(data => {
  //     if ( code == 'KCM012' ) { this.total1 = data.rspBody.size; this.KCM012Source = data.rspBody.items; }
  //     if ( code == 'DAM001' ) { this.total2 = data.rspBody.size; this.DAM001Source = data.rspBody.items; }
  //     if ( code == 'BAM061' ) { this.total3 = data.rspBody.size; this.BAM061Source = data.rspBody.items; }
  //     if ( code == 'KRM043' ) { this.total4 = data.rspBody.size; this.KRM043Source = data.rspBody.items; }
  //     if ( code == 'BAM062' ) { this.total5 = data.rspBody.size; this.BAM062Source = data.rspBody.items; }
  //     if ( code == 'VAM020' ) { this.total6 = data.rspBody.size; this.VAM020Source = data.rspBody.items; }
  //     if ( code == 'VAM201' ) { this.total7 = data.rspBody.size; this.VAM201Source = data.rspBody.items; }
  //     if ( code == 'VAM106' ) { this.total8 = data.rspBody.size; this.VAM106Source = data.rspBody.items; }
  //     if ( code == 'VAM107' ) { this.total9 = data.rspBody.size; this.VAM107Source = data.rspBody.items; }
  //     if ( code == 'VAM108' ) { this.total10 = data.rspBody.size; this.VAM108Source = data.rspBody.items; }
  //     if ( code == 'BAM029' ) { this.total11 = data.rspBody.size; this.BAM029Source = data.rspBody.items; }
  //     if ( code == 'BAM501' ) { this.total12 = data.rspBody.size; this.BAM501Source = data.rspBody.items; }
  //     if ( code == 'BAM502' ) { this.total13 = data.rspBody.size; this.BAM502Source = data.rspBody.items; }
  //     if ( code == 'BAM504' ) { this.total14 = data.rspBody.size; this.BAM504Source = data.rspBody.items; }
  //     if ( code == 'BAM505' ) { this.total15 = data.rspBody.size; this.BAM505Source = data.rspBody.items; }
  //     if ( code == 'BAM032' ) { this.total16 = data.rspBody.size; this.BAM032Source = data.rspBody.items; }
  //     if ( code == 'BAM067' ) { this.total18 = data.rspBody.size; this.BAM067Source = data.rspBody.items; }
  //     if ( code == 'BAM070' ) { this.total19 = data.rspBody.size; this.BAM070Source = data.rspBody.items; }
  //     if ( code == 'BAM101' ) { this.total20 = data.rspBody.size; this.BAM101Source = data.rspBody.items; }
  //     if ( code == 'BAM421' ) { this.total21 = data.rspBody.size; this.BAM421Source = data.rspBody.items; }
  //     if ( code == 'BAM305' ) { this.total22 = data.rspBody.size; this.BAM305Source = data.rspBody.items; }
  //     if ( code == 'BAM306' ) { this.total23 = data.rspBody.size; this.BAM306Source = data.rspBody.items; }
  //     if ( code == 'BAM307' ) { this.total24 = data.rspBody.size; this.BAM307Source = data.rspBody.items; }
  //     if ( code == 'BAM608' ) { this.total25 = data.rspBody.size; this.BAM608Source = data.rspBody.items; }
  //     if ( code == 'KRM046' ) { this.total26 = data.rspBody.size; this.KRM046Source = data.rspBody.items; }
  //     if ( code == 'KRM048' ) { this.total27 = data.rspBody.size; this.KRM048Source = data.rspBody.items; }
  //     if ( code == 'STM022' ) { this.total28 = data.rspBody.size; this.STM022Source = data.rspBody.items; }
  //     if ( code == 'STM008' ) { this.total29 = data.rspBody.size; this.STM008Source = data.rspBody.items; }
  //     if ( code == 'STM025' ) { this.total30 = data.rspBody.size; this.STM025Source = data.rspBody.items; }
  //   });
  // }

  // onQueryParamsChange(params: NzTableQueryParams, code: string): void {
  //   const { pageSize, pageIndex } = params;
  //   this.getJCIC(pageIndex, pageSize, code);
  // }

  // getKRI002() {
  //   this.KRI002Source.data = null;
  //   const formdata: FormData = new FormData();
  //   formdata.append('applno', this.applno);
  //   formdata.append('cuid', this.cuid);
  //   formdata.append('code', 'KRI002');
  //   formdata.append('queryDate', this.queryDate);
  //   formdata.append('page', `${this.currentPage.pageIndex + 1}`);
  //   formdata.append('per_page', `${this.currentPage.pageSize}`);
  //   this.childscn6Service.getJCICSearch(formdata).subscribe(data => {
  //     this.totalCount = data.rspBody.size;
  //     this.KRI002Source.data = data.rspBody.items;
  //   });
  // }

  setBooleanTrue() {
    this.hideJCICMASTER = true;
    this.hideBAM061 = true;
    this.hideKRM043 = true;
    this.hideBAM062 = true;
    this.hideBAM501 = true;
    this.hideBAM502 = true;
    this.hideBAM504 = true;
    this.hideBAM505 = true;
    this.hideBAM032 = true;
    this.hideBAM033 = true;
    this.hideBAM034 = true;
    this.hideBAS010 = true;
    this.hideBAM029 = true;
    this.hideSTM022 = true;
    this.hideSTM008 = true;
    this.hideSTM025 = true;
    this.hideBAM421 = true;
    this.hideBAM101 = true;
    this.hideBAM305 = true;
    this.hideBAM306 = true;
    this.hideBAM307 = true;
    this.hideBAM067 = true;
    this.hideBAM070 = true;
    this.hideKRM046 = true;
    this.hideKRM048 = true;

    this.hideKCM012 = true;
    this.hideDAM001 = true;
    this.hideVAM020 = true;
    this.hideVAM201 = true;
    this.hideVAM106 = true;
    this.hideVAM107 = true;
    this.hideVAM108 = true;
    this.hideBAM608 = true;
    this.hideSTM007 = true;
    this.hideSTM015 = true;
    this.hideR20 = true;
    this.hideD10 = true;

    this.hideSC1 = true;
    this.hideSC2 = true;

    this.hideT5 = true;
  }

  setBooleanFalse() {
    this.hideJCICMASTER = false;
    this.hideBAM061 = false;
    this.hideKRM043 = false;
    this.hideBAM062 = false;
    this.hideBAM501 = false;
    this.hideBAM502 = false;
    this.hideBAM504 = false;
    this.hideBAM505 = false;
    this.hideBAM032 = false;
    this.hideBAM033 = false;
    this.hideBAM034 = false;
    this.hideBAS010 = false;
    this.hideBAM029 = false;
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
    this.hideVAM106 = false;
    this.hideVAM107 = false;
    this.hideVAM108 = false;
    this.hideBAM608 = false;
    this.hideSTM007 = false;
    this.hideSTM015 = false;

    this.hideSC1 = false;
    this.hideSC2 = false;

    this.hideT5 = false;
  }

  exist() {
    for (let index = 0; index < this.list.length; index++) {
      if (this.list[index] == "JCICMASTER") { this.hideJCICMASTER = !this.hideJCICMASTER; }
      if (this.list[index] == "BAM061") { this.hideBAM061 = !this.hideBAM061; }
      if (this.list[index] == "KRM043") { this.hideKRM043 = !this.hideKRM043; }
      if (this.list[index] == "BAM062") { this.hideBAM062 = !this.hideBAM062; }
      if (this.list[index] == "BAM501") { this.hideBAM501 = !this.hideBAM501; }
      if (this.list[index] == "BAM502") { this.hideBAM502 = !this.hideBAM502; }
      if (this.list[index] == "BAM504") { this.hideBAM504 = !this.hideBAM504; }
      if (this.list[index] == "BAM505") { this.hideBAM505 = !this.hideBAM505; }
      if (this.list[index] == "BAM032") { this.hideBAM032 = !this.hideBAM032; }
      if (this.list[index] == "BAM033") { this.hideBAM033 = !this.hideBAM033; }
      if (this.list[index] == "BAM034") { this.hideBAM034 = !this.hideBAM034; }
      if (this.list[index] == "BAS010") { this.hideBAS010 = !this.hideBAS010; }
      if (this.list[index] == "BAM029") { this.hideBAM029 = !this.hideBAM029; }
      if (this.list[index] == "STM022") { this.hideSTM022 = !this.hideSTM022; }
      if (this.list[index] == "STM008") { this.hideSTM008 = !this.hideSTM008; }
      if (this.list[index] == "STM025") { this.hideSTM025 = !this.hideSTM025; }
      if (this.list[index] == "BAM421") { this.hideBAM421 = !this.hideBAM421; }
      if (this.list[index] == "BAM101") { this.hideBAM101 = !this.hideBAM101; }
      if (this.list[index] == "BAM305") { this.hideBAM305 = !this.hideBAM305; }
      if (this.list[index] == "BAM306") { this.hideBAM306 = !this.hideBAM306; }
      if (this.list[index] == "BAM307") { this.hideBAM307 = !this.hideBAM307; }
      if (this.list[index] == "BAM067") { this.hideBAM067 = !this.hideBAM067; }
      if (this.list[index] == "BAM070") { this.hideBAM070 = !this.hideBAM070; }
      if (this.list[index] == "KRM046") { this.hideKRM046 = !this.hideKRM046; }
      if (this.list[index] == "KRM048") { this.hideKRM048 = !this.hideKRM048; }

      if (this.list[index] == "KCM012") { this.hideKCM012 = !this.hideKCM012; }
      if (this.list[index] == "DAM001") { this.hideDAM001 = !this.hideDAM001; }
      if (this.list[index] == "VAM020") { this.hideVAM020 = !this.hideVAM020; }
      if (this.list[index] == "VAM201") { this.hideVAM201 = !this.hideVAM201; }
      if (this.list[index] == "VAM106") { this.hideVAM106 = !this.hideVAM106; }
      if (this.list[index] == "VAM107") { this.hideVAM107 = !this.hideVAM107; }
      if (this.list[index] == "VAM108") { this.hideVAM108 = !this.hideVAM108; }
      // if (this.list[index] == "BAM032") { this.hideBAM032 = !this.hideBAM032; }
      if (this.list[index] == "BAM608") { this.hideBAM608 = !this.hideBAM608; }
      if (this.list[index] == "STM007") { this.hideSTM007 = !this.hideSTM007; }
      if (this.list[index] == "STM015") { this.hideSTM015 = !this.hideSTM015; }
      if (this.list[index] == "R20") { this.hideR20 = !this.hideR20; }
      if (this.list[index] == "D10") { this.hideD10 = !this.hideD10; }
      //20220509 SC1 SC2
      if (this.list[index] == "SC1") { this.hideSC1 = !this.hideSC1; }
      if (this.list[index] == "SC2") { this.hideSC2 = !this.hideSC2; }
      //20220913 T5
      if (this.list[index] == "T5") { this.hideT5 = !this.hideT5; }
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
    } else if (this.list.length == 38) {
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
