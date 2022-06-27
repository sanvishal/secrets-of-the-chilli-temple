import { lengthdir_x, lengthdir_y } from "../utils.js";
import { createEnemyCorpse } from "./enemyCorpse.js";
import { createEnemyParent } from "./enemyParent.js";
import { getPlayer } from "./player.js";

export const createEnemy = ({ mypos }) => {
  let width = 10,
    height = 10;
  const parent = createEnemyParent({ mypos, width, height });
  let player = getPlayer();
  const enemy = add([
    rect(width, height),
    area(),
    pos(mypos),
    {
      parent: null,
      health: 5,
      update: function () {
        if (this.parent) {
          this.parent.pos = this.pos;
          this.opacity = this.parent.stun ? 0.8 : 1;
        }
        if (!player) {
          player = getPlayer();
        }
        this.dir = player.pos.angle(this.pos);

        this.moveTo(
          vec2(
            this.pos.x + lengthdir_x(player.pos.dist(this.pos), this.parent.stun ? this.dir - 180 : this.dir),
            this.pos.y + lengthdir_y(player.pos.dist(this.pos), this.parent.stun ? this.dir - 180 : this.dir)
          ),
          0 - 40 * this.parent.stun
        );
      },
      onHit: function (hitAngle) {
        this.parent.stun = true;
        let throwDir = 1;
        if (Math.abs(hitAngle) < 10) {
          throwDir = 1;
        } else {
          throwDir = -1;
        }
        this.health -= 1;
        if (this.health <= 0) {
          createEnemyCorpse({
            mypos: this.pos,
            dir: throwDir,
            spd: randi(1, 3),
          });
          destroy(this.parent);
          destroy(this);
        }
      },
    },
  ]);

  enemy.parent = parent;
  parent.child = enemy;

  return enemy;
};
