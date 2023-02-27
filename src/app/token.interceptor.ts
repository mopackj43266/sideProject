import { Injectable, OnInit } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { BaseService } from './base.service';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router, private baseService: BaseService) {}
  private from: string = environment.from;
  private allowOrigin: string = environment.allowOrigin;
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let urlStr = request.url;
    let authStr = (urlStr.indexOf('login') != -1 || urlStr.indexOf('logOut') != -1 || urlStr.indexOf('checkReplaceSSo') != -1) ? '' : ('Bearer ' + this.baseService.getToken());
    request = request.clone({
      setHeaders: {
        'Authorization': authStr,
        'Access-Control-Allow-Origin': this.allowOrigin,
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
        'Access-Control-Expose-Headers': 'ticket',
        'X-Frame-Options': 'DENY'
      }
    });

    return next.handle(request).pipe(map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        if (authStr.length > 0) {
          let token: string = authStr.replace('Bearer ', '');
          let ticket: string = event.headers.get('ticket');
          if (token != ticket) {
            if ('local' == this.from || 'rstn' == this.from || 'dev' == this.from || 'stg' == this.from) {
            } else {
              if (this.baseService.logOutAction()) {
                 if ('uat' == this.from || 'prod' == this.from) {
                  let url: string = ('uat' == this.from ? '.lbtwsys.' : '.lbtw.linebanktw.');
                  this.router.navigate(['./logOut']).then(async () => {
                    window.location.href = 'https://sso' + url + 'com:8443/cas/logout?service=' + environment.allowOrigin + '/sso';
                  });
                }
              }
            }
          }
        }
      }
      return event;
    }));
  }
}
