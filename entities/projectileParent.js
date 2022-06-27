export const createProjectileParent = ({ mypos, width, height }) => {
  let parent = add([
    rect(width, height),
    "projParent",
    opacity(0),
    color(rgb(255, 0, 0)),
    pos(mypos),
    cleanup(),
    area(),
    { child: null },
    origin("center"),
  ]);

  return parent;
};
