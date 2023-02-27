import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator, PageEvent } from '@angular/material/paginator'
import { MatSort, Sort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { ConfirmComponent } from '../common-lib/confirm/confirm.component'
import { OptionsCode } from '../interface/base'
import { MappingCode } from '../mappingcode.model'
import { F03012Service } from './f03012.service'
import { F03012addComponent } from './f03012add/f03012add.component'
import { F03012editComponent } from './f03012edit/f03012edit.component'
import { NzTableQueryParams } from 'ng-zorro-antd/table'
import { NzAlertModule } from 'ng-zorro-antd/alert'
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'

interface checkBox {
	id: number
	setValueHight: number
	setValueLow: number
	compareType: string
	compareColumn: string
	compareTable: string
	completed: boolean
}

@Component({
	selector: 'app-f03012',
	templateUrl: './f03012.component.html',
	styleUrls: ['./f03012.component.css', '../../assets/css/f03.css'],
})

export class F03012Component implements OnInit, AfterViewInit {
	isAllCheck: boolean = false
	chkArray: checkBox[] = []
	selectedValue: string = 'default'
	selectedValue1: string = ""
	total: any
	pageSize = 10
	pageIndex = 1
	sysCode: OptionsCode[] = []
	// selectedColumn: OptionsCode[] = [];
	compareTableCode: OptionsCode[] = []
	compareColumnCode: OptionsCode[] = []
	compareType: OptionsCode[] = []
	compareTypeValue: any[] = []
	currentPage: PageEvent
	currentSort: Sort
	allComplete: boolean = false
	one: any[] = [] //裝一開始的資料表
	x: string
	height: string
	addreset$: Subscription //rxjs訂閱者
	low: string
	childusedata: any
	index = []
	aaa: string
	// 20211005 新增
	checked = [] //存取被選到的物件
	compareItems = [] //物件陣列
	useFlag: boolean //用來控制元件是否顯示於頁面
	isEdit: boolean = true
	setValueLow: number
	setValueHight: number
	constructor(private f03012Service: F03012Service, public dialog: MatDialog, private alert: NzAlertModule, private router: Router) {
		this.addreset$ = this.f03012Service.addreset$.subscribe((data) => {
			this.getComePareDataSetList(this.pageIndex, this.pageSize);
		});
	}

	ngOnInit(): void {

		this.getCompareTable()
		this.getComePareDataSetList(this.pageIndex, this.pageSize)
		// this.currentPage = {
		//   pageIndex: 1,
		//   pageSize: 3,
		//   length: null
		// };

		this.currentSort = {
			active: '',
			direction: '',
		}
	}



	// 取得資料比對下拉項目
	getCompareTable() {
		this.selectedValue1 = ""
		this.f03012Service.getSysTypeCode('COMPARE_TABLE').subscribe(data => {
			this.compareTableCode.push({ value: '', viewValue: '請選擇' })

			for (const jsonObj of data.rspBody.mappingList) {
				const codeNo = jsonObj.codeNo
				const desc = jsonObj.codeDesc
				this.compareTableCode.push({ value: codeNo, viewValue: desc })
			}
		})
	}

	// 分頁切換
	onQueryParamsChange(params: NzTableQueryParams): void {
		const { pageSize, pageIndex } = params
		this.getComePareDataSetList(pageIndex, pageSize)
	}

	mappingCodeSource = new MatTableDataSource<any>()

	ngAfterViewInit(): void {
		this.selectedValue1 = ""
		this.getComePareDataSetList(this.pageIndex, this.pageSize)
		this.paginator.page.subscribe((page: PageEvent) => {
			this.currentPage = page
			this.getComePareDataSetList(this.pageIndex, this.pageSize)
		})
	}

	totalCount: any
	@ViewChild('paginator', { static: true }) paginator: MatPaginator
	@ViewChild('sortTable', { static: true }) sortTable: MatSort
	compareDataSetSource = new MatTableDataSource<any>()
	compareTableOption: MappingCode[]
	compareColumnOption: MappingCode[]

	// 取得資料比對資料
	getComePareDataSetList(pageIndex: number, pageSize: number) {
		const baseUrl = 'f03/f03012scn1'
		let jsonObject: any = {}
		jsonObject['page'] = pageIndex
		jsonObject['per_page'] = pageSize

		this.f03012Service.getComePareDataSetList(baseUrl, jsonObject).subscribe(data => {
			// 取得items裡面的單一值
			// for(const j of data.rspBody.items)
			// {
			// 	this.compareTypeValue.push(j['codeDesc'])
			// }
			this.total = data.rspBody.size
			this.childusedata = data.rspBody.items
			this.compareDataSetSource.data = data.rspBody.items
			this.compareTableOption = data.rspBody.compareTable
			this.compareColumnOption = data.rspBody.comparColumn
			this.one = data.rspBody.items
			// this.limit2()
			this.useFlag = false
		})
	}

	// limit(x: string, id: string, name: string) {
	// 	x = x.replace(/\D/g, '')
	// 	if (x.length > 0) {
	// 		x = x.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	// 	}
	// 	for (const item of this.one) {
	// 		if (item.id == id) {
	// 			switch (name) {
	// 				case 'setValueLow':
	// 					item.setValueLow = x
	// 					break
	// 				case 'setValueHight':
	// 					item.setValueHight = x
	// 					break
	// 			}
	// 		}
	// 	}
	// }
	// 取得資料轉換千分位
	// limit2() {
	// 	for (const item of this.one) {
	// 		item.setValueHight = item.setValueHight != undefined ? (item.setValueHight + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') : item.setValueHight
	// 		item.setValueLow = item.setValueLow != undefined ? (item.setValueLow + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') : item.setValueLow
	// 	}
	// }

	//儲存前處理千分位
	Cut(s: string) {
		if (s != null) {
			s = s.replace(/,/g, "")
		}

		return s
	}

	// 刪除
	delete(compareTable: string, compareColumn: string, compareType: string, setValueHight: string, setValueLow: string) {
		let pageSize = 10
		let pageIndex = 1
		let msg = ''
		const url = 'f03/f03012action3'
		const formdata: FormData = new FormData()
		formdata.append('compareTable', compareTable)
		formdata.append('compareColumn', compareColumn)
		formdata.append('compareType', compareType)
		if (compareType == '2') {
			formdata.append('setValueLow', setValueLow)
		} else if (compareType == '1') {
			formdata.append('setValueHight', setValueHight)
			formdata.append('setValueLow', setValueLow)
		}
		this.f03012Service.saveComePareDataSetList(url, formdata).subscribe(data => {
			msg = data.rspMsg
		})
		this.getComePareDataSetList(pageIndex, pageSize)


		setTimeout(() => {
			const DialogRef = this.dialog.open(ConfirmComponent, { data: { msgStr: msg } })
		}, 1500)
		this.getComePareDataSetList(pageIndex, pageSize)

	}

	// 新增
	add() {
		const dialogRef = this.dialog.open(F03012addComponent, {
			panelClass: 'mat-dialog-transparent',
			minHeight: '70vh',
			width: '50%',
		})

		dialogRef.afterClosed().subscribe(result => {
			if (result != null && (result.event == 'success' || result == '1')) {

				this.refreshTable()
				this.dialog.closeAll()
			}
			// window.location.reload();
		})
	}
	// 編輯
	edit(compareTable: string, compareColumn: string, setValueLow: string, setValueHight: string, compareType: string) {
		const dialogRef = this.dialog.open(F03012editComponent, {
			panelClass: 'mat-dialog-transparent',
			minHeight: '70vh',
			width: '50%',
			data: {
				compareTable: compareTable,
				compareColumn: compareColumn,
				compareType: compareType,
				setValueHight: setValueHight,
				setValueLow: setValueLow,
				oldSetValueLow: setValueLow,
				oldSetValueHight: setValueHight,
				oldCompareColumn: compareColumn,
				oldCompareType: compareType,

			},
		})
		dialogRef.afterClosed().subscribe(result => {
			if (result != null && result.event == 'success') {
				this.refreshTable()
			}
		})
	}
	private refreshTable() {
		this.paginator._changePageSize(this.paginator.pageSize)
	}

	// 清除資料
	Clear() {
		// this.compareTableCode = null;
		this.compareTableCode = [];
		this.selectedValue1 = '';
		this.getCompareTable();
		this.getComePareDataSetList(this.pageIndex, this.pageSize)
	}

	getOptionCompareTable(codeVal: string): string {
		for (const data of this.compareTableOption) {
			if (data.codeNo == codeVal) {
				return data.codeDesc
				break
			}
		}
		return codeVal
	}

	getOptionCompareColumn(codeVal: string): string {
		for (const data of this.compareColumnCode) {
			if (data.value == codeVal) {
				return data.viewValue
				break
			}
		}
		return codeVal
	}
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value
		this.mappingCodeSource.filter = filterValue.trim().toLowerCase()
	}
	// changeSelect(){
	//   this.selectedColumn=[];
	//   this.f03012Service.getSysTypeCode(this.selectedValue1)
	//   .subscribe(data => {
	//     for(const jsonObj of data.rspBody.mappingList){
	//       const codeNo = jsonObj.codeNo;
	//       const desc = jsonObj.codeDesc;
	//       this.selectedColumn.push({value:codeNo, viewValue:desc})
	//     }
	//   })

	// }
	queryByCompareTable(compareTable: string) {
		this.selectedValue1 = compareTable
		let msg = ''
		const url = 'f03/f03012action4'
		const formdata: FormData = new FormData()
		formdata.append('compareTable', compareTable)
		this.total = ''
		this.f03012Service.saveComePareDataSetList(url, formdata).subscribe(data => {
			// msg = data.rspMsg;
			// const items = data.rspBody.items.filter(item => item.compareType !== null && item.setValueHight !== null && item.setValueLow !== null)
			const items = data.rspBody.items
			this.totalCount = items.length
			this.compareDataSetSource.data = items
			this.one = data.rspBody.items
			// this.limit2()
			this.useFlag = true
		})

	}


	// checkBox狀態變化時觸發此function，改變checkBox狀態同時存取該項目入checked陣列
	changeChkStatus(id) {
		// if(this.useFlag == false) {
		//   return false
		// }

		this.compareDataSetSource.data.forEach(chk => {
			if (chk.id === id) {
				chk.isChk = !chk.isChk
				// this.getCompareDataSet();
			}
		})
	}

	// 送出選中項
	submit() {

		// this.getCompareDataSet();
		let jsonObjects: any = []
		const url = 'f03/f03012action1'
		let msg = ''
		this.checked = this.compareDataSetSource.data.filter(i => i.isChk == true)
		//如果未選中任何項目
		if (this.checked.length == 0) {
			this.dialog.open(ConfirmComponent, {
				data: { msgStr: "未選中任何項目!!" },
			})
			return false
		}

		for (let obj of this.checked) {
			let jsonObject: any = {}
			jsonObject['compareTable'] = obj.compareTable
			jsonObject['compareColumn'] = obj.compareColumn
			jsonObject['compareType'] = obj.compareType

			if (obj.compareType == '2') {

				//檢核是否大於1
				if (Number(obj.setValueLow) >= 1) {
					this.dialog.open(ConfirmComponent, {
						data: { msgStr: "「相對值」不可以大於1" }
					});
					return;
					//檢核是否有小數
				} if (!(obj.setValueLow.includes('.'))) {
					this.dialog.open(ConfirmComponent, {
						data: { msgStr: "請填小數點" }
					});
					return;
					//檢核是否有空值
				} if (obj.setValueLow.trim() == '') {
					this.dialog.open(ConfirmComponent, {
						data: { msgStr: "「相對值」欄位不可為空" }
					});
					return
				}
				jsonObject['setValueLow'] = obj.setValueLow != '' ? Number(obj.setValueLow).toString() : "0";
			}

			else if (obj.compareType == '1') {
				if (Number(obj.setValueLow) != null || Number(obj.setValueHight) != null) {
					//檢核是否為整數
					if ((obj.setValueLow.includes('.'))) {
						this.dialog.open(ConfirmComponent, {
							data: { msgStr: "請填整數" }
						});
						return;
					}
					//檢核最高有無大於最低
					else if (Number(obj.setValueHight) < Number(obj.setValueLow)) {

						this.dialog.open(ConfirmComponent, {
							data: { msgStr: "「絕對值」設定最高門檻需大於設定最低門檻!!" },
						})
						return
						//檢核是否有空值
					} else if (Number(obj.setValueHight) == null || Number(obj.setValueLow) == null) {

						this.dialog.open(ConfirmComponent, {
							data: { msgStr: "「絕對值」欄位不可為空!!" },
						})
						return
						//檢核是否有空值
					} else if (obj.setValueHight.trim() == '' || obj.setValueLow.trim() == '') {

						this.dialog.open(ConfirmComponent, {
							data: { msgStr: "「絕對值」欄位不可為空!!" },
						})
						return
					}
					//檢核最高有無等於最低
					else if (Number(obj.setValueHight) == Number(obj.setValueLow)) {

						this.dialog.open(ConfirmComponent, {
							data: { msgStr: '「絕對值」設定最高門檻不能等於設定最低門檻!!' }
						});

						return
						//檢核是否有空值
					} else if (obj.setValueHight.length == 0 || obj.setValueLow.length == 0) {

						this.dialog.open(ConfirmComponent, {
							data: { msgStr: '「絕對值」欄位不可為空!!' }
						});

						return
					} else {
						jsonObject['setValueHight'] = obj.setValueHight != '' || obj.setValueLow != '' ? Number(obj.setValueHight).toString() : "0";
						jsonObject['setValueLow'] = obj.setValueLow != '' || obj.setValueHight != '' ? Number(obj.setValueLow).toString() : "0";
					}
				} else {
					this.dialog.open(ConfirmComponent, {
						data: { msgStr: '「絕對值」欄位不可為空!!' }
					});

					return
				}

			}

			if (obj.compareType == null || obj.setValueHight == '' || obj.compareType == '' || obj.setValueLow == '') {

				this.dialog.open(ConfirmComponent, {
					data: { msgStr: "有欄位為空值，儲存失敗" },
				})

				return
			} else {

				jsonObjects.push(jsonObject)
			}
		}
		this.f03012Service.submit(url, jsonObjects).subscribe(data => {
			this.dialog.open(ConfirmComponent, {
				data: { msgStr: data.rspMsg },
			})
			this.changePage();
      window.location.reload();
			// let currentUrl = this.router.url;
			// this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			// 	this.router.navigate([currentUrl]);
			// });
			// this.getComePareDataSetList(this.pageIndex, this.pageSize)
		})
	}
	changePage() {
		this.pageIndex = 1
		this.pageSize = 10
		this.total = 1
	}
	test(option: number, value: 1): boolean {
		return option === value
	}

	// 千分號標點符號(form顯示用)
	data_number(p: number) {
		this.x = '';
		this.x = (p + "").replace(/,/g, "")
		if (this.x != null) {
			this.x = this.x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		}
		return this.x
	}
	// 數字靠右
	getStyle(value: string) {
		// value = this.toNumber(value);
		value = value != null ? value.replace(',', '') : value;
		return {
			'text-align': this.isNumber(value) ? 'right' : 'left'
		}
	}
	isNumber(value: any) { return /^-?[\d.]+(?:e-?\d+)?$/.test(value); }

	//去除符號/中英文
	toNumber(data: string) {
		return data != null ? data.replace(/[^\w\s]|_/g, '.') : data;

	}
	//+逗號
	toCurrency(amount: string) {
		return amount != null ? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : amount;
	}
	//檢核整數
	numberOnly(i: string, id: string) {
		var num = 0;
		num = Number(i);
		for (var t of this.compareDataSetSource.data) {

			if (t.id == id) {
				if (num > 1) {
					this.dialog.open(ConfirmComponent, {
						data: { msgStr: "最大值1" },
					})
					t.setValueLow = '';
				}
			}
		}

	}


	//檢核小數
	checkPoint(i: string, id: string) {
		var num = 0;
		num = Number(i);
		for (var t of this.compareDataSetSource.data) {
			if (t.id == id) {
				if (i.includes('.')) {
					this.dialog.open(ConfirmComponent, {
						data: { msgStr: "請填寫整數" },
					})
					t.setValueLow = '';
				}
			}
		}
	}

	//檢核空白
	checkSpace(i: string) {
		if (i.trim() == '') {
			this.dialog.open(ConfirmComponent, {
				data: { msgStr: "「相對值」欄位不可為空" }
			});
		}
	}
	//最高
	numberhingt(i: string, id: string) {
		this.height = i;
		var num = 0;
		num = Number(i);

		// for (var t of this.compareDataSetSource.data) {

		// 	if (t.id == id) {
		// 		if (num > 99) {
		// 			this.dialog.open(ConfirmComponent, {
		// 				data: { msgStr: "最大值99" },
		// 			})
		// 			t.setValueHight = '';
		// 		}
		// 	}
		// }


	}

}
