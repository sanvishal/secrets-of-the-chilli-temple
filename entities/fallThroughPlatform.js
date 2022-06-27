import { getPlayer } from "./player.js";

export const createFallThroughPlatform = ({ posx, posy, width, height }) => [
  rect(width, height),
  pos(posx, posy),
  "fallthru",
  area({ solid: true }),
  origin("center"),
  {
    playerOffsetHeight: getPlayer()?.area.height,
  },
  {
    update: function () {
      if (!this.playerOffsetHeight) {
        this.playerOffsetHeight = getPlayer()?.area.height;
      }
      if (!getPlayer()?.fallthrough) {
        if (this.hasPoint(vec2(getPlayer()?.pos.x, getPlayer()?.pos.y + this.playerOffsetHeight))) {
          this.makeSolid(true);
        } else {
          this.makeSolid(false);
        }
      } else {
        this.makeSolid(false);
        // possibly the hackiest piece of code (in order to avoid raycasting)
        if (getPlayer()?.curPlatform()?._id === this._id) {
          getPlayer()?.jump(-10);
        }
      }
    },
    makeSolid: function (s) {
      this.solid = s;
    },
  },
];
