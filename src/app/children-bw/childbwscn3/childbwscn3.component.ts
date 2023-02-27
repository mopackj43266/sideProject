import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Childbwscn3Service } from '../childbwscn3/childbwscn3.service';
import { ChildrenService } from '../../children/children.service';
import { DatePipe } from '@angular/common';
import { MenuListService } from 'src/app/menu-list/menu-list.service';

interface sysCode {
  value: string;
  viewValue: string;
}


//Jay 複審行外資訊
@Component({
  selector: 'app-childbwscn3',
  templateUrl: './childbwscn3.component.html',
  styleUrls: ['./childbwscn3.component.css', '../../../assets/css/child.css']
})
// '../../../../assets/css/child.css'
export class Childbwscn3Component implements OnInit, AfterViewInit {

  constructor(
    private childbwscn3Service: Childbwscn3Service,
    private router: Router,
    public childService: ChildrenService,
    private pipe: DatePipe,
    private menuListService: MenuListService
  ) {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.getJcicList()
    //     this.getJcicMultiple();
    //     this.setBooleanFalse();
    //     this.list = [];

    //     // when onSameUrlNavigation: 'reload'，會重新觸發 router event
    //   }
    // });
  }

  AAS003: any[] = [];
  BAI001: any[] = [];
  JAS002: any[] = [];
  AAS003Code: sysCode[] = [];
  BAMAccountCode: sysCode[] = [];
  BAMAccountCodeTwo: sysCode[] = [];
  BAMPurposeCode: sysCode[] = [];
  BAMIsKindCode: sysCode[] = [];
  BAMProjectCode: sysCode[] = [];
  BAMUnMarkCode: sysCode[] = [];
  KRM048PayStatCode: sysCode[] = [];
  KRM048PayCode: sysCode[] = [];
  KRM048DebtCode: sysCode[] = [];
  KRM048CloseCode: sysCode[] = [];
  KRM046DispGroupCode: sysCode[] = [];
  KRM046StopCode: sysCode[] = [];
  KRM046ABCode: sysCode[] = [];
  KRM046CloseCode: sysCode[] = [];
  STM015ApplyWayCode: sysCode[] = [];
  VAM201TypeCode: sysCode[] = [];
  VAM201RelCode: sysCode[] = [];
  BAM029XactCode: sysCode[] = [];
  BAMGidCode: sysCode[] = [];
  BAMRelCode: sysCode[] = [];
  BAM031TranAttrCode: sysCode[] = [];
  BAM031PurposeCode: sysCode[] = [];
  // JAS002: any[] = [];
  // BAM307: any[] = [];
  // ACI001: any[] = [];
  // BAI001: any[] = [];
  // KRI001: any[] = [];
  // BAI004: any[] = [];
  // KRI002: any[] = [];
  // BAS008: any[] = [];
  // BAS006: any[] = [];
  // STS007: any[] = [];

  list: any[] = [];
  firstFlag = 1
  hideAll = false;
  hideJCICMASTER = false;
  hideJCIC = true;
  hideBAM095 = false;
  hideBAM101 = false;
  hideKRM048 = false;
  hideKRM046 = false;
  hideSTM022 = false;
  hideSTM007 = false;
  hideSTM008 = false;
  hideSTM015 = false;
  hideSTM025 = false;
  hideVAM106 = false;
  hideVAM107 = false;
  hideVAM108 = false;
  hideVAM201 = false;
  hideBAM501 = false;
  hideBAM502 = false;
  hideBAM504 = false;
  hideBAM505 = false;
  hideBAM029 = false;
  hideBAM305 = false;
  hideBAM306 = false;
  hideBAM307 = false;
  hideBAM011 = false;
  hideBAM070 = false;
  hideBAM031 = false;
  newData: any[] = [];
  newData1: any[] = [];
  newData2: any[] = [];
  newData3: any[] = [];
  newData4: any[] = [];
  newData5: any[] = [];
  newData6: any[] = [];
  newData7: any[] = [];
  newData8: any[] = [];
  newData9: any[] = [];
  newData10: any[] = [];
  newData11: any[] = [];
  newData12: any[] = [];
  newData13: any[] = [];
  newData14: any[] = [];
  newData15: any[] = [];
  newData16: any[] = [];
  newData17: any[] = [];
  newData18: any[] = [];
  newData19: any[] = [];
  newData20: any[] = [];
  newData21: any[] = [];
  newData22: any[] = [];
  newData23: any[] = [];
  private applno: string;
  private cuid: string;
  swcCustId: string;
  queryDate: string;
  listSource: any = {}
  total = 1
  pageIndex = 1
  pageSize = 50
  index: any

