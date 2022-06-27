export const createEnemyParent = ({ mypos, width, height }) => {
  const parent = add([
    pos(mypos),
    "enemyParent",
    rect(width, height),
    opacity(0),
    color(rgb(255, 0, 0)),
    area({ width, height }),
    {
      child: null,
      stun: false,
      stunTime: 0,
      update: function () {
        if (this.stun) {
          this.stunTime++;
          if (this.stunTime >= 20) {
            this.stun = false;
            this.stunTime = 0;
          }
        }
      },
    },
  ]);
  return parent;
};
