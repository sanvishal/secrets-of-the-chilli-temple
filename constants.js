import { randRange } from "./utils.js";

export const constants = {
  roomWidth: 416,
  roomHeight: 256,
  tileSize: 16,
};

export const weaponNames = {
  REVOLVER: "REVOLVER",
};

export const weapons = {
  [weaponNames.REVOLVER]: {
    id: weaponNames.REVOLVER,
    name: "Revolver",
    reloadSpeed: 5,
    spriteName: "revolver",
    width: 7,
    height: 6,
    minSpread: -1,
    maxSpread: 1,
    getSpread: function () {
      return randRange(this.minSpread, this.maxSpread);
    },
    speed: 750,
    muzzleFlashSprite: "commonMuzzleFlash",
  },
};
