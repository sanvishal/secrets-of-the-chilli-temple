import { gamepad } from "../managers/gamepadManager.js";
import { createRevolverBullet } from "./revolverBullet.js";
import { approach, clamp, convertAxisToAngle, lengthdir_x, lengthdir_y } from "../utils.js";
import { weapons } from "../constants.js";
import { createMuzzleFlash } from "./muzzleFlash.js";
import { createEmptyBullet } from "./emptyBullet.js";

export const createPlayer = () => {
  let p = add([
    origin("center"),
    sprite("player", { anim: "idle", width: 11 * 2, height: 12 * 2 }),
    area({ width: 5 * 2, height: 9 * 2 - 5, offset: vec2(0, 6) }),
    pos(180, 100),
    "player",
    body({ jumpForce: 300 }),
    {
      ang: 0,
      t: 0.5,
      sway: 10,
      xscale: 1,
      yscale: 1,
      swaySpeed: 0.07,
      tt: 0,
      dur: 1.2,
      posx: [0, 0],
      posy: [0, 0],
      hspd: 160,
      vspd: 150,
      fallthrough: false,
      holster: null,
      dir: 1,
      aimAngle: 0,
      currWeapon: null,
      needReload: false,
      currReloadTime: 0,
      isHit: false,
      canHit: true,
      invincibleTimer: 0,
    },
    {
      update: function () {
        // camPos(this.pos);
        const left = keyIsDown("left") || gamepad()?.left;
        const right = keyIsDown("right") || gamepad()?.right;
        this.fallthrough = (keyIsDown("down") || gamepad()?.down) && (keyIsDown("z") || gamepad()?.aPress);

        if (left || right) {
          this.t += left ? -1 * this.swaySpeed : this.swaySpeed;
        } else {
          this.t = approach(this.t, 0.5, this.swaySpeed);
        }

        if (!gamepad().usingGamepad) {
          if (this.curPlatform() !== null && this.curAnim() !== "idle" && !left && !right) {
            this.play("idle");
          }
        }

        let axis = {
          left: gamepad().left || keyIsDown("left"),
          right: gamepad().right || keyIsDown("right"),
          up: gamepad().up || keyIsDown("up"),
          down: gamepad().down || keyIsDown("down"),
        };
        this.aimAngle = convertAxisToAngle(axis) !== undefined ? convertAxisToAngle(axis) : this.aimAngle;

        this.t = clamp(this.t, 0, 1);
        this.ang = lerp(-this.sway, this.sway, this.t);
        this.use(rotate(this.ang));

        if (gamepad().usingGamepad) {
          if (gamepad()?.left) {
            this.dir = -1;
            this.flipX(true);
            if (!this.grounded()) {
              this.move(-this.vspd, 0);
            } else {
              this.move(-this.hspd, 0);
            }
            if (this.curAnim() !== "run" && this.curAnim() !== "jump" && this.grounded()) {
              this.play("run");
            }
          }

          if (gamepad()?.right) {
            this.dir = 1;
            this.flipX(false);
            if (!this.grounded()) {
              this.move(this.vspd, 0);
            } else {
              this.move(this.hspd, 0);
            }
            if (this.curAnim() !== "run" && this.curAnim() !== "jump" && this.grounded()) {
              this.play("run");
            }
          }

          if (!gamepad()?.right && !gamepad()?.left && this.grounded() && this.curAnim() !== "idle") {
            this.play("idle");
          }
        }

        if (this.needReload) {
          this.currReloadTime++;
          if (this.currReloadTime >= this.currWeapon.reloadSpeed) {
            this.currReloadTime = 0;
            this.needReload = false;
          }
        }

        if (this.isHit) {
          this.invincibleTimer++;
          if (this.invincibleTimer % 10 > 2 && this.invincibleTimer % 10 < 8) {
            this.opacity = 0.5;
          } else {
            this.opacity = 1;
          }
          if (this.invincibleTimer >= 120) {
            this.invincibleTimer = 0;
            this.isHit = false;
            this.canHit = true;
            this.opacity = 1;
          }
        }
      },
      reload: function () {
        if (this.currReloadTime === 0) {
          this.needReload = true;
        }
      },
      onHit: function () {
        if (this.canHit) {
          this.isHit = true;
          this.canHit = false;
        }
      },
    },
  ]);

  p.collides("weapondrop", (drop) => {
    p.currWeapon = weapons[drop.weaponId];
    console.log(weapons, weapons[drop.weaponId]);
    destroy(drop);
    destroy(p.holster);
    p.holster = add([
      sprite(p.currWeapon.spriteName, { width: p.currWeapon.width * 2, height: p.currWeapon.height * 2 }),
      pos(p.pos.x, p.pos.y),
      origin("center"),
      {
        update: function () {
          this.pos = vec2(p.pos.x + 10 * p.dir, p.pos.y + 4);
          if (p.dir === -1) {
            this.flipX(true);
          } else {
            this.flipX(false);
          }
          this.angle = approach(this.angle, 0, 0.8);
        },
      },
    ]);
  });

  const playerOnJump = () => {
    if (p.grounded() && !keyIsDown("down") && !gamepad()?.down) {
      p.play("jump");
      p.jump();
      p.yscale = 1.5;
      p.xscale = 0.75;
    }
  };

  const playerOnLeftPress = () => {
    p.dir = -1;
    p.flipX(true);
    if (!p.grounded()) {
      p.move(-p.vspd, 0);
    } else {
      p.move(-p.hspd, 0);
    }
    if (p.curAnim() !== "run" && p.curAnim() !== "jump" && p.grounded()) {
      p.play("run");
    }
  };

  const playerOnRightPress = () => {
    p.dir = 1;
    p.flipX(false);
    if (!p.grounded()) {
      p.move(p.vspd, 0);
    } else {
      p.move(p.hspd, 0);
    }
    if (p.curAnim() !== "run" && p.curAnim() !== "jump" && p.grounded()) {
      p.play("run");
    }
  };

  const playerOnShoot = () => {
    if (p.currWeapon && !p.needReload) {
      p.holster.angle = 15 * (p.dir * -1);
      createEmptyBullet({ mypos: p.pos, dir: p.dir * -1, spd: randi(2, 5) });
      let spread = p.currWeapon.getSpread();
      createMuzzleFlash({ weapon: p.currWeapon, mypos: vec2(p.pos.x + (p.currWeapon.width + 10) * p.dir, p.pos.y + 2) });
      createRevolverBullet({
        mypos: vec2(p.pos.x + (p.currWeapon.width - 5) * p.dir, p.pos.y + 4),
        dir: (p.dir === 1 ? 0 : 180) + spread,
        spd: p.currWeapon.speed,
      });
      p.reload();
    }
  };

  gamepad().on("aPress", () => {
    gamepad().usingGamepad = true;
    playerOnJump();
  });

  gamepad().on("xPress", () => {
    gamepad().usingGamepad = true;
    playerOnShoot();
  });

  keyPress("z", () => {
    gamepad().usingGamepad = false;
    playerOnJump();
  });

  keyDown("x", () => {
    gamepad().usingGamepad = false;
    playerOnShoot();
  });

  keyDown("left", () => {
    gamepad().usingGamepad = false;
    playerOnLeftPress();
  });

  keyDown("right", () => {
    gamepad().usingGamepad = false;
    playerOnRightPress();
  });

  gravity(1200);
};

export const getPlayer = () => {
  return get("player")?.[0];
};
