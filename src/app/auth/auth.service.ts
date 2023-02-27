import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

//Nick
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false; //預設未登入

  // 記錄登入之後,需要跳轉到原來請求的地址
  redirectUrl: string;
// 登入
  login(): void {
    this.isLoggedIn = true
  }
// 登出
  logout(): void {
    this.isLoggedIn = false;
  }
}
