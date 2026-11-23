// Original monochrome characters for the two moving lanes.
(() => {
const paths = new Map();
function getPath(source) {
  if (!paths.has(source)) paths.set(source, new Path2D(source));
  return paths.get(source);
}

window.drawPortfolioWalker = (context, walker) => {
  const { x, y, size, phase, variant, layer } = walker;
  const ink = '#1a1917';
  const paper = '#f7f5ef';
  const skin = ['#edebe4', '#d8d4cb', '#f8f6ef', '#e3dfd5'][variant % 4];
  const shirt = ['#f0eee7', '#272623', '#d9d5cb', '#f9f7f0'][variant % 4];
  const bob = Math.sin(phase) * 1.6;

  function shape(path, fill, width = 2) {
    const figure = getPath(path);
    if (fill) {
      context.fillStyle = fill;
      context.fill(figure);
    }
    context.lineWidth = width;
    context.stroke(figure);
  }

  function oval(x, y, rx, ry, fill, outline = true) {
    context.beginPath();
    context.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();
    if (outline) context.stroke();
  }

  context.save();
  context.translate(x, y + bob);
  context.scale(size / 135, size / 135);
  context.globalAlpha = layer ? 1 : .91;
  context.strokeStyle = ink;
  context.lineWidth = 2;
  context.lineJoin = 'round';
  context.lineCap = 'round';

  if (variant % 5 === 0) {
    shape('M -23 -82 Q -31 -95 -28 -112 Q -27 -139 0 -140 Q 27 -139 29 -111 L 29 -79 Q 9 -69 -23 -82 Z', ink);
  }

  shape('M -46 4 Q -44 -30 -38 -45 Q -30 -57 -13 -60 L 12 -60 Q 30 -58 38 -45 Q 45 -30 46 4 Z', shirt, 3);
  shape('M -10 -73 L -11 -58 Q 0 -49 12 -58 L 10 -74 Z', skin);
  shape('M -33 -36 Q -30 -20 -31 2 M 33 -36 Q 30 -20 31 2', shirt === '#272623' ? '#363532' : null);

  if (variant % 4 === 0) {
    context.save();
    context.clip(getPath('M -37 -42 Q 0 -23 37 -42 L 45 4 H -45 Z'));
    for (let stripe = -33; stripe <= 6; stripe += 9) {
      shape(`M -47 ${stripe} Q 0 ${stripe + 9} 47 ${stripe}`, null, 2.5);
    }
    context.restore();
  } else if (variant % 4 === 2) {
    shape('M -23 -54 Q -26 -23 -24 4 M 23 -54 Q 26 -23 24 4', null, 5);
    shape('M -10 -53 Q 1 -39 12 -53', null);
  } else if (variant % 4 === 3) {
    shape('M -9 -56 L -19 -48 L -9 -38 L 0 -51 L 9 -38 L 19 -48 L 10 -56', paper);
    shape('M 0 -49 V 4', null, 1.3);
  }

  oval(-19, -96, 5, 7, skin);
  oval(19, -96, 5, 7, skin);
  shape('M -20 -107 Q -19 -127 0 -127 Q 19 -127 20 -108 L 17 -92 Q 12 -75 0 -74 Q -14 -76 -18 -92 Z', skin, 2.4);

  switch (variant % 6) {
    case 0:
      shape('M -21 -103 Q -28 -128 -10 -136 Q 9 -146 24 -128 L 20 -96 Q 15 -105 14 -121 Q 2 -111 -16 -110 L -18 -99 Z', ink);
      break;
    case 1:
      shape('M -20 -102 Q -26 -117 -20 -126 Q -16 -133 -7 -132 Q 1 -143 10 -134 Q 22 -134 24 -122 L 19 -102 L 16 -119 Q 3 -112 -15 -119 Z', ink);
      break;
    case 2:
      shape('M -21 -103 Q -29 -122 -18 -130 Q -8 -138 2 -131 Q 13 -137 22 -125 Q 26 -115 20 -104 L 14 -118 Q 1 -109 -13 -117 Z', ink);
      break;
    case 3:
      shape('M -23 -104 Q -29 -126 -16 -132 Q 0 -143 18 -134 Q 33 -126 23 -102 L 16 -111 Q 15 -122 2 -124 Q -14 -123 -18 -110 Z', '#bbb8af');
      shape('M -17 -126 Q -6 -135 9 -132 M -13 -122 Q 1 -132 16 -127', null, 1.2);
      break;
    case 4:
      shape('M -24 -105 Q -33 -127 -17 -137 Q 10 -147 24 -127 L 24 -104 L 17 -108 L 10 -121 Q 0 -111 -17 -115 Z', '#34322e');
      shape('M -17 -127 Q -1 -125 10 -133', null, 1.3);
      break;
    default:
      shape('M -19 -106 Q -22 -125 -12 -132 Q -7 -137 1 -133 Q 18 -140 24 -126 L 20 -104 L 14 -118 L -15 -119 Z', ink);
  }

  shape('M -13 -104 Q -9 -107 -5 -104 M 5 -104 Q 10 -107 14 -104', null, 1.4);
  oval(-9, -99, 1.8, 2.4, ink, false);
  oval(9, -99, 1.8, 2.4, ink, false);
  shape('M 0 -99 Q -3 -93 1 -92', null, 1.15);
  shape(variant % 3 ? 'M -5 -86 Q 0 -82 6 -87' : 'M -5 -86 Q 0 -88 5 -86', null, 1.5);
  if (variant % 4 === 2 || variant % 6 === 3) {
    shape('M -18 -101 H -16 M -2 -101 Q 0 -104 2 -101 M 16 -101 H 19', null, 1.6);
    context.beginPath();
    context.ellipse(-9, -100, 7, 5.3, 0, 0, Math.PI * 2);
    context.ellipse(9, -100, 7, 5.3, 0, 0, Math.PI * 2);
    context.stroke();
  }
  if (variant % 7 === 1) {
    shape('M -21 -107 Q -23 -133 0 -134 Q 22 -135 22 -107', null, 3.2);
    oval(-20, -102, 3.8, 7, ink);
    oval(20, -102, 3.8, 7, ink);
  }

  context.restore();
};
})();
