import { constants } from "./constants.js";

const getScale = (maxScale = 4) => {
  let scale = 1;
  for (let i = 0; i < maxScale; i++) {
    if (constants.roomHeight * i <= window.innerHeight && constants.roomWidth * i <= window.innerWidth) {
      scale = i;
    }
  }

  return scale;
};

export const initKaboom = () => {
  let k = kaboom({
    width: constants.roomWidth,
    height: constants.roomHeight,
    background: [0, 0, 0],
    scale: getScale(),
    crisp: true,
    canvas: document.querySelector("#canvas"),
  });

  onLoad(() => {
    if (!focused()) {
      focus();
    }
  });

  return k;
};
