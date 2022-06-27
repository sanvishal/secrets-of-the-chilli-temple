export const createWeaponDrop = ({ mypos, weapon }) => {
  const t = (n = 1) => time() * n;
  const w = (a, b, n) => wave(a, b, t(n));
  let wd = add([
    // sprite(weapon.spriteName, { width: weapon.width * 2, height: weapon.height * 2 }),
    "weapondrop",
    `weapondrop-${weapon.id}`,
    { weaponId: weapon.id },
    area({ width: weapon.width, height: weapon.height }),
    body(),
    pos(mypos),
    {
      draw: function () {
        drawRect({
          opacity: 0.2,
          pos: vec2(0, 0),
          width: w(10, 20, 4),
          height: w(15, 25, 8),
          origin: "center",
          angle: t(80),
          color: rgb(w(128, 255, 4), 255, w(128, 255, 8)),
        });
        drawRect({
          opacity: 0.2,
          pos: vec2(0, 0),
          width: w(15, 25, 4),
          height: w(10, 20, 8),
          origin: "center",
          angle: -t(80),
          color: rgb(w(128, 255, 4), 255, w(128, 255, 8)),
        });
        drawRect({
          opacity: 0.2,
          pos: vec2(0, 0),
          width: w(10, 20, 8),
          height: w(15, 25, 4),
          origin: "center",
          angle: t(80 / 2),
          color: rgb(w(128, 255, 4), 255, w(128, 255, 8)),
        });
        drawSprite({
          pos: vec2(0, 0),
          sprite: weapon.spriteName,
          width: weapon.width * 2,
          height: weapon.height * 2,
          origin: "center",
        });
      },
    },
  ]);

  return wd;
};
