import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { BaseService } from '../base.service'

@Injectable({
	providedIn: 'root',
})
export class F03012Service extends BaseService {
	constructor(protected httpClient: HttpClient) {
		super(httpClient)
	}
	//rxjs中繼站
	private addreset = new Subject<any>();
	addreset$ = this.addreset.asObservable();

	//rxjs監聽 add頁面更新
	resetfn(): void {
		this.addreset.next()
	}

	getComePareDataSetList(baseUrl: string, jsonObject: JSON): Observable<any> {
		return this.postJsonObject(baseUrl, jsonObject)
		// let targetUrl = `${baseUrl}?page=${pageIndex}&per_page=${pageSize}`;
		// return this.postHttpClient(targetUrl);
	}
	saveComePareDataSetList(baseUrl: string, formData: FormData): Observable<any> {
		return this.postFormData(baseUrl, formData)
	}
	getRoleFunction(baseUrl: string, roleNo: String): Observable<any> {
		let targetUrl = `${baseUrl}?roleNo=${roleNo}`
		return this.postHttpClient(targetUrl)
	}
	//儲存前處理千分位
	Cut(s: string) {
		if (s != null) {
			s = s.replace(/,/g, "")
		}

		return s
	}

	update(baseUrl: string, data: any, oldCompareTable: string, oldCompareColumn: string,  oldSetValueLow: string, oldSetValueHight: string,setValueLow: string, setValueHight: string, compareType: string, oldCompareType: string): any {
		const formdata: FormData = new FormData()
		// formdata.append('setValue', data.setValue);
		formdata.append('oldCompareTable', oldCompareTable)
		formdata.append('oldCompareColumn', oldCompareColumn)
		formdata.append('oldCompareType', oldCompareType)
		formdata.append('oldSetValueHight', oldSetValueHight)
		formdata.append('oldSetValueLow', oldSetValueLow)
		formdata.append('compareTable', data.compareTable)
		formdata.append('compareColumn', data.compareColumn)
		formdata.append('compareType', compareType)
		if(compareType=="2"){
			formdata.append('setValueLow', this.Cut(setValueLow))
		}else{
			formdata.append('setValueLow', this.Cut(setValueLow))
			formdata.append('setValueHight', this.Cut(setValueHight))
		}
	
		
		return this.saveOrEditMsgString(baseUrl, formdata)
	}

	// 送出選中的項目轉json後送到後端
	submit(baseUrl: string, json: JSON): Observable<any> {
		return this.postJsonObject(baseUrl, json)
	}
	// 選中TABLE欄位資訊
	public getColumn(jsoonObject: JSON): Observable<any> {
		let targetUrl = 'f03/f03012action6'
		return this.postJsonObject(targetUrl, jsoonObject)
	}
}
