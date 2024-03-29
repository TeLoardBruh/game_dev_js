function draw_grid(ctx, minor, major, stroke, fill) {
  minor = minor || 10;
  major = major || minor * 5;
  stroke = stroke || "#00FF00";
  fill = fill || "#009900";
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  let width = ctx.canvas.width,
    height = ctx.canvas.height;
  for (var x = 0; x < width; x += minor) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.lineWidth = x % major == 0 ? 0.5 : 0.25;
    ctx.stroke();
    if (x % major == 0) {
      ctx.fillText(x, x, 10);
    }
  }
  for (var y = 0; y < height; y += minor) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.lineWidth = y % major == 0 ? 0.5 : 0.25;
    ctx.stroke();
    if (y % major == 0) {
      ctx.fillText(y, 0, y + 10);
    }
  }
  ctx.restore();
}

function draw_pacman(context, x, y, radius, isOpen) {
  draw_grid(context);
  context.beginPath();
  context.arc(x, y, 150, radius * Math.PI, 1.8 * Math.PI);
  context.lineTo(x, y);
  context.fillStyle = "yellow";
  context.fill();
}

function draw_ship(ctx, radius, options) {
  options = options || {};
  let angle = (options.angle || 0.5 * Math.PI) / 2;
  // Now we have two curve arguments
  let curve1 = options.curve1 || 0.25;
  let curve2 = options.curve2 || 0.75;
  ctx.save();
  if (options.guide) {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }
  ctx.lineWidth = options.lineWidth || 2;
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = options.fill || "black";
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  // here we have the three curves
  ctx.quadraticCurveTo(
    Math.cos(angle) * radius * curve2,
    Math.sin(angle) * radius * curve2,
    Math.cos(Math.PI - angle) * radius,
    Math.sin(Math.PI - angle) * radius
  );
  ctx.quadraticCurveTo(
    -radius * curve1,
    0,
    Math.cos(Math.PI + angle) * radius,
    Math.sin(Math.PI + angle) * radius
  );
  ctx.quadraticCurveTo(
    Math.cos(-angle) * radius * curve2,
    Math.sin(-angle) * radius * curve2,
    radius,
    0
  );
  ctx.fill();
  ctx.stroke();
  // the guide drawing code is getting complicated
  if (options.guide) {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.cos(-angle) * radius, Math.sin(-angle) * radius);
    ctx.lineTo(0, 0);
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    ctx.moveTo(-radius, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      Math.cos(angle) * radius * curve2,
      Math.sin(angle) * radius * curve2,
      radius / 40,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      Math.cos(-angle) * radius * curve2,
      Math.sin(-angle) * radius * curve2,
      radius / 40,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(radius * curve1 - radius, 0, radius / 50, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();
}

function draw(ctx, guide) {
  if (guide) {
    draw_grid(ctx);
  }
  ctx.save();
  ctx.translate(asteroid.x, asteroid.y);
  ctx.rotate(asteroid.angle);
  draw_asteroid(ctx, asteroid.radius, asteroid.shape, {
    noise: asteroid.noise,
    guide: guide,
  });
  ctx.restore();
}

function update(elapsed) {
  if (x - radius + elapsed * x_speed > context.canvas.width) {
    x = -radius;
  }
  if (x + radius + elapsed * x_speed < 0) {
    x = context.canvas.width + radius;
  }
  if (y - radius + elapsed * y_speed > context.canvas.height) {
    y = -radius;
  }
  if (y + radius + elapsed * y_speed < 0) {
    y = context.canvas.height + radius;
  }
  x += elapsed * x_speed;
  y += elapsed * y_speed;
  angle = (angle + elapsed * rotation_speed) % (2 * Math.PI);
}

function Asteroid(segments, radius, noise) {
  this.x = context.canvas.width * Math.random();
  this.y = context.canvas.height * Math.random();
  this.angle = 0;
  this.x_speed = context.canvas.width * (Math.random() - 0.5);
  this.y_speed = context.canvas.height * (Math.random() - 0.5);
  this.rotation_speed = 2 * Math.PI * (Math.random() - 0.5);
  this.radius = radius;
  this.noise = noise;
  this.shape = [];
  for(let i = 0; i < segments; i++) {
    this.shape.push(Math.random() - 0.5);
  }
}