  BAM095Source: readonly Data[] = [];
  total1 = 1;
  pageIndex1 = 1;
  pageSize1 = 20;

  BAM101Source: readonly Data[] = [];
  total2 = 1;
  pageIndex2 = 1;
  pageSize2 = 20;

  KRM048Source: readonly Data[] = [];
  total3 = 1;
  pageIndex3 = 1;
  pageSize3 = 20;

  KRM046Source: readonly Data[] = [];
  total4 = 1;
  pageIndex4 = 1;
  pageSize4 = 20;


  STM022Source: readonly Data[] = [];
  total6 = 1;
  pageIndex6 = 1;
  pageSize6 = 20;

  STM007Source: readonly Data[] = [];
  total24 = 1;
  pageIndex24 = 1;
  pageSize24 = 20
    ;
  STM015Source: readonly Data[] = [];
  total25 = 1;
  pageIndex25 = 1;
  pageSize25 = 20;

  STM008Source: readonly Data[] = [];
  total7 = 1;
  pageIndex7 = 1;
  pageSize7 = 20;

  STM025Source: readonly Data[] = [];
  total8 = 1;
  pageIndex8 = 1;
  pageSize8 = 20;

  VAM106Source: readonly Data[] = [];
  total9 = 1;
  pageIndex9 = 1;
  pageSize9 = 20;

  VAM107Source: readonly Data[] = [];
  total10 = 1;
  pageIndex10 = 1;
  pageSize10 = 20;

  VAM108Source: readonly Data[] = [];
  total11 = 1;
  pageIndex11 = 1;
  pageSize11 = 20;

  VAM201Source: readonly Data[] = [];
  total12 = 1;
  pageIndex12 = 1;
  pageSize12 = 20;

  BAM501Source: readonly Data[] = [];
  total13 = 1;
  pageIndex13 = 1;
  pageSize13 = 20;

  BAM502Source: readonly Data[] = [];
  total14 = 1;
  pageIndex14 = 1;
  pageSize14 = 20;

  BAM504Source: readonly Data[] = [];
  total15 = 1;
  pageIndex15 = 1;
  pageSize15 = 20;

  BAM505Source: readonly Data[] = [];
  total16 = 1;
  pageIndex16 = 1;
  pageSize16 = 20;

  BAM029Source: readonly Data[] = [];
  total17 = 1;
  pageIndex17 = 1;
  pageSize17 = 20;

  BAM305Source: readonly Data[] = [];
  total18 = 1;
  pageIndex18 = 1;
  pageSize18 = 20;

  BAM306Source: readonly Data[] = [];
  total19 = 1;
  pageIndex19 = 1;
  pageSize19 = 20;

  BAM307Source: readonly Data[] = [];
  total20 = 1;
  pageIndex20 = 1;
  pageSize20 = 20;

  BAM011Source: readonly Data[] = [];
  total21 = 1;
  pageIndex21 = 1;
  pageSize21 = 20;

  BAM070Source: readonly Data[] = [];
  total22 = 1;
  pageIndex22 = 1;
  pageSize22 = 20;

  BAM031Source: readonly Data[] = [];
  total23 = 1;
  pageIndex23 = 1;
  pageSize23 = 20;


  watermark: string;
  s: string;
  today: string;


