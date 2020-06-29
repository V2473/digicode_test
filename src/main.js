import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
  width: 800,
  height: 600,
});

document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.margin = '20px';

document.body.children[0].addEventListener('click', (e) => {
  const circle = new PIXI.Graphics();

  circle.beginFill(0x9966FF);
  circle.drawCircle(0, 0, 32);
  circle.endFill();
  circle.x = e.clientX - circle.width / 2;
  circle.y = e.clientY - circle.height / 2;

  app.stage.addChild(circle);

  const gravity = (g, element) => {
    let speed = 0;

    return () => {
      speed += g / 100;
      element.y += speed;

      if (element.y > document.body.children[0].height + element.height - 100) {
        app.stage.removeChild(element);
        element.destroy();
        clearInterval(interval);
      }
    };
  };

  const interval = setInterval(gravity(1, circle), 10);
});
