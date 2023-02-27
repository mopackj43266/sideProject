import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { MappingCode } from 'src/app/mappingcode.model';
import { Childbwscn13Service } from './childbwscn13.service';
import { Childbwscn13addComponent } from './childbwscn13add/childbwscn13add.component';
import { Childbwscn13deleteComponent } from './childbwscn13delete/childbwscn13delete.component';
import { Childbwscn13editComponent } from './childbwscn13edit/childbwscn13edit.component';

//網頁資訊
interface webInfoData {
  applno: string;
  daytime: string;
  empno: string;
  messageContent: string;
  rowId: string;
  web: string;
  webAddr: string;
  webImg: string;
  ImgSrc: string;
}

@Component({
  selector: 'app-childbwscn13',
  templateUrl: './childbwscn13.component.html',
  styleUrls: ['./childbwscn13.component.css', '../../../assets/css/child.css']
})
export class Childbwscn13Component implements OnInit {

  constructor(
    private childbwscn13Service: Childbwscn13Service,
    public dialog: MatDialog
  ) { }

  private applno: string;
  private search: string;
  private page: string;

  imageSrcB: string = "outline_photo_black_48dp";
  imageSrcW: string = "outline_image_white_48dp";
  imageSrc: string;

  webInfoSource: readonly Data[] = [];
  webInfoSource2: webInfoData[] = [];
  total = 1;
  pageIndex = 1;
  pageSize = 50;
  webAddrOption: MappingCode[];

  image: any;

  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.page = sessionStorage.getItem('page');
    this.imageSrc = this.imageSrcB;
  }

  getApplno(): String {
    return this.applno;
  }

  getSearch(): String {
    return this.search;
  }

  getPage(): String {
    return this.page;
  }

  ngAfterViewInit() {
    this.getWebInfo(this.pageIndex, this.pageSize);
  }

  getWebInfo(pageIndex: number, pageSize: number) {
    const baseurl = 'f01/childbwscn13';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.childbwscn13Service.getWebInfo(baseurl, jsonObject).subscribe(data => {
      this.total = data.rspBody.size;
      this.webInfoSource = data.rspBody.items;
      this.webInfoSource2 = data.rspBody.items;
      this.webInfoSource2.forEach(c => c.ImgSrc = this.imageSrcB);
      this.webAddrOption = data.rspBody.webAddr;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getWebInfo(pageIndex, pageSize);
  }

  openView(web_img: any) {
    let base64String = 'data:image/jpeg;base64,' + web_img;
    this.image = base64String;
  }

  getOptionDesc(codeVal: string): string {
    for (const data of this.webAddrOption) {
      if (data.codeNo == codeVal) {
        return data.codeDesc;
        break;
      }
    }
    return codeVal;
  }

  addNew() {
    const dialogRef = this.dialog.open(Childbwscn13addComponent, {
      height: '100%',
      panelClass: 'mat-dialog-transparent',
      data: {
        applno: this.applno,
        search: this.search,
        webAddrOption: this.webAddrOption
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') { this.refreshTable(); }
    });
  }

  startEdit(rowid: string, webCode: string, webUrl: string, msgContent: string, webImg: string) {
    const dialogRef = this.dialog.open(Childbwscn13editComponent, {
      data: {
        webAddrValue: webCode + ',' + webUrl,
        webAddrOption: this.webAddrOption,
        webAddrUrl: webUrl,
        search: this.search,
        webInfoContent: msgContent,
        base64: webImg,
        rowId: rowid
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') { this.refreshTable(); }
    });
  }

  deleteItem(rowid: string, webCode: string, webUrl: string, msgContent: string, webImg: string) {
    const dialogRef = this.dialog.open(Childbwscn13deleteComponent, {
      data: {
        webAddrValue: webCode + ',' + webUrl,
        webAddrOption: this.webAddrOption,
        webAddrUrl: webUrl,
        search: this.search,
        webInfoContent: msgContent,
        base64: webImg,
        rowId: rowid
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') { this.refreshTable(); }
    });
  }

  private refreshTable() {
    this.changePage();
    this.getWebInfo(this.pageIndex, this.pageSize);
  }

  changePage() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 1;
  }

  //滑鼠移進切換圖示
  mouseover(rowId: string) {
    this.webInfoSource2.find(c => c.rowId == rowId).ImgSrc = this.imageSrcW;
  }
  //滑鼠移出切換圖示
  mouseout(rowId: string) {
    this.webInfoSource2.find(c => c.rowId == rowId).ImgSrc = this.imageSrcB;
  }
}
