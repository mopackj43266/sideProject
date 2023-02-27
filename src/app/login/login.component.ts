import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './login.service';
import { JSEncrypt } from 'jsencrypt/lib';
import { environment } from 'src/environments/environment';
import { MenuListService } from '../menu-list/menu-list.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  jsEncrypt: JSEncrypt = new JSEncrypt({});
  hash: string;
  hide = true;
  SrcEyeOff = "outline_visibility_off_black_48dp";
  SrcEye = "outline_remove_red_eye_black_48dp";
  imgSrc = this.SrcEyeOff;

  no: string = '';
  lineBankWord: string = '';
  private from: string = environment.from;
  private SSO_FLAG = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private menuListService: MenuListService,
  ) { }

  private ticket: string;
  ngOnInit() {
    this.menuListService.setMenuList();
    this.no = this.route.snapshot.queryParamMap.get('name');
    this.ticket = this.route.snapshot.queryParamMap.get('ticket');
    let baseUrl = 'checkReplaceSSo';
    this.loginService.posSSO_FLAG(baseUrl).subscribe(data => {
      this.SSO_FLAG = data.ssoFlag;
    });
  }

  ngAfterViewInit() {
    if (this.no != null && this.no.length > 0 && this.ticket != null && this.ticket.length > 0) {
      let element: HTMLElement = document.getElementById('loginBtn') as HTMLElement;
      element.click();
    }
  }

  async onClickMe(): Promise<void> {
    let chkTicket: string = (this.ticket != null && this.ticket.length > 0) ? this.ticket : '';
    if ('local' == this.from || 'rstn' == this.from || 'dev' == this.from) { chkTicket = ''; }
    else {
      if (this.SSO_FLAG != 'Y' && chkTicket == '') {
        alert('請由SSO登入本系統');
        return;
      }
    }
    this.no = this.no != null ? this.no.toUpperCase() : this.no;
    if (await this.loginService.initData(this.no, this.lineBankWord, chkTicket)) {
      this.router.navigate(['./home'], { queryParams: { empNo: this.no } });
      this.loginService.setBnIdle();
    } else {
      alert('帳號或密碼有誤!');
      if (('stg' == this.from || 'uat' == this.from || 'prod' == this.from) && this.SSO_FLAG != 'Y') {
        window.location.href = 'https://sso.lbtwsys.com:8443/cas/logout?service=' + environment.allowOrigin + '/sso';
      } else {
        window.location.reload();
      }
    }
  }

  changeImage() {
    this.hide = !this.hide;
    this.imgSrc = this.hide ? this.SrcEyeOff : this.SrcEye;
  }
}