  ngOnInit(): void {

    //AAS003 mappingcode
    this.childbwscn3Service.getSysTypeCode('WANTEDLIST')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.AAS003Code.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //BAM ACCOUNT_CODE mappingcode
    this.childbwscn3Service.getSysTypeCode('ACCOUNT_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAMAccountCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //BAM ACCOUNT_CODE2 mappingcode
    this.childbwscn3Service.getSysTypeCode('ACCOUNT_CODE2')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAMAccountCodeTwo.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //BAM PURPOSE_CODE mappingcode
    this.childbwscn3Service.getSysTypeCode('PURPOSE_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAMPurposeCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //BAM095 IS_KIND mappingcode
    this.childbwscn3Service.getSysTypeCode('IS_KIND')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAMIsKindCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //BAM095 PROJECT_CODE mappingcode
    this.childbwscn3Service.getSysTypeCode('PROJECT_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAMProjectCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //BAM095 UN_MARK mappingcode
    this.childbwscn3Service.getSysTypeCode('UN_MARK')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAMUnMarkCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //KRM048 PAY_STAT mappingcode
    this.childbwscn3Service.getSysTypeCode('PAY_STAT')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.KRM048PayStatCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //KRM048 PAY_CODE mappingcode
    this.childbwscn3Service.getSysTypeCode('PAY_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.KRM048PayCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //KRM048 DEBT_CODE mappingcode
    this.childbwscn3Service.getSysTypeCode('DEBT_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.KRM048DebtCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //KRM048 CLOSE_CODE mappingcode
    this.childbwscn3Service.getSysTypeCode('CLOSE_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.KRM048CloseCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //KRM046 DISP_GROUP mappingcode
    this.childbwscn3Service.getSysTypeCode('DISP_GROUP')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.KRM046DispGroupCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //KRM046 STOP_CODE mappingcode
    this.childbwscn3Service.getSysTypeCode('STOP_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.KRM046StopCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //KRM046 AB_CODE  mappingcode
    this.childbwscn3Service.getSysTypeCode('AB_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.KRM046ABCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //KRM046 CLOSE_CODE  mappingcode
    this.childbwscn3Service.getSysTypeCode('CLOSE_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.KRM046CloseCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //STM015 APPLY_WAY  mappingcode
    this.childbwscn3Service.getSysTypeCode('APPLY_WAY')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.STM015ApplyWayCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //VAM201 TYPE  mappingcode
    this.childbwscn3Service.getSysTypeCode('TYPE ')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.VAM201TypeCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    //VAM201 REL_CODE  mappingcode
    this.childbwscn3Service.getSysTypeCode('REL_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.VAM201RelCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    // BAM029 XACT_CODE  mappingcode
    this.childbwscn3Service.getSysTypeCode('XACT_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAM029XactCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    // bam305/bam306/bam307 GID_CODE  mappingcode
    this.childbwscn3Service.getSysTypeCode('GID_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAMGidCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    // bam305/bam306/bam307 REL_CODE  mappingcode
    this.childbwscn3Service.getSysTypeCode('REL_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAMRelCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    // bam031 TRAN_ATTR  mappingcode
    this.childbwscn3Service.getSysTypeCode('TRAN_ATTR')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAM031TranAttrCode.push({ value: codeNo, viewValue: codeNo + '-' + desc })
        }
      });
    // bam031 PURPOSE_CODE  mappingcode
    this.childbwscn3Service.getSysTypeCode('PURPOSE_CODE')
      .subscribe(data => {
        for (const jsonObj of data.rspBody.mappingList) {
          const codeNo = jsonObj.codeNo;
          const desc = jsonObj.codeDesc;
          this.BAM031PurposeCode.push({ value: codeNo, viewValue: desc })
        }
      });
    this.menuListService.setWaterMarkSource({
      show: true
    })
    this.applno = sessionStorage.getItem('applno');
    this.cuid = sessionStorage.getItem('nationalId');
    this.swcCustId = sessionStorage.getItem('swcCustId');
    this.getJCIC('BAM095');
    this.getJCIC('BAM101');
    this.getJCIC('KRM048');
    this.getJCIC('KRM046');
    this.getJCIC('STM022');
    this.getJCIC('STM007');
    this.getJCIC('STM015');
    this.getJCIC('STM008');
    this.getJCIC('STM025');
    this.getJCIC('VAM106');
    this.getJCIC('VAM107');
    this.getJCIC('VAM108');
    this.getJCIC('VAM201');
    this.getJCIC('BAM501');
    this.getJCIC('BAM502');
    this.getJCIC('BAM504');
    this.getJCIC('BAM505');
    this.getJCIC('BAM029');
    this.getJCIC('BAM305');
    this.getJCIC('BAM306');
    this.getJCIC('BAM307');
    this.getJCIC('BAM011');
    this.getJCIC('BAM070');
    this.getJCIC('BAM031');
    this.getJcicMultiple();
    this.setBooleanFalse();
    this.getJcicList()
    this.getQueryDate();
  }

  ngAfterViewInit() {

  }
  getQueryDate() {
    const url = 'f01/childbwscn3action4';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.cuid;
    this.childbwscn3Service.getDate(url, jsonObject).subscribe(data => {

      if (data.rspBody != null && data.rspBody != '') {
        this.queryDate = this.pipe.transform(new Date(data.rspBody), 'yyyy-MM-dd HH:mm:ss');
      }
    });
  }
  // 取得聯徵彙整清單
  getJcicList() {
    let jsonObject: any = {}
    jsonObject['applno'] = this.applno
    jsonObject['nationalId'] = this.cuid;
    jsonObject['custId'] = this.swcCustId;
    this.childbwscn3Service.getMASTERJCICList(jsonObject).subscribe(data => {
      if (data.rspBody != null) {
        this.listSource = data.rspBody;
      }
    })
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

  getJcicMultiple() {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['nationalId'] = this.cuid;
    jsonObject['custId'] = this.swcCustId;
    jsonObject['code'] = 'AAS003,BAI001,JAS002';
    this.childbwscn3Service.getMASTERJCICSearch(jsonObject).subscribe(data => {
      if (Object.keys(data.rspBody[0]).length === 0) {
        this.AAS003.push('');
        this.BAI001.push('');
        this.JAS002.push('');
      } else {
        if (data.rspBody[0].AAS003.length == 0) { this.AAS003.push(''); } else { this.AAS003 = data.rspBody[0].AAS003; };
        if (data.rspBody[0].BAI001.length == 0) { this.BAI001.push(''); } else { this.BAI001 = data.rspBody[0].BAI001; };
        if (data.rspBody[0].JAS002.length == 0) { this.JAS002.push(''); } else { this.JAS002 = data.rspBody[0].JAS002; };
      }
    });
  }

  getJCIC(code: string) {
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['code'] = code;
    jsonObject['nationalId'] = this.cuid;
    jsonObject['custId'] = this.swcCustId;
    // jsonObject['page'] = pageIndex;
    // jsonObject['per_page'] = pageSize;
    this.childbwscn3Service.getJCICSearch(jsonObject).subscribe(data => {
      if (code == 'BAM095') {
        this.total1 = data.rspBody.size;
        this.BAM095Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData = this.childbwscn3Service.getTableDate(this.pageIndex1, this.pageSize1, this.BAM095Source);

      }
      if (code == 'BAM101') {
        this.total2 = data.rspBody.size;
        this.BAM101Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData1 = this.childbwscn3Service.getTableDate(this.pageIndex2, this.pageSize2, this.BAM101Source);
      }
      if (code == 'KRM048') {
        this.total3 = data.rspBody.size;
        this.firstFlag = 2;
        this.KRM048Source = data.rspBody.items;
        this.newData2 = this.childbwscn3Service.getTableDate(this.pageIndex3, this.pageSize3, this.KRM048Source);
      }
      if (code == 'KRM046') {
        this.total4 = data.rspBody.size;
        this.KRM046Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData3 = this.childbwscn3Service.getTableDate(this.pageIndex4, this.pageSize4, this.KRM046Source);
      }
      if (code == 'STM022') {
        this.total6 = data.rspBody.size;
        this.STM022Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData4 = this.childbwscn3Service.getTableDate(this.pageIndex6, this.pageSize6, this.STM022Source);

      }
      if (code == 'STM008') {
        this.total7 = data.rspBody.size;
        this.STM008Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData5 = this.childbwscn3Service.getTableDate(this.pageIndex7, this.pageSize7, this.STM008Source);
      }
      if (code == 'STM025') {
        this.total8 = data.rspBody.size;
        this.STM025Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData6 = this.childbwscn3Service.getTableDate(this.pageIndex8, this.pageSize8, this.STM025Source);
      }
      if (code == 'VAM106') {
        this.total9 = data.rspBody.size;
        this.VAM106Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData7 = this.childbwscn3Service.getTableDate(this.pageIndex9, this.pageSize9, this.VAM106Source);
      }
      if (code == 'VAM107') {
        this.total10 = data.rspBody.size;
        this.VAM107Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData8 = this.childbwscn3Service.getTableDate(this.pageIndex10, this.pageSize10, this.VAM107Source);
      }
      if (code == 'VAM108') {
        this.total11 = data.rspBody.size;
        this.VAM108Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData9 = this.childbwscn3Service.getTableDate(this.pageIndex11, this.pageSize11, this.VAM108Source);
      }
      if (code == 'VAM201') {
        this.total12 = data.rspBody.size;
        this.VAM201Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData10 = this.childbwscn3Service.getTableDate(this.pageIndex12, this.pageSize12, this.VAM201Source);
      }
      if (code == 'BAM501') {
        this.total13 = data.rspBody.size;
        this.BAM501Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData11 = this.childbwscn3Service.getTableDate(this.pageIndex13, this.pageSize13, this.BAM501Source);
      }
      if (code == 'BAM502') {
        this.total14 = data.rspBody.size;
        this.BAM502Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData12 = this.childbwscn3Service.getTableDate(this.pageIndex14, this.pageSize14, this.BAM502Source);
      }
      if (code == 'BAM504') {
        this.total15 = data.rspBody.size;
        this.BAM504Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData13 = this.childbwscn3Service.getTableDate(this.pageIndex15, this.pageSize15, this.BAM504Source);
      }
      if (code == 'BAM505') {
        this.total16 = data.rspBody.size;
        this.BAM505Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData14 = this.childbwscn3Service.getTableDate(this.pageIndex16, this.pageSize16, this.BAM505Source);
      }
      if (code == 'BAM029') {
        this.total17 = data.rspBody.size;
        this.BAM029Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData15 = this.childbwscn3Service.getTableDate(this.pageIndex17, this.pageSize17, this.BAM029Source);
      }
      if (code == 'BAM305') {
        this.total18 = data.rspBody.size;
        this.BAM305Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData16 = this.childbwscn3Service.getTableDate(this.pageIndex18, this.pageSize18, this.BAM305Source);
      }
      if (code == 'BAM306') {
        this.total19 = data.rspBody.size;
        this.BAM306Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData17 = this.childbwscn3Service.getTableDate(this.pageIndex19, this.pageSize19, this.BAM306Source);
      }
      if (code == 'BAM307') {
        this.total20 = data.rspBody.size;
        this.BAM307Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData18 = this.childbwscn3Service.getTableDate(this.pageIndex20, this.pageSize20, this.BAM307Source);
      }
      if (code == 'BAM011') {
        this.total21 = data.rspBody.size;
        this.BAM011Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData19 = this.childbwscn3Service.getTableDate(this.pageIndex21, this.pageSize21, this.BAM011Source);
      }
      if (code == 'BAM070') {
        this.total22 = data.rspBody.size;
        this.BAM070Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData20 = this.childbwscn3Service.getTableDate(this.pageIndex22, this.pageSize22, this.BAM070Source);
      }
      if (code == 'BAM031') {
        this.total23 = data.rspBody.size;
        this.BAM031Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData21 = this.childbwscn3Service.getTableDate(this.pageIndex23, this.pageSize23, this.BAM031Source);
      }
      if (code == 'STM007') {
        this.total24 = data.rspBody.size;
        this.STM007Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData22 = this.childbwscn3Service.getTableDate(this.pageIndex24, this.pageSize24, this.STM007Source);
      }
      if (code == 'STM015') {
        this.total25 = data.rspBody.size;
        this.STM015Source = data.rspBody.items;
        this.firstFlag = 2;
        this.newData23 = this.childbwscn3Service.getTableDate(this.pageIndex25, this.pageSize25, this.STM015Source);
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams, code: string): void {
    const { pageSize, pageIndex } = params;

    if (this.pageIndex !== pageIndex) {
      if (this.firstFlag != 1) {
        switch (code) {
          case 'BAM095':
            this.pageIndex = pageIndex;
            this.newData = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize1, this.BAM095Source);
            break;
          case 'BAM101':
            this.pageIndex = pageIndex;
            this.newData1 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize2, this.BAM101Source);
            break;
          case 'KRM048':
            this.pageIndex = pageIndex;
            this.newData2 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize3, this.KRM048Source);
            break;
          case 'KRM046':
            this.pageIndex = pageIndex;
            this.newData3 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize4, this.KRM046Source);
            break;
          case 'STM022':
            this.pageIndex = pageIndex;
            this.newData4 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize6, this.STM022Source);
            break;
          case 'STM008':
            this.pageIndex = pageIndex;
            this.newData5 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize7, this.STM008Source);
            break;
          case 'STM025':
            this.pageIndex = pageIndex;
            this.newData6 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize8, this.STM025Source);           
             break;
          case 'VAM106':
            this.pageIndex = pageIndex;
            this.newData7 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize9, this.VAM106Source);
            break;
          case 'VAM107':
            this.pageIndex = pageIndex;
            this.newData8 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize10, this.VAM107Source);
            break;
          case 'VAM108':
            this.pageIndex = pageIndex;
            this.newData9 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize11, this.VAM108Source);
            break;
          case 'VAM201':
            this.pageIndex = pageIndex;
            this.newData10 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize12, this.VAM201Source);
            break;
          case 'BAM501':
            this.pageIndex = pageIndex;
            this.newData11 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize13, this.BAM501Source);
            break;
          case 'BAM502':
            this.pageIndex = pageIndex;
            this.newData12 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize14, this.BAM502Source);
            break;
          case 'BAM504':
            this.pageIndex = pageIndex;
            this.newData13 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize15, this.BAM504Source);
            break;
          case 'BAM505':
            this.pageIndex = pageIndex;
            this.newData14 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize16, this.BAM505Source);
            break;
          case 'BAM029':
            this.pageIndex = pageIndex;
            this.newData15 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize17, this.BAM029Source);
            break;
          case 'BAM305':
            this.pageIndex = pageIndex;
            this.newData16 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize18, this.BAM305Source);
            break;
          case 'BAM306':
            this.pageIndex = pageIndex;
            this.newData17 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize19, this.BAM306Source);
            break;
          case 'BAM307':
            this.pageIndex = pageIndex;
            this.newData18 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize20, this.BAM307Source);
            break;
          case 'BAM011':
            this.pageIndex = pageIndex;
            this.newData19 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize21, this.BAM011Source);
            break;
          case 'BAM070':
            this.pageIndex = pageIndex;
            this.newData20 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize22, this.BAM070Source);
            break;
          case 'BAM031':
            this.pageIndex = pageIndex;
            this.newData21 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize23, this.BAM031Source);
            break;
          case 'STM007':
            this.pageIndex = pageIndex;
            this.newData22 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize24, this.STM007Source);
            break;
          case 'STM015':
            this.pageIndex = pageIndex;
            this.newData23 = this.childbwscn3Service.getTableDate(this.pageIndex, this.pageSize25, this.STM015Source);
            break;
        }

        // this.selectData(pageIndex, this.pageSize, this.order, this.sor);
        // this.getJCIC(pageIndex, pageSize, code);
      }
    }
  }

  setBooleanTrue() {
    this.hideJCICMASTER = true;
    this.hideVAM201 = true;
    this.hideVAM106 = true;
    this.hideVAM107 = true;
    this.hideVAM108 = true;
    this.hideBAM029 = true;
    this.hideBAM501 = true;
    this.hideBAM502 = true;
    this.hideBAM504 = true;
    this.hideBAM505 = true;
    this.hideBAM011 = true;
    this.hideBAM070 = true;
    this.hideBAM101 = true;
    this.hideBAM095 = true;
    this.hideBAM305 = true;
    this.hideBAM306 = true;
    this.hideBAM307 = true;
    this.hideKRM046 = true;
    this.hideKRM048 = true;
    this.hideSTM022 = true;
    this.hideSTM008 = true;
    this.hideSTM007 = true;
    this.hideSTM015 = true;
    this.hideSTM025 = true;
    this.hideBAM031 = true;
  }

  setBooleanFalse() {
    this.hideJCICMASTER = false;
    this.hideBAM095 = false;
    this.hideBAM101 = false;
    this.hideKRM048 = false;
    this.hideKRM046 = false;
    this.hideSTM022 = false;
    this.hideSTM007 = false;
    this.hideSTM015 = false;
    this.hideSTM008 = false;
    this.hideSTM025 = false;
    this.hideVAM106 = false;
    this.hideVAM107 = false;
    this.hideVAM108 = false;
    this.hideVAM201 = false;
    this.hideBAM501 = false;
    this.hideBAM502 = false;
    this.hideBAM504 = false;
    this.hideBAM505 = false;
    this.hideBAM029 = false;
    this.hideBAM305 = false;
    this.hideBAM306 = false;
    this.hideBAM307 = false;
    this.hideBAM011 = false;
    this.hideBAM070 = false;
    this.hideBAM031 = false;
  }

  exist() {
    for (let index = 0; index < this.list.length; index++) {
      if (this.list[index] == "JCICMASTER") { this.hideJCICMASTER = !this.hideJCICMASTER; }
      if (this.list[index] == "JCIC") { this.hideJCIC = !this.hideJCIC }
      if (this.list[index] == "VAM201") { this.hideVAM201 = !this.hideVAM201; }
      if (this.list[index] == "VAM106") { this.hideVAM106 = !this.hideVAM106; }
      if (this.list[index] == "VAM107") { this.hideVAM107 = !this.hideVAM107; }
      if (this.list[index] == "VAM108") { this.hideVAM108 = !this.hideVAM108; }
      if (this.list[index] == "BAM029") { this.hideBAM029 = !this.hideBAM029; }
      if (this.list[index] == "BAM501") { this.hideBAM501 = !this.hideBAM501; }
      if (this.list[index] == "BAM502") { this.hideBAM502 = !this.hideBAM502; }
      if (this.list[index] == "BAM504") { this.hideBAM504 = !this.hideBAM504; }
      if (this.list[index] == "BAM505") { this.hideBAM505 = !this.hideBAM505; }
      if (this.list[index] == "BAM011") { this.hideBAM011 = !this.hideBAM011; }
      if (this.list[index] == "BAM070") { this.hideBAM070 = !this.hideBAM070; }
      if (this.list[index] == "BAM101") { this.hideBAM101 = !this.hideBAM101; }
      if (this.list[index] == "BAM095") { this.hideBAM095 = !this.hideBAM095; }
      if (this.list[index] == "BAM305") { this.hideBAM305 = !this.hideBAM305; }
      if (this.list[index] == "BAM306") { this.hideBAM306 = !this.hideBAM306; }
      if (this.list[index] == "BAM307") { this.hideBAM307 = !this.hideBAM307; }
      if (this.list[index] == "KRM046") { this.hideKRM046 = !this.hideKRM046; }
      if (this.list[index] == "KRM048") { this.hideKRM048 = !this.hideKRM048; }
      if (this.list[index] == "STM022") { this.hideSTM022 = !this.hideSTM022; }
      if (this.list[index] == "STM007") { this.hideSTM007 = !this.hideSTM007; }
      if (this.list[index] == "STM015") { this.hideSTM015 = !this.hideSTM015; }
      if (this.list[index] == "STM008") { this.hideSTM008 = !this.hideSTM008; }
      if (this.list[index] == "STM025") { this.hideSTM025 = !this.hideSTM025; }
      if (this.list[index] == "BAM031") { this.hideBAM031 = !this.hideBAM031; }
    }
  }

  //轉換中文
  convert(name: string, codeVal: string) {
    switch (name) {
      //AAS003轉換中文
      case 'AAS003change':
        for (const data of this.AAS003Code) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //BAM ACCOUNT_CODE轉換中文
      case 'BAMAccountChange':
        for (const data of this.BAMAccountCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //BAM ACCOUNT_CODE2 轉換中文
      case 'BAMAccountTwoChange':
        for (const data of this.BAMAccountCodeTwo) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //BAM PURPOSE_CODE  轉換中文
      case 'BAMPurposeChange':
        for (const data of this.BAMPurposeCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //BAM095 IS_KIND 轉換中文
      case 'BAMIsKindChange':
        for (const data of this.BAMIsKindCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //BAM095 PROJECT_CODE 轉換中文
      case 'BAMProjectChange':
        for (const data of this.BAMProjectCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //BAM095 UN_MARK 轉換中文
      case 'BAMUnMarkChange':
        for (const data of this.BAMUnMarkCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //KRM048 PAY_STAT 轉換中文
      case 'KRM048PayStatChange':
        for (const data of this.KRM048PayStatCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //KRM048 PAY_CODE 轉換中文
      case 'KRM048PayChange':
        for (const data of this.KRM048PayCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //KRM048 DEBT_CODE 轉換中文
      case 'KRM048DebtChange':
        for (const data of this.KRM048DebtCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //KRM048 CLOSE_CODE 轉換中文
      case 'KRM048CloseChange':
        for (const data of this.KRM048CloseCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //KRM046 DISP_GROUP 轉換中文
      case 'KRM046DispGroupChange':
        for (const data of this.KRM046DispGroupCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //KRM046 STOP_CODE 轉換中文
      case 'KRM046StopChange':
        for (const data of this.KRM046StopCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //KRM046 AB_CODE 轉換中文
      case 'KRM046ABChange':
        for (const data of this.KRM046ABCode) {
          if (data.value == codeVal) {
            return data.viewValue;
            break;
          }
        }
      //KRM046 CLOSE_CODE 轉換中文
      case 'KRM046CloseChange':
        for (const data of this.KRM046CloseCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //STM015 APPLY_WAY 轉換中文
      case 'STM015ApplyWayChange':
        for (const data of this.STM015ApplyWayCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //VAM201 TYPE 轉換中文
      case 'VAM201TypeChange':
        for (const data of this.VAM201TypeCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //VAM201 REL_CODE 轉換中文
      // case 'VAM201RelChange':
      //   for (const data of this.VAM201RelCode) {
      //     if (data.value == codeVal) {
      //       return data.viewValue;
      //     }
      //   }
      //BAM029 XACT_CODE 轉換中文
      case 'BAM029XactChange':
        for (const data of this.BAM029XactCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //bam305/bam306/bam307 GID_CODE 轉換中文
      case 'BAMGidChange':
        for (const data of this.BAMGidCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      // bam305/bam306/bam307 REL_CODE 轉換中文
      // case 'BAMRelChange':
      //   for (const data of this.BAMRelCode) {
      //     if (data.value == codeVal) {
      //       return data.viewValue;
      //     }
      //   }
      // bam031 TRAN_ATTR 轉換中文
      case 'BAM031TranAttrChange':
        for (const data of this.BAM031TranAttrCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
      //bam031轉換中文
      case 'BAM031PurposeCode':
        for (const data of this.BAM031PurposeCode) {
          if (data.value == codeVal) {
            return data.viewValue;
          }
        }
    }
    return codeVal
  }

  // //BAM ACCOUNT_CODE轉換中文
  // BAMAccountChange(codeVal: string): string {
  //   for (const data of this.BAMAccountCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //BAM ACCOUNT_CODE2 轉換中文
  // BAMAccountTwoChange(codeVal: string): string {
  //   for (const data of this.BAMAccountCodeTwo) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //BAM PURPOSE_CODE  轉換中文
  // BAMPurposeChange(codeVal: string): string {
  //   for (const data of this.BAMPurposeCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //BAM095 IS_KIND 轉換中文
  // BAMIsKindChange(codeVal: string): string {
  //   for (const data of this.BAMIsKindCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //BAM095 PROJECT_CODE 轉換中文
  // BAMProjectChange(codeVal: string): string {
  //   for (const data of this.BAMProjectCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //BAM095 UN_MARK 轉換中文
  // BAMUnMarkChange(codeVal: string): string {
  //   for (const data of this.BAMUnMarkCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //KRM048 PAY_STAT 轉換中文
  // KRM048PayStatChange(codeVal: string): string {
  //   for (const data of this.KRM048PayStatCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //KRM048 PAY_CODE 轉換中文
  // KRM048PayChange(codeVal: string): string {
  //   for (const data of this.KRM048PayCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //KRM048 DEBT_CODE 轉換中文
  // KRM048DebtChange(codeVal: string): string {
  //   for (const data of this.KRM048DebtCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //KRM048 CLOSE_CODE 轉換中文
  // KRM048CloseChange(codeVal: string): string {
  //   for (const data of this.KRM048CloseCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //KRM046 DISP_GROUP 轉換中文
  // KRM046DispGroupChange(codeVal: string): string {
  //   for (const data of this.KRM046DispGroupCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //KRM046 STOP_CODE 轉換中文
  // KRM046StopChange(codeVal: string): string {
  //   for (const data of this.KRM046StopCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //KRM046 AB_CODE 轉換中文
  // KRM046ABChange(codeVal: string): string {
  //   for (const data of this.KRM046ABCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //KRM046 CLOSE_CODE 轉換中文
  // KRM046CloseChange(codeVal: string): string {
  //   for (const data of this.KRM046CloseCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //STM015 APPLY_WAY 轉換中文
  // STM015ApplyWayChange(codeVal: string): string {
  //   for (const data of this.STM015ApplyWayCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //VAM201 TYPE 轉換中文
  // VAM201TypeChange(codeVal: string): string {
  //   for (const data of this.VAM201TypeCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //VAM201 REL_CODE 轉換中文
  // VAM201RelChange(codeVal: string): string {
  //   for (const data of this.VAM201RelCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //BAM029 XACT_CODE 轉換中文
  // BAM029XactChange(codeVal: string): string {
  //   for (const data of this.BAM029XactCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // //bam305/bam306/bam307 GID_CODE 轉換中文
  // BAMGidChange(codeVal: string): string {
  //   for (const data of this.BAMGidCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // // bam305/bam306/bam307 REL_CODE 轉換中文
  // BAMRelChange(codeVal: string): string {
  //   for (const data of this.BAMRelCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }
  // // bam031 TRAN_ATTR 轉換中文
  // BAM031TranAttrChange(codeVal: string): string {
  //   for (const data of this.BAM031TranAttrCode) {
  //     if (data.value == codeVal) {
  //       return data.viewValue;
  //       break;
  //     }
  //   }
  //   return codeVal;
  // }

  show(who: string) {
    this.hideAll = true;
    this.hideJCIC = true;
    if (this.list.indexOf(who) !== -1) {
      const index: number = this.list.indexOf(who);
      this.list.splice(index, 1);
    } else {
      this.list.push(who);
    }
    if (this.list.length == 0) {
      this.setBooleanFalse();
    } else if (this.list.length == 25) {
      this.setBooleanFalse();
      this.list = [];
    } else {
      this.setBooleanTrue();
      this.exist();
    }
  }

  all() {
    this.hideAll = false;
    this.hideJCIC = true;
    this.setBooleanFalse();
    this.list = [];
  }
  toCurrency(amount: string) {
    let number_amount = Number(amount)
    let string_amount = Number(amount).toString()
    return amount != null ? string_amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : number_amount;
  }
  // numberArrange(amount: string){
  // let new_amount=Number(amount)
  // if(amount.substring(0,1)=='0'){
  //   return Number(amount)
  // }else{

  // }
  //   return amount != null ? amount.substr(3) : amount;
  // }
  ngOnDestroy() {
    this.menuListService.setWaterMarkSource({
      show: false
    })
  }
  // sortData() {
  //   const test = []
  //   for (let data of this.KRM048Source) {
  //     if (data.ISSUE == 'TOT') {
  //       let x = Number(data.BILL_DATE);
  //       let y = x.toString();
  //       let z = y + '00'
  //       test.push(z)

  //     } else if (data.ISSUE != 'TOT') {
  //       test.push(data.BILL_DATE)
  //     }
  //     test.reverse()
  //   }
  // }

}

