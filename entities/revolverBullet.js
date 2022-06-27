import { createProjectileHit } from "./projectileHit.js";
import { createProjectileParent } from "./projectileParent.js";

export const createRevolverBullet = ({ mypos, dir = 0, spd = 20 }) => {
  let width = 10,
    height = 5;
  let bullet = add([
    sprite("revolverBullet"),
    pos(mypos),
    layer("bullets"),
    origin("center"),
    area(),
    cleanup(),
    { parent: null, dir, spd },
    move(dir, spd),
    rotate(dir),
    {
      update: function () {
        if (this.parent) {
          this.parent.pos = this.pos;
        }
      },
      destroyEffect: function () {
        createProjectileHit({ mypos: this.pos });
        destroy(this);
      },
      draw: function () {
        drawSprite({
          sprite: "revolverBullet",
          pos: vec2(0),
          origin: "center",
          width: width * 1.8,
          height: height * 1.8,
          opacity: 0.1,
        });
      },
    },
  ]);

  let parent = createProjectileParent({
    mypos,
    width: width,
    height: height,
  });
  parent.child = bullet;
  bullet.parent = parent;

  return bullet;
};
