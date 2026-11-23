/* Aswin Panengal footer. Original sprite layout and motion adapted from the supplied site export. */
const crowdSpriteScales = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 0.95, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

(() => {
  const scene = document.querySelector('.footer-crowd-scene');
  if (!scene) return;
  const portrait = scene.querySelector('.footer-crowd-portrait');
  const canvases = [...scene.querySelectorAll('canvas')];
  const contexts = canvases.map(canvas => canvas.getContext('2d'));
  if (contexts.some(context => !context)) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sprites = Array.from({length: 7}, (_, index) => {
    const image = new Image();
    image.src = `footer/bengaluru/crowd-${String(index + 1).padStart(2, '0')}.webp`;
    return image;
  });
  let ready = false;
  let visible = false;
  let paused = false;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let travel = 0;
  let padding = 0;
  let walkers = [];

  function random(seed) {
    const value = 43758.5453 * Math.sin(127.1 * seed + 311.7);
    return value - Math.floor(value);
  }

  function paint() {
    for (const context of contexts) {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
    }
    for (const walker of walkers) {
      const progress = walker.phase + elapsed * walker.speed / 10;
      const lap = Math.floor(progress);
      const fraction = progress - lap;
      const cell = (walker.cell + 37 * lap) % 105;
      const sheet = sprites[Math.floor(cell / 15)];
      const cellWidth = sheet.naturalWidth / 5;
      const cellHeight = sheet.naturalHeight / 3;
      const tile = cell % 15;
      const x = (walker.direction === 1 ? fraction : 1 - fraction) * travel - padding;
      const bounce = (1 - Math.cos((elapsed * walker.speed + 10 * walker.phase) * Math.PI * 4)) * 5;
      const scale = crowdSpriteScales[cell];
      const context = contexts[walker.layer];
      context.save();
      context.translate(x, walker.baseline + walker.height * (1 - scale) - bounce);
      context.scale(walker.direction, 1);
      context.drawImage(sheet, tile % 5 * cellWidth, Math.floor(tile / 5) * cellHeight, cellWidth, cellHeight,
        -walker.width * scale / 2, 0, walker.width * scale, walker.height * scale);
      context.restore();
    }
  }

  function tick(now) {
    if (lastTime) elapsed += Math.min((now - lastTime) / 1000, .05);
    lastTime = now;
    paint();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    cancelAnimationFrame(frame);
    lastTime = 0;
    scene.disabled = !ready || reduced.matches;
    scene.setAttribute('aria-pressed', String(paused || reduced.matches));
    scene.setAttribute('aria-label', paused ? 'Resume crowd animation' : 'Pause crowd animation');
    if (!ready) return;
    paint();
    if (visible && !document.hidden && !paused && !reduced.matches) frame = requestAnimationFrame(tick);
  }

  function resize() {
    if (!ready) return;
    width = scene.clientWidth;
    height = scene.clientHeight;
    pixelRatio = Math.min(devicePixelRatio || 1, 2);
    for (const canvas of canvases) {
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
    }
    const portraitHeight = portrait.getBoundingClientRect().height;
    const scale = Math.max(.1, Math.min(1, portraitHeight / 310));
    const ratio = width / (1440 * scale);
    const counts = width >= 600 ? [25, 16] : [Math.max(9, Math.round(25 * ratio)), Math.max(6, Math.round(16 * ratio))];
    const count = counts[0] + counts[1];
    walkers = Array.from({length: count}, (_, index) => {
      const lane = index < counts[0] ? 0 : 1;
      const position = index - (lane ? counts[0] : 0);
      const walkerHeight = (lane ? 250 + 30 * random(index + 8) : 170 + 35 * random(index + 8)) * scale;
      const baseline = lane
        ? height - walkerHeight + 30 * scale + 15 * random(index + 4)
        : height - portraitHeight - 12 + 24 * random(index + 4);
      return {
        cell: 37 * Math.floor(105 * index / count) % 105,
        layer: Number(lane > 0 || position % 3 === 0),
        height: walkerHeight, width: .8 * walkerHeight, baseline,
        speed: [ .7, 1.05 ][lane] * (.88 + .24 * random(index + 97)),
        phase: (position + .85 * random(index + 41)) / counts[lane],
        direction: lane ? -1 : 1
      };
    }).sort((a, b) => a.baseline - b.baseline);
    padding = Math.max(...walkers.map(walker => walker.width));
    travel = width + 2 * padding;
    sync();
  }

  new ResizeObserver(resize).observe(scene);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, {rootMargin: '80px'}).observe(scene);
  scene.addEventListener('click', () => {
    paused = !paused;
    sync();
  });
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  const portraitReady = portrait.decode().catch(() => {});
  Promise.all([portraitReady, ...sprites.map(image => image.decode())]).then(() => {
    ready = true;
    scene.dataset.ready = 'true';
    resize();
  }).catch(error => console.error('Footer artwork could not load.', error));
  sync();
})();
