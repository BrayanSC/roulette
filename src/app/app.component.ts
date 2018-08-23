import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Roulette';
  statusGames:boolean;
  typeGame: Number;
  readyPage = false;
  isTotalStop: boolean;
  contStop: number;
  contWin: number = 0;
  contLose: number = 0;

  //BEGIN for typeGame == 1
  imageSelected: Number;
  showAlertImageSelected: Boolean;
  //END for typeGame == 1

  private listRamdom: Number[];

  elementsRoulette: Roulette[] = [];
  images: any[] = [
    { img: "assets/img/seven.png" },
    { img: "assets/img/money.png" },
    { img: "assets/img/heart.png" },
    { img: "assets/img/dragon.png" },
    { img: "assets/img/dice.png" },
    { img: "assets/img/chip.png" },
    { img: "assets/img/clubs.png" }
  ];


  constructor() {
    this.typeGame = 1;
  }


  ngOnInit() {
    this.statusGames = false;
    this.contStop = 0
    this.isTotalStop = true;
    for (let i = 0; i < this.typeGame; i++) {
      this.elementsRoulette.push(new Roulette(this));
    }

    setTimeout(() => {
      this.elementsRoulette.forEach((element, index) => {
        index += 1;
        element.init((<HTMLInputElement>document.getElementById("roulette" + index)));
      });

    }, 1000);
  }

  validateSelection() {
    this.showAlertImageSelected = this.imageSelected >= 0 ? false : true
    if (!this.showAlertImageSelected) {
      this.rollNow();
    }

  }

  imageSelection(indexImg: Number) {
    this.imageSelected = indexImg >= 0 ? indexImg : -1
  }

  startNow() {
    this.typeGame != 1 ? this.rollNow() : this.validateSelection()
  }

  rollNow() {
    this.statusGames = false;
    this.isTotalStop = false;
    this.listRamdom = [];
    for (let i = 0; i < this.elementsRoulette.length; i++) {

      const numRandom = Math.floor(Math.random() * this.elementsRoulette[i].p.imageCount);
      this.listRamdom.push(numRandom);
      this.elementsRoulette[i].start(this.listRamdom[i]);
    }

    this.statusGame()
    // console.log(this.listRamdom);

  }


  isTotalStopRoll() {
    this.contStop++;
    if (this.contStop === this.elementsRoulette.length) {
      this.isTotalStop = true;
      this.contStop = 0;
    }
  }

  statusGame() {
    switch (this.typeGame) {
      case 1:
        this.winGameOneValidation();
        break;
      case 2:
        // this.winGameTwoValidation();
        break;
      case 3:
        this.winGameManyValidation();
        break;
      default:
        break;

    }

  }

  winGameManyValidation() {
    throw new Error("Method not implemented.");
  }
  winGameTwoValidation() {
    throw new Error("Method not implemented.");
  }

  winGameOneValidation() {
    if (this.listRamdom[0] === this.imageSelected) {
      this.contWin++;
      this.statusGames = true;
    } else {
      this.contLose++;
    }
  }

}

export class Roulette {

  defaultSettings: any = {
    speed: 10, // x > 0
    stopImageNumber: -1, // x >= 0 or null or -1
    // rollCount: 3, // x >= 0
    duration: 3, //(x second)	
    stopCallback: function () {
    },
    startCallback: function () {
    },
    slowDownCallback: function () {
    }
  }
  //exaple object of config
  options: any = {
    speed: 10,
    duration: 10,
    stopImageNumber: 2
  };


  this: any;//father this

  p: any = {
    speed: 15, //rotation speed 
    stopImageNumber: -1, // stopImageNumber >= 0 and x <= imageCount-1
    // rollCount: 3, // x >= 0
    duration: 1, //(x second)	
    stopCallback: () => {
      this.this.isTotalStopRoll();
    },
    startCallback: () => {

    },
    slowDownCallback: () => {

    },
    element: null,
    imageCount: null,
    originalStopImageNumber: null,
    totalHeight: null,//imageHeight*imageCount
    topPosition: 0,

    maxDistance: null,
    slowDownStartDistance: null,

    isSpeedUp: true,
    isSpeedDown: false,
    isStop: true,
    imageHeight: null,//size img height
    distance: 0,
    runUpDistance: null//imageHeight*2

  };

  constructor(th: any) {
    this.this = th;
  }

  init(element: any) {
    this.p.element = element;
    this.p.imageCount = element.children[0].children.length - 1;
    this.p.imageHeight = parseFloat(element.style.height);
    this.p.totalHeight = this.p.imageCount * this.p.imageHeight;
    this.p.runUpDistance = this.p.imageHeight * 2;
    console.log(this.p)

  }

  start(num: Number) {
    this.p.stopImageNumber = num >= 0 ?
      num : Math.floor(Math.random() * this.p.imageCount);
    this.p.isStop = false;

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
    } else if (this.p.isSpeedDown) {
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

    this.p.element.children[0].style.transform = 'translate(0px, ' + this.p.topPosition * -1 + 'px)';

    if (!this.p.isStop) {
      setTimeout(() => { this.roll() }, 1);
    }

  }

  slowDownSetup() {

    //This is for add event STOP rotation stop
    // if (this.p.isSpeedDown) {
    //   return;
    // }
    this.p.isSpeedDown = true;
    this.p.slowDownStartDistance = this.p.distance;
    this.p.maxDistance = this.p.distance + (2 * this.p.totalHeight);
    this.p.maxDistance += this.p.imageHeight - this.p.topPosition % this.p.imageHeight;

    if (this.p.stopImageNumber != null) {
      this.p.maxDistance += (this.p.totalHeight - (this.p.maxDistance % this.p.totalHeight) + (this.p.stopImageNumber * this.p.imageHeight))
        % this.p.totalHeight;
    }
  }

  reset() {
    this.p.maxDistance = 0;
    this.p.slowDownStartDistance = 0;
    this.p.distance = 0;
    this.p.isSpeedUp = true;
    this.p.isSpeedDown = false;
    this.p.isStop = false;
    this.p.topPosition = 0;
  }

  //This method is for add event STOP rotation.
  // stop(option) {
  //   if (!this.p.isSpeedDown) {
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