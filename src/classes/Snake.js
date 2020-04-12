import Vue from 'vue';
import DOM from '@/classes/DOM';

class Snake {
  #state = Vue.observable({
    speed: 150,
    direction: 'right',
    parts: [{ x: 5, y: 5 }],
  })

  get speed() {
    return this.#state.speed;
  }

  get direction() {
    return this.#state.direction;
  }

  get parts() {
    return this.#state.parts;
  }

  get changingDirectionALlowed() {
    return this.#state.changingDirectionALlowed;
  }

  setDirection(direction) {
    this.#state.direction = direction;
  }

  setPartCoordinate(partIndex, axis, value) {
    this.#state.parts[partIndex][axis] = value;
  }

  move(areaSize) {
    const oldPartsCoords = this.getCoordsBeforeMoving();

    for (let i = 0; i < this.parts.length; i += 1) {
      /* if it's head, just increment/decrement X or Y depending on moving direction */
      if (i === 0) {
        this.getHeadElement().classList.remove('snakeHead');

        switch (this.direction) {
          case 'up':
            if (this.parts[0].y === 1) {
              this.setPartCoordinate(0, 'y', areaSize.y);
            } else {
              this.setPartCoordinate(0, 'y', this.parts[0].y - 1);
            }
            break;

          case 'down':
            if (this.parts[0].y === areaSize.y) {
              this.setPartCoordinate(0, 'y', 1);
            } else {
              this.setPartCoordinate(0, 'y', this.parts[0].y + 1);
            }
            break;

          case 'left':
            if (this.parts[0].x === 1) {
              this.setPartCoordinate(0, 'x', areaSize.x);
            } else {
              this.setPartCoordinate(0, 'x', this.parts[0].x - 1);
            }
            break;

          case 'right':
            if (this.parts[0].x === areaSize.x) {
              this.setPartCoordinate(0, 'x', 1);
            } else {
              this.setPartCoordinate(0, 'x', this.parts[0].x + 1);
            }
            break;

          default:
            break;
        }
      } else {
        /*
          If it's a body part, put it on coords of the part that going ahead of it.
          Thus, each part of the body is constantly trying to catch up with
          the part that going ahead,
        */
        this.getBodyPartElement(i).classList.remove('snakePart');
        this.setPartCoordinate(i, 'x', oldPartsCoords[i - 1].x);
        this.setPartCoordinate(i, 'y', oldPartsCoords[i - 1].y);
      }
    }
  }

  addBodyPart(areaWidth, areaHeight) {
    const newBodyPartCoords = {
      x: null,
      y: null,
    };
    const lastPartIndex = this.parts.length - 1;
    /*
      determine the coordinates of the new part of the
      body depending on the direction of movement
    */
    switch (this.direction) {
      case 'up':
        newBodyPartCoords.x = this.parts[lastPartIndex].x;

        if (this.parts[lastPartIndex].y === 1) {
          newBodyPartCoords.y = areaHeight;
        } else {
          newBodyPartCoords.y = this.parts[lastPartIndex].y - 1;
        }

        break;

      case 'down':
        newBodyPartCoords.x = this.parts[lastPartIndex].x;

        if (this.parts[lastPartIndex].y === areaHeight) {
          newBodyPartCoords.y = 1;
        } else {
          newBodyPartCoords.y = this.parts[lastPartIndex].y + 1;
        }

        break;

      case 'left':
        newBodyPartCoords.y = this.parts[lastPartIndex].y;

        if (this.parts[lastPartIndex].x === areaWidth) {
          newBodyPartCoords.x = 1;
        } else {
          newBodyPartCoords.x = this.parts[lastPartIndex].x + 1;
        }

        break;

      case 'right':
        newBodyPartCoords.y = this.parts[lastPartIndex].y;

        if (this.parts[lastPartIndex].x === 1) {
          newBodyPartCoords.x = areaWidth;
        } else {
          newBodyPartCoords.x = this.parts[lastPartIndex].x - 1;
        }

        break;

      default:
        break;
    }

    this.#state.parts.push({
      x: newBodyPartCoords.x,
      y: newBodyPartCoords.y,
    });
  }

  setSpeed(speed) {
    this.#state.speed = speed;
  }

  getBodyPartElement(n) {
    return DOM.getFieldByCoords(this.parts[n].x, this.parts[n].y);
  }

  getHeadElement() {
    return DOM.getFieldByCoords(this.parts[0].x, this.parts[0].y);
  }

  getCoordsBeforeMoving() {
    const oldPartsCoords = [];

    this.parts.forEach((part) => {
      oldPartsCoords.push({
        x: part.x,
        y: part.y,
      });
    });

    return oldPartsCoords;
  }

  onItself() {
    return this.getHeadElement()
      .classList.value.includes('snakePart');
  }
}

const snake = new Snake();

export { snake };
