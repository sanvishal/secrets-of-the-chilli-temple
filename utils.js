export function approach(start, end, rate) {
  if (start > end) return Math.max(start - rate, end);
  else return Math.min(start + rate, end);
}

export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

export function lengthdir_x(len, dir) {
  return Math.cos((dir * Math.PI) / 180) * len;
}

export function lengthdir_y(len, dir) {
  return Math.sin((dir * Math.PI) / 180) * len;
}

export function minkDiff(r1, r2) {
  return {
    p1: vec2(r1.p1.x - r2.p2.x, r1.p1.y - r2.p2.y),
    p2: vec2(r1.p2.x - r2.p1.x, r1.p2.y - r2.p1.y),
  };
}

export const convertAxisToAngle = ({ left, right, up, down }) => {
  const angles = {
    left: 180,
    up: 270,
    down: 90,
    right: 0,
  };

  if (left && up) {
    return (angles.left + angles.up) / 2;
  }

  if (left && down) {
    return (angles.left + angles.down) / 2;
  }

  if (right && down) {
    return (angles.right + angles.down) / 2;
  }

  if (right && up) {
    return -45;
  }

  if (left) {
    return angles.left;
  }

  if (right) {
    return angles.right;
  }
  if (up) {
    return angles.up;
  }
  if (down) {
    return angles.down;
  }
};

export function randRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function pointDirection(x1, y1, x2, y2) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
}
