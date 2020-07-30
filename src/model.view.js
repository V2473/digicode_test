/* eslint-disable max-len */
import * as PIXI from 'pixi.js';

// VIEW

const shapesControl = document.querySelector('.shapes-control');
const gravityControl = document.querySelector('.gravity-control');
const counterOfShapes = document.querySelector('.number-of-shapes');

const surface = document.querySelector('.surface');
let surfaceSum = 0;

const app = new PIXI.Application({
  width: 800,
  height: 500,
});

app.renderer.view.addEventListener('mousedown', (e) => {
  if (e.target.style.cursor === 'inherit') {
    makeShape(e.pageX - 25, e.pageY - 75);
  };
});

counterOfShapes.innerHTML = app.stage.children.length;

document.querySelector('.app').appendChild(app.view);

app.renderer.backgroundColor = 0xffffff;
app.renderer.view.style.margin = '20px';

// MODEL

class Shape extends PIXI.Graphics {
  constructor(x, y) {
    super();
    this.rotation = Math.random() * 360;
    this.skewX = Math.random() - 0.5;
    this.scaleX = Math.random() + 0.5;
    this.scaleY = Math.random() + 0.5;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 20 + 15;
    this.color = this.colorGenerate();
    this.intervalGravity = setInterval(this.gravity(), 10);
    this.name = this.shapeNameGenerate();
    this.name1 = this.shapeNameGenerateRandom();
    this.name2 = this.shapeNameGenerateRandom();
    this.name3 = this.shapeNameGenerateRandom();
    this.surface = 0;

    this.on('mousedown', () => {
      this.deleteShape();
      this.sameColorChange();
    });
  }

  sameColorChange() {
    app.stage.children.forEach(x => {
      if (x.name === this.name) {
        x.colorChange();
      }
    });
  }

  colorGenerate() {
    return '0x' + ((1 << 24) * Math.random() | 0).toString(16);
  };

  shapeNameGenerate() {
    const shapes = [
      'circle',
      'ellipse',
      '3sides',
      '4sides',
      '5sides',
      '6sides',
      'random',
    ];

    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  shapeNameGenerateRandom() {
    const shapes = [
      'ellipse',
      '3sides',
      '4sides',
      '5sides',
      '6sides',
    ];

    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  shapeGenerate(shape) {
    switch (shape) {
      case ('circle'):
        this.drawCircle(0, 0, this.size);
        this.surface = Math.PI * this.size ** 2;
        break;
      case ('ellipse'):
        this.drawCircle(0, 0, this.size);
        this.surface = Math.PI * this.size ** 2 * this.scaleX * this.scaleY;
        break;
      case ('3sides'):
        this.moveTo(this.size, -this.size);
        this.lineTo(0, this.size);
        this.lineTo(-this.size, -this.size);
        this.surface = ((this.size * 2) ** 2 * Math.sqrt(3)) / 4;
        break;
      case ('4sides'):
        this.drawRect(
          -this.size / 2,
          -this.size / 2,
          this.size,
          this.size,
        );
        this.surface = (this.size * 2) ** 2 * this.scaleX * this.scaleY;
        break;
      case ('5sides'):
        this.drawPolygon(
          0, this.size,
          Math.sin(2 * Math.PI / 5) * this.size,
          Math.cos(2 * Math.PI / 5) * this.size,
          Math.sin(4 * Math.PI / 5) * this.size,
          -Math.cos(Math.PI / 5) * this.size,
          -Math.sin(4 * Math.PI / 5) * this.size,
          -Math.cos(Math.PI / 5) * this.size,
          -Math.sin(2 * Math.PI / 5) * this.size,
          Math.cos(2 * Math.PI / 5) * this.size,
        );
        this.surface = 0.25 * (Math.sqrt(5 * (5 + 2 * Math.sqrt(5)))) * (this.size ** 2) * this.scaleX * this.scaleY;
        break;
      case ('6sides'):
        this.drawPolygon(
          0, this.size / 2,
          Math.cos(Math.PI / 6) * this.size, this.size / 4,
          Math.cos(Math.PI / 6) * this.size, -this.size / 4,
          0, -this.size / 2,
          -Math.cos(Math.PI / 6) * this.size, -this.size / 4,
          -Math.cos(Math.PI / 6) * this.size, this.size / 4,
        );
        this.surface = (3 * Math.sqrt(3) / 2) * this.size ** 2 * this.scaleX * this.scaleY;
        break;
      case ('random'):
        this.randomGen();
        break;
    }

    if (this.name !== 'circle') {
      this.setTransform(
        this.x,
        this.y,
        this.scaleX,
        this.scaleY,
        this.rotation,
        this.skewX,
        0,
        0,
        0,
      );
    }
  }

  randomGen() {
    this.shapeGenerate(this.name1);
    this.endFill();
    this.beginFill(this.color);
    this.shapeGenerate(this.name2);
    this.endFill();
    this.beginFill(this.color);
    this.shapeGenerate(this.name3);
  }

  start() {
    counterOfShapes.innerHTML = app.stage.children.length;

    this.beginFill(this.color);

    this.shapeGenerate(this.name);

    this.endFill();
    surfaceSum += this.surface;
    surface.innerHTML = surfaceSum.toFixed(0);
    this.interactive = true;
    this.buttonMode = true;
    app.stage.addChild(this);
    counterOfShapes.innerHTML = app.stage.children.length;
  }

  colorChange() {
    this.color = this.colorGenerate();
    surfaceSum -= this.surface;
    surface.innerHTML = surfaceSum.toFixed(0);

    this.start();
  }

  gravity() {
    let speed = 0;

    return () => {
      speed += gravityControl.value / 777;
      this.y += speed;

      if (this.y > app.renderer.view.height + this.height) {
        this.deleteShape();
      }
    };
  };

  deleteShape() {
    app.stage.removeChild(this);
    surfaceSum -= this.surface;
    surface.innerHTML = surfaceSum.toFixed(0);
    clearInterval(this.intervalGravity);
    counterOfShapes.innerHTML = app.stage.children.length;
    this.destroy();
  };
}

const makeShape = (x, y) => {
  const shape = new Shape(x, y);

  shape.start();
};

const rain = () => {
  let timer = 0;
  let interval;
  let stop = false;

  const changeTimer = () => {
    stop = false;

    timer = shapesControl.value > 0
      ? 1000 / shapesControl.value
      : stop = true;
  };

  const intervalGenerator = () => {
    clearInterval(interval);

    stop
      ? changeTimer()
      : makeShape(Math.random() * app.renderer.screen.width, -50);
    changeTimer();
    interval = setInterval(intervalGenerator, timer);
  };

  intervalGenerator();
};

rain();
