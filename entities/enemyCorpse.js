import { pointDirection } from "../utils.js";

export const createEnemyCorpse = ({ mypos, dir = 1, spd = 5 }) => {
  return add([
    pos(mypos),
    rect(12, 12),
    opacity(0.3),
    "enemyCorpse",
    area(),
    cleanup(),
    origin("center"),
    lifespan(1.5, { fade: 0.2 }),
    {
      xsp: -5,
      ysp: randi(-0.5, 0.5),
      grav: randi(0.2, 0.4),
      grounded: false,
      spd: spd,
      dir: dir,
      update: function () {
        if (!this.grounded) {
          if (chance(0.5)) {
            this.angle = randi(0, 360);
          }
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
