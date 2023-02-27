import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';

interface sysCode {
  codE_NO: string;
  codE_DESC: string;

}

@Injectable({
  providedIn: 'root'
})
export class F03001Service extends BaseService {
  // RuleCode!: sysCode[]  ;
  Condition!: sysCode[] ;

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  private async getRuleCodeOption(value: string): Promise<Observable<any>> {
    let formData = new FormData();
    formData.append('value', value);
    const baseUrl = 'https://localhost:44316/RuleCode/GetRuleCode';
    return await this.postFormData(baseUrl, formData).toPromise();
  }

}
