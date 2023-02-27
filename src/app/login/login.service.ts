import { BaseService } from 'src/app/base.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OptionsCode } from '../interface/base';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AES, mode, pad, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService {
  RuleCode: OptionsCode[] = null;
  Condition: OptionsCode[] = null;

  constructor(
    protected httpClient: HttpClient,
    private bnIdle: BnNgIdleService,
    private router: Router,
    private baseService: BaseService
  ) { super(httpClient); }

  private routerGoUrl(): void {
    this.bnIdle.stopTimer();
    // window.localStorage.clear();
    localStorage.removeItem('empId');
    localStorage.removeItem('empName');
    localStorage.removeItem('empNo');
    localStorage.removeItem('token');
    window.sessionStorage.clear();
    let form: string = environment.from;
    if ('uat' == form || 'prod' == form) {
      this.router.navigate(['./logOut']).then(async () => {
        window.location.href = 'https://sso.lbtwsys.com:8443/cas/logout?service=' + environment.allowOrigin + '/sso';
      });
    } else {
      this.router.navigate(['./logOut']).then(() => {
        window.location.reload();
      });
    }
  }

  // 登入閒置登出
  public setBnIdle(): void {
    if (!this.bnIdle['idle$']) {
      this.bnIdle.startWatching(60 * 30).subscribe((isTimedOut: boolean) => {
        if (isTimedOut) { this.routerGoUrl(); }
      });
    } else {
      this.bnIdle.resetTimer();
    }
  }

  private async checkEmpNoPromise(empNo: string, lineBankWord: string, ticket: string): Promise<Observable<any>> {
    const formData = new FormData();
    formData.append("username", empNo);
    if (lineBankWord != null && lineBankWord != '' && lineBankWord != undefined) {
      let Key = enc.Utf8.parse("MpWsyseHtJywNON8");
      let aesWord: any = AES.encrypt(lineBankWord, Key, {
        mode: mode.ECB,
        padding: pad.Pkcs7
      }).ciphertext.toString();
      formData.append("empword", aesWord);
    }
    else {
      formData.append("empword", lineBankWord);
    }
    formData.append("ticket", ticket);
    const baseURL = 'login';
    return await this.postFormData(baseURL, formData).toPromise();
  }

  public async initData(empNo: string, lineBankWord: string, ticket: string): Promise<boolean> {
    let isOk: boolean = false;
    let tokenStr: string = '';
    await this.checkEmpNoPromise(empNo, lineBankWord, ticket).then((data: any) => {
      if (data.rspCode == '0000') {
        tokenStr = data.rspBody.token;
        localStorage.setItem("loginKey", 'change');
        localStorage.setItem("empNo", empNo);
        localStorage.setItem("empName", data.rspBody.empName);
        localStorage.removeItem('loginKey');
        this.baseService.setUserId(empNo);
        this.baseService.setEmpName(data.rspBody.empName);
        this.baseService.setEmpId(data.rspBody.empId);
      }
      isOk = data.rspCode == '0000';
    });
    if (localStorage.getItem('token') != null && tokenStr != localStorage.getItem('token')) {
      localStorage.setItem("oldToken", localStorage.getItem('token'));
      localStorage.setItem("token", tokenStr);
    } else {
      localStorage.removeItem('oldToken');
      localStorage.setItem("token", tokenStr);
    }
    return isOk;
  }

  posSSO_FLAG(baseUrl: string): Observable<any> {
    return this.postHttpClient(baseUrl);
  }

}
