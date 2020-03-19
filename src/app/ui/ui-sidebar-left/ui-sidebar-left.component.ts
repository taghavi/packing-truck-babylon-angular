import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service'
import { float } from 'babylonjs';

class selectedVal {
  title: string;
  lenth: float;
  width: float;
  height: float;
}

@Component({
  selector: 'app-ui-sidebar-left',
  templateUrl: './ui-sidebar-left.component.html',
  styleUrls: ['./ui-sidebar-left.component.css']
})
export class UiSidebarLeftComponent implements OnInit {

  message: unknown;
  dimensions: selectedVal[];
  // selectedDim: selectedVal;
  
  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message)
   
    this.dimensions = [
      {title: 'ICD_1', lenth:11.5, width:11.0,height:23.9},
      {title: 'ICD_2', lenth:11.5, width:11.0,height:25.5},
      {title: 'ICD_3', lenth:14.3, width:11.0,height:23.9},
      {title: 'ICD_4', lenth:14.3, width:11.0,height:25.5},
    ]
   
  }

  
  addNewBox(l,w,h,name) {
    var dimension= {
      length: l,
      width: w,
      height: h,
      name: name
    };
    this.data.changeMessage(dimension)
  }
}
