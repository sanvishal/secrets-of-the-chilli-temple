export const createMuzzleFlash = ({ weapon, mypos }) => {
  return add([
    pos(mypos),
    sprite(weapon.muzzleFlashSprite),
    scale(1.3),
    lifespan(0.1, { fade: 0.8 }),
    origin("center"),
    layer("muzzleFlash"),
  ]);
};
