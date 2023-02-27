import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { BaseService } from 'src/app/base.service';

import { DynamicDirective } from 'src/app/common-lib/directive/dynamic.directive';
import { MenuListService } from 'src/app/menu-list/menu-list.service';
import { environment } from 'src/environments/environment';
import { Childscn6Service } from '../childscn6/childscn6.service';
import { Childscn14Service } from './childscn14.service';
import { Childscn14page1Component } from './childscn14page1/childscn14page1.component';

import { Childscn14page3Component } from './childscn14page3/childscn14page3.component';
@Component({
  selector: 'app-childscn14',
  templateUrl: './childscn14.component.html',
  styleUrls: ['./childscn14.component.css', '../../../assets/css/child.css']
})
export class Childscn14Component implements OnInit {
  @Input() closeButton: boolean = false;
  @Input() closeButton2: boolean = false;
  constructor(
    // private componenFactoryResolver: ComponentFactoryResolver,
    private childscn6Service: Childscn6Service,
    private childscn14Service: Childscn14Service,
    public dialog: MatDialog,
    private menuListService: MenuListService,
  ) { }

  @ViewChild(DynamicDirective) appDynamic: DynamicDirective;
  private applno: string;
  private search: string;
  private docKey: string;
  private cuid: string;
  private cuNm: string;
  private host: String;
  imageSource: Data[] = [];
  total = 1;
  loading = false;
  pageSize = 10;
  pageIndex = 1;
  // component = new Map<Page, any>(
  //   [
  //     [Page.Page1, Childscn14page1Component],
  //     [Page.Page2, Childscn14page2Component],
  //     [Page.Page3, Childscn14page3Component],
  //   ]
  // );
  // nowPage = Page.Page1;
  // readonly Page = Page;
  ngOnChanges() {
    return this.closeButton
  }
  ngOnInit(): void {
    this.applno = sessionStorage.getItem('applno');
    this.search = sessionStorage.getItem('search');
    this.host = this.getHost();
    const baseUrl = 'f01/childscn6action2';
    let jsonObject: any = {};
    this.childscn6Service.getDate(baseUrl, jsonObject).subscribe(data => {
      this.cuid = data.rspBody[0].empNo;
      this.cuNm = data.rspBody[0].empName;
      this.getImageDetail(this.pageIndex, this.pageSize);
    });
  }

  ngAfterViewInit() {
    // this.changePage(this.nowPage);
  }

  getSearch(i: string) {
    if (this.search == 'N') {
      if (i && i != null) {
        if (i.includes(BaseService.userId)) {
          return 'N';
        } else if (i == 'K') {
          return 'N';
        } else {
          return 'Y';
        }
      } else {
        return 'Y';
      }
    } else {
      return this.search;
    }
  }

  getHost(): String {
    var origin = window.location.origin;
    var host = origin.substring(0, origin.lastIndexOf(":"));
    return host;
  }

  getImageDetail(pageIndex: number, pageSize: number) {
    const baseUrl = 'f01/childscn14action1';
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['cuid'] = this.cuid;
    jsonObject['cuNm'] = this.cuNm;
    this.childscn14Service.childscn14(baseUrl, jsonObject).subscribe(data => {

      this.imageSource = data.rspBody.items;
      this.total = data.rspBody.items.size;
      if (this.closeButton2 == true) {
        // let imageSource = [];
        this.imageSource = data.rspBody.items.filter(c => c.UPLOAD_USER != null);
        // for(var i of this.imageSource)
        // {
        //     if(i.UPLOAD_USER != "" && i.UPLOAD_USER !=null )
        //     {
        //       this.imageSource.filter
        //     }
        // }
      }

    });
  }

  // onQueryParamsChange(params: NzTableQueryParams): void {
  //   const { pageSize, pageIndex } = params;
  //   this.pageSize = pageSize;
  //   this.pageIndex = pageIndex;
  //   this.getImageDetail(this.pageIndex, this.pageSize);
  // }

  //上傳影像
  uploadImage() {
    const dialogRef = this.dialog.open(Childscn14page3Component, {
      panelClass: 'mat-dialog-transparent',
      data: {
        DOC_ID: '',
        FILE_ATTACHMENT_ID: '',
        REMARK: '',
        UPLOAD_PERSON: this.cuid,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.event == 'success') {
        this.getImageDetail(this.pageIndex, this.pageSize);
      }
    });
  }

  //刪除影像
  async deleteFile(uploadId: string, docKey: string) {
    if (!uploadId.includes(this.cuid) && uploadId != '' && uploadId != null) {
      const deleteDialogRef = this.dialog.open(Childscn14page1Component, {
        data: { msgStr: "無法刪除非本人上傳之圖檔" }
      });
      return;
    }
    let jsonObject: any = {};
    jsonObject['applno'] = this.applno;
    jsonObject['docKey'] = docKey;
    jsonObject['cuId'] = this.cuid;
    jsonObject['cuNm'] = this.cuNm;

    this.childscn14Service.childscn14('f01/childscn14action3', jsonObject).subscribe(data => {
      if (data.rspCode == '0000') {
        const deleteDialogRef = this.dialog.open(Childscn14page1Component, {
          data: { msgStr: data.rspMsg }
        });
        deleteDialogRef.afterClosed().subscribe(result => {
          this.getImageDetail(this.pageIndex, this.pageSize);
        });
      }
    });
  }

  //下載影像
  downloadFile(docKey: string) {
    let jsonObject: any = {};
    let blob: Blob;
    jsonObject['applno'] = this.applno;
    jsonObject['docKey'] = docKey;
    jsonObject['cuId'] = this.cuid;
    jsonObject['cuNm'] = this.cuNm;
    this.childscn14Service.childscn14('f01/childscn14action4', jsonObject).subscribe(data => {
      const byteCharacters = atob(data.rspBody.file);
      const fileName = data.rspBody.fileName;
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: data.rspBody.type });

      let downloadURL = window.URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      link.click();

    });
  }

  openUrl(value: string) {
    let url = window.open(this.host + ':18443/LineBankViewOne/system/viewer.html?docKey=' + value + '&cuId=' + this.cuid + '&cuNm=' + this.cuNm);
    this.menuListService.setUrl({
      url: url
    });
  }
}
