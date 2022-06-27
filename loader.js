export const loadResources = () => {
  loadSpriteAtlas("sprites/main-sheet.png", {
    tiles: {
      x: 0,
      y: 0,
      width: 16 * 8,
      height: 16 * 6,
      sliceY: 6,
      sliceX: 8,
    },
    player: {
      x: 0,
      y: 97,
      height: 12,
      width: 11 * 14,
      sliceX: 14,
      anims: {
        idle: { from: 0, to: 4, loop: true, speed: 10 },
        run: { from: 5, to: 10, loop: true, speed: 16 },
        jump: { from: 11, to: 13, loop: false },
      },
    },
    dust: {
      x: 132,
      y: 0,
      height: 5 * 3,
      width: 5 * 8,
      sliceX: 8,
      sliceY: 3,
      anims: {
        fade1: { from: 0, to: 7, loop: false, speed: 16 },
        fade2: { from: 8, to: 15, loop: false, speed: 14 },
        fade3: { from: 16, to: 23, loop: false, speed: 13 },
      },
    },
    revolver: {
      x: 132,
      y: 17,
      height: 6,
      width: 7,
    },
    revolverBullet: {
      x: 132,
      y: 25,
      height: 5,
      width: 10,
    },
    commonMuzzleFlash: {
      x: 140,
      y: 17,
      height: 6,
      width: 6,
    },
    commonBulletHit: {
      x: 142,
      y: 25,
      width: 6 * 4,
      height: 5,
      sliceX: 4,
      anims: {
        default: { from: 0, to: 3, speed: 26 },
      },
    },
    commonEmptyBullet: {
      x: 146,
      y: 17,
      width: 2,
      height: 1,
    },
  });
};
