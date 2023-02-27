import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class Childscn17Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }

  getRestartList(applno: string){
    const baseUrl = 'f01/childscn17';
    let targetUrl = `${baseUrl}?applno=${applno}`;
    return this.postHttpClient(targetUrl);
  }
}
