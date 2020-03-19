import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';
import { DataService } from '../services/data.service'


@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;
  message: unknown;
  constructor(private engServ: EngineService,private data: DataService ) { }

  ngOnInit() {
    var baseInfo = this.engServ.createScene(this.rendererCanvas);
    this.data.currentMessage.subscribe( message =>  this.engServ.AddBox(baseInfo, message))

    this.engServ.animate();
  }
}
