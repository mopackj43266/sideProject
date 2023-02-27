import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Data } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { MappingCode } from '../mappingcode.model';
import { F03011Service } from './f03011.service';
import { F03011addComponent } from './f03011add/f03011add.component';
import { F03011deleteComponent } from './f03011delete/f03011delete.component';
import { F03011editComponent } from './f03011edit/f03011edit.component';

@Component({
  selector: 'app-f03011',
  templateUrl: './f03011.component.html',
  styleUrls: ['./f03011.component.css','../../assets/css/f03.css']
})
export class F03011Component implements OnInit {

  constructor(
    private fb: FormBuilder,
    private f03011Service: F03011Service,
    public dialog: MatDialog
  ) { }

  dssCalloutSource: readonly Data[] = [];
  total = 1;
  loading = true;
  pageIndex = 1;
  pageSize = 50;
  tvnoOption: MappingCode[];
  calvOption: MappingCode[];
  scklvOption: MappingCode[];

  ngOnInit(): void {
    this.getDssCallout(this.pageIndex, this.pageSize);
  }

  changePage() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.total = 1;
  }

  getDssCallout(pageIndex: number, pageSize: number) {
    const baseUrl = 'f03/f03011scn1';
    let jsonObject: any = {};
    jsonObject['page'] = pageIndex;
    jsonObject['per_page'] = pageSize;
    this.f03011Service.dssCallout(baseUrl, jsonObject).subscribe(data => {
      this.total = data.rspBody.size;
      this.dssCalloutSource = data.rspBody.items;
      this.loading = false;
      this.tvnoOption = data.rspBody.tvno;
      this.calvOption = data.rspBody.calv;
      this.scklvOption = data.rspBody.scklv;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.getDssCallout(pageIndex, pageSize);
  }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getOptionscklv(codeVal: string): string {
    for (const data of this.scklvOption) {
      if (data.codeNo == codeVal) {
        return data.codeDesc;
        break;
      }
    }
    return codeVal;
  }

  getOptioncalv(codeVal: string): string {
    for (const data of this.calvOption) {
      if (data.codeNo == codeVal) {
        return data.codeDesc;
        break;
      }
    }
    return codeVal;
  }

  getOptiontvNo(codeVal: string): string {
    for (const data of this.tvnoOption) {
      if (data.codeNo == codeVal) {
        return data.codeDesc;
        break;
      }
    }
    return codeVal;
  }

  add(){
    const dialogRef = this.dialog.open(F03011addComponent, {
      minHeight: '70vh',
      width: '50%',
      panelClass: 'mat-dialog-transparent',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') {
          this.changePage();
          this.getDssCallout(this.pageIndex, this.pageSize);
        }
      });
  }

  startEdit(tvNo: string, scklv: string, calv: string) {
    const dialogRef = this.dialog.open(F03011editComponent, {
      minHeight: '70vh',
      width: '50%',
      panelClass: 'mat-dialog-transparent',
      data: {
        tvNo: tvNo,
        scklv : scklv ,
        calv: calv
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == 'success') {
          this.changePage();
          this.getDssCallout(this.pageIndex, this.pageSize);
        }
      });
  }

  private refreshTable() {
    //this.paginator._changePageSize(this.paginator.pageSize);
  }

  delete(tvNo: string, scklv: string, calv: string) {
    const dialogRef = this.dialog.open(F03011deleteComponent, {
      minHeight: '30%',
      width: '70%',
      data: {
        tvNo: tvNo,
        scklv : scklv ,
        calv: calv
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null && result.event == '刪除成功!') {
          this.changePage();
          this.getDssCallout(this.pageIndex, this.pageSize);
        }
      });
  }
}
