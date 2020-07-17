import * as PIXI from 'pixi.js';

const counterOfShapes = document.querySelector('.number-of-shapes');
const surface = document.querySelector('.surface');
let surfaceSum = 0;
const shapesButton = document.querySelector('.qtyS');
const gravity = document.querySelector('.qty');

const app = new PIXI.Application({
  width: 800,
  height: 500,
});

counterOfShapes.innerHTML = app.stage.children.length - 1;

document.querySelector('.app').appendChild(app.view);

app.renderer.backgroundColor = 0x000000;
app.renderer.view.style.margin = '20px';

const makeShape = (x, y) => {
  const colorGenerate = () => {
    return '0x' + ((1 << 24) * Math.random() | 0).toString(16);
  };

  const shapeAuto = new PIXI.Graphics();
  const colorAuto = colorGenerate();

  shapeGenerate(shapeAuto, colorAuto, x, y);

  const deleteShape = () => {
    app.stage.removeChild(shapeAuto);
    surfaceSum -= shapeAuto.height * shapeAuto.width * 0.6;
    surface.innerHTML = surfaceSum.toFixed(0);
    shapeAuto.destroy();
    counterOfShapes.innerHTML = app.stage.children.length;
    clearInterval(intervalAuto);
  };

  shapeAuto.on('mousedown', () => {
    deleteShape();
  });

  app.stage.addChild(shapeAuto);
  counterOfShapes.innerHTML = app.stage.children.length;

  const gravityAuto = (element) => {
    let speed = 0;

    return () => {
      speed += gravity.value / 777;
      element.y += speed;

      if (shapeAuto.y > app.renderer.view.height + shapeAuto.height) {
        deleteShape();
      }
    };
  };

  const intervalAuto = setInterval(gravityAuto(shapeAuto), 10);
};

const shapeGenerate = (el, color, x, y) => {
  const random = Math.random();

  el.beginFill(color);

  switch (true) {
    case (random < 0.142):
      el.drawCircle(0, 0, Math.random() * 20 + 5);
      el.x = x;
      el.y = y;
      surfaceSum += el.height * el.width * 0.6;
      surface.innerHTML = surfaceSum.toFixed(0);

      return;
    case (random < 0.285):
      el.drawCircle(0, 0, Math.random() * 25 + 10);
      break;
    case (random <= 0.428):
      el.moveTo(25, -25);
      el.lineTo(0, 25);
      el.lineTo(-25, -25);
      break;
    case (random < 0.571):
      el.drawRect(-25, -25, 50, 50);
      break;
    case (random < 0.714):
      el.drawPolygon(
        0, 25,
        Math.sin(2 * Math.PI / 5) * 25, Math.cos(2 * Math.PI / 5) * 25,
        Math.sin(4 * Math.PI / 5) * 25, -Math.cos(Math.PI / 5) * 25,
        -Math.sin(4 * Math.PI / 5) * 25, -Math.cos(Math.PI / 5) * 25,
        -Math.sin(2 * Math.PI / 5) * 25, Math.cos(2 * Math.PI / 5) * 25,
      );
      break;
    case (random < 0.857):
      el.drawPolygon(
        0, 25,
        Math.cos(Math.PI / 6) * 25, 12.5,
        Math.cos(Math.PI / 6) * 25, -12.5,
        0, -25,
        -Math.cos(Math.PI / 6) * 25, -12.5,
        -Math.cos(Math.PI / 6) * 25, 12.5,
      );
      break;
    case (random <= 1):
      shapeGenerate(el, color, x, y);
      el.endFill();
      surfaceSum -= el.height * el.width * 0.6;
      surface.innerHTML = surfaceSum.toFixed(0);
      el.beginFill(color);
      shapeGenerate(el, color, x, y);
      el.endFill();
      surfaceSum -= el.height * el.width * 0.6;
      surface.innerHTML = surfaceSum.toFixed(0);
      el.beginFill(color);
      shapeGenerate(el, color, x, y);
      surfaceSum -= el.height * el.width * 0.6;
      surface.innerHTML = surfaceSum.toFixed(0);

      break;
  };

  el.setTransform(
    x,
    y,
    Math.random() + 0.5,
    Math.random() + 0.5,
    Math.random() * 360,
    Math.random() - 0.5,
    0,
    0,
    0,
  );
  el.endFill();
  surfaceSum += el.height * el.width * 0.6;
  surface.innerHTML = surfaceSum.toFixed(0);
  el.interactive = true;
  el.buttonMode = true;
};

app.renderer.view.addEventListener('click', (e) => {
  if (e.target.style.cursor !== 'inherit') {
    return;
  };

  makeShape(e.pageX - 25, e.pageY - 75);

  // new Shape(e.pageX - 25, e.pageY - 50);

  // newShape();
});

let t = 0;
let interval;

f1();

let stop = false;

function changeTimer() {
  stop = false;

  t = shapesButton.value > 0
    ? 1000 / shapesButton.value
    : stop = true;
};

function f1() {
  clearInterval(interval);

  stop
    ? changeTimer()
    : makeShape(Math.random() * app.renderer.screen.width, -50);
  changeTimer();
  interval = setInterval(f1, t);
};
