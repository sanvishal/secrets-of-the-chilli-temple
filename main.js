import { generateAutoTileBitMask, mapTilesToBitMask } from "./autotiler.js";
import { constants, weaponNames, weapons } from "./constants.js";
import { createEnemy } from "./entities/enemy.js";
import { createEnemyParent } from "./entities/enemyParent.js";
import { createFallThroughPlatform } from "./entities/fallThroughPlatform.js";
import { createPlayer, getPlayer } from "./entities/player.js";
import { createProjectileHit } from "./entities/projectileHit.js";
import { createRevolverBullet } from "./entities/revolverbullet.js";
import { createWeaponDrop } from "./entities/weaponDrop.js";
import { initKaboom } from "./init.js";
import { loadResources } from "./loader.js";
import { createGamepadManager, gamepad } from "./managers/gamepadManager.js";
import { lengthdir_x, lengthdir_y, minkDiff } from "./utils.js";

initKaboom();

Gamepads.start();

const gamepadManager = createGamepadManager();
Gamepads.addEventListener("connect", function (gamepad) {
  gamepadManager.gamepadConnect(gamepad?.gamepad);
});

loadResources();

let level = [];
for (let i = 0; i < height() / constants.tileSize; i++) {
  let slice = "";
  for (let j = 0; j < width() / constants.tileSize; j++) {
    if (
      i === 0 ||
      j === 0 ||
      i === Math.floor(height() / constants.tileSize) - 1 ||
      j === Math.floor(width() / constants.tileSize) - 1
    ) {
      slice += "t";
      continue;
    }
    // if (Math.random() < 0.1) {
    //   slice += "t";
    //   continue;
    // }
    slice += " ";
  }
  level.push(slice);
}

let { transformedLevel, mapper } = mapTilesToBitMask(generateAutoTileBitMask(level, "t"));

addLevel(transformedLevel, {
  width: constants.tileSize,
  height: constants.tileSize,
  ...mapper,
});

createPlayer();

// const enemy = add([
//   rect(16, 16),
//   pos(100, 100),
//   area({ scale: 0.6 }),
//   origin("center"),
//   { dir: 0, wdir: 0, backoffTimer: 0, backoff: false, bdir: 0 },
//   {
//     update: function () {
//       const p = getPlayer();
//       this.dir = p.pos.angle(this.pos);

//       if (!this.backoff) {
//         this.moveTo(
//           vec2(
//             this.pos.x + lengthdir_x(p.pos.dist(this.pos), this.dir),
//             this.pos.y + lengthdir_y(p.pos.dist(this.pos), this.dir)
//           ),
//           50
//         );
//       } else {
//         this.moveTo(
//           vec2(
//             this.pos.x + lengthdir_x(p.pos.dist(this.pos), this.wdir - 90),
//             this.pos.y + lengthdir_y(p.pos.dist(this.pos), this.wdir - 90)
//           ),
//           50
//         );
//       }

//       if (this.backoff) {
//         if (this.backoffTimer === 0) {
//           this.bdir = this.wdir - 45;
//         }
//         this.backoffTimer += 1;
//         if (this.backoffTimer > 20) {
//           this.backoff = false;
//           this.backoffTimer = 0;
//         }
//       }
//     },
//     draw: function () {
//       drawLine({
//         p1: vec2(0, 0),
//         p2: vec2(lengthdir_x(20, this.dir), lengthdir_y(20, this.dir)),
//         color: rgb(255, 0, 0),
//       });
//       drawLine({
//         p1: vec2(0, 0),
//         p2: vec2(lengthdir_x(20, this.wdir - 90), lengthdir_y(20, this.wdir - 90)),
//         color: rgb(0, 255, 0),
//       });
//       drawLine({
//         p1: vec2(0, 0),
//         p2: vec2(lengthdir_x(20, this.bdir), lengthdir_y(20, this.bdir)),
//         color: rgb(0, 0, 255),
//       });
//     },
//     backOffTrigger: function () {
//       this.backoff = true;
//       this.backoffTimer = 0;
//     },
//   },
// ]);

// enemy.onCollide("wall", (w) => {
//   const a = w.pos.angle(enemy.pos);
//   enemy.wdir = a;
//   enemy.backOffTrigger();
//   // enemy.moveTo(
//   //   vec2(enemy.pos.x + lengthdir_x(enemy.dir, enemy.wdir - 180), enemy.pos.y + lengthdir_y(enemy.dir, enemy.wdir - 180)),
//   //   100
//   // );
// });

// console.log(enemy);

layers(["muzzleFlash", "bullets", "game"], "game");

createEnemy({
  mypos: vec2(200, 220),
});

collides("projParent", "wall", (p, w) => {
  p.child.destroyEffect();
  destroy(p);
});

collides("emptyBullet", "wall", (e, w) => {
  e.grounded = true;
});

collides("enemyCorpse", "wall", (e, w) => {
  e.grounded = true;
});

collides("enemyParent", "projParent", (enemy, projectile) => {
  enemy.child.onHit(projectile.child.dir);
  projectile.child.destroyEffect();
  destroy(projectile);
});

getPlayer().collides("enemyParent", (enemy) => {
  const isOnTop = testRectRect(
    {
      p1: vec2(getPlayer().pos.x - 8, getPlayer().pos.y + 7),
      p2: vec2(getPlayer().pos.x + 8, getPlayer().pos.y + 10),
    },
    {
      p1: vec2(enemy.pos.x - enemy.area.width / 2, enemy.pos.y - enemy.area.height / 2),
      p2: vec2(enemy.pos.x + enemy.area.width / 2, enemy.pos.y + enemy.area.height / 2),
    }
  );

  // another hacky way to avoid raycasting
  if (
    enemy.hasPoint(vec2(getPlayer().pos.x, getPlayer().pos.y + 12)) ||
    enemy.hasPoint(vec2(getPlayer().pos.x - 4, getPlayer().pos.y + 12)) ||
    enemy.hasPoint(vec2(getPlayer().pos.x + 2, getPlayer().pos.y + 12)) ||
    enemy.hasPoint(vec2(getPlayer().pos.x - 2, getPlayer().pos.y + 12)) ||
    enemy.hasPoint(vec2(getPlayer().pos.x + 4, getPlayer().pos.y + 12)) ||
    isOnTop
  ) {
    enemy.child.onHit();
    getPlayer().jump();
  } else {
    getPlayer().onHit(choose([180, 0]));
  }
});

onDraw(() => {
  // drawRect({
  //   width: 8,
  //   height: 3,
  //   origin: "center",
  //   pos: getPlayer().pos,
  // });
});

createWeaponDrop({ mypos: vec2(100, 100), weapon: weapons[weaponNames.REVOLVER] });
