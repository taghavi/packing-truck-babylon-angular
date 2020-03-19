import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service'


@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: []
})
export class UiComponent implements OnInit {

  message: unknown;
  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
  }

}
