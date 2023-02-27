import { Injectable } from '@angular/core';
import { CaseParams } from '../interface/base';

@Injectable({
  providedIn: 'root'
})
export class ChildrenService {

  constructor() { }

  private caseParams: CaseParams = null;

  setData(data: CaseParams): void {
    this.caseParams = data
  }

  getData(): CaseParams {
    return this.caseParams;
  }

}
