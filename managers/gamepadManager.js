export const createGamepadManager = (gp = null) => {
  return add([
    pos(0, 0),
    "gamepad",
    {
      gamepad: gp,
      left: false,
      right: false,
      up: false,
      down: false,
      usingGamepad: false,
      aPress: false,
      xPress: false,
    },
    {
      // add: function () {
      //   this.paused = true;
      // },
      gamepadConnect: function (e) {
        this.gamepad = e;

        this?.gamepad?.addEventListener(
          "joystickmove",
          (e) => {
            this.usingGamepad = true;
            if (e?.horizontalValue < 0) {
              this.left = true;
              // this.right = false;
            } else if (e?.horizontalValue > 0) {
              this.right = true;
              // this.left = false;
            } else if (e?.horizontalValue === 0) {
              this.left = false;
              this.right = false;
            }

            if (e?.verticalValue < 0) {
              this.up = true;
              // this.down = false;
            } else if (e?.verticalValue > 0) {
              this.down = true;
              // this.up = false;
            } else if (e?.verticalValue === 0) {
              this.up = false;
              this.down = false;
            }
          },
          StandardMapping.Axis.JOYSTICK_LEFT
        );

        this?.gamepad?.addEventListener("buttonpress", (e) => {
          this.usingGamepad = true;
          switch (e?.index) {
            case 0:
              this.trigger("aPress");
              this.aPress = true;
              break;
            case 2:
              this.trigger("xPress");
              this.xPress = true;
              break;
          }
        });

        this?.gamepad?.addEventListener("buttonrelease", (e) => {
          this.usingGamepad = true;
          switch (e?.index) {
            case 0:
              this.aPress = false;
              break;
            case 2:
              this.xPress = false;
              break;
          }
        });
      },
      update: function () {
        if (this.xPress) {
          this.trigger("xPress");
        }
      },
    },
  ]);
};

export const gamepad = () => get("gamepad")?.[0];
