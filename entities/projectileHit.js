export const createProjectileHit = ({ mypos }) => {
  return add([
    pos(mypos),
    origin("center"),
    sprite("commonBulletHit", { anim: "default" }),
    rotate(randi(0, 360)),
    {
      update: function () {
        if (this.frame === 3) {
          destroy(this);
        }
      },
    },
  ]);
};
