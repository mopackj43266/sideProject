import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { ConfirmComponent } from '../common-lib/confirm/confirm.component';
import { DeleteConfirmComponent } from '../common-lib/delete-confirm/delete-confirm.component';

@Injectable({
  providedIn: 'root'
})
export class F06008Service extends BaseService {
  constructor(
    protected httpClient: HttpClient,
    private dialog: MatDialog,
  ) { super(httpClient); }

  getData(baseUrl: string, jsonObject: JSON): Observable<any>  {
    return this.postJsonObject(baseUrl, jsonObject);
  }

  confrimCom(msg: string) {
    const childernDialogRef = this.dialog.open(ConfirmComponent, {
      data: { msgStr: msg }
    });
  }

  confrimComCancel(msg: string): MatDialogRef<DeleteConfirmComponent, any> {
    return this.dialog.open(DeleteConfirmComponent, {
      panelClass: 'mat-dialog-transparent',
      height: '30%',
      width: '30%',
      data: { msgStr: msg }
    });
  }
}
