import { pointDirection } from "../utils.js";

export const createEmptyBullet = ({ mypos, dir = 1, spd = 5 }) => {
  return add([
    pos(mypos),
    sprite("commonEmptyBullet"),
    // body(),
    "emptyBullet",
    area(),
    cleanup(),
    origin("center"),
    lifespan(1.5, { fade: 0.2 }),
    {
      xsp: -5,
      ysp: -2 + randi(-0.5, 0.5),
      grav: randi(0.1, 0.2),
      grounded: false,
      spd: spd,
      dir: dir,
      update: function () {
        if (!this.grounded) {
          this.angle = randi(0, 360);
          this.grav += 0.01;
          this.ysp += this.grav;
          this.xsp = this.spd * this.dir;

          this.pos.x += this.xsp;
          this.pos.y += this.ysp;
        }
      },
    },
  ]);
};
