import { constants } from "./constants.js";

let uniqueMasks = {
  2: 1,
  8: 2,
  10: 3,
  11: 4,
  16: 5,
  18: 6,
  22: 7,
  24: 8,
  26: 9,
  27: 10,
  30: 11,
  31: 12,
  64: 13,
  66: 14,
  72: 15,
  74: 16,
  75: 17,
  80: 18,
  82: 19,
  86: 20,
  88: 21,
  90: 22,
  91: 23,
  94: 24,
  95: 25,
  104: 26,
  106: 27,
  107: 28,
  120: 29,
  122: 30,
  123: 31,
  126: 32,
  127: 33,
  208: 34,
  210: 35,
  214: 36,
  216: 37,
  218: 38,
  219: 39,
  222: 40,
  223: 41,
  248: 42,
  250: 43,
  251: 44,
  254: 45,
  255: 46,
  0: 47,
};

const getVal = (l, x, y) => {
  try {
    return l[x][y];
  } catch (some) {
    return null;
  }
};

export const generateAutoTileBitMask = (map, solid = "t") => {
  let levelBitMask = [];
  map.forEach((slice, x) => {
    let newSlice = [];
    Array.from(slice).forEach((_, y) => {
      let curr = map[x][y];
      let tl = getVal(map, x - 1, y - 1);
      let t = getVal(map, x - 1, y);
      let tr = getVal(map, x - 1, y + 1);
      let l = getVal(map, x, y - 1);
      let r = getVal(map, x, y + 1);
      let bl = getVal(map, x + 1, y - 1);
      let b = getVal(map, x + 1, y);
      let br = getVal(map, x + 1, y + 1);

      let bitMask = -1;

      if (curr !== " ") {
        bitMask =
          1 * (tl === solid) * (t === solid) * (l === solid) +
          2 * (t === solid) +
          4 * (tr === solid) * (t === solid) * (r === solid) +
          8 * (l === solid) +
          16 * (r === solid) +
          32 * (bl === solid) * (b === solid) * (l === solid) +
          64 * (b === solid) +
          128 * (br === solid) * (b === solid) * (r === solid);
      }

      newSlice.push(bitMask === -1 ? -1 : uniqueMasks[bitMask]);
    });
    levelBitMask.push(newSlice);
  });
  // console.table(levelBitMask);
  return levelBitMask;
};

export const mapTilesToBitMask = (levelBitMask) => {
  let transformedLevel = levelBitMask?.map((slice) => {
    return slice
      ?.map((bit) => {
        return bit !== -1 ? String.fromCharCode(bit + 68) : " ";
      })
      .join("");
  });

  let mapper = {};
  for (let i = 0; i < 48; i++) {
    mapper[String.fromCharCode(i + 68)] = () => [
      sprite("tiles", { frame: i }),
      area(),
      solid(),
      pos(constants.tileSize / 2, constants.tileSize / 2),
      origin("center"),
      // outline(),
      "wall",
      { frame: i },
    ];
  }

  return { transformedLevel, mapper };
};
