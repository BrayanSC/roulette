import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { extend } from "extend";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'roulette';

  test: Roulette;
  valor: number = 0;
  myStyles = {
    'transform': 'translate(0px, -30px)'
    // 'background-color': 'lime',
    // 'font-size': '20px',
    // 'font-weight': 'bold'
  }



  constructor() { }

  startNow() {
    this.test.start();
    this.test.p.stopCallback
  }

  ngOnInit() {
    this.test = new Roulette((<HTMLInputElement>document.getElementById("testRR")));
  }

}

export class Roulette {


  defaultSettings: any = {
    speed: 10, // x > 0
    stopImageNumber: 2, // x >= 0 or null or -1
    // rollCount: 3, // x >= 0
    duration: 3, //(x second)	
    stopCallback: function () {
    },
    startCallback: function () {
    },
    slowDownCallback: function () {
    }
  }
  options: any = {
    speed: 10,
    duration: 10,
    stopImageNumber: 2
  };

  defaultProperty = {
    $rouletteTarget: null,
    imageCount: 6,
    originalStopImageNumber: 3,
    totalHeight: 640,
    topPosition: 0,

    maxDistance: null,
    slowDownStartDistance: null,

    isSpeedUp: true,
    isSlowdown: false,
    isStop: true,

    distance: 0,
    runUpDistance: 256
  };

  //p:any = extend({}, this.defaultSettings, this.options, this.defaultProperty);
  p: any = {
    speed: 10, //rotation speed 
    stopImageNumber: 2, // stopImageNumber >= 0 and x <= imageCount-1
    // rollCount: 3, // x >= 0
    duration: 3, //(x second)	
    stopCallback: () => {
      //
    },
    startCallback: () => {

    },
    slowDownCallback: () => {

    },
    element: null,
    imageCount: 6,
    originalStopImageNumber: 3,
    totalHeight: 640,//imageHeight*imageCount
    topPosition: 0,

    maxDistance: null,
    slowDownStartDistance: null,

    isSpeedUp: true,
    isSlowdown: false,
    isStop: true,
    imageHeight: 128,//size img height
    distance: 0,
    runUpDistance: 256//imageHeight*2

  };


  constructor(element: any) {
    this.p.element = element;
    this.p.element.style.transform = 'translate(0px, -0px)';
    this.p.imageCount = element.children.length
  }

  start() {
    this.p.stopImageNumber = (this.defaultProperty.originalStopImageNumber) && (this.defaultProperty.originalStopImageNumber) >= 0 ?
      this.defaultProperty.originalStopImageNumber : Math.floor(Math.random() * this.p.imageCount);
    this.p.isStop = false;//for diseable button run

    setTimeout(() => {
      this.slowDownSetup();
    }, this.p.duration * 1000);

    this.roll();
  }

  roll() {
    let _speed = this.p.speed;
    if (this.p.isSpeedUp) {

      if (this.p.distance <= this.p.runUpDistance) {

        let _rate = ~~((this.p.distance / this.p.runUpDistance) * this.p.speed);

        _speed = _rate + 1;
      } else {
        this.p.isSpeedUp = false;
      }
    } else if (this.p.isSlowdown) {
      let _rate = ~~(((this.p.maxDistance - this.p.distance) / (this.p.maxDistance - this.p.slowDownStartDistance)) * (this.p.speed));
      _speed = _rate + 1;
    }

    if (this.p.maxDistance && this.p.distance >= this.p.maxDistance) {
      this.p.isStop = true;
      this.reset();
      this.p.stopCallback();
      return;
    }

    this.p.distance += _speed;
    this.p.topPosition += _speed;
    if (this.p.topPosition >= this.p.totalHeight) {
      this.p.topPosition = this.p.topPosition - this.p.totalHeight;
    }

    this.p.element.style.transform = 'translate(0px, ' + this.p.topPosition * -1 + 'px)';

    if (!this.p.isStop) {
      setTimeout(() => { this.roll() }, 1);
    }

  }

  slowDownSetup() {

    if (this.p.isSlowdown) {
      return;
    }
    this.p.isSlowdown = true;
    this.p.slowDownStartDistance = this.p.distance;
    this.p.maxDistance = this.p.distance + (2 * this.p.totalHeight);
    this.p.maxDistance += this.p.imageHeight - this.p.topPosition % this.p.imageHeight;

    if (this.p.stopImageNumber != null) {
      this.p.maxDistance += (this.p.totalHeight - (this.p.maxDistance % this.p.totalHeight) + (this.p.stopImageNumber * this.p.imageHeight))
        % this.p.totalHeight;
    }
  }

  reset() {
    this.p.maxDistance = this.defaultProperty.maxDistance;
    this.p.slowDownStartDistance = this.defaultProperty.slowDownStartDistance;
    this.p.distance = this.defaultProperty.distance;
    this.p.isSpeedUp = this.defaultProperty.isSpeedUp;
    this.p.isSlowdown = this.defaultProperty.isSlowdown;
    this.p.isStop = this.defaultProperty.isStop;
    this.p.topPosition = this.defaultProperty.topPosition;
  }

  //This method is for add event STOP rotation.
  // stop(option) {
  //   if (!this.p.isSlowdown) {
  //     if (option) {
  //       let stopImageNumber = Number(option.stopImageNumber);
  //       if (0 <= stopImageNumber && stopImageNumber <= (this.p.imageCount - 1)) {
  //         this.p.stopImageNumber = option.stopImageNumber;
  //       }
  //     }
  //     this.slowDownSetup();
  //   }
  // }
}