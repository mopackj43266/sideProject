import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../base.service';
import { Menu } from './menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuListService extends BaseService {
  private empNo: String = '';
  jsonData: {}
  //rxjs中繼站
  private addreset = new Subject<any>();
  addreset$ = this.addreset.asObservable();
  menuList: Menu[] = [];

  constructor(protected httpClient: HttpClient, private route: ActivatedRoute) {
    super(httpClient);
  }
  resetfn3(value: {}): void {
    console.log(value)
    this.addreset.next(value)
  }
  public getMenuData(empNo: string): Observable<any> {
    const baseURL = 'MenuListForLineBank?strEmpID=' + empNo;
    return this.postHttpClient(baseURL);
  }

  addMenu(empNo: string): void {
    this.getMenuData(empNo).subscribe(data => {
      for (const jsonObj of data.rspBody) {
        const title = jsonObj['title'];                // 功能主標題
        const dataMap = jsonObj['dataMap'];
        const icon = jsonObj['icon'];
        const keyArray = Object.keys(dataMap);         // 功能子標題
        const menuMap = new Map<string, string>();
        for (const menu of keyArray) {
          const path = dataMap[menu];                  // 功能/URL
          menuMap.set(menu, path);
        }
        this.menuList.push(new Menu(title.toString(), menuMap, icon));
      }
    });
  }

  getMap(): Menu[] {
    return this.menuList;
  }

  setMenuList() {
    this.menuList = [];
  }

  //浮水印控制區
  private WaterMarkSource = new Subject<any>();
  WaterMarkSource$ = this.WaterMarkSource.asObservable();

  setWaterMarkSource(data): void {
    this.WaterMarkSource.next(data);
  }

  //url
  private url = new Subject<any>();
  url$ = this.url.asObservable();

  setUrl(data): void {
    this.url.next(data);
  }

}
