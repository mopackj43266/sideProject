import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginService } from '../login/login.service';
//Nick
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {

    // return true
    if (this.authService.isLoggedIn) { return true; }

    // 儲存原始的請求地址,登入後跳轉到該地址
    this.authService.redirectUrl = url;

    // 未登入,跳轉到登入頁面
    this.router.navigate(['./']);
    return false;
  }
}
