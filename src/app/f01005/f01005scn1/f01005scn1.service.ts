import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BaseService } from 'src/app/base.service';

@Injectable({
  providedIn: 'root'
})
export class F01005scn1Service extends BaseService {

  constructor(protected httpClient: HttpClient) { super(httpClient); }
  private JCICSource = new Subject<any>();
  JCICSource$ = this.JCICSource.asObservable();
  private JCICAddSource = new Subject<any>();
  JCICAddSource$ = this.JCICAddSource.asObservable();
  private JCICItemsSource = new Subject<any>();
  JCICItemsSource$ = this.JCICItemsSource.asObservable();

  setJCICSource(data): void {
    this.JCICSource.next(data);
  }

  setJCICAddSource(data): void {
    this.JCICAddSource.next(data);
  }

  setJCICItemsSource(data): void {
    this.JCICItemsSource.next(data);
  }

  dialogData: any;

  saveOrEditMsgJson(baseUrl: string, json: JSON): any {
    return this.saveOrEditMsgJson(baseUrl, json);
  }

  send(baseUrl: string, json: JSON){
    return this.postJsonObject( baseUrl, json);
  }
}
