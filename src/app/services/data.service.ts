import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { ReplaySubject } from 'rxjs'

@Injectable()
export class DataService {

  private msgSource = new ReplaySubject(); //BehaviorSubject<object>(Object);
  currentMessage = this.msgSource.asObservable();

  constructor() { 

  }

  changeMessage(msg:object) {
    console.log(msg);
    this.msgSource.next(msg);
  }

